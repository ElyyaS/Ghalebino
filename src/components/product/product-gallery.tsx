"use client";

import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: { url: string; alt: string | null }[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (images.length === 0) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-100 via-white to-accent-100 text-brand-300">
        <LayoutGrid className="h-16 w-16" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img src={current.url} alt={current.alt ?? title} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors",
                i === active ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`تصویر ${i + 1}`}
            >
              <img src={img.url} alt={img.alt ?? title} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
