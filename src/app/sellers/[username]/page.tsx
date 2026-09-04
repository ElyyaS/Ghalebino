import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Package, Star, TrendingUp } from "lucide-react";
import { getSellerByUsername, listProducts } from "@/server/queries";
import { formatCompact, formatDate, formatNumber } from "@/lib/format";
import { RatingStars } from "@/components/rating";
import { ProductGrid } from "@/components/product/product-listing";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const seller = await getSellerByUsername(username);
  return { title: seller?.storeName ?? "فروشگاه" };
}

export default async function SellerPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const seller = await getSellerByUsername(username);
  if (!seller) notFound();

  const products = await listProducts({ sellerId: seller.id, page: 1, perPage: 16, sort: "best_sellers" });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="h-28 bg-gradient-to-l from-brand-600 to-accent-500 sm:h-36" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-brand-100 text-3xl font-bold text-brand-700">
                {seller.storeName.slice(0, 1)}
              </span>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-slate-900">{seller.storeName}</h1>
                {seller.tagline ? <p className="text-sm text-slate-500">{seller.tagline}</p> : null}
              </div>
            </div>
            <div className="flex gap-6 pb-1 text-center">
              <Stat icon={<Star className="h-4 w-4 text-amber-500" />} label="امتیاز" value={formatNumber(Math.round(seller.rating * 10) / 10)} />
              <Stat icon={<Package className="h-4 w-4 text-brand-500" />} label="محصولات" value={formatNumber(seller.totalProducts)} />
              <Stat icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} label="فروش" value={formatCompact(seller.totalSales)} />
              <Stat icon={<CalendarDays className="h-4 w-4 text-slate-400" />} label="عضویت" value={formatDate(seller.joinedAt)} />
            </div>
          </div>

          {seller.bio ? (
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">{seller.bio}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-5 text-lg font-bold text-slate-900">محصولات این فروشگاه</h2>
        {products.items.length > 0 ? (
          <ProductGrid items={products.items} />
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
            این فروشگاه هنوز محصولی منتشر نکرده است.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="hidden sm:block">
      <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-900">
        {icon}
        {value}
      </div>
      <p className="mt-0.5 text-xs text-slate-400">{label}</p>
    </div>
  );
}
