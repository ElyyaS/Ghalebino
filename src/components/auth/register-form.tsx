"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/server/actions/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export default function RegisterForm() {
    const [state, formAction, pending] = useActionState(registerAction, {});

    return (
        <AuthCard
            title="ساخت حساب کاربری"
            subtitle="به جامعه قالبی نو بپیوندید"
            footer={
                <>
                    حساب دارید؟{" "} <Link
                        href="/auth/login"
                        className="font-medium text-brand-600 hover:text-brand-700"
                    >
                        وارد شوید </Link>
                </>
            }
        > <form action={formAction} className="space-y-4"> <Field label="نام و نام خانوادگی" htmlFor="name"> <Input id="name" name="name" required /> </Field>

                <Field label="ایمیل" htmlFor="email">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        dir="ltr"
                        placeholder="you@example.com"
                        required
                    />
                </Field>

                <Field
                    label="رمز عبور"
                    htmlFor="password"
                    hint="حداقل ۸ کاراکتر"
                >
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        dir="ltr"
                        required
                    />
                </Field>

                {state.error ? <Alert tone="danger">{state.error}</Alert> : null}

                <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? "در حال ساخت حساب…" : "ساخت حساب"}
                </Button>
            </form>
        </AuthCard>

    );
}
