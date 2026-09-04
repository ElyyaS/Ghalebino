import { getAdminOrders } from "@/server/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { ORDER_STATUS_LABELS, orderStatusTone } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">شماره</th>
              <th className="px-4 py-3 text-start font-medium">مشتری</th>
              <th className="px-4 py-3 text-start font-medium">مبلغ</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">تاریخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs" dir="ltr">{o.orderNumber}</td>
                <td className="px-4 py-3 text-slate-600">{o.customerName}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <Badge tone={orderStatusTone(o.status)}>{ORDER_STATUS_LABELS[o.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
