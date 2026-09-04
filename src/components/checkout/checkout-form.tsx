"use client";

import { useActionState } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { checkoutAction } from "@/server/actions/checkout";
import { Input } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState(checkoutAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">کد تخفیف (اختیاری)</label>
        <Input name="couponCode" placeholder="مثلاً GHALEBI10" dir="ltr" className="text-left" />
      </div>

      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}

      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
        پرداخت از طریق درگاه امن انجام می‌شود و بلافاصله پس از پرداخت، دسترسی دانلود فعال می‌شود.
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        <CreditCard className="h-4 w-4" />
        {pending ? "در حال پردازش پرداخت…" : "پرداخت و تکمیل خرید"}
      </button>
    </form>
  );
}
