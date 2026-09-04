import type { Metadata } from "next";

export const metadata: Metadata = { title: "حریم خصوصی" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">حریم خصوصی</h1>
      <div className="mt-6 space-y-4 text-sm leading-8 text-slate-600">
        <p>
          قالبی نو به حریم خصوصی کاربران خود احترام می‌گذارد. اطلاعات شخصی شما صرفاً برای ارائه خدمات و
          بهبود تجربه کاربری استفاده می‌شود و در اختیار اشخاص ثالث قرار نمی‌گیرد.
        </p>
        <p>اطلاعاتی که جمع‌آوری می‌کنیم شامل ایمیل، نام، و داده‌های مربوط به خریدها و دانلودها است.</p>
        <p>
          رمزهای عبور به صورت رمزنگاری‌شده ذخیره می‌شوند و هرگز به صورت متن ساده نگهداری نمی‌گردند.
        </p>
        <p>در صورت درخواست، کاربران می‌توانند اطلاعات حساب خود را اصلاح یا حذف کنند.</p>
      </div>
    </div>
  );
}
