import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  productStatusTone,
  type Tone,
} from "@/lib/labels";

const badgeTones: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  danger: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20",
  info: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, tone }: { status: string; tone: Tone }) {
  return <Badge tone={tone}>{status}</Badge>;
}

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-sky-200 bg-sky-50 text-sky-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-rose-200 bg-rose-50 text-rose-800",
  } as const;
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-sm", tones[tone], className)} role="alert">
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      {icon ? <div className="text-slate-300">{icon}</div> : null}
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-slate-500">{description}</p> : null}
      {action}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-slate-200", className)} />;
}

export function StatusPill({ label, status }: { label: string; status: string }) {
  return <StatusBadge status={label} tone={productStatusTone(status)} />;
}
