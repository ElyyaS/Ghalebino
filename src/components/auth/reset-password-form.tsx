"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <Field label="رمز عبور جدید" htmlFor="password" hint="حداقل ۸ کاراکتر">
        <Input id="password" name="password" type="password" dir="ltr" required />
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "در حال ذخیره…" : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}
