"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/server/actions/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, {});

  return (
    <AuthCard
      title="بازیابی رمز عبور"
      subtitle="ایمیل خود را وارد کنید تا لینک بازیابی ارسال شود"
      footer={
        <Link href="/auth/login" className="font-medium text-brand-600 hover:text-brand-700">
          بازگشت به ورود
        </Link>
      }
    >
      <form action={formAction} className="space-y-4">
        <Field label="ایمیل" htmlFor="email">
          <Input id="email" name="email" type="email" dir="ltr" placeholder="you@example.com" required />
        </Field>

        {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
        {state.message ? <Alert tone="success">{state.message}</Alert> : null}
        {state.devLink ? (
          <Alert tone="info">
            <a href={state.devLink} className="underline" dir="ltr">
              {state.devLink}
            </a>
          </Alert>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "در حال ارسال…" : "ارسال لینک بازیابی"}
        </Button>
      </form>
    </AuthCard>
  );
}
