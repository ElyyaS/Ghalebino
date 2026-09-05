import { getAdminSellers } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge, EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function AdminSellersPage() {
  const sellers = await getAdminSellers();

  if (sellers.length === 0) {
    return <EmptyState title="فروشنده فعالی وجود ندارد" />;
  }

  return (
    <div className="space-y-4">
      {sellers.map((seller) => (
        <div
          key={seller.id}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">
                {seller.storeName}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {seller.userName} ·{" "}
                <span dir="ltr">{seller.userEmail}</span>
              </p>
            </div>

            <Badge tone="success">فعال</Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">نام کاربری</p>
              <p className="mt-1 text-sm font-medium text-slate-900" dir="ltr">
                @{seller.username}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">محصولات</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {seller.totalProducts.toLocaleString("fa-IR")}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">فروش</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {seller.totalSales.toLocaleString("fa-IR")}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">امتیاز</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {seller.rating.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>

          {seller.tagline ? (
            <p className="mt-4 text-sm text-slate-600">
              {seller.tagline}
            </p>
          ) : null}

          <p className="mt-2 text-xs text-slate-400">
            عضویت در {formatDate(seller.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}