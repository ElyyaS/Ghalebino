import { FilterPanel } from "./filter-panel";
import { SortForm } from "./sort-form";
import { EmptyResults, Pagination, ProductGrid } from "./product-listing";
import { SlidersHorizontal } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getCategories, getTechnologies, getWishlistIds } from "@/server/queries";
import type { ProductListItem } from "@/lib/types";
import { formatNumber } from "@/lib/format";

type Result = {
  items: ProductListItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export async function Catalog({
  basePath,
  title,
  subtitle,
  params,
  result,
}: {
  basePath: string;
  title: string;
  subtitle?: string;
  params: Record<string, string>;
  result: Result;
}) {
  const [categories, technologies, user] = await Promise.all([
    getCategories(),
    getTechnologies(),
    getSessionUser(),
  ]);
  const wishlistedIds = user ? await getWishlistIds(user.id) : [];

  const makeHref = (page: number) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) p.set(k, v);
    p.set("page", String(page));
    return `${basePath}?${p.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        <p className="mt-2 text-sm text-slate-500">{formatNumber(result.total)} محصول یافت شد</p>
      </header>

      <div className="flex items-start gap-6">
        <aside className="sticky top-20 hidden w-64 shrink-0 md:block">
          <FilterPanel basePath={basePath} categories={categories} technologies={technologies} current={params} />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <details className="md:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                <SlidersHorizontal className="h-4 w-4" />
                فیلترها
              </summary>
              <div className="mt-3">
                <FilterPanel basePath={basePath} categories={categories} technologies={technologies} current={params} />
              </div>
            </details>
            <SortForm basePath={basePath} params={params} current={params.sort ?? "newest"} />
          </div>

          {result.items.length > 0 ? (
            <>
              <ProductGrid items={result.items} wishlistedIds={wishlistedIds} />
              <Pagination page={result.page} totalPages={result.totalPages} makeHref={makeHref} />
            </>
          ) : (
            <EmptyResults onClear={basePath} />
          )}
        </div>
      </div>
    </div>
  );
}
