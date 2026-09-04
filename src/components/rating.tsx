import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRating } from "@/lib/format";

export function RatingStars({
  rating,
  count,
  size = 14,
  showValue = true,
  className,
}: {
  rating: number;
  count?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const filled = Math.round(rating);
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center gap-0.5" dir="ltr" aria-label={`امتیاز ${rating} از ۵`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={i <= filled ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
          />
        ))}
      </span>
      {showValue ? <span className="text-xs font-medium text-slate-600">{formatRating(rating)}</span> : null}
      {count != null ? <span className="text-xs text-slate-400">({count.toLocaleString("fa-IR")})</span> : null}
    </span>
  );
}
