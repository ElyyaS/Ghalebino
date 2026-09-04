import Link from "next/link";
import type { Metadata } from "next";
import { getAllSellers } from "@/server/queries";
import { formatCompact, formatNumber } from "@/lib/format";
import { RatingStars } from "@/components/rating";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "فروشندگان" };

export default async function SellersPage() {
  const sellers = await getAllSellers();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">فروشندگان قالبی نو</h1>
        <p className="mt-1 text-sm text-slate-500">آثار حرفه‌ای‌ترین سازندگان قالب را ببینید.</p>
      </header>

      {sellers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sellers.map((s) => (
            <Link
              key={s.id}
              href={`/sellers/${s.username}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-xl font-bold text-brand-700">
                  {s.storeName.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{s.storeName}</p>
                  <p className="truncate text-xs text-slate-500">{s.tagline ?? "فروشنده قالب"}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <RatingStars rating={s.rating} showValue={false} size={12} />
                <span className="text-xs text-slate-400">{formatCompact(s.totalSales)} فروش</span>
                <span className="text-xs text-slate-400">{formatNumber(s.totalProducts)} محصول</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
          هنوز فروشنده‌ای ثبت نشده است.
        </p>
      )}
    </div>
  );
}
