import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { getCartLines } from "@/server/queries";
import { formatPrice } from "@/lib/format";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "تسویه حساب" };

export default async function CheckoutPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/checkout");

  const lines = await getCartLines({ userId: user.id });
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="سبد خرید شما خالی است"
          description="برای تکمیل خرید، ابتدا محصولی به سبد اضافه کنید."
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
      <h1 className="mb-6 text-2xl font-bold text-slate-900">تسویه حساب</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-slate-900">اقلام سفارش</h2>
            <div className="divide-y divide-slate-100">
              {lines.map((line) => (
                <div key={line.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{line.productTitle}</p>
                    <p className="text-xs text-slate-500">{line.licenseName}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-slate-900">{formatPrice(line.unitPrice)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-slate-900">اطلاعات خریدار</h2>
            <div className="text-sm text-slate-700">
              <p className="font-medium text-slate-900">{user.name}</p>
              <p className="mt-1 text-slate-500" dir="ltr">{user.email}</p>
            </div>
          </section>
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-20">
          <h2 className="mb-4 font-semibold text-slate-900">پرداخت</h2>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>جمع اقلام</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-medium text-slate-700">مبلغ قابل پرداخت</span>
            <span className="text-xl font-bold text-slate-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="my-5 border-t border-slate-100" />
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
