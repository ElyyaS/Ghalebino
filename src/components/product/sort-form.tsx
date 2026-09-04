"use client";

import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "best_sellers", label: "پرفروش‌ترین" },
  { value: "highest_rated", label: "بالاترین امتیاز" },
  { value: "trending", label: "پرطرفدارترین" },
  { value: "recently_updated", label: "به‌روزرسانی اخیر" },
  { value: "price_asc", label: "ارزان‌ترین" },
  { value: "price_desc", label: "گران‌ترین" },
];

export function SortForm({
  basePath,
  params,
  current,
}: {
  basePath: string;
  params: Record<string, string>;
  current: string;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <ArrowUpDown className="h-4 w-4 text-slate-400" />
      <select
        value={current}
        onChange={(e) => {
          const p = new URLSearchParams();
          for (const [k, v] of Object.entries(params)) {
            if (k !== "sort" && k !== "page" && v) p.set(k, v);
          }
          p.set("sort", e.target.value);
          router.push(`${basePath}?${p.toString()}`);
        }}
        className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-sm"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
