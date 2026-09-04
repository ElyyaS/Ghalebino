import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getUserTickets } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { TICKET_STATUS_LABELS, ticketStatusTone } from "@/lib/labels";
import { SupportCreateForm } from "@/components/dashboard/customer-actions";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const user = (await getSessionUser())!;
  const tickets = await getUserTickets(user.id);

  return (
    <div className="space-y-6">
      <SupportCreateForm />

      <div>
        <h2 className="mb-3 font-semibold text-slate-900">تیکت‌های شما</h2>
        {tickets.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">شماره</th>
                  <th className="px-4 py-3 text-start font-medium">موضوع</th>
                  <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                  <th className="px-4 py-3 text-start font-medium">آخرین به‌روزرسانی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-3 font-mono text-xs" dir="ltr">{t.ticketNumber}</td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/customer/support/${t.id}`} className="text-slate-800 hover:text-brand-700">
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
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            هنوز تیکتی ثبت نکرده‌اید.
          </p>
        )}
      </div>
    </div>
  );
}
