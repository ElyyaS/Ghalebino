import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getSellerByUserIdForDashboard, getSellerTickets } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { TICKET_STATUS_LABELS, ticketStatusTone } from "@/lib/labels";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function SellerSupportPage() {
  const user = (await getSessionUser())!;
  const seller = (await getSellerByUserIdForDashboard(user.id))!;
  const tickets = await getSellerTickets(seller.id);

  if (tickets.length === 0) {
    return <EmptyState title="تیکتی برای شما وجود ندارد" description="پرسش‌های مشتریان درباره محصولات شما اینجا نمایش داده می‌شود." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 text-start font-medium">شماره</th>
            <th className="px-4 py-3 text-start font-medium">موضوع</th>
            <th className="px-4 py-3 text-start font-medium">وضعیت</th>
            <th className="px-4 py-3 text-start font-medium">به‌روزرسانی</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-3 font-mono text-xs" dir="ltr">{t.ticketNumber}</td>
              <td className="px-4 py-3">
                <Link href={`/dashboard/seller/support/${t.id}`} className="text-slate-800 hover:text-brand-700">
                  {t.subject}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Badge tone={ticketStatusTone(t.status)}>{TICKET_STATUS_LABELS[t.status]}</Badge>
              </td>
              <td className="px-4 py-3 text-slate-500">{formatDate(t.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
