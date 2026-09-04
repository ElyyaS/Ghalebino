import type { Metadata } from "next";
import { Catalog } from "@/components/product/catalog";
import { searchProvider } from "@/lib/search";
import type { SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "جستجو" };

const SORTS = ["relevance", "newest", "best_sellers", "highest_rated", "trending", "recently_updated", "price_asc", "price_desc"];

function parseSort(v: string | undefined): SortOption {
  return (v && SORTS.includes(v) ? v : "relevance") as SortOption;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sort = parseSort(typeof sp.sort === "string" ? sp.sort : undefined);
  const page = Math.max(1, Number(sp.page) || 1);

  const result = await searchProvider.search({ q, page, perPage: 16, sort });

  const params: Record<string, string> = {};
  if (q) params.q = q;
  params.sort = sort;

  return (
    <Catalog
      basePath="/search"
      title={q ? `نتایج جستجو برای «${q}»` : "جستجو"}
      subtitle={q ? "نتایج مرتبط با عبارت شما" : "عبارتی را برای جستجو وارد کنید"}
      params={params}
      result={result}
    />
  );
}
