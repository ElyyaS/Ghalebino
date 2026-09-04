import Link from "next/link";
import { Banknote, Flag, Package, ShoppingBag, Users, Wallet } from "lucide-react";
import { getAdminStats } from "@/server/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCompact } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const pending = [
    { label: "درخواست فروشندگی", count: stats.pendingSellers, href: "/admin/sellers" },
    { label: "محصول در انتظار بررسی", count: stats.pendingProducts, href: "/admin/products" },
    { label: "درخواست برداشت", count: stats.pendingWithdrawals, href: "/admin/withdrawals" },
    { label: "گزارش باز", count: stats.openReports, href: "/admin/reports" },
  ].filter((p) => p.count > 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="درآمد بازارچه" value={formatCompact(stats.revenue)} icon={Banknote} tone="emerald" />
        <StatCard label="سفارش‌ها" value={stats.ordersCount.toLocaleString("fa-IR")} icon={ShoppingBag} tone="brand" />
        <StatCard label="کاربران" value={stats.usersCount.toLocaleString("fa-IR")} icon={Users} tone="sky" />
        <StatCard label="محصولات" value={stats.productsCount.toLocaleString("fa-IR")} icon={Package} tone="amber" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Flag className="h-5 w-5 text-brand-600" />
          <h2 className="font-bold text-slate-900">موارد نیازمند بررسی</h2>
        </div>
        {pending.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pending.map((p) => (
              <Link key={p.href} href={p.href} className="rounded-xl border border-slate-200 p-4 hover:border-brand-300">
                <p className="text-2xl font-bold text-slate-900">{p.count.toLocaleString("fa-IR")}</p>
                <p className="mt-1 text-sm text-slate-500">{p.label}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">همه موارد بررسی شده‌اند. 🎉</p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "فروشندگان فعال", value: stats.sellersCount, icon: Wallet },
          { label: "درآمد ناخالص", value: formatCompact(stats.revenue), icon: Banknote },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-lg font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
