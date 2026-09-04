import type { Metadata } from "next";
import { Catalog } from "@/components/product/catalog";
import { listProducts } from "@/server/queries";
import { getCategoryBySlug, getTechnologyBySlug } from "@/server/queries";
import type { SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "بازارچه" };

const SORTS = ["relevance", "newest", "best_sellers", "highest_rated", "trending", "recently_updated", "price_asc", "price_desc"];

function parseSort(v: string | undefined): SortOption {
  return (v && SORTS.includes(v) ? v : "newest") as SortOption;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sort = parseSort(typeof sp.sort === "string" ? sp.sort : undefined);
  const page = Math.max(1, Number(sp.page) || 1);

  const categorySlug = typeof sp.category === "string" ? sp.category : undefined;
  const technologySlug = typeof sp.technology === "string" ? sp.technology : undefined;
  const category = categorySlug ? await getCategoryBySlug(categorySlug) : null;
  const technology = technologySlug ? await getTechnologyBySlug(technologySlug) : null;

  const minPrice = Number(sp.minPrice) > 0 ? Number(sp.minPrice) : undefined;
  const maxPrice = Number(sp.maxPrice) > 0 ? Number(sp.maxPrice) : undefined;
  const minRating = Number(sp.minRating) > 0 ? Number(sp.minRating) : undefined;
  const onSale = sp.onSale === "1";

  const result = await listProducts({
    q: q || undefined,
    categoryId: category?.id,
    technologyId: technology?.id,
    minPrice,
    maxPrice,
    minRating,
    onSale: onSale || undefined,
    page,
    perPage: 16,
    sort,
  });

  const params: Record<string, string> = {};
  if (q) params.q = q;
  params.sort = sort;
  if (categorySlug) params.category = categorySlug;
  if (technologySlug) params.technology = technologySlug;
  if (minPrice) params.minPrice = String(minPrice);
  if (maxPrice) params.maxPrice = String(maxPrice);
  if (minRating) params.minRating = String(minRating);
  if (onSale) params.onSale = "1";

  return (
    <Catalog
      basePath="/marketplace"
      title="بازارچه قالب‌ها"
      subtitle="تمام قالب‌ها و محصولات وب را مرور و بر اساس نیاز خود فیلتر کنید."
      params={params}
      result={result}
    />
  );
}
