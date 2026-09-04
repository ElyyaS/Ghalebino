import Link from "next/link";
import { getAdminProducts } from "@/server/queries";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { PRODUCT_STATUS_LABELS, productStatusTone } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">محصول</th>
              <th className="px-4 py-3 text-start font-medium">فروشنده</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">قیمت</th>
              <th className="px-4 py-3 text-start font-medium">فروش</th>
              <th className="px-4 py-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                <td className="px-4 py-3 text-slate-600">{p.sellerName}</td>
                <td className="px-4 py-3">
                  <Badge tone={productStatusTone(p.status)}>{PRODUCT_STATUS_LABELS[p.status]}</Badge>
                </td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.salesCount.toLocaleString("fa-IR")}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="text-brand-600 hover:text-brand-700">
                    بررسی
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
