"use server";

import { redirect } from "next/navigation";
import { and, eq, inArray, sql } from "drizzle-orm";
import {
  cartItems,
  coupons,
  db,
  orderItems,
  orders,
  payments,
  products,
  sellers,
  transactions,
} from "@/db";
import { requireUser } from "@/lib/auth";
import { AppError, type FormState } from "@/lib/errors";
import { notify } from "@/lib/notifications";
import { paymentProvider } from "@/lib/payments";
import { applyCoupon, splitSellerShare } from "@/lib/pricing";
import { getCartLines } from "@/server/queries";

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GHB-${stamp}-${rand}`;
}

export async function checkoutAction(_prev: FormState, formData: FormData): Promise<FormState> {
  let orderNumber = "";
  try {
    const user = await requireUser();
    const lines = await getCartLines({ userId: user.id });
    if (lines.length === 0) throw new AppError("سبد خرید شما خالی است.");

    const couponCode = (formData.get("couponCode") as string | null)?.trim().toUpperCase();
    let coupon: (typeof coupons.$inferSelect) | null = null;
    if (couponCode) {
      const [found] = await db.select().from(coupons).where(eq(coupons.code, couponCode)).limit(1);
      if (!found) throw new AppError("کد تخفیف نامعتبر است.");
      if (!found.isActive) throw new AppError("کد تخفیف غیرفعال است.");
      if (found.expiresAt && found.expiresAt.getTime() < Date.now()) {
        throw new AppError("کد تخفیف منقضی شده است.");
      }
      if (found.maxUses != null && found.usedCount >= found.maxUses) {
        throw new AppError("سقف استفاده از این کد تکمیل شده است.");
      }
      coupon = found;
    }

    const subtotal = lines.reduce((sum, l) => sum + l.unitPrice, 0);
    const eligible = coupon
      ? lines.filter((l) => coupon!.scope === "PLATFORM" || l.sellerId === coupon!.sellerId)
      : [];
    const eligibleBase = eligible.reduce((sum, l) => sum + l.unitPrice, 0);

    if (coupon && coupon.minOrder > subtotal) {
      throw new AppError(`حداقل مبلغ سفارش برای این کد ${coupon.minOrder.toLocaleString("fa-IR")} تومان است.`);
    }

    const discount = coupon ? applyCoupon(eligibleBase, coupon) : 0;
    const total = Math.max(0, subtotal - discount);

    const perItemDiscount = new Map<number, number>();
    if (coupon && eligibleBase > 0) {
      for (const l of eligible) {
        perItemDiscount.set(l.id, Math.round((l.unitPrice * discount) / eligibleBase));
      }
    }

    const result = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: generateOrderNumber(),
          userId: user.id,
          status: "PAYMENT_PROCESSING",
          subtotal,
          discount,
          couponId: coupon?.id,
          total,
          platformFee: 0,
          paymentMethod: paymentProvider.name,
        })
        .returning({ id: orders.id, orderNumber: orders.orderNumber });

      let platformFeeSum = 0;
      for (const line of lines) {
        const itemDiscount = perItemDiscount.get(line.id) ?? 0;
        const finalPrice = Math.max(0, line.unitPrice - itemDiscount);
        const { sellerShare, platformFee } = splitSellerShare(finalPrice);
        platformFeeSum += platformFee;

        const [item] = await tx
          .insert(orderItems)
          .values({
            orderId: order.id,
            productId: line.productId,
            sellerId: line.sellerId,
            licenseId: line.licenseId,
            productTitle: line.productTitle,
            licenseName: line.licenseName,
            unitPrice: line.unitPrice,
            discount: itemDiscount,
            finalPrice,
            sellerShare,
            platformFee,
          })
          .returning({ id: orderItems.id });

        await tx
          .update(products)
          .set({ salesCount: sql`${products.salesCount} + 1` })
          .where(eq(products.id, line.productId));
        await tx
          .update(sellers)
          .set({ totalSales: sql`${sellers.totalSales} + 1` })
          .where(eq(sellers.id, line.sellerId));

        const [balanceRow] = await tx
          .select({ balance: sql<number>`coalesce(sum(${transactions.amount}), 0)` })
          .from(transactions)
          .where(eq(transactions.sellerId, line.sellerId));
        const balanceAfter = (balanceRow?.balance ?? 0) + sellerShare;

        await tx.insert(transactions).values({
          sellerId: line.sellerId,
          type: "SALE",
          amount: sellerShare,
          balanceAfter,
          referenceType: "order_item",
          referenceId: item.id,
          description: `فروش «${line.productTitle}»`,
        });
      }

      await tx.update(orders).set({ platformFee: platformFeeSum }).where(eq(orders.id, order.id));

      const [payment] = await tx
        .insert(payments)
        .values({
          orderId: order.id,
          userId: user.id,
          provider: paymentProvider.name,
          amount: total,
          status: "PENDING",
        })
        .returning({ id: payments.id });

      const intent = await paymentProvider.createPayment({ orderNumber: order.orderNumber, amount: total });
      const verified = intent.success && (await paymentProvider.verifyPayment(intent.ref, total));

      if (!verified) {
        await tx.update(orders).set({ status: "FAILED" }).where(eq(orders.id, order.id));
        await tx.update(payments).set({ status: "FAILED", providerRef: intent.ref }).where(eq(payments.id, payment.id));
        throw new AppError("پرداخت ناموفق بود. لطفاً دوباره تلاش کنید.");
      }

      await tx
        .update(payments)
        .set({ status: "SUCCEEDED", providerRef: intent.ref, paidAt: new Date() })
        .where(eq(payments.id, payment.id));
      await tx
        .update(orders)
        .set({ status: "PAID", paidAt: new Date() })
        .where(eq(orders.id, order.id));

      if (coupon) {
        await tx.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, coupon.id));
      }

      return { orderNumber: order.orderNumber, orderId: order.id };
    });

    await db.delete(cartItems).where(eq(cartItems.userId, user.id));

    const sellerIds = [...new Set(lines.map((l) => l.sellerId))];
    for (const sellerId of sellerIds) {
      const [seller] = await db.select({ userId: sellers.userId }).from(sellers).where(eq(sellers.id, sellerId)).limit(1);
      if (seller) {
        await notify(seller.userId, {
          type: "ORDER",
          title: "فروش جدید ثبت شد",
          body: `یک سفارش جدید برای فروشگاه شما ثبت و پرداخت شد.`,
          link: "/dashboard/seller/orders",
        });
      }
    }

    await notify(user.id, {
      type: "PAYMENT",
      title: "پرداخت موفق",
      body: `سفارش ${result.orderNumber} با موفقیت پرداخت شد.`,
      link: `/dashboard/customer/orders/${result.orderId}`,
    });

    orderNumber = result.orderNumber;
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    console.error("[checkout]", err);
    return { error: "خطایی در پردازش پرداخت رخ داد." };
  }

  redirect(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
}

export async function cancelUnpaidOrdersAction() {
  const user = await requireUser();
  await db
    .update(orders)
    .set({ status: "CANCELLED", cancellationReason: "لغو توسط کاربر" })
    .where(and(eq(orders.userId, user.id), inArray(orders.status, ["PENDING", "PAYMENT_PROCESSING", "FAILED"])));
}
