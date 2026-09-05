"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createBlogPostAction,
  createCategoryAction,
  createCouponAction,
  createTechnologyAction,
  resolveReportAction,
  reviewProductAction,
  reviewSellerApplicationAction,
  reviewWithdrawalAction,
  saveSettingsAction,
  setUserRoleAction,
  setUserStatusAction,
} from "@/server/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

export function UserRoleSelect({ userId, current }: { userId: number; current: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <select
      value={current}
      disabled={pending}
      onChange={(e) =>
        start(async () => {
          const fd = new FormData();
          fd.set("userId", String(userId));
          fd.set("role", e.target.value);
          const r = await setUserRoleAction({}, fd);
          if (r.error) alert(r.error);
          else router.refresh();
        })
      }
      className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"
    >
      <option value="CUSTOMER">مشتری</option>
      <option value="SELLER">فروشنده</option>
      <option value="ADMIN">مدیر</option>
    </select>
  );
}

export function UserStatusSelect({ userId, current }: { userId: number; current: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <select
      value={current}
      disabled={pending}
      onChange={(e) =>
        start(async () => {
          const fd = new FormData();
          fd.set("userId", String(userId));
          fd.set("status", e.target.value);
          const r = await setUserStatusAction({}, fd);
          if (r.error) alert(r.error);
          else router.refresh();
        })
      }
      className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"
    >
      <option value="ACTIVE">فعال</option>
      <option value="SUSPENDED">تعلیق</option>
      <option value="BANNED">مسدود</option>
    </select>
  );
}

export function SellerDecisionForm({ applicationId }: { applicationId: number }) {
  const [state, formAction, pending] = useActionState(reviewSellerApplicationAction, {});
  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="applicationId" value={applicationId} />
      <Textarea name="note" placeholder="یادداشت (اختیاری)" className="min-h-[60px]" />
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" name="decision" value="APPROVED" disabled={pending}>
          تأیید
        </Button>
        <Button type="submit" size="sm" variant="danger" name="decision" value="REJECTED" disabled={pending}>
          رد
        </Button>
      </div>
    </form>
  );
}

export function ProductDecisionForm({ productId, current }: { productId: number; current: string }) {
  const [state, formAction, pending] = useActionState(reviewProductAction, {});
  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="productId" value={productId} />
      <Textarea name="note" placeholder="یادداشت برای فروشنده (اختیاری)" className="min-h-[60px]" />
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <div className="flex flex-wrap gap-2">
        {current === "SUSPENDED" ? (
          <Button type="submit" size="sm" name="decision" value="RESTORE" disabled={pending}>
            بازگردانی
          </Button>
        ) : (
          <>
            <Button type="submit" size="sm" name="decision" value="APPROVE" disabled={pending}>
              تأیید و انتشار
            </Button>
            <Button type="submit" size="sm" variant="outline" name="decision" value="CHANGES" disabled={pending}>
              نیاز به اصلاح
            </Button>
            <Button type="submit" size="sm" variant="danger" name="decision" value="REJECT" disabled={pending}>
              رد
            </Button>
            <Button type="submit" size="sm" variant="secondary" name="decision" value="SUSPEND" disabled={pending}>
              تعلیق
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

export function WithdrawalDecisionForm({ withdrawalId }: { withdrawalId: number }) {
  const [state, formAction, pending] = useActionState(reviewWithdrawalAction, {});
  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="withdrawalId" value={withdrawalId} />
      <Input name="payoutReference" placeholder="شماره مرجع واریز (اختیاری)" dir="ltr" />
      <Textarea name="note" placeholder="یادداشت" className="min-h-[50px]" />
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" name="decision" value="APPROVE" disabled={pending}>
          تأیید
        </Button>
        <Button type="submit" size="sm" variant="secondary" name="decision" value="MARK_PAID" disabled={pending}>
          ثبت واریز
        </Button>
        <Button type="submit" size="sm" variant="danger" name="decision" value="REJECT" disabled={pending}>
          رد
        </Button>
      </div>
    </form>
  );
}

export function CreateCouponForm() {
  const [state, formAction, pending] = useActionState(createCouponAction, {});
  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">کد تخفیف جدید</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="کد" htmlFor="code">
          <Input id="code" name="code" dir="ltr" required />
        </Field>
        <Field label="نوع" htmlFor="type">
          <Select id="type" name="type" defaultValue="PERCENT">
            <option value="PERCENT">درصدی</option>
            <option value="FIXED">مبلغ ثابت (تومان)</option>
          </Select>
        </Field>
        <Field label="مقدار" htmlFor="value">
          <Input id="value" name="value" type="number" required />
        </Field>
        <Field label="حداقل سفارش" htmlFor="minOrder">
          <Input id="minOrder" name="minOrder" type="number" defaultValue="0" />
        </Field>
        <Field label="حداکثر استفاده" htmlFor="maxUses">
          <Input id="maxUses" name="maxUses" type="number" />
        </Field>
        <Field label="انقضا" htmlFor="expiresAt">
          <Input id="expiresAt" name="expiresAt" type="date" />
        </Field>
      </div>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        ایجاد کد
      </Button>
    </form>
  );
}

export function CreateCategoryForm() {
  const [state, formAction, pending] = useActionState(createCategoryAction, {});
  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">دسته‌بندی جدید</h2>
      <Field label="نام" htmlFor="name">
        <Input id="name" name="name" required />
      </Field>
      <Field label="توضیحات" htmlFor="description">
        <Input id="description" name="description" />
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        ایجاد دسته‌بندی
      </Button>
    </form>
  );
}

