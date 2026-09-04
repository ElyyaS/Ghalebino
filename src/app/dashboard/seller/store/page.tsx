import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getSellerByUserIdForDashboard } from "@/server/queries";
import { StoreForm } from "@/components/seller/seller-actions";

export const dynamic = "force-dynamic";

export default async function SellerStorePage() {
  const user = (await getSessionUser())!;
  const seller = (await getSellerByUserIdForDashboard(user.id))!;

  return (
    <div className="space-y-5">
      <Link
        href={`/sellers/${seller.username}`}
        target="_blank"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        <ExternalLink className="h-4 w-4" />
        مشاهده فروشگاه عمومی
      </Link>

      <StoreForm initial={{ storeName: seller.storeName, tagline: seller.tagline, bio: seller.bio }} />
    </div>
  );
}
