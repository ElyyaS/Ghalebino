import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getOrderDetail } from "@/server/queries";
import { formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { ORDER_STATUS_LABELS, orderStatusTone } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = (await getSessionUser())!;
  const detail = await getOrderDetail(Number(id), user.id);
  if (!detail) notFound();

  const downloadable = ["PAID", "COMPLETED"].includes(detail.status);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">شماره سفارش</p>
            <p className="font-mono text-sm font-semibold" dir="ltr">{detail.orderNumber}</p>
          </div>
          <Badge tone={orderStatusTone(detail.status)}>{ORDER_STATUS_LABELS[detail.status]}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-slate-500">تاریخ ثبت</p>
            <p className="font-medium">{formatDate(detail.createdAt)}</p>
          </div>
          <div>
            <p className="text-slate-500">تخفیف</p>
            <p className="font-medium">{formatPrice(detail.discount)}</p>
          </div>
          <div>
            <p className="text-slate-500">جمع کل</p>
            <p className="font-bold">{formatPrice(detail.total)}</p>
          </div>
          <div>
            <p className="text-slate-500">روش پرداخت</p>
            <p className="font-medium">{detail.paymentMethod === "mock" ? "درگاه آزمایشی" : detail.paymentMethod}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4 font-semibold text-slate-900">اقلام سفارش</div>
        <div className="divide-y divide-slate-100">
          {detail.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{item.productTitle}</p>
                <p className="text-xs text-slate-500">{item.licenseName} · {item.sellerName}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold">{formatPrice(item.finalPrice)}</span>
                {downloadable ? (
                  <a
                    href={`/api/downloads/${item.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    دانلود
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link href="/dashboard/customer/orders" className="text-sm text-slate-500 hover:text-brand-700">
        بازگشت به سفارش‌ها
      </Link>
    </div>
  );
}
