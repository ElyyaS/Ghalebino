"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "@/server/actions/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export default function LoginForm() {
    const [state, formAction, pending] = useActionState(loginAction, {});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (state.error) {
            setPassword("");
        }
    }, [state.error]);

    return (
        <AuthCard
            title="ورود به قالبی نو"
            subtitle="به حساب کاربری خود وارد شوید"
            footer={
                <>
                    حساب ندارید؟{" "} <Link
                        href="/auth/register"
                        className="font-medium text-brand-600 hover:text-brand-700"
                    >
                        ثبت‌نام کنید </Link>
                </>
            }
        > <form action={formAction} className="space-y-4"> <Field label="ایمیل" htmlFor="email">
            <Input
                id="email"
                name="email"
                type="email"
                dir="ltr"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
            /> </Field>

                <Field label="رمز عبور" htmlFor="password">
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        dir="ltr"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </Field>

                {state.error ? <Alert tone="danger">{state.error}</Alert> : null}

                <div className="flex items-center justify-between text-sm">
                    <Link
                        href="/auth/forgot-password"
                        className="text-slate-500 hover:text-brand-700"
                    >
                        فراموشی رمز عبور؟
                    </Link>
                </div>

                <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? "در حال ورود…" : "ورود"}
                </Button>
            </form>
        </AuthCard>

    );
}