export function CreateTechnologyForm() {
  const [state, formAction, pending] = useActionState(createTechnologyAction, {});
  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">تکنولوژی جدید</h2>
      <Field label="نام" htmlFor="name">
        <Input id="name" name="name" required />
      </Field>
      <Field label="نوع" htmlFor="kind">
        <Select id="kind" name="kind" defaultValue="framework">
          <option value="framework">فریمورک</option>
          <option value="language">زبان</option>
          <option value="cms">سیستم مدیریت محتوا</option>
          <option value="library">کتابخانه</option>
        </Select>
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        ایجاد تکنولوژی
      </Button>
    </form>
  );
}

export function CreateBlogPostForm() {
  const [state, formAction, pending] = useActionState(createBlogPostAction, {});
  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">مقاله جدید</h2>
      <Field label="عنوان" htmlFor="title">
        <Input id="title" name="title" required />
      </Field>
      <Field label="خلاصه" htmlFor="excerpt">
        <Input id="excerpt" name="excerpt" />
      </Field>
      <Field label="متن" htmlFor="content">
        <Textarea id="content" name="content" className="min-h-[160px]" required />
      </Field>
      <Field label="برچسب‌ها (با کاما جدا کنید)" htmlFor="tagNames">
        <Input id="tagNames" name="tagNames" />
      </Field>
      <Field label="وضعیت" htmlFor="status">
        <Select id="status" name="status" defaultValue="DRAFT">
          <option value="DRAFT">پیش‌نویس</option>
          <option value="PUBLISHED">منتشر شده</option>
        </Select>
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        ذخیره مقاله
      </Button>
    </form>
  );
}

export function ReportResolveForm({ reportId }: { reportId: number }) {
  const [state, formAction, pending] = useActionState(resolveReportAction, {});
  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="reportId" value={reportId} />
      <Input name="note" placeholder="یادداشت" className="h-9 w-40" />
      <Button type="submit" size="sm" name="decision" value="RESOLVED" disabled={pending}>
        حل شد
      </Button>
      <Button type="submit" size="sm" variant="outline" name="decision" value="DISMISS" disabled={pending}>
        رد گزارش
      </Button>
    </form>
  );
}

export function SettingsForm({ initial }: { initial: { siteName: string; siteTagline: string; supportEmail: string } }) {
  const [state, formAction, pending] = useActionState(saveSettingsAction, {});
  return (
    <form action={formAction} className="max-w-xl space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">تنظیمات سایت</h2>
      <Field label="نام سایت" htmlFor="siteName">
        <Input id="siteName" name="siteName" defaultValue={initial.siteName} />
      </Field>
      <Field label="شعار" htmlFor="siteTagline">
        <Input id="siteTagline" name="siteTagline" defaultValue={initial.siteTagline} />
      </Field>
      <Field label="ایمیل پشتیبانی" htmlFor="supportEmail">
        <Input id="supportEmail" name="supportEmail" dir="ltr" defaultValue={initial.supportEmail} />
      </Field>
      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        ذخیره
      </Button>
    </form>
  );
}