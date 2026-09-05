import { getAdminSellerApplications } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge, EmptyState } from "@/components/ui/feedback";
import { SellerDecisionForm } from "@/components/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminSellerApplicationsPage() {
  const applications = await getAdminSellerApplications();

  if (applications.length === 0) {
    return <EmptyState title="درخواست فروشندگی وجود ندارد" />;
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">
                {application.storeName}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {application.userName} ·{" "}
                <span dir="ltr">{application.userEmail}</span>
              </p>
            </div>

            <Badge
              tone={
                application.status === "PENDING"
                  ? "info"
                  : application.status === "APPROVED"
                    ? "success"
                    : "danger"
              }
            >
              {application.status === "PENDING"
                ? "در انتظار"
                : application.status === "APPROVED"
                  ? "تأیید شده"
                  : "رد شده"}
            </Badge>
          </div>

          {application.description ? (
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {application.description}
            </p>
          ) : null}

          {application.portfolioUrl ? (
            <p className="mt-2 text-xs text-slate-400">
              نمونه‌کار:{" "}
              <a
                href={application.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600"
                dir="ltr"
              >
                {application.portfolioUrl}
              </a>
            </p>
          ) : null}

          <p className="mt-2 text-xs text-slate-400">
            ثبت در {formatDate(application.createdAt)}
          </p>

          {application.status === "PENDING" ? (
            <div className="mt-4">
              <SellerDecisionForm applicationId={application.id} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}