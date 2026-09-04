"use server";

import { and, count, eq, sql } from "drizzle-orm";
import {
  comparisons,
  db,
  products,
  questions,
  reports,
  reviewCriteria,
  reviewRatings,
  reviews,
  sellers,
  wishlist,
} from "@/db";
import { requireUser } from "@/lib/auth";
import { AppError, firstErrorMessage, runAction, type FormState } from "@/lib/errors";
import { notify } from "@/lib/notifications";
import { hasPurchased } from "@/server/queries";
import { questionSchema, reportSchema, reviewSchema } from "@/lib/validators";

export async function toggleWishlistAction(productId: number) {
  return runAction(async () => {
    const user = await requireUser();
    const [existing] = await db
      .select({ userId: wishlist.userId })
      .from(wishlist)
      .where(and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId)))
      .limit(1);
    if (existing) {
      await db
        .delete(wishlist)
        .where(and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId)));
      return { added: false };
    }
    await db.insert(wishlist).values({ userId: user.id, productId });
    return { added: true };
  });
}

export async function toggleCompareAction(productId: number) {
  return runAction(async () => {
    const user = await requireUser();
    const [existing] = await db
      .select({ productId: comparisons.productId })
      .from(comparisons)
      .where(and(eq(comparisons.userId, user.id), eq(comparisons.productId, productId)))
      .limit(1);
    if (existing) {
      await db
        .delete(comparisons)
        .where(and(eq(comparisons.userId, user.id), eq(comparisons.productId, productId)));
      return { added: false };
    }
    const current = await db
      .select({ n: count() })
      .from(comparisons)
      .where(eq(comparisons.userId, user.id));
    if ((current?.[0]?.n ?? 0) >= 4) {
      throw new AppError("حداکثر ۴ محصول را می‌توانید مقایسه کنید.");
    }
    await db.insert(comparisons).values({ userId: user.id, productId });
    return { added: true };
  });
}

export async function submitReviewAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser();
    const parsed = reviewSchema.safeParse({
      productId: formData.get("productId"),
      rating: formData.get("rating"),
      title: formData.get("title"),
      content: formData.get("content"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };

    const { productId, rating, title, content } = parsed.data;
    if (!(await hasPurchased(user.id, productId))) {
      throw new AppError("فقط خریداران این محصول می‌توانند دیدگاه ثبت کنند.");
    }
    const [dup] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.userId, user.id)))
      .limit(1);
    if (dup) throw new AppError("شما قبلاً برای این محصول دیدگاه ثبت کرده‌اید.");

    const [review] = await db
      .insert(reviews)
      .values({ productId, userId: user.id, rating, title, content, status: "PUBLISHED" })
      .returning({ id: reviews.id });

    const criteria = await db.select().from(reviewCriteria);
    for (const c of criteria) {
      const raw = formData.get(`criterion_${c.id}`);
      const val = Number(raw);
      if (raw && Number.isInteger(val) && val >= 1 && val <= 5) {
        await db
          .insert(reviewRatings)
          .values({ reviewId: review.id, criterionId: c.id, rating: val });
      }
    }

    const [agg] = await db
      .select({
        avg: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
        total: count(),
      })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, "PUBLISHED")));

    await db
      .update(products)
      .set({ ratingAvg: Math.round((agg?.avg ?? 0) * 10) / 10, ratingCount: agg?.total ?? 0 })
      .where(eq(products.id, productId));

    return { message: "دیدگاه شما با موفقیت ثبت شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    console.error("[review]", err);
    return { error: "خطایی رخ داد." };
  }
}

export async function askQuestionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser();
    const parsed = questionSchema.safeParse({
      productId: formData.get("productId"),
      question: formData.get("question"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };

    await db
      .insert(questions)
      .values({ productId: parsed.data.productId, userId: user.id, question: parsed.data.question });

    const [product] = await db
      .select({ sellerId: products.sellerId, title: products.title })
      .from(products)
      .where(eq(products.id, parsed.data.productId))
      .limit(1);
    if (product) {
      const [seller] = await db
        .select({ userId: sellers.userId })
        .from(sellers)
        .where(eq(sellers.id, product.sellerId))
        .limit(1);
      if (seller) {
        await notify(seller.userId, {
          type: "QUESTION",
          title: "سؤال جدید برای محصول شما",
          body: `برای «${product.title}» سؤال جدیدی ثبت شده است.`,
        });
      }
    }
    return { message: "سؤال شما ثبت شد و پس از پاسخ فروشنده نمایش داده می‌شود." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function reportAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser();
    const parsed = reportSchema.safeParse({
      targetType: formData.get("targetType"),
      targetId: formData.get("targetId"),
      reason: formData.get("reason"),
      details: formData.get("details"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };
    const d = parsed.data;
    await db.insert(reports).values({
      reporterId: user.id,
      targetType: d.targetType,
      targetId: d.targetId,
      reason: d.reason,
      details: d.details,
    });
    return { message: "گزارش شما ثبت شد و توسط تیم مدیریت بررسی می‌شود." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}
