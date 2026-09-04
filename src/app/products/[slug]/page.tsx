import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Check,
  ExternalLink,
  FileText,
  Home,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import {
  getProductBySlug,
  getQuestions,
  getReviewCriteria,
  getReviews,
  getReviewSummary,
  hasPurchased,
  listProducts,
  recordProductView,
} from "@/server/queries";
import { getSessionUser } from "@/lib/auth";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { RatingStars } from "@/components/rating";
import { Badge } from "@/components/ui/feedback";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ReviewForm } from "@/components/product/review-form";
import { QuestionForm } from "@/components/product/question-form";
import { ProductGrid } from "@/components/product/product-listing";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.seoTitle ?? product?.title ?? "محصول",
    description: product?.seoDescription ?? product?.shortDescription,
    openGraph: product ? { title: product.title, description: product.shortDescription } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "PUBLISHED") notFound();

  await recordProductView(product.id);

  const [user, reviews, questions, summary, criteria, related] = await Promise.all([
    getSessionUser(),
    getReviews(product.id),
    getQuestions(product.id),
    getReviewSummary(product.id),
    getReviewCriteria(),
    listProducts({ categoryId: product.categoryId, page: 1, perPage: 5, sort: "best_sellers" }),
  ]);

  const canReview = user ? await hasPurchased(user.id, product.id) : false;
  const discount =
    product.salePrice != null && product.salePrice < product.price
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="flex items-center gap-1 hover:text-brand-600">
          <Home className="h-3 w-3" />
          خانه
        </Link>
        <span>/</span>
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-brand-600">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-slate-600">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <ProductGallery images={product.images} title={product.title} />

          <div className="mt-6 lg:hidden">
            <PurchasePanel product={{ id: product.id, slug: product.slug, title: product.title }} licenses={product.licenses} />
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-slate-900">توضیحات محصول</h2>
            <div className="whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-8 text-slate-700">
              {product.description}
            </div>
          </section>

          {/* Features */}
          {product.features.length > 0 ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-slate-900">ویژگی‌ها</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Requirements */}
          {product.requirements.length > 0 ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-slate-900">نیازمندی‌ها</h2>
              <ul className="space-y-1.5 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                {product.requirements.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Reviews */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-slate-900">دیدگاه‌ها</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-slate-900">{formatNumber(summary.avg)}</span>
                  <div>
                    <RatingStars rating={summary.avg} count={summary.count} showValue={false} />
                    <p className="mt-1 text-xs text-slate-500">{formatNumber(summary.count)} دیدگاه</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const n = summary.distribution[star as 1 | 2 | 3 | 4 | 5] ?? 0;
                    const pct = summary.count ? Math.round((n / summary.count) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-3">{star.toLocaleString("fa-IR")}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-left">{formatNumber(n)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                            {r.userName.slice(0, 1)}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{r.userName}</p>
                            {r.orderItemId ? (
                              <span className="text-xs text-emerald-600">خرید تأییدشده</span>
                            ) : null}
                          </div>
                        </div>
                        <RatingStars rating={r.rating} showValue={false} size={12} />
                      </div>
                      {r.title ? <p className="mt-3 text-sm font-medium text-slate-900">{r.title}</p> : null}
                      {r.content ? <p className="mt-1 text-sm leading-7 text-slate-600">{r.content}</p> : null}
                      {r.sellerReply ? (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                          <span className="font-semibold text-slate-800">پاسخ فروشنده: </span>
                          {r.sellerReply}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    هنوز دیدگاهی ثبت نشده است.
                  </p>
                )}

                {canReview ? (
                  <ReviewForm productId={product.id} criteria={criteria.map((c) => ({ id: c.id, name: c.name }))} />
                ) : (
                  <p className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
                    {user ? "برای ثبت دیدگاه باید این محصول را خریداری کرده باشید." : "برای ثبت دیدگاه وارد شوید."}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Q&A */}
          <section className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
              <MessageSquare className="h-5 w-5" />
              پرسش و پاسخ
            </h2>
            <div className="space-y-4">
              {questions.length > 0 ? (
                questions.map((q) => (
                  <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 rounded bg-brand-50 px-1.5 text-xs font-bold text-brand-600">پ</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{q.question}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{q.userName}</p>
                      </div>
                    </div>
                    {q.sellerAnswer ? (
                      <div className="mt-3 rounded-lg bg-emerald-50/60 p-3 text-sm text-slate-700">
                        <span className="font-semibold text-emerald-700">پاسخ فروشنده: </span>
                        {q.sellerAnswer}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  هنوز پرسشی ثبت نشده است.
                </p>
              )}
              <QuestionForm productId={product.id} />
            </div>
          </section>
        </div>

        {/* Right column (RTL: appears on the left visually) */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h1 className="text-2xl font-bold leading-9 text-slate-900">{product.title}</h1>
              {discount > 0 ? <Badge tone="danger">٪{discount.toLocaleString("fa-IR")} تخفیف</Badge> : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <RatingStars rating={product.ratingAvg} count={product.ratingCount} />
              <span>{formatNumber(product.salesCount)} فروش</span>
              <span>نسخه {product.currentVersion}</span>
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-600">{product.shortDescription}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.technologies.map((t) => (
                <Link
                  key={t.id}
                  href={`/technologies/${t.slug}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-brand-300 hover:text-brand-700"
                >
                  {t.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-b border-slate-200 pb-4 text-xs text-slate-400">
              <span>آخرین به‌روزرسانی: {formatDate(product.lastUpdatedAt)}</span>
            </div>

            <div className="mt-4 flex gap-2">
              {product.demoUrl ? (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  پیش‌نمایش زنده
                </a>
              ) : null}
              {product.documentationUrl ? (
                <a
                  href={product.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4" />
                  مستندات
                </a>
              ) : null}
            </div>
          </div>

          <div className="hidden lg:block">
            <PurchasePanel product={{ id: product.id, slug: product.slug, title: product.title }} licenses={product.licenses} />
          </div>

          <Link
            href={`/sellers/${product.sellerUsername}`}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
              {product.sellerName.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{product.sellerName}</p>
              <RatingStars rating={product.sellerRating} showValue={false} size={12} />
            </div>
            <span className="mr-auto text-xs font-medium text-brand-600">مشاهده فروشگاه</span>
          </Link>

          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {product.supportNote ?? "پشتیبانی و به‌روزرسانی شامل این محصول است."}
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.items.length > 0 ? (
        <section className="mt-14">
          <h2 className="mb-5 text-lg font-bold text-slate-900">محصولات مشابه</h2>
          <ProductGrid items={related.items.filter((p) => p.id !== product.id).slice(0, 4)} />
        </section>
      ) : null}
    </div>
  );
}
