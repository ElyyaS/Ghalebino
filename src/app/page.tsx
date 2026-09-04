import Link from "next/link";
import {
  BadgeCheck,
  Download,
  Headphones,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ProductGrid } from "@/components/product/product-listing";
import {
  mockCategories,
  mockTechnologies,
  mockSellers,
} from "@/server/mock-data";
export const dynamic = "force-dynamic";

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
      <Link
        href={href}
        className="text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        مشاهده همه
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const categories = mockCategories;
  const technologies = mockTechnologies;
  const sellers = mockSellers;
  const blog: typeof import("@/server/mock-db").mockBlogPosts = [];
  const featured = { items: [] };
  const trending = { items: [] };
  const bestSellers = { items: [] };
  const newest = { items: [] };
  const topRated = { items: [] };
  const onSale = { items: [] };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <Zap className="h-3.5 w-3.5" />
              مارکت‌پلیس تخصصی قالب‌های وب
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              قالب‌های حرفه‌ای برای
              <span className="text-gradient"> پروژه بعدی شما</span>
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-500">
              هزاران قالب HTML، React، Next.js و وردپرس را بخرید، دانلود کنید و
              با خیال راحت پروژه خود را سریع‌تر شروع کنید.
            </p>

            <form
              action="/search"
              method="get"
              className="mx-auto mt-7 flex max-w-lg items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
            >
              <Search className="mr-2 h-5 w-5 shrink-0 text-slate-400" />

              <input
                name="q"
                placeholder="جستجوی قالب، تکنولوژی یا فروشنده…"
                className="h-10 flex-1 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
              />

              <button className="h-10 rounded-xl bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700">
                جستجو
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400">پرطرفدار:</span>

              {technologies.slice(0, 6).map((t) => (
                <Link
                  key={t.id}
                  href={`/technologies/${t.slug}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:border-brand-300 hover:text-brand-700"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12">
        <section>
          <SectionHeader title="دسته‌بندی‌های محبوب" href="/marketplace" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-brand-300 hover:shadow-sm"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-lg font-bold text-white">
                  {c.name.slice(0, 1)}
                </span>

                <span className="text-sm font-medium text-slate-700 group-hover:text-brand-700">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {featured.items.length > 0 ? (
          <section>
            <SectionHeader
              title="منتخب سردبیر"
              href="/marketplace?sort=best_sellers"
            />
            <ProductGrid items={featured.items} />
          </section>
        ) : null}

        {trending.items.length > 0 ? (
          <section>
            <SectionHeader
              title="پرطرفدارهای هفته"
              href="/marketplace?sort=trending"
            />
            <ProductGrid items={trending.items} />
          </section>
        ) : null}

        {bestSellers.items.length > 0 ? (
          <section>
            <SectionHeader
              title="پرفروش‌ترین‌ها"
              href="/marketplace?sort=best_sellers"
            />
            <ProductGrid items={bestSellers.items} />
          </section>
        ) : null}

        {newest.items.length > 0 ? (
          <section>
            <SectionHeader
              title="جدیدترین قالب‌ها"
              href="/marketplace?sort=newest"
            />
            <ProductGrid items={newest.items} />
          </section>
        ) : null}

        {onSale.items.length > 0 ? (
          <section>
            <SectionHeader
              title="تخفیف‌های ویژه"
              href="/marketplace?onSale=1"
            />
            <ProductGrid items={onSale.items} />
          </section>
        ) : null}

        {topRated.items.length > 0 ? (
          <section>
            <SectionHeader
              title="بالاترین امتیازها"
              href="/marketplace?sort=highest_rated"
            />
            <ProductGrid items={topRated.items} />
          </section>
        ) : null}

        {sellers.length > 0 ? (
          <section>
            <SectionHeader title="فروشندگان برتر" href="/sellers" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sellers.map((s) => (
                <Link
                  key={s.id}
                  href={`/sellers/${s.username}`}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-sm"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                    {s.storeName.slice(0, 1)}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {s.storeName}
                    </p>

                    <p className="text-xs text-slate-500">
                      {s.bio ?? "فروشنده قالب"}
                    </p>
                  </div>

                  <span className="mr-auto shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    فروشنده
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {blog.length > 0 ? (
          <section>
            <SectionHeader title="از وبلاگ قالبی نو" href="/blog" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {blog.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-brand-300 hover:shadow-sm"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <div className="grid h-full place-items-center bg-gradient-to-br from-brand-100 to-accent-100 text-brand-300">
                      <BadgeCheck className="h-10 w-10" />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 font-semibold leading-6 text-slate-900 group-hover:text-brand-700">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "پرداخت امن",
              desc: "تراکنش‌های محافظت‌شده",
            },
            {
              icon: Download,
              title: "دانلود فوری",
              desc: "دسترسی بلافاصله پس از خرید",
            },
            {
              icon: Headphones,
              title: "پشتیبانی فارسی",
              desc: "پاسخگوی سوالات شما",
            },
            {
              icon: BadgeCheck,
              title: "تضمین کیفیت",
              desc: "بررسی محصولات توسط تیم ما",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center gap-2 text-center"
            >
              <f.icon className="h-7 w-7 text-brand-600" />

              <p className="text-sm font-semibold text-slate-900">
                {f.title}
              </p>

              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}