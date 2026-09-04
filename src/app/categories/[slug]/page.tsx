import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Catalog } from "@/components/product/catalog";
import { getCategoryBySlug, listProducts } from "@/server/queries";
import type { SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";

const SORTS = ["relevance", "newest", "best_sellers", "highest_rated", "trending", "recently_updated", "price_asc", "price_desc"];
function parseSort(v: string | undefined): SortOption {
  return (v && SORTS.includes(v) ? v : "newest") as SortOption;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "دسته‌بندی", description: category?.description ?? undefined };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const sort = parseSort(typeof sp.sort === "string" ? sp.sort : undefined);
  const page = Math.max(1, Number(sp.page) || 1);

  const result = await listProducts({ categoryId: category.id, page, perPage: 16, sort });

  const queryParams: Record<string, string> = { sort };
  if (sp.category) queryParams.category = String(sp.category);

  return (
    <Catalog
      basePath={`/categories/${slug}`}
      title={category.name}
      subtitle={category.description ?? undefined}
      params={queryParams}
      result={result}
    />
  );
}
