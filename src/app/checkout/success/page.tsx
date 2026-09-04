import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Download, Package } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getOrderDetail, getOrders } from "@/server/queries";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getSessionUser();
  const sp = await searchParams;
  const orderNumber = typeof sp.order === "string" ? sp.order : "";
  if (!user || !orderNumber) redirect("/auth/login");

  const orders = await getOrders(user.id);
  const found = orders.find((o) => o.orderNumber === orderNumber);
  if (!found) redirect("/dashboard/customer/orders");

  const detail = await getOrderDetail(found.id, user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">پرداخت با موفقیت انجام شد</h1>
        <p className="mt-2 text-sm text-slate-500">
          سفارش <span dir="ltr" className="font-mono">{orderNumber}</span> ثبت شد و دسترسی دانلود شما فعال است.
        </p>

        {detail ? (
          <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-5 text-right">
            {detail.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{item.productTitle}</span>
                <span className="font-semibold text-slate-900">{formatPrice(item.finalPrice)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold">
              <span className="text-slate-700">جمع کل</span>
              <span className="text-slate-900">{formatPrice(detail.total)}</span>
            </div>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard/customer/downloads"
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Download className="h-4 w-4" />
            دانلود محصولات
          </Link>
          <Link
            href="/dashboard/customer/orders"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Package className="h-4 w-4" />
            مشاهده سفارش‌ها
          </Link>
        </div>
      </div>
    </div>
  );
}
