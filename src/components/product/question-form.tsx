"use client";

import { useActionState } from "react";
import { askQuestionAction } from "@/server/actions/products";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export function QuestionForm({ productId }: { productId: number }) {
  const [state, formAction, pending] = useActionState(askQuestionAction, {});

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">پرسش خود را مطرح کنید</h3>
      <input type="hidden" name="productId" value={productId} />
      <Textarea name="question" placeholder="سؤال خود را درباره این محصول بنویسید…" required />
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "در حال ثبت…" : "ثبت پرسش"}
      </Button>
    </form>
  );
}
