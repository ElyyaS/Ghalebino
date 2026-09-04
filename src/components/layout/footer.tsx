import Link from "next/link";
import { LayoutGrid } from "lucide-react";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "بازارچه",
    links: [
      { href: "/marketplace", label: "همه محصولات" },
      { href: "/marketplace?sort=best_sellers", label: "پرفروش‌ترین‌ها" },
      { href: "/marketplace?sort=newest", label: "جدیدترین‌ها" },
      { href: "/marketplace?onSale=1", label: "تخفیف‌دارها" },
      { href: "/sellers", label: "فروشندگان" },
    ],
  },
  {
    title: "راهنما",
    links: [
      { href: "/help", label: "مرکز راهنمایی" },
      { href: "/faq", label: "پرسش‌های پرتکرار" },
      { href: "/contact", label: "تماس با ما" },
      { href: "/license", label: "مجوزها و لایسنس" },
    ],
  },
  {
    title: "قانونی",
    links: [
      { href: "/terms", label: "قوانین و مقررات" },
      { href: "/privacy", label: "حریم خصوصی" },
      { href: "/refund-policy", label: "سیاست بازگشت وجه" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
              <LayoutGrid className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">
              قالبی <span className="text-gradient">نو</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
            قالبی نو، مارکت‌پلیس تخصصی قالب‌ها و محصولات وب برای توسعه‌دهندگان فارسی‌زبان؛ جایی که
            بهترین قالب‌های HTML، React، Next.js و وردپرس را پیدا می‌کنید.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 transition-colors hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear().toLocaleString("fa-IR")} قالبی نو — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
