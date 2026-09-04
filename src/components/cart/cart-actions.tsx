"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { removeFromCartAction } from "@/server/actions/cart";

export function RemoveCartButton({ itemId }: { itemId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          await removeFromCartAction(itemId);
          router.refresh();
        })
      }
      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
      aria-label="حذف از سبد"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
