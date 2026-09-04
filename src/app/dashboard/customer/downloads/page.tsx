import Link from "next/link";
import { Download } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getCustomerDownloads } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const user = (await getSessionUser())!;
  const downloads = await getCustomerDownloads(user.id);

  if (downloads.length === 0) {
    return (
      <EmptyState
        title="هنوز محصولی نخریده‌اید"
        description="پس از خرید، محصولات شما برای دانلود اینجا نمایش داده می‌شوند."
        action={
          <Link href="/marketplace" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            رفتن به بازارچه
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {downloads.map((d) => (
        <div key={d.orderItemId} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            {d.imageUrl ? (
              <img src={d.imageUrl} alt={d.productTitle} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center bg-gradient-to-br from-brand-100 to-accent-100 text-brand-300" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/products/${d.productSlug}`} className="line-clamp-1 font-medium text-slate-900 hover:text-brand-700">
              {d.productTitle}
            </Link>
            <p className="mt-0.5 text-xs text-slate-500">
              نسخه {d.currentVersion} · {d.licenseName} · به‌روزرسانی {formatDate(d.lastUpdatedAt)}
            </p>
          </div>
          <a
            href={`/api/downloads/${d.orderItemId}`}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Download className="h-4 w-4" />
            دانلود
          </a>
        </div>
      ))}
    </div>
  );
}
