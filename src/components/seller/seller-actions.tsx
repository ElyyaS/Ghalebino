"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Trash2 } from "lucide-react";
import { deleteProductAction, requestWithdrawalAction, submitProductAction, updateStoreAction } from "@/server/actions/seller";
import { replyToReviewAction, answerQuestionAction } from "@/server/actions/seller";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export function SubmitProductButton({ productId }: { productId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button
      variant="subtle"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await submitProductAction(productId);
          if (r.error) alert(r.error);
          else router.refresh();
        })
      }
    >
      <Send className="h-3.5 w-3.5" />
      ارسال برای بررسی
    </Button>
  );
}

export function DeleteProductButton({ productId }: { productId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          if (!confirm("محصول حذف شود؟")) return;
          const r = await deleteProductAction(productId);
          if (r.error) alert(r.error);
          else router.refresh();
        })
      }
      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
      aria-label="حذف"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export function WithdrawalForm({ balance }: { balance: number }) {
  const [state, formAction, pending] = useActionState(requestWithdrawalAction, {});
  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">درخواست برداشت</h2>
      <p className="text-sm text-slate-500">موجودی قابل برداشت: {balance.toLocaleString("fa-IR")} تومان</p>
      <Field label="مبلغ (تومان)" htmlFor="amount">
        <Input id="amount" name="amount" type="number" min={10000} required />
      </Field>
      <Field label="روش پرداخت" htmlFor="method">
        <Select id="method" name="method" defaultValue="bank">
          <option value="bank">حساب بانکی</option>
          <option value="card">کارت به کارت</option>
          <option value="wallet">کیف پول</option>
        </Select>
      </Field>
      <Field label="اطلاعات حساب مقصد" htmlFor="accountDetails">
        <Input id="accountDetails" name="accountDetails" required />
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "در حال ثبت…" : "ثبت درخواست برداشت"}
      </Button>
    </form>
  );
}

export function ReviewReplyForm({ reviewId }: { reviewId: number }) {
  const [state, formAction, pending] = useActionState(replyToReviewAction, {});
  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="reviewId" value={reviewId} />
      <Textarea name="reply" placeholder="پاسخ به دیدگاه…" />
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <Button type="submit" size="sm" disabled={pending}>
        ثبت پاسخ
      </Button>
    </form>
  );
}

export function QuestionAnswerForm({ questionId }: { questionId: number }) {
  const [state, formAction, pending] = useActionState(answerQuestionAction, {});
  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="questionId" value={questionId} />
      <Textarea name="answer" placeholder="پاسخ به سؤال…" />
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <Button type="submit" size="sm" disabled={pending}>
        ثبت پاسخ
      </Button>
    </form>
  );
}

export function StoreForm({ initial }: { initial: { storeName: string; tagline: string | null; bio: string | null } }) {
  const [state, formAction, pending] = useActionState(updateStoreAction, {});
  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">اطلاعات فروشگاه</h2>
      <Field label="نام فروشگاه" htmlFor="storeName">
        <Input id="storeName" name="storeName" defaultValue={initial.storeName} required />
      </Field>
      <Field label="شعار فروشگاه" htmlFor="tagline">
        <Input id="tagline" name="tagline" defaultValue={initial.tagline ?? ""} />
      </Field>
      <Field label="معرفی فروشگاه" htmlFor="bio">
        <Textarea id="bio" name="bio" defaultValue={initial.bio ?? ""} />
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        ذخیره
      </Button>
    </form>
  );
}
