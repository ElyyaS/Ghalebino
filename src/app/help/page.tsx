import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Download, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = { title: "مرکز راهنمایی" };

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">مرکز راهنمایی</h1>
      <p className="mt-3 text-sm text-slate-500">راهنمای استفاده از قالبی نو</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { icon: Download, title: "خرید و دانلود", desc: "راهنمای خرید، پرداخت و دانلود فایل‌ها", href: "/faq" },
          { icon: Users, title: "فروشندگی", desc: "نحوه ثبت‌نام و انتشار محصولات", href: "/faq" },
          { icon: ShieldCheck, title: "مجوزها", desc: "انواع لایسنس و شرایط استفاده", href: "/license" },
          { icon: BookOpen, title: "وبلاگ آموزشی", desc: "مقالات و آموزش‌های دنیای قالب", href: "/blog" },
        ].map((item) => (
          <Link key={item.title} href={item.href} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300">
            <item.icon className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
