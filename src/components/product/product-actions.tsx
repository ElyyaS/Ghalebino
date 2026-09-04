"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GitCompare, Heart, ShoppingCart } from "lucide-react";
import { addToCartAction } from "@/server/actions/cart";
import { toggleCompareAction, toggleWishlistAction } from "@/server/actions/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function useActionFeedback() {
  const router = useRouter();
  return (error: string) => {
    if (error.includes("وارد")) router.push("/auth/login");
    else alert(error);
  };
}

export function WishlistButton({
  productId,
  initialAdded = false,
}: {
  productId: number;
  initialAdded?: boolean;
}) {
  const [added, setAdded] = useState(initialAdded);
  const [pending, start] = useTransition();
  const handleError = useActionFeedback();

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await toggleWishlistAction(productId);
          if (r.ok) setAdded(r.data.added);
          else handleError(r.error);
        })
      }
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-colors",
        added ? "text-rose-600" : "text-slate-500 hover:text-rose-600",
      )}
      aria-label={added ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
    >
      <Heart className={cn("h-4 w-4", added && "fill-current")} />
    </button>
  );
}

export function CompareButton({ productId }: { productId: number }) {
  const [added, setAdded] = useState(false);
  const [pending, start] = useTransition();
  const handleError = useActionFeedback();

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await toggleCompareAction(productId);
          if (r.ok) setAdded(r.data.added);
          else handleError(r.error);
        })
      }
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-colors",
        added ? "text-brand-600" : "text-slate-500 hover:text-brand-600",
      )}
      aria-label="افزودن به مقایسه"
    >
      <GitCompare className="h-4 w-4" />
    </button>
  );
}

export function AddToCartButton({
  productId,
  licenseId,
  className,
  label = "افزودن به سبد",
}: {
  productId: number;
  licenseId: number;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Button
      variant="primary"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await addToCartAction(productId, licenseId);
          if (!r.ok) {
            if (r.error.includes("وارد")) router.push("/auth/login");
            else alert(r.error);
            return;
          }
          if (r.data.alreadyInCart) alert("این محصول از قبل در سبد خرید شماست.");
          router.refresh();
        })
      }
      className={className}
    >
      <ShoppingCart className="h-4 w-4" />
      {pending ? "در حال افزودن…" : label}
    </Button>
  );
}
