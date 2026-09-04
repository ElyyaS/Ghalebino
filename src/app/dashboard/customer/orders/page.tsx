import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getOrders } from "@/server/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { ORDER_STATUS_LABELS, orderStatusTone } from "@/lib/labels";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = (await getSessionUser())!;
  const orders = await getOrders(user.id);

  if (orders.length === 0) {
    return <EmptyState title="سفارشی ندارید" description="پس از خرید، سفارش‌های شما اینجا نمایش داده می‌شوند." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">شماره سفارش</th>
              <th className="px-4 py-3 text-start font-medium">تاریخ</th>
              <th className="px-4 py-3 text-start font-medium">اقلام</th>
              <th className="px-4 py-3 text-start font-medium">مبلغ</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs" dir="ltr">{o.orderNumber}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">{o.itemsCount.toLocaleString("fa-IR")}</td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <Badge tone={orderStatusTone(o.status)}>{ORDER_STATUS_LABELS[o.status]}</Badge>
                </td>
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
    </div>
  );
}
