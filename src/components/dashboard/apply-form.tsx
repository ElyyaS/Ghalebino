"use client";

import { useActionState } from "react";
import { applyToSellAction } from "@/server/actions/seller";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export function ApplyForm() {
  const [state, formAction, pending] = useActionState(applyToSellAction, {});

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">فرم درخواست فروشندگی</h2>
      <Field label="نام فروشگاه" htmlFor="storeName">
        <Input id="storeName" name="storeName" required />
      </Field>
      <Field label="توضیحات (درباره شما و تخصصتان)" htmlFor="description">
        <Textarea id="description" name="description" required />
      </Field>
      <Field label="لینک نمونه‌کار (اختیاری)" htmlFor="portfolioUrl">
        <Input id="portfolioUrl" name="portfolioUrl" dir="ltr" />
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "در حال ثبت…" : "ثبت درخواست"}
      </Button>
    </form>
  );
}
