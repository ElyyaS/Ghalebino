import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollectionBySlug, listProducts } from "@/server/queries";
import { ProductGrid } from "@/components/product/product-listing";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const col = await getCollectionBySlug(slug);
  return { title: col?.name ?? "مجموعه" };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const result = await listProducts({ page: 1, perPage: 100, sort: "best_sellers" });
  const items = result.items.filter((p) => collection.productIds.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{collection.name}</h1>
        {collection.description ? <p className="mt-1 text-sm text-slate-500">{collection.description}</p> : null}
      </header>
      {items.length > 0 ? (
        <ProductGrid items={items} />
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
          این مجموعه خالی است.
        </p>
      )}
    </div>
  );
}
