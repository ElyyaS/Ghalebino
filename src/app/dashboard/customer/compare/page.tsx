import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getComparisonProducts } from "@/server/queries";
import { formatPrice } from "@/lib/format";
import { RatingStars } from "@/components/rating";
import { EmptyState } from "@/components/ui/feedback";
import { WishlistRemoveButton } from "@/components/dashboard/customer-actions";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const user = (await getSessionUser())!;
  const items = await getComparisonProducts(user.id);

  if (items.length === 0) {
    return <EmptyState title="مقایسه خالی است" description="با آیکون مقایسه در صفحات محصول، محصولات را برای مقایسه انتخاب کنید." />;
  }

  const rows = [
    { label: "قیمت", render: (p: (typeof items)[number]) => formatPrice(p.salePrice ?? p.price) },
    { label: "امتیاز", render: (p: (typeof items)[number]) => <RatingStars rating={p.ratingAvg} showValue={false} size={11} /> },
    { label: "تعداد فروش", render: (p: (typeof items)[number]) => p.salesCount.toLocaleString("fa-IR") },
    { label: "نسخه", render: (p: (typeof items)[number]) => p.currentVersion },
    { label: "دسته‌بندی", render: (p: (typeof items)[number]) => p.categoryName },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-slate-500">ویژگی</th>
              {items.map((p) => (
                <th key={p.id} className="min-w-[160px] px-4 py-3 text-start">
                  <Link href={`/products/${p.slug}`} className="font-semibold text-slate-900 hover:text-brand-700">
                    {p.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="px-4 py-3 font-medium text-slate-500">{row.label}</td>
                {items.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-slate-700">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-4 py-3 font-medium text-slate-500">حذف</td>
              {items.map((p) => (
                <td key={p.id} className="px-4 py-3">
                  <WishlistRemoveButton productId={p.id} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
