export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  DRAFT: "پیش‌نویس",
  SUBMITTED: "در انتظار بررسی",
  UNDER_REVIEW: "در حال بررسی",
  CHANGES_REQUESTED: "نیاز به اصلاح",
  APPROVED: "تأیید شده",
  PUBLISHED: "منتشر شده",
  REJECTED: "رد شده",
  SUSPENDED: "تعلیق شده",
  ARCHIVED: "بایگانی شده",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار پرداخت",
  PAYMENT_PROCESSING: "در حال پردازش پرداخت",
  PAID: "پرداخت شده",
  FAILED: "ناموفق",
  CANCELLED: "لغو شده",
  REFUND_REQUESTED: "درخواست بازگشت وجه",
  REFUNDED: "بازگشت وجه",
  COMPLETED: "تکمیل شده",
};

export const WITHDRAWAL_STATUS_LABELS: Record<string, string> = {
  REQUESTED: "درخواست شده",
  UNDER_REVIEW: "در حال بررسی",
  APPROVED: "تأیید شده",
  REJECTED: "رد شده",
  PROCESSING: "در حال پردازش",
  PAID: "پرداخت شده",
  FAILED: "ناموفق",
};

export const TICKET_STATUS_LABELS: Record<string, string> = {
  OPEN: "باز",
  IN_PROGRESS: "در حال پیگیری",
  WAITING_FOR_CUSTOMER: "منتظر پاسخ مشتری",
  WAITING_FOR_SELLER: "منتظر پاسخ فروشنده",
  RESOLVED: "حل شده",
  CLOSED: "بسته شده",
  ESCALATED: "ارجاع شده",
};

export const TICKET_TYPE_LABELS: Record<string, string> = {
  PRESALE: "پرسش پیش از خرید",
  TECHNICAL: "مشکل فنی",
  BUG: "گزارش باگ",
  POST_PURCHASE: "پشتیبانی پس از خرید",
  REFUND: "درخواست بازگشت وجه",
  GENERAL: "پشتیبانی عمومی",
};

export const REPORT_REASON_LABELS: Record<string, string> = {
  copyright: "نقض کپی‌رایت",
  misleading: "پیش‌نمایش گمراه‌کننده",
  broken: "محصول خراب",
  security: "نگرانی امنیتی/بدافزار",
  duplicate: "محصول تکراری",
  offensive: "محتوای نامناسب",
  other: "سایر موارد",
};

export type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

export function productStatusTone(status: string): Tone {
  switch (status) {
    case "PUBLISHED":
    case "APPROVED":
      return "success";
    case "SUBMITTED":
    case "UNDER_REVIEW":
      return "info";
    case "CHANGES_REQUESTED":
      return "warning";
    case "REJECTED":
    case "SUSPENDED":
      return "danger";
    default:
      return "neutral";
  }
}

export function orderStatusTone(status: string): Tone {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return "success";
    case "PAYMENT_PROCESSING":
    case "PENDING":
      return "info";
    case "REFUND_REQUESTED":
    case "REFUNDED":
      return "warning";
    case "FAILED":
    case "CANCELLED":
      return "danger";
    default:
      return "neutral";
  }
}

export function withdrawalStatusTone(status: string): Tone {
  switch (status) {
    case "APPROVED":
    case "PAID":
      return "success";
    case "REQUESTED":
    case "UNDER_REVIEW":
    case "PROCESSING":
      return "info";
    case "REJECTED":
    case "FAILED":
      return "danger";
    default:
      return "neutral";
  }
}

export function ticketStatusTone(status: string): Tone {
  switch (status) {
    case "RESOLVED":
    case "CLOSED":
      return "success";
    case "ESCALATED":
      return "danger";
    case "IN_PROGRESS":
      return "info";
    case "WAITING_FOR_CUSTOMER":
    case "WAITING_FOR_SELLER":
      return "warning";
    default:
      return "neutral";
  }
}
