import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getUserReviews } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { RatingStars } from "@/components/rating";
import { EmptyState, Badge } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const user = (await getSessionUser())!;
  const reviews = await getUserReviews(user.id);

  if (reviews.length === 0) {
    return <EmptyState title="دیدگاهی ثبت نکرده‌اید" description="پس از خرید محصول، می‌توانید از صفحه محصول دیدگاه ثبت کنید." />;
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <Link href={`/products/${r.productSlug}`} className="font-medium text-slate-900 hover:text-brand-700">
              {r.productTitle}
            </Link>
            <Badge tone={r.status === "PUBLISHED" ? "success" : "neutral"}>
              {r.status === "PUBLISHED" ? "منتشر شده" : r.status}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars rating={r.rating} showValue={false} size={12} />
            <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
          </div>
          {r.content ? <p className="mt-2 text-sm leading-7 text-slate-600">{r.content}</p> : null}
        </div>
      ))}
    </div>
  );
}
