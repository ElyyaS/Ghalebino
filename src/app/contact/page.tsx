import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "تماس با ما" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">تماس با ما</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        برای پرسش‌های پیش از خرید، مشکلات فنی یا سایر درخواست‌ها می‌توانید از طریق تیکت پشتیبانی با ما در
        ارتباط باشید.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/help" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300">
          <MessageSquare className="h-6 w-6 text-brand-600" />
          <p className="mt-3 font-semibold text-slate-900">پشتیبانی و تیکت</p>
          <p className="mt-1 text-xs text-slate-500">سریع‌ترین راه ارتباط با تیم پشتیبانی</p>
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Mail className="h-6 w-6 text-brand-600" />
          <p className="mt-3 font-semibold text-slate-900">ایمیل</p>
          <p className="mt-1 text-xs text-slate-500" dir="ltr">
            support@ghalebi-no.example
          </p>
        </div>
      </div>
    </div>
  );
}
