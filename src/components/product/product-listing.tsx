import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { ProductCard } from "./product-card";
import { EmptyState } from "@/components/ui/feedback";
import { toPersianDigits } from "@/lib/format";

export function ProductGrid({
  items,
  wishlistedIds = [],
}: {
  items: ProductListItem[];
  wishlistedIds?: number[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} wishlisted={wishlistedIds.includes(p.id)} />
      ))}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="صفحه‌بندی">
      {page > 1 ? (
        <Link
          href={makeHref(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label="صفحه قبل"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}

      {pages.map((p) => (
        <Link
          key={p}
          href={makeHref(p)}
          className={
            p === page
              ? "flex h-9 min-w-9 items-center justify-center rounded-lg bg-brand-600 px-2 text-sm font-semibold text-white"
              : "flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-600 hover:bg-slate-50"
          }
        >
          {toPersianDigits(p)}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={makeHref(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label="صفحه بعد"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}

export function EmptyResults({ onClear }: { onClear?: string }) {
  return (
    <EmptyState
      icon={<SearchX className="h-10 w-10" />}
      title="محصولی یافت نشد"
      description="فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید."
      action={
        onClear ? (
          <Link href={onClear} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            حذف فیلترها
          </Link>
        ) : undefined
      }
    />
  );
}
