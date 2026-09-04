"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  GitCompare,
  Heart,
  Link as LinkIcon,
  Zap,
} from "lucide-react";
import type { ProductLicenseRef } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { addToCartAction } from "@/server/actions/cart";
import { toggleCompareAction, toggleWishlistAction } from "@/server/actions/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PurchasePanel({
  product,
  licenses,
}: {
  product: { id: number; slug: string; title: string };
  licenses: ProductLicenseRef[];
}) {
  const router = useRouter();
  const [licenseId, setLicenseId] = useState(licenses[0]?.licenseId ?? 0);
  const [pending, start] = useTransition();
  const [wishlisted, setWishlisted] = useState(false);
  const [compared, setCompared] = useState(false);

  const selected = licenses.find((l) => l.licenseId === licenseId) ?? licenses[0];

  function handleError(error: string) {
    if (error.includes("وارد")) router.push("/auth/login");
    else alert(error);
  }

  function addAndGo(checkout: boolean) {
    if (!selected) return;
    start(async () => {
      const r = await addToCartAction(product.id, selected.licenseId);
      if (!r.ok) return handleError(r.error);
      if (checkout) router.push("/checkout");
      else router.refresh();
    });
  }

  async function share() {
    const url = `${window.location.origin}/products/${product.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: product.title, url });
      else {
        await navigator.clipboard.writeText(url);
        alert("لینک محصول کپی شد.");
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">انتخاب لایسنس</h3>

      <div className="space-y-2">
        {licenses.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLicenseId(l.licenseId)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-start transition-colors",
              l.licenseId === licenseId
                ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600/30"
                : "border-slate-200 hover:border-slate-300",
            )}
          >
            <div>
              <p className="text-sm font-medium text-slate-900">{l.licenseName}</p>
              <p className="text-xs text-slate-500">{l.licenseKey}</p>
            </div>
            <span className="text-sm font-bold text-brand-700">{formatPrice(l.price)}</span>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="mt-4 flex items-baseline justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-xs text-slate-500">قیمت نهایی</span>
          <span className="text-xl font-bold text-slate-900">{formatPrice(selected.price)}</span>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="primary" size="lg" disabled={pending || !selected} onClick={() => addAndGo(false)}>
          افزودن به سبد
        </Button>
        <Button
          variant="secondary"
          size="lg"
          disabled={pending || !selected}
          onClick={() => addAndGo(true)}
        >
          <Zap className="h-4 w-4" />
          خرید فوری
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          onClick={() =>
            start(async () => {
              const r = await toggleWishlistAction(product.id);
              if (r.ok) setWishlisted(r.data.added);
              else handleError(r.error);
            })
          }
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium transition-colors",
            wishlisted ? "text-rose-600" : "text-slate-600 hover:bg-slate-50",
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", wishlisted && "fill-current")} />
          علاقه‌مندی
        </button>
        <button
          onClick={() =>
            start(async () => {
              const r = await toggleCompareAction(product.id);
              if (r.ok) setCompared(r.data.added);
              else handleError(r.error);
            })
          }
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium transition-colors",
            compared ? "text-brand-600" : "text-slate-600 hover:bg-slate-50",
          )}
        >
          <GitCompare className="h-3.5 w-3.5" />
          مقایسه
        </button>
        <button
          onClick={share}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <LinkIcon className="h-3.5 w-3.5" />
          اشتراک
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 rounded-lg bg-slate-50 py-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <ExternalLink className="h-3.5 w-3.5" />
          پرداخت امن
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          دانلود فوری پس از خرید
        </span>
      </div>
    </div>
  );
}
