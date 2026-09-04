const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatNumber(value: number): string {
  const grouped = new Intl.NumberFormat("en-US").format(Math.round(value));
  return toPersianDigits(grouped);
}

export function formatPrice(toman: number): string {
  return `${formatNumber(toman)} تومان`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `${toPersianDigits((value / 1_000_000_000).toFixed(1))} میلیارد`;
  if (value >= 1_000_000) return `${toPersianDigits((value / 1_000_000).toFixed(1))} میلیون`;
  if (value >= 1_000) return `${toPersianDigits((value / 1_000).toFixed(1))} هزار`;
  return toPersianDigits(value);
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return String(value);
  }
}

export function formatDateShort(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return String(value);
  }
}

export function formatRating(value: number): string {
  return toPersianDigits(value.toFixed(1));
}
