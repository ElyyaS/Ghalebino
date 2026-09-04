import { notFound } from "next/navigation";
import { getAdminProductDetail } from "@/server/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { PRODUCT_STATUS_LABELS, productStatusTone } from "@/lib/labels";
import { ProductDecisionForm } from "@/components/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProductDetail(Number(id));
  if (!product) notFound();

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{product.title}</h2>
            <p className="mt-1 text-sm text-slate-500">فروشنده: {product.sellerName}</p>
          </div>
          <Badge tone={productStatusTone(product.status)}>{PRODUCT_STATUS_LABELS[product.status]}</Badge>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-slate-400">قیمت</dt>
            <dd className="font-semibold">{formatPrice(product.price)}</dd>
          </div>
          {product.salePrice != null ? (
            <div>
              <dt className="text-slate-400">قیمت با تخفیف</dt>
              <dd className="font-semibold">{formatPrice(product.salePrice)}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-slate-400">نسخه</dt>
            <dd>{product.currentVersion}</dd>
          </div>
          <div>
            <dt className="text-slate-400">تاریخ ایجاد</dt>
            <dd>{formatDate(product.createdAt)}</dd>
          </div>
        </dl>

        {product.demoUrl ? (
          <p className="mt-3 text-sm text-slate-500">
            دمو:{" "}
            <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600" dir="ltr">
              {product.demoUrl}
            </a>
          </p>
        ) : null}

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-400">توضیح کوتاه</p>
          <p className="mt-1 text-sm leading-7 text-slate-600">{product.shortDescription}</p>
        </div>
        <div className="mt-3 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-400">توضیحات کامل</p>
          <p className="mt-1 whitespace-pre-line text-sm leading-7 text-slate-600">{product.description}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-3 font-semibold text-slate-900">اقدام مدیریتی</h3>
        <ProductDecisionForm productId={product.id} current={product.status} />
      </div>
    </div>
  );
}
