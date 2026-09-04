import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Catalog } from "@/components/product/catalog";
import { getTechnologyBySlug, listProducts } from "@/server/queries";
import type { SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";

const SORTS = ["relevance", "newest", "best_sellers", "highest_rated", "trending", "recently_updated", "price_asc", "price_desc"];
function parseSort(v: string | undefined): SortOption {
  return (v && SORTS.includes(v) ? v : "newest") as SortOption;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tech = await getTechnologyBySlug(slug);
  return { title: tech?.name ?? "تکنولوژی" };
}

export default async function TechnologyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const tech = await getTechnologyBySlug(slug);
  if (!tech) notFound();

  const sp = await searchParams;
  const sort = parseSort(typeof sp.sort === "string" ? sp.sort : undefined);
  const page = Math.max(1, Number(sp.page) || 1);

  const result = await listProducts({ technologyId: tech.id, page, perPage: 16, sort });

  return (
    <Catalog
      basePath={`/technologies/${slug}`}
      title={`قالب‌های ${tech.name}`}
      subtitle="محصولات ساخته‌شده با این تکنولوژی"
      params={{ sort }}
      result={result}
    />
  );
}
