import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { formatNumber, formatPrice } from "@/lib/format";
import { RatingStars } from "@/components/rating";
import { CompareButton, WishlistButton } from "./product-actions";

function Cover({ product, discount }: { product: ProductListItem; discount: number }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-100 via-white to-accent-100 text-brand-300">
          <LayoutGrid className="h-12 w-12" />
        </div>
      )}
      {discount > 0 ? (
        <span className="absolute right-2.5 top-2.5 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
          ٪{discount.toLocaleString("fa-IR")}
        </span>
      ) : null}
    </div>
  );
}

export function ProductCard({ product, wishlisted = false }: { product: ProductListItem; wishlisted?: boolean }) {
  const discount =
    product.salePrice != null && product.salePrice < product.price
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;
  const price = product.salePrice ?? product.price;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <Cover product={product} discount={discount} />
      </Link>

      <div className="absolute left-2.5 top-2.5 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <WishlistButton productId={product.id} initialAdded={wishlisted} />
        <CompareButton productId={product.id} />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link href={`/categories/${product.categorySlug}`} className="hover:text-brand-600">
            {product.categoryName}
          </Link>
          <span>نسخه {product.currentVersion}</span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 font-semibold leading-6 text-slate-900 transition-colors hover:text-brand-700"
        >
          {product.title}
        </Link>

        <p className="line-clamp-2 text-xs leading-5 text-slate-500">{product.shortDescription}</p>

        <div className="mt-auto flex items-center justify-between pt-1.5">
          <RatingStars rating={product.ratingAvg} count={product.ratingCount} size={12} showValue={false} />
          <span className="text-xs text-slate-400">{formatNumber(product.salesCount)} فروش</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div className="flex items-baseline gap-2">
            {discount > 0 ? (
              <span className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</span>
            ) : null}
            <span className="text-base font-bold text-slate-900">{formatPrice(price)}</span>
          </div>
          <Link
            href={`/sellers/${product.sellerUsername}`}
            className="max-w-[40%] truncate text-xs text-slate-400 hover:text-brand-600"
          >
            {product.sellerName}
          </Link>
        </div>
      </div>
    </article>
  );
}
