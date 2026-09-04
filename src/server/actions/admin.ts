"use server";

import { and, eq, sql } from "drizzle-orm";
import {
  blogPostTags,
  blogPosts,
  blogTags,
  categories,
  coupons,
  db,
  products,
  reports,
  sellerApplications,
  sellers,
  settings,
  technologies,
  transactions,
  users,
  withdrawals,
  type ProductStatus,
} from "@/db";
import { requireAdmin } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { AppError, firstErrorMessage, type FormState } from "@/lib/errors";
import { notify } from "@/lib/notifications";
import {
  blogPostSchema,
  categorySchema,
  couponSchema,
  technologySchema,
} from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { mockStore, updateMockUser } from "@/server/mock-store";

async function ensureUniqueUsername(base: string): Promise<string> {
  let username = base;
  let i = 2;
  while (true) {
    const [existing] = await db
      .select({ id: sellers.id })
      .from(sellers)
      .where(eq(sellers.username, username))
      .limit(1);
    if (!existing) return username;
    username = `${base}-${i++}`;
  }
}

export async function reviewSellerApplicationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const id = Number(formData.get("applicationId"));
    const decision = String(formData.get("decision"));
    const note = String(formData.get("note") ?? "");

    const [app] = await db
      .select()
      .from(sellerApplications)
      .where(eq(sellerApplications.id, id))
      .limit(1);
    if (!app) throw new AppError("درخواست یافت نشد.", 404);
    if (app.status !== "PENDING") throw new AppError("این درخواست قبلاً بررسی شده است.");

    if (decision === "APPROVED") {
      const username = await ensureUniqueUsername(slugify(app.storeName));
      await db.insert(sellers).values({
        userId: app.userId,
        username,
        storeName: app.storeName,
        tagline: "فروشگاه قالب و محصولات وب",
        bio: app.description,
        status: "ACTIVE",
        approvedAt: new Date(),
      });
      await db.update(users).set({ role: "SELLER" }).where(eq(users.id, app.userId));
      await db
        .update(sellerApplications)
        .set({ status: "APPROVED", reviewedAt: new Date(), reviewedBy: admin.id, reviewerNote: note })
        .where(eq(sellerApplications.id, id));
      await notify(app.userId, {
        type: "SELLER_APPLICATION",
        title: "درخواست فروشندگی تأیید شد",
        body: "فروشگاه شما فعال شد. می‌توانید محصولات خود را ایجاد کنید.",
        link: "/dashboard/seller",
      });
    } else {
      await db
        .update(sellerApplications)
        .set({ status: "REJECTED", reviewedAt: new Date(), reviewedBy: admin.id, reviewerNote: note })
        .where(eq(sellerApplications.id, id));
      await notify(app.userId, {
        type: "SELLER_APPLICATION",
        title: "درخواست فروشندگی رد شد",
        body: note || "درخواست شما مورد تأیید قرار نگرفت.",
        link: "/dashboard/customer",
      });
    }

    await audit(admin.id, decision === "APPROVED" ? "SELLER_APPROVED" : "SELLER_REJECTED", "seller_application", id, { note });
    return { message: "بررسی انجام شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function reviewProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const id = Number(formData.get("productId"));
    const decision = String(formData.get("decision"));
    const note = String(formData.get("note") ?? "");

    const [product] = await db
      .select({ id: products.id, sellerId: products.sellerId, title: products.title })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    if (!product) throw new AppError("محصول یافت نشد.", 404);

    let status: ProductStatus = "PUBLISHED";
    if (decision === "REJECT") status = "REJECTED";
    else if (decision === "CHANGES") status = "CHANGES_REQUESTED";
    else if (decision === "SUSPEND") status = "SUSPENDED";

    await db
      .update(products)
      .set({
        status,
        publishedAt: decision === "APPROVE" ? new Date() : undefined,
      })
      .where(eq(products.id, id));

    const [seller] = await db
      .select({ userId: sellers.userId })
      .from(sellers)
      .where(eq(sellers.id, product.sellerId))
      .limit(1);
    if (seller) {
      const messages: Record<string, string> = {
        APPROVE: "محصول شما تأیید و منتشر شد.",
        REJECT: note || "محصول شما رد شد.",
        CHANGES: note || "محصول شما نیاز به اصلاح دارد.",
        SUSPEND: "محصول شما به حالت تعلیق درآمد.",
        RESTORE: "محصول شما دوباره منتشر شد.",
      };
      await notify(seller.userId, {
        type: "MODERATION",
        title: `وضعیت محصول «${product.title}»`,
        body: messages[decision] ?? "وضعیت محصول تغییر کرد.",
        link: "/dashboard/seller/products",
      });
    }

    await audit(admin.id, `PRODUCT_${decision}`, "product", id, { note });
    return { message: "وضعیت محصول به‌روزرسانی شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function setUserRoleAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const userId = Number(formData.get("userId"));
    const role = String(formData.get("role"));

    if (!["ADMIN", "SELLER", "CUSTOMER"].includes(role)) {
      throw new AppError("نقش نامعتبر است.");
    }

    if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
      const user = mockStore.users.find((candidate) => candidate.id === userId);

      if (!user) {
        throw new AppError("کاربر یافت نشد.", 404);
      }

      if (user.id === admin.id && role !== "ADMIN") {
        throw new AppError("نمی‌توانید نقش حساب مدیر فعلی را حذف کنید.");
      }

      updateMockUser(userId, {
        role: role as "ADMIN" | "SELLER" | "CUSTOMER",
      });

      await audit(admin.id, "USER_ROLE_CHANGED", "user", userId, { role });

      return { message: "نقش کاربر تغییر کرد." };
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        role: role as "ADMIN" | "SELLER" | "CUSTOMER",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    if (!updatedUser) {
      throw new AppError("کاربر یافت نشد.", 404);
    }

    await audit(admin.id, "USER_ROLE_CHANGED", "user", userId, { role });

    return { message: "نقش کاربر تغییر کرد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function setUserStatusAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const userId = Number(formData.get("userId"));
    const status = String(formData.get("status"));

    if (!["ACTIVE", "SUSPENDED", "BANNED"].includes(status)) {
      throw new AppError("وضعیت نامعتبر است.");
    }

    if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
      const user = mockStore.users.find((candidate) => candidate.id === userId);

      if (!user) {
        throw new AppError("کاربر یافت نشد.", 404);
      }

      if (user.id === admin.id && status !== "ACTIVE") {
        throw new AppError("نمی‌توانید حساب مدیر فعلی را غیرفعال کنید.");
      }

      updateMockUser(userId, {
        status: status as "ACTIVE" | "SUSPENDED" | "BANNED",
      });

      await audit(admin.id, "USER_STATUS_CHANGED", "user", userId, { status });

      return { message: "وضعیت کاربر تغییر کرد." };
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        status: status as "ACTIVE" | "SUSPENDED" | "BANNED",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    if (!updatedUser) {
      throw new AppError("کاربر یافت نشد.", 404);
    }

    await audit(admin.id, "USER_STATUS_CHANGED", "user", userId, { status });

    return { message: "وضعیت کاربر تغییر کرد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function createCategoryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const parsed = categorySchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      icon: formData.get("icon"),
      parentId: formData.get("parentId"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };
    await db.insert(categories).values({
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      description: parsed.data.description,
      icon: parsed.data.icon,
      parentId: parsed.data.parentId,
    });
    await audit(admin.id, "CATEGORY_CREATED", "category", null, { name: parsed.data.name });
    return { message: "دسته‌بندی ایجاد شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function createTechnologyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const parsed = technologySchema.safeParse({
      name: formData.get("name"),
      kind: formData.get("kind"),
      icon: formData.get("icon"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };
    await db.insert(technologies).values({
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      kind: parsed.data.kind,
      icon: parsed.data.icon,
    });
    await audit(admin.id, "TECHNOLOGY_CREATED", "technology", null, { name: parsed.data.name });
    return { message: "تکنولوژی ایجاد شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." }
  }
}

export async function createCouponAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const parsed = couponSchema.safeParse({
      code: formData.get("code"),
      type: formData.get("type"),
      value: formData.get("value"),
      minOrder: formData.get("minOrder"),
      maxUses: formData.get("maxUses"),
      expiresAt: formData.get("expiresAt"),
      scope: formData.get("scope"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };
    await db.insert(coupons).values(parsed.data);
    await audit(admin.id, "COUPON_CREATED", "coupon", null, { code: parsed.data.code });
    return { message: "کد تخفیف ایجاد شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function reviewWithdrawalAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const id = Number(formData.get("withdrawalId"));
    const decision = String(formData.get("decision"));
    const note = String(formData.get("note") ?? "");
    const payoutRef = String(formData.get("payoutReference") ?? "");

    const [w] = await db.select().from(withdrawals).where(eq(withdrawals.id, id)).limit(1);
    if (!w) throw new AppError("درخواست برداشت یافت نشد.", 404);
    if (!["REQUESTED", "UNDER_REVIEW"].includes(w.status)) {
      throw new AppError("این درخواست قابل بررسی نیست.");
    }

    if (decision === "REJECT") {
      await db
        .update(withdrawals)
        .set({ status: "REJECTED", adminNote: note, processedAt: new Date(), processedBy: admin.id })
        .where(eq(withdrawals.id, id));
      const [bal] = await db
        .select({ balance: sql<number>`coalesce(sum(${transactions.amount}), 0)` })
        .from(transactions)
        .where(eq(transactions.sellerId, w.sellerId));
      await db.insert(transactions).values({
        sellerId: w.sellerId,
        type: "ADJUSTMENT",
        amount: w.amount,
        balanceAfter: (bal?.balance ?? 0) + w.amount,
        referenceType: "withdrawal",
        referenceId: w.id,
        description: "بازگشت مبلغ برداشت ردشده",
      });
    } else {
      await db
        .update(withdrawals)
        .set({
          status: decision === "APPROVE" ? "APPROVED" : "PAID",
          adminNote: note,
          payoutReference: payoutRef || undefined,
          processedAt: new Date(),
          processedBy: admin.id,
        })
        .where(eq(withdrawals.id, id));
    }

    const [seller] = await db
      .select({ userId: sellers.userId })
      .from(sellers)
      .where(eq(sellers.id, w.sellerId))
      .limit(1);
    if (seller) {
      await notify(seller.userId, {
        type: "WITHDRAWAL",
        title: decision === "REJECT" ? "برداشت رد شد" : "برداشت تأیید شد",
        body: note || undefined,
        link: "/dashboard/seller/withdrawals",
      });
    }
    await audit(admin.id, "WITHDRAWAL_REVIEWED", "withdrawal", id, { decision });
    return { message: "درخواست برداشت بررسی شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function createBlogPostAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const parsed = blogPostSchema.safeParse({
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      status: formData.get("status"),
      tagNames: formData.getAll("tagNames").map(String).filter(Boolean),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };
    const d = parsed.data;

    const [post] = await db
      .insert(blogPosts)
      .values({
        authorId: admin.id,
        title: d.title,
        slug: slugify(d.title),
        excerpt: d.excerpt,
        content: d.content,
        status: d.status,
        publishedAt: d.status === "PUBLISHED" ? new Date() : null,
      })
      .returning({ id: blogPosts.id });

    for (const name of d.tagNames) {
      const tagSlug = slugify(name);
      let [tag] = await db.select().from(blogTags).where(eq(blogTags.slug, tagSlug)).limit(1);
      if (!tag) {
        [tag] = await db.insert(blogTags).values({ name, slug: tagSlug }).returning();
      }
      await db
        .insert(blogPostTags)
        .values({ postId: post.id, tagId: tag.id })
        .onConflictDoNothing();
    }
    await audit(admin.id, "BLOG_POST_CREATED", "blog_post", post.id, { title: d.title });
    return { message: "مقاله ذخیره شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function resolveReportAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    const id = Number(formData.get("reportId"));
    const decision = String(formData.get("decision"));
    const note = String(formData.get("note") ?? "");
    const status = decision === "RESOLVED" ? "RESOLVED" : "DISMISSED";
    await db
      .update(reports)
      .set({ status, reviewerNote: note, reviewedAt: new Date(), reviewedBy: admin.id })
      .where(eq(reports.id, id));
    await audit(admin.id, "REPORT_RESOLVED", "report", id, { status });
    return { message: "گزارش بررسی شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function saveSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await requireAdmin();
    for (const key of ["siteName", "siteTagline", "supportEmail"]) {
      const value = String(formData.get(key) ?? "");
      if (value) {
        await db
          .insert(settings)
          .values({ key, value })
          .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
      }
    }
    await audit(admin.id, "SETTINGS_UPDATED", "settings", null);
    return { message: "تنظیمات ذخیره شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}