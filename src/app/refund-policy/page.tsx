import type { Metadata } from "next";

export const metadata: Metadata = { title: "سیاست بازگشت وجه" };

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">سیاست بازگشت وجه</h1>
      <div className="mt-6 space-y-4 text-sm leading-8 text-slate-600">
        <p>
          با توجه به ماهیت دیجیتال محصولات، بازگشت وجه در همه موارد امکان‌پذیر نیست؛ اما در شرایط زیر درخواست
          شما بررسی خواهد شد:
        </p>
        <ul className="list-disc space-y-2 pr-5">
          <li>محصول خراب باشد یا با توضیحات ارائه‌شده در صفحه محصول مغایرت جدی داشته باشد.</li>
          <li>فایل خریداری‌شده به دلیل مشکل فنی قابل دانلود نباشد.</li>
          <li>خطای پرداخت منجر به کسر مبلغ بدون تحویل محصول شده باشد.</li>
        </ul>
        <p>
          درخواست بازگشت وجه از طریق تیکت پشتیبانی ثبت می‌شود و پس از بررسی تیم مدیریت و فروشنده، نتیجه
          اعلام خواهد شد.
        </p>
      </div>
    </div>
  );
}
