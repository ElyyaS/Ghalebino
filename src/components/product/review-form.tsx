"use client";

import { useActionState } from "react";
import { submitReviewAction } from "@/server/actions/products";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

type Criterion = { id: number; name: string };

export function ReviewForm({ productId, criteria }: { productId: number; criteria: Criterion[] }) {
  const [state, formAction, pending] = useActionState(submitReviewAction, {});

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">ثبت دیدگاه شما</h3>
      <input type="hidden" name="productId" value={productId} />

      <Field label="امتیاز کلی" htmlFor="rating">
        <Select id="rating" name="rating" defaultValue="5">
          <option value="5">۵ — عالی</option>
          <option value="4">۴ — خوب</option>
          <option value="3">۳ — متوسط</option>
          <option value="2">۲ — ضعیف</option>
          <option value="1">۱ — بسیار ضعیف</option>
        </Select>
      </Field>

      {criteria.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {criteria.map((c) => (
            <Field key={c.id} label={c.name}>
              <Select name={`criterion_${c.id}`} defaultValue="5">
                <option value="5">۵</option>
                <option value="4">۴</option>
                <option value="3">۳</option>
                <option value="2">۲</option>
                <option value="1">۱</option>
              </Select>
            </Field>
          ))}
        </div>
      ) : null}

      <Field label="عنوان (اختیاری)" htmlFor="title">
        <Input id="title" name="title" placeholder="خلاصه دیدگاه شما" />
      </Field>

      <Field label="متن دیدگاه" htmlFor="content" error={state.error}>
        <Textarea id="content" name="content" placeholder="تجربه خود از این محصول را بنویسید…" required />
      </Field>

      {state.message ? <Alert tone="success">{state.message}</Alert> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "در حال ثبت…" : "ثبت دیدگاه"}
      </Button>
    </form>
  );
}
