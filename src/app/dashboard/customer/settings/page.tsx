import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { SettingsForm } from "@/components/dashboard/customer-actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = (await getSessionUser())!;

  return (
    <div className="grid max-w-2xl gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">اطلاعات حساب</h2>
        <SettingsForm initialName={user.name} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-slate-900">جزئیات حساب</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">ایمیل</dt>
            <dd className="font-medium" dir="ltr">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">نقش</dt>
            <dd className="font-medium">{user.role === "ADMIN" ? "مدیر" : user.role === "SELLER" ? "فروشنده" : "مشتری"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 font-semibold text-slate-900">امنیت</h2>
        <p className="text-sm text-slate-500">برای تغییر رمز عبور از لینک بازیابی استفاده کنید.</p>
        <Link href="/auth/forgot-password" className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
          تغییر رمز عبور
        </Link>
      </section>
    </div>
  );
}
