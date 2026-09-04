import Link from "next/link";
import { ArrowLeft, Download, Heart, Package, Store } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getCustomerDownloads, getOrders, getWishlistIds } from "@/server/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { ORDER_STATUS_LABELS, orderStatusTone } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function CustomerOverviewPage() {
  const user = (await getSessionUser())!;
  const [orders, downloads, wishlist] = await Promise.all([
    getOrders(user.id),
    getCustomerDownloads(user.id),
    getWishlistIds(user.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="سفارش" value={orders.length.toLocaleString("fa-IR")} icon={Package} tone="brand" />
        <StatCard label="محصول دانلودی" value={downloads.length.toLocaleString("fa-IR")} icon={Download} tone="emerald" />
        <StatCard label="علاقه‌مندی" value={wishlist.length.toLocaleString("fa-IR")} icon={Heart} tone="rose" />
      </div>

      {user.role === "CUSTOMER" ? (
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-brand-200 bg-gradient-to-l from-brand-50 to-accent-50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
              <Store className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-900">قالب‌های خود را بفروشید</p>
              <p className="text-sm text-slate-600">فروشگاه بسازید و از فروش قالب درآمد کسب کنید.</p>
            </div>
          </div>
          <Link href="/dashboard/customer/become-seller" className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
            درخواست فروشندگی
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      ) : null}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">سفارش‌های اخیر</h2>
          <Link href="/dashboard/customer/orders" className="text-sm text-brand-600 hover:text-brand-700">
            مشاهده همه
          </Link>
        </div>
        {orders.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">شماره سفارش</th>
                  <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                  <th className="px-4 py-3 text-start font-medium">مبلغ</th>
                  <th className="px-4 py-3 text-start font-medium">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono text-xs" dir="ltr">{o.orderNumber}</td>
                    <td className="px-4 py-3">
                      <Badge tone={orderStatusTone(o.status)}>{ORDER_STATUS_LABELS[o.status]}</Badge>
                    </td>
                    <td className="px-4 py-3">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/customer/orders/${o.id}`} className="text-brand-600 hover:text-brand-700">
                        جزئیات
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            هنوز سفارشی ثبت نکرده‌اید.
          </p>
        )}
      </section>
    </div>
  );
}
