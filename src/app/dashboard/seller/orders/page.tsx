import { getSessionUser } from "@/lib/auth";
import { getSellerByUserIdForDashboard, getSellerOrders } from "@/server/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { ORDER_STATUS_LABELS, orderStatusTone } from "@/lib/labels";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function SellerOrdersPage() {
  const user = (await getSessionUser())!;
  const seller = (await getSellerByUserIdForDashboard(user.id))!;
  const orders = await getSellerOrders(seller.id);

  if (orders.length === 0) {
    return <EmptyState title="سفارشی ندارید" description="پس از اولین فروش، سفارش‌های شما اینجا نمایش داده می‌شوند." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">سفارش</th>
              <th className="px-4 py-3 text-start font-medium">محصول</th>
              <th className="px-4 py-3 text-start font-medium">مشتری</th>
              <th className="px-4 py-3 text-start font-medium">مبلغ</th>
              <th className="px-4 py-3 text-start font-medium">سهم شما</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">تاریخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs" dir="ltr">{o.orderNumber}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{o.productTitle}</td>
                <td className="px-4 py-3 text-slate-600">{o.customerName}</td>
                <td className="px-4 py-3">{formatPrice(o.finalPrice)}</td>
                <td className="px-4 py-3 text-emerald-600">{formatPrice(o.sellerShare)}</td>
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
