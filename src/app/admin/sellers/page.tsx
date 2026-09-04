import { getAdminSellerApplications } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { SellerDecisionForm } from "@/components/admin/admin-actions";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function AdminSellersPage() {
  const applications = await getAdminSellerApplications();

  if (applications.length === 0) {
    return <EmptyState title="درخواست فروشندگی وجود ندارد" />;
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{app.storeName}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {app.userName} · <span dir="ltr">{app.userEmail}</span>
              </p>
            </div>
            <Badge tone={app.status === "PENDING" ? "info" : app.status === "APPROVED" ? "success" : "danger"}>
              {app.status === "PENDING" ? "در انتظار" : app.status === "APPROVED" ? "تأیید شده" : "رد شده"}
            </Badge>
          </div>

          {app.description ? <p className="mt-3 text-sm leading-7 text-slate-600">{app.description}</p> : null}
          {app.portfolioUrl ? (
            <p className="mt-2 text-xs text-slate-400">
              نمونه‌کار:{" "}
              <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600" dir="ltr">
                {app.portfolioUrl}
              </a>
            </p>
          ) : null}

          <p className="mt-2 text-xs text-slate-400">ثبت در {formatDate(app.createdAt)}</p>

          {app.status === "PENDING" ? (
            <div className="mt-4">
              <SellerDecisionForm applicationId={app.id} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
