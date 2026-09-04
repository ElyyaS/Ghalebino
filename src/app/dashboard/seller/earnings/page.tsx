import { getSessionUser } from "@/lib/auth";
import {
  getSellerBalance,
  getSellerByUserIdForDashboard,
  getSellerStats,
  getSellerTransactions,
  getSellerWithdrawals,
} from "@/server/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { Wallet, TrendingUp, Receipt } from "lucide-react";
import { formatCompact, formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { WITHDRAWAL_STATUS_LABELS, withdrawalStatusTone } from "@/lib/labels";
import { WithdrawalForm } from "@/components/seller/seller-actions";

export const dynamic = "force-dynamic";

export default async function SellerEarningsPage() {
  const user = (await getSessionUser())!;
  const seller = (await getSellerByUserIdForDashboard(user.id))!;
  const [stats, balance, transactions, withdrawals] = await Promise.all([
    getSellerStats(seller.id),
    getSellerBalance(seller.id),
    getSellerTransactions(seller.id),
    getSellerWithdrawals(seller.id),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="موجودی قابل برداشت" value={formatCompact(balance)} icon={Wallet} tone="emerald" />
        <StatCard label="سهم فروشنده (کل)" value={formatCompact(stats.earnings)} icon={TrendingUp} tone="brand" />
        <StatCard label="تعداد فروش" value={stats.orderCount.toLocaleString("fa-IR")} icon={Receipt} tone="sky" />
      </div>

      <WithdrawalForm balance={balance} />

      <section>
        <h2 className="mb-3 font-bold text-slate-900">تاریخچه برداشت‌ها</h2>
        {withdrawals.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">مبلغ</th>
                  <th className="px-4 py-3 text-start font-medium">روش</th>
                  <th className="px-4 py-3 text-start font-medium">وضعیت</th>
                  <th className="px-4 py-3 text-start font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td className="px-4 py-3 font-semibold">{formatPrice(w.amount)}</td>
                    <td className="px-4 py-3 text-slate-600">{w.method}</td>
                    <td className="px-4 py-3">
                      <Badge tone={withdrawalStatusTone(w.status)}>{WITHDRAWAL_STATUS_LABELS[w.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(w.requestedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            هنوز درخواست برداشتی ثبت نکرده‌اید.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold text-slate-900">تراکنش‌ها</h2>
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((t) => (
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
        ) : null}
      </section>
    </div>
  );
}
