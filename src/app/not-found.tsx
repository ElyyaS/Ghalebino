import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 py-20">
      <div className="text-center">
        <p className="text-6xl font-bold text-brand-200">۴۰۴</p>
        <h1 className="mt-4 text-xl font-bold text-slate-900">صفحه مورد نظر پیدا نشد</h1>
        <p className="mt-2 text-sm text-slate-500">ممکن است صفحه حذف شده یا نشانی آن تغییر کرده باشد.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
