import Link from "next/link";
import { Eye, Package, Plus, ShoppingBag, Wallet } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getSellerByUserIdForDashboard, getSellerProducts, getSellerStats, getSellerTransactions } from "@/server/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCompact, formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { PRODUCT_STATUS_LABELS, productStatusTone } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function SellerOverviewPage() {
  const user = (await getSessionUser())!;
  const seller = (await getSellerByUserIdForDashboard(user.id))!;
  const [stats, products, transactions] = await Promise.all([
    getSellerStats(seller.id),
    getSellerProducts(seller.id),
    getSellerTransactions(seller.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="درآمد ناخالص" value={formatCompact(stats.revenue)} icon={ShoppingBag} tone="brand" />
        <StatCard label="سهم فروشنده" value={formatCompact(stats.earnings)} icon={Wallet} tone="emerald" />
        <StatCard label="موجودی قابل برداشت" value={formatCompact(stats.balance)} icon={Wallet} tone="sky" />
        <StatCard label="بازدید" value={formatCompact(stats.views)} icon={Eye} tone="amber" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">آخرین محصولات</h2>
          <Link href="/dashboard/seller/products/new" className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700">
            <Plus className="h-4 w-4" />
            محصول جدید
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">محصول</th>
                  <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                  <th className="px-4 py-3 text-start font-medium">فروش</th>
                  <th className="px-4 py-3 text-start font-medium">امتیاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.slice(0, 6).map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/seller/products/${p.id}/edit`} className="font-medium text-slate-900 hover:text-brand-700">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={productStatusTone(p.status)}>{PRODUCT_STATUS_LABELS[p.status]}</Badge>
                    </td>
                    <td className="px-4 py-3">{p.salesCount.toLocaleString("fa-IR")}</td>
                    <td className="px-4 py-3">{p.ratingAvg.toLocaleString("fa-IR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            هنوز محصولی ایجاد نکرده‌اید.
          </p>
        )}
      </section>

      {transactions.length > 0 ? (
        <section>
          <h2 className="mb-3 font-bold text-slate-900">تراکنش‌های اخیر</h2>
          <div className="space-y-2">
            {transactions.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <div>
                  <p className="text-slate-700">{t.description ?? t.type}</p>
                  <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                </div>
                <span className={t.amount >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>
                  {t.amount >= 0 ? "+" : ""}
                  {formatPrice(Math.abs(t.amount))}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
