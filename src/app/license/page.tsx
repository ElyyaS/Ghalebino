import type { Metadata } from "next";

export const metadata: Metadata = { title: "مجوزها و لایسنس" };

export default function LicensePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">مجوزها و لایسنس‌ها</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        هر محصول در قالبی نو با چند نوع لایسنس عرضه می‌شود که شرایط استفاده متفاوتی دارند.
      </p>

      <div className="mt-6 space-y-4">
        {[
          {
            name: "لایسنس شخصی",
            desc: "مناسب برای پروژه‌های شخصی و غیرتجاری. استفاده در یک پروژه واحد مجاز است و امکان استفاده در پروژه‌های مشتری وجود ندارد.",
          },
          {
            name: "لایسنس تجاری",
            desc: "مناسب برای فریلنسرها و کسب‌وکارها. امکان استفاده در پروژه‌های مشتری و وب‌سایت‌های تجاری فراهم است.",
          },
          {
            name: "لایسنس نامحدود",
            desc: "برای آژانس‌ها و تیم‌ها؛ امکان استفاده در تعداد نامحدود پروژه، بدون محدودیت در تعداد کاربران نهایی.",
          },
        ].map((l) => (
          <div key={l.name} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">{l.name}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{l.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
