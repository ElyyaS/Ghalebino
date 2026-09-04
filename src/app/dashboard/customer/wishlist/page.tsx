import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getWishlistProducts } from "@/server/queries";
import { formatPrice } from "@/lib/format";
import { RatingStars } from "@/components/rating";
import { EmptyState } from "@/components/ui/feedback";
import { WishlistRemoveButton } from "@/components/dashboard/customer-actions";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = (await getSessionUser())!;
  const items = await getWishlistProducts(user.id);

  if (items.length === 0) {
    return <EmptyState title="علاقه‌مندی شما خالی است" description="محصولات مورد علاقه خود را با آیکون قلب ذخیره کنید." />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="min-w-0 flex-1">
            <Link href={`/products/${item.slug}`} className="line-clamp-1 font-medium text-slate-900 hover:text-brand-700">
              {item.title}
            </Link>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
              <span>{item.sellerName}</span>
              <RatingStars rating={item.ratingAvg} showValue={false} size={11} />
            </div>
          </div>
          <span className="font-bold text-slate-900">{formatPrice(item.salePrice ?? item.price)}</span>
          <WishlistRemoveButton productId={item.productId} />
        </div>
      ))}
    </div>
  );
}
