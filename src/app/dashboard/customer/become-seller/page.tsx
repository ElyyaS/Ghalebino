import Link from "next/link";
import { Store } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { ApplyForm } from "@/components/dashboard/apply-form";

export const dynamic = "force-dynamic";

export default async function BecomeSellerPage() {
  const user = (await getSessionUser())!;
  const isSeller = user.role === "SELLER";

  return (
    <div className="max-w-xl">
      {isSeller ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-semibold text-emerald-800">شما فروشنده هستید</p>
          <p className="mt-1 text-sm text-emerald-700">فروشگاه شما فعال است.</p>
          <Link href="/dashboard/seller" className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
            ورود به پنل فروشنده
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-700">
              <Store className="h-6 w-6" />
            </span>
            <p className="text-sm leading-6 text-slate-600">
              با فروشنده‌شدن می‌توانید قالب‌های خود را در بازارچه منتشر کرده و از هر فروش درصدی دریافت کنید.
            </p>
          </div>
          <ApplyForm />
        </>
      )}
    </div>
  );
}
