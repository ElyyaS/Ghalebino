import { getAdminCoupons } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { CreateCouponForm } from "@/components/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">کد</th>
              <th className="px-4 py-3 text-start font-medium">نوع</th>
              <th className="px-4 py-3 text-start font-medium">مقدار</th>
              <th className="px-4 py-3 text-start font-medium">استفاده</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">انقضا</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-mono text-xs font-semibold" dir="ltr">{c.code}</td>
                <td className="px-4 py-3">{c.type === "PERCENT" ? "درصدی" : "ثابت"}</td>
                <td className="px-4 py-3">
                  {c.type === "PERCENT" ? `${c.value}٪` : c.value.toLocaleString("fa-IR")}
                </td>
                <td className="px-4 py-3">
                  {c.usedCount.toLocaleString("fa-IR")}
                  {c.maxUses ? ` / ${c.maxUses.toLocaleString("fa-IR")}` : ""}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={c.isActive ? "success" : "neutral"}>{c.isActive ? "فعال" : "غیرفعال"}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-500">{c.expiresAt ? formatDate(c.expiresAt) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateCouponForm />
    </div>
  );
}
