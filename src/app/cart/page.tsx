import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingCart } from "lucide-react";
import { getCartOwner, getSessionUser } from "@/lib/auth";
import { getCartLines } from "@/server/queries";
import { formatPrice } from "@/lib/format";
import { RemoveCartButton } from "@/components/cart/cart-actions";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "سبد خرید" };

export default async function CartPage() {
  const user = await getSessionUser();
  const owner = await getCartOwner(false);
  const lines = await getCartLines(owner);
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={<ShoppingCart className="h-10 w-10" />}
          title="سبد خرید شما خالی است"
          description="برای شروع خرید، محصولات مورد علاقه خود را به سبد اضافه کنید."
          action={
            <Link href="/marketplace" className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
              رفتن به بازارچه
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">سبد خرید</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {lines.map((line) => (
            <div key={line.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <Link href={`/products/${line.productSlug}`} className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {line.imageUrl ? (
                  <img src={line.imageUrl} alt={line.productTitle} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-brand-100 to-accent-100 text-brand-300">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${line.productSlug}`} className="line-clamp-1 font-medium text-slate-900 hover:text-brand-700">
                  {line.productTitle}
                </Link>
                <p className="mt-0.5 text-xs text-slate-500">لایسنس: {line.licenseName}</p>
                <p className="mt-0.5 text-xs text-slate-400">فروشنده: {line.sellerName}</p>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">{formatPrice(line.unitPrice)}</p>
              </div>
              <RemoveCartButton itemId={line.id} />
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-20">
          <h2 className="mb-4 font-semibold text-slate-900">خلاصه سفارش</h2>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>تعداد اقلام</span>
            <span>{lines.length.toLocaleString("fa-IR")}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-medium text-slate-700">جمع کل</span>
            <span className="text-lg font-bold text-slate-900">{formatPrice(subtotal)}</span>
          </div>
          <Link href="/checkout" className="mt-5 block rounded-lg bg-brand-600 py-3 text-center text-sm font-medium text-white hover:bg-brand-700">
            ادامه و تسویه حساب
          </Link>
          <Link href="/marketplace" className="mt-2 block text-center text-xs text-slate-500 hover:text-brand-700">
            ادامه خرید
          </Link>
        </div>
      </div>
    </div>
  );
}
