import { randomBytes } from "node:crypto";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const FA_TRANSLIT: Record<string, string> = {
  "ا": "a", "آ": "a", "ب": "b", "پ": "p", "ت": "t", "ث": "s", "ج": "j", "چ": "ch",
  "ح": "h", "خ": "kh", "د": "d", "ذ": "z", "ر": "r", "ز": "z", "ژ": "zh", "س": "s",
  "ش": "sh", "ص": "s", "ض": "z", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f",
  "ق": "gh", "ک": "k", "گ": "g", "ل": "l", "م": "m", "ن": "n", "و": "v", "ه": "h",
  "ی": "y", "ئ": "y", "ء": "",
};

export function slugify(input: string): string {
  const latin = [...input.toLowerCase()]
    .map((c) => FA_TRANSLIT[c] ?? c)
    .join("");
  const slug = latin
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
  return slug || `item-${randomBytes(4).toString("hex")}`;
}

export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length - 1)}…`;
}
