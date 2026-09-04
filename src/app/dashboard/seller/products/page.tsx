import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getSellerByUserIdForDashboard, getSellerProducts } from "@/server/queries";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { PRODUCT_STATUS_LABELS, productStatusTone } from "@/lib/labels";
import { DeleteProductButton, SubmitProductButton } from "@/components/seller/seller-actions";

export const dynamic = "force-dynamic";

export default async function SellerProductsPage() {
  const user = (await getSessionUser())!;
  const seller = (await getSellerByUserIdForDashboard(user.id))!;
  const products = await getSellerProducts(seller.id);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
        <p className="text-slate-500">هنوز محصولی ندارید.</p>
        <Link href="/dashboard/seller/products/new" className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
          ایجاد اولین محصول
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">محصول</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">قیمت</th>
              <th className="px-4 py-3 text-start font-medium">فروش</th>
              <th className="px-4 py-3 text-start font-medium">اقدامات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-400">نسخه {p.currentVersion}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={productStatusTone(p.status)}>{PRODUCT_STATUS_LABELS[p.status]}</Badge>
                </td>
                <td className="px-4 py-3">{formatPrice(p.salePrice ?? p.price)}</td>
                <td className="px-4 py-3">{p.salesCount.toLocaleString("fa-IR")}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/seller/products/${p.id}/edit`} className="text-brand-600 hover:text-brand-700">
                      ویرایش
                    </Link>
                    {["DRAFT", "CHANGES_REQUESTED", "REJECTED"].includes(p.status) ? (
                      <SubmitProductButton productId={p.id} />
                    ) : null}
                    <DeleteProductButton productId={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
