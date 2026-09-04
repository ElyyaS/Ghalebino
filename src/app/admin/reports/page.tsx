import { getAdminReports } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { REPORT_REASON_LABELS } from "@/lib/labels";
import { ReportResolveForm } from "@/components/admin/admin-actions";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await getAdminReports();

  if (reports.length === 0) {
    return <EmptyState title="گزارشی ثبت نشده است" />;
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge tone="brand">{r.targetType}</Badge>
              <Badge tone={r.status === "OPEN" ? "danger" : r.status === "RESOLVED" ? "success" : "neutral"}>
                {r.status === "OPEN" ? "باز" : r.status === "RESOLVED" ? "حل شده" : "رد شده"}
              </Badge>
            </div>
            <span className="text-xs text-slate-400">{formatDate(r.createdAt)} · توسط {r.reporterName}</span>
          </div>
          <p className="mt-3 font-medium text-slate-900">{REPORT_REASON_LABELS[r.reason] ?? r.reason}</p>
          {r.details ? <p className="mt-1 text-sm text-slate-600">{r.details}</p> : null}
          <p className="mt-1 text-xs text-slate-400">شناسه هدف: {r.targetId}</p>
          {r.status === "OPEN" ? (
            <div className="mt-4">
              <ReportResolveForm reportId={r.id} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
