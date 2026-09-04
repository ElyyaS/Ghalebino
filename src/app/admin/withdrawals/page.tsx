import { getAdminWithdrawals } from "@/server/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { WITHDRAWAL_STATUS_LABELS, withdrawalStatusTone } from "@/lib/labels";
import { WithdrawalDecisionForm } from "@/components/admin/admin-actions";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await getAdminWithdrawals();

  if (withdrawals.length === 0) {
    return <EmptyState title="درخواست برداشتی وجود ندارد" />;
  }

  return (
    <div className="space-y-4">
      {withdrawals.map((w) => (
        <div key={w.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{w.sellerName}</p>
              <p className="text-xs text-slate-400">@{w.sellerUsername}</p>
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900">{formatPrice(w.amount)}</p>
              <Badge tone={withdrawalStatusTone(w.status)}>{WITHDRAWAL_STATUS_LABELS[w.status]}</Badge>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-600">روش: {w.method} · {formatDate(w.requestedAt)}</p>
          {w.accountDetails ? <p className="mt-1 text-xs text-slate-400">{w.accountDetails}</p> : null}
          {["REQUESTED", "UNDER_REVIEW"].includes(w.status) ? (
            <div className="mt-4">
              <WithdrawalDecisionForm withdrawalId={w.id} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
