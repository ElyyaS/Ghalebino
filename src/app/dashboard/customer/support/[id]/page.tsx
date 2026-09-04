import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTicketDetail } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { TICKET_STATUS_LABELS, TICKET_TYPE_LABELS, ticketStatusTone } from "@/lib/labels";
import { SupportReplyForm } from "@/components/dashboard/customer-actions";

export const dynamic = "force-dynamic";

export default async function SupportThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = (await getSessionUser())!;
  const ticket = await getTicketDetail(Number(id), { userId: user.id });
  if (!ticket) notFound();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-slate-400" dir="ltr">{ticket.ticketNumber}</p>
            <h2 className="mt-1 font-semibold text-slate-900">{ticket.subject}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="neutral">{TICKET_TYPE_LABELS[ticket.type] ?? ticket.type}</Badge>
            <Badge tone={ticketStatusTone(ticket.status)}>{TICKET_STATUS_LABELS[ticket.status]}</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {ticket.messages.map((m) => (
          <div
            key={m.id}
            className={
              m.authorRole === "CUSTOMER"
                ? "mr-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-50 p-4"
                : "ml-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 p-4"
            }
          >
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{m.authorName}</span>
              <span>{m.authorRole === "CUSTOMER" ? "مشتری" : m.authorRole === "SELLER" ? "فروشنده" : "پشتیبانی"}</span>
              <span>{formatDate(m.createdAt)}</span>
            </div>
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{m.content}</p>
          </div>
        ))}
      </div>

      {ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <SupportReplyForm ticketId={ticket.id} />
        </div>
      ) : null}
    </div>
  );
}
