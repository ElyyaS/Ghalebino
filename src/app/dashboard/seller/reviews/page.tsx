import { getSessionUser } from "@/lib/auth";
import { getSellerByUserIdForDashboard, getSellerQuestions, getSellerReviews } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { RatingStars } from "@/components/rating";
import { EmptyState } from "@/components/ui/feedback";
import { QuestionAnswerForm, ReviewReplyForm } from "@/components/seller/seller-actions";

export const dynamic = "force-dynamic";

export default async function SellerReviewsPage() {
  const user = (await getSessionUser())!;
  const seller = (await getSellerByUserIdForDashboard(user.id))!;
  const [reviews, questions] = await Promise.all([getSellerReviews(seller.id), getSellerQuestions(seller.id)]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 font-bold text-slate-900">دیدگاه‌های مشتریان</h2>
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{r.productTitle}</p>
                  <RatingStars rating={r.rating} showValue={false} size={12} />
                </div>
                {r.content ? <p className="mt-2 text-sm leading-7 text-slate-600">{r.content}</p> : null}
                {r.sellerReply ? (
                  <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <span className="font-semibold">پاسخ شما: </span>
                    {r.sellerReply}
                  </p>
                ) : (
                  <div className="mt-3">
                    <ReviewReplyForm reviewId={r.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="دیدگاهی وجود ندارد" />
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold text-slate-900">پرسش‌های مشتریان</h2>
        {questions.length > 0 ? (
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-medium text-slate-900">{q.productTitle}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{q.question}</p>
                {q.sellerAnswer ? (
                  <p className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                    <span className="font-semibold">پاسخ شما: </span>
                    {q.sellerAnswer}
                  </p>
                ) : (
                  <div className="mt-3">
                    <QuestionAnswerForm questionId={q.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="پرسشی وجود ندارد" />
        )}
      </section>
    </div>
  );
}
