import { z } from "zod";

const email = z.email("نشانی ایمیل معتبر وارد کنید.");
const password = z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد.").max(80),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "رمز عبور را وارد کنید."),
});

export const forgotSchema = z.object({ email });
export const resetSchema = z.object({
  token: z.string().min(10, "توکن نامعتبر است."),
  password,
});

export const productSchema = z.object({
  title: z.string().trim().min(3, "عنوان محصول را وارد کنید.").max(160),
  shortDescription: z.string().trim().min(10, "توضیح کوتاه باید حداقل ۱۰ کاراکتر باشد.").max(300),
  description: z.string().trim().min(20, "توضیحات کامل را وارد کنید."),
  categoryId: z.coerce.number().int().positive("دسته‌بندی را انتخاب کنید."),
  price: z.coerce.number().int().min(0, "قیمت نامعتبر است."),
  salePrice: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().min(0).optional(),
  ),
  version: z.string().trim().min(1, "نسخه را وارد کنید.").max(40),
  demoUrl: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().url("نشانی دمو معتبر نیست.").optional()),
  documentationUrl: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().url("نشانی مستندات معتبر نیست.").optional()),
  features: z.array(z.string().trim().min(1)).max(30),
  requirements: z.array(z.string().trim().min(1)).max(20),
  technologyIds: z.array(z.coerce.number().int().positive()).max(30),
});

export const reviewSchema = z.object({
  productId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(160).optional(),
  content: z.string().trim().min(5, "متن دیدگاه را وارد کنید.").max(2000),
});

export const questionSchema = z.object({
  productId: z.coerce.number().int().positive(),
  question: z.string().trim().min(5, "متن سؤال را وارد کنید.").max(1000),
});

export const sellerApplicationSchema = z.object({
  storeName: z.string().trim().min(3, "نام فروشگاه را وارد کنید.").max(120),
  description: z.string().trim().min(20, "توضیحات فروشگاه را کامل کنید.").max(1000),
  portfolioUrl: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().url("نشانی نمونه‌کار معتبر نیست.").optional()),
});

export const sellerStoreSchema = z.object({
  storeName: z.string().trim().min(3).max(120),
  tagline: z.string().trim().max(200).optional(),
  bio: z.string().trim().max(2000).optional(),
});

export const ticketSchema = z.object({
  subject: z.string().trim().min(5, "موضوع تیکت را وارد کنید.").max(200),
  type: z.enum(["PRESALE", "TECHNICAL", "BUG", "POST_PURCHASE", "REFUND", "GENERAL"]),
  message: z.string().trim().min(5, "متن پیام را وارد کنید.").max(4000),
  sellerId: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().positive().optional(),
  ),
});

export const replySchema = z.object({
  content: z.string().trim().min(1, "متن پیام را وارد کنید.").max(4000),
});

export const withdrawalSchema = z.object({
  amount: z.coerce.number().int().min(10000, "حداقل برداشت ۱۰٬۰۰۰ تومان است."),
  method: z.string().trim().min(1),
  accountDetails: z.string().trim().min(5, "اطلاعات حساب مقصد را وارد کنید."),
});

export const couponSchema = z.object({
  code: z.string().trim().min(3).max(60).transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().int().positive("مقدار تخفیف را وارد کنید."),
  minOrder: z.coerce.number().int().min(0).default(0),
  maxUses: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().positive().optional(),
  ),
  expiresAt: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.date().optional(),
  ),
  scope: z.enum(["PLATFORM", "SELLER"]).default("PLATFORM"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional(),
  icon: z.string().trim().max(60).optional(),
  parentId: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().positive().optional(),
  ),
});

export const technologySchema = z.object({
  name: z.string().trim().min(2).max(80),
  kind: z.string().trim().min(2).max(40),
  icon: z.string().trim().max(60).optional(),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().trim().min(20, "متن مقاله را وارد کنید."),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  tagNames: z.array(z.string().trim().min(1)).max(10).default([]),
});

export const reportSchema = z.object({
  targetType: z.enum(["PRODUCT", "REVIEW", "USER"]),
  targetId: z.coerce.number().int().positive(),
  reason: z.string().trim().min(2),
  details: z.string().trim().max(2000).optional(),
});

export const settingsSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));
