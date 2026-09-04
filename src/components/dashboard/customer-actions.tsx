"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { toggleWishlistAction } from "@/server/actions/products";
import { replyTicketAction } from "@/server/actions/support";
import { markNotificationsReadAction } from "@/server/actions/support";
import { updateProfileAction } from "@/server/actions/auth";
import { createTicketAction } from "@/server/actions/support";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export function WishlistRemoveButton({ productId }: { productId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          await toggleWishlistAction(productId);
          router.refresh();
        })
      }
      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
      aria-label="حذف"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export function MarkNotificationsRead() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await markNotificationsReadAction();
          router.refresh();
        })
      }
    >
      علامت‌گذاری همه به‌عنوان خوانده‌شده
    </Button>
  );
}

export function SettingsForm({ initialName }: { initialName: string }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {});
  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <Field label="نام و نام خانوادگی" htmlFor="name">
        <Input id="name" name="name" defaultValue={initialName} required />
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "در حال ذخیره…" : "ذخیره"}
      </Button>
    </form>
  );
}

export function SupportReplyForm({ ticketId }: { ticketId: number }) {
  const [state, formAction, pending] = useActionState((prev: { error?: string }, fd: FormData) => replyTicketAction(ticketId, fd), {});
  return (
    <form action={formAction} className="space-y-3">
      <Textarea name="content" placeholder="پاسخ خود را بنویسید…" required />
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "در حال ارسال…" : "ارسال پاسخ"}
      </Button>
    </form>
  );
}

export function SupportCreateForm() {
  const [state, formAction, pending] = useActionState(createTicketAction, {});
  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">ثبت تیکت جدید</h2>
      <Field label="موضوع" htmlFor="subject">
        <Input id="subject" name="subject" required />
      </Field>
      <Field label="نوع درخواست" htmlFor="type">
        <Select id="type" name="type" defaultValue="GENERAL">
          <option value="GENERAL">پشتیبانی عمومی</option>
          <option value="PRESALE">پرسش پیش از خرید</option>
          <option value="TECHNICAL">مشکل فنی</option>
          <option value="BUG">گزارش باگ</option>
          <option value="POST_PURCHASE">پشتیبانی پس از خرید</option>
          <option value="REFUND">درخواست بازگشت وجه</option>
        </Select>
      </Field>
      <Field label="توضیحات" htmlFor="message">
        <Textarea id="message" name="message" required />
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "در حال ثبت…" : "ثبت تیکت"}
      </Button>
    </form>
  );
}
