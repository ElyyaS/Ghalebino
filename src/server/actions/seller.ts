"use server";

import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import {
  db,
  licenses,
  productFeatures,
  productImages,
  productLicenses,
  productRequirements,
  productTags,
  products,
  productTechnologies,
  productVersions,
  questions,
  reviews,
  sellerApplications,
  sellers,
  tags,
  transactions,
  users,
  withdrawals,
} from "@/db";
import { requireSeller, requireUser } from "@/lib/auth";
import { AppError, firstErrorMessage, type FormState } from "@/lib/errors";
import { notify } from "@/lib/notifications";
import { getSellerBalance } from "@/server/queries";
import {
  productSchema,
  sellerApplicationSchema,
  sellerStoreSchema,
  withdrawalSchema,
} from "@/lib/validators";
import { slugify } from "@/lib/utils";

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [existing] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (!existing) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function applyToSellAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser();
    const parsed = sellerApplicationSchema.safeParse({
      storeName: formData.get("storeName"),
      description: formData.get("description"),
      portfolioUrl: formData.get("portfolioUrl"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };

    const [existing] = await db
      .select({ id: sellerApplications.id, status: sellerApplications.status })
      .from(sellerApplications)
      .where(and(eq(sellerApplications.userId, user.id), eq(sellerApplications.status, "PENDING")))
      .limit(1);
    if (existing) throw new AppError("شما یک درخواست در حال بررسی دارید.");

    await db.insert(sellerApplications).values({
      userId: user.id,
      storeName: parsed.data.storeName,
      description: parsed.data.description,
      portfolioUrl: parsed.data.portfolioUrl,
    });

    const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, "ADMIN"));
    for (const admin of admins) {
      await notify(admin.id, {
        type: "SELLER_APPLICATION",
        title: "درخواست فروشندگی جدید",
        body: `${user.name} درخواست فروشندگی ثبت کرده است.`,
        link: "/admin/sellers",
      });
    }
    return { message: "درخواست شما ثبت شد و پس از بررسی اعلام می‌شود." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice"),
    version: formData.get("version"),
    demoUrl: formData.get("demoUrl"),
    documentationUrl: formData.get("documentationUrl"),
    features: formData.getAll("features").map(String).filter((x) => x.trim().length > 0),
    requirements: formData.getAll("requirements").map(String).filter((x) => x.trim().length > 0),
    technologyIds: formData.getAll("technologyIds").map(String).filter(Boolean),
  });
}

export async function createProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  let productId = 0;
  try {
    const seller = await requireSeller();
    const parsed = parseProductForm(formData);
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };
    const d = parsed.data;

    const slug = await ensureUniqueSlug(slugify(d.title));
    const [product] = await db
      .insert(products)
      .values({
        sellerId: seller.id,
        title: d.title,
        slug,
        shortDescription: d.shortDescription,
        description: d.description,
        categoryId: d.categoryId,
        price: d.price,
        salePrice: d.salePrice,
        status: "DRAFT",
        currentVersion: d.version,
        demoUrl: d.demoUrl,
        documentationUrl: d.documentationUrl,
      })
      .returning({ id: products.id });
    productId = product.id;

    for (const [i, text] of d.features.entries()) {
      await db.insert(productFeatures).values({ productId, text, sortOrder: i });
    }
    for (const [i, text] of d.requirements.entries()) {
      await db.insert(productRequirements).values({ productId, text, sortOrder: i });
    }
    for (const techId of d.technologyIds) {
      await db
        .insert(productTechnologies)
        .values({ productId, technologyId: techId })
        .onConflictDoNothing();
    }
    const allLicenses = await db.select().from(licenses);
    for (const l of allLicenses) {
      await db.insert(productLicenses).values({ productId, licenseId: l.id });
    }
    await db.insert(productVersions).values({
      productId,
      version: d.version,
      changelog: "انتشار اولیه محصول",
      fileKey: `products/${productId}/${d.version}.zip`,
      fileSize: 0,
    });
    await db.insert(productImages).values({
      productId,
      url: "/images/placeholder-product.svg",
      alt: d.title,
      isPrimary: true,
      sortOrder: 0,
    });
    await db
      .update(sellers)
      .set({ totalProducts: sql`${sellers.totalProducts} + 1` })
      .where(eq(sellers.id, seller.id));
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    console.error("[create-product]", err);
    return { error: "خطایی رخ داد." };
  }
  redirect(`/dashboard/seller/products/${productId}/edit`);
}

export async function updateProductAction(productId: number, formData: FormData): Promise<FormState> {
  try {
    const seller = await requireSeller();
    const [owned] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.sellerId, seller.id)))
      .limit(1);
    if (!owned) throw new AppError("محصول یافت نشد.", 404);

    const parsed = parseProductForm(formData);
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };
    const d = parsed.data;

    await db
      .update(products)
      .set({
        title: d.title,
        shortDescription: d.shortDescription,
        description: d.description,
        categoryId: d.categoryId,
        price: d.price,
        salePrice: d.salePrice,
        demoUrl: d.demoUrl,
        documentationUrl: d.documentationUrl,
      })
      .where(eq(products.id, productId));

    await db.delete(productFeatures).where(eq(productFeatures.productId, productId));
    await db.delete(productRequirements).where(eq(productRequirements.productId, productId));
    await db.delete(productTechnologies).where(eq(productTechnologies.productId, productId));

    for (const [i, text] of d.features.entries()) {
      await db.insert(productFeatures).values({ productId, text, sortOrder: i });
    }
    for (const [i, text] of d.requirements.entries()) {
      await db.insert(productRequirements).values({ productId, text, sortOrder: i });
    }
    for (const techId of d.technologyIds) {
      await db
        .insert(productTechnologies)
        .values({ productId, technologyId: techId })
        .onConflictDoNothing();
    }
    return { message: "تغییرات ذخیره شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function submitProductAction(productId: number) {
  try {
    const seller = await requireSeller();
    const [owned] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.sellerId, seller.id)))
      .limit(1);
    if (!owned) throw new AppError("محصول یافت نشد.", 404);

    await db.update(products).set({ status: "SUBMITTED" }).where(eq(products.id, productId));

    const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, "ADMIN"));
    for (const admin of admins) {
      await notify(admin.id, {
        type: "MODERATION",
        title: "محصول جدید برای بررسی",
        link: "/admin/products",
      });
    }
    return { message: "محصول برای بررسی ارسال شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function deleteProductAction(productId: number) {
  try {
    const seller = await requireSeller();
    const [owned] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.sellerId, seller.id)))
      .limit(1);
    if (!owned) throw new AppError("محصول یافت نشد.", 404);
    await db.update(products).set({ deletedAt: new Date() }).where(eq(products.id, productId));
    return { message: "محصول حذف شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function requestWithdrawalAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const seller = await requireSeller();
    const parsed = withdrawalSchema.safeParse({
      amount: formData.get("amount"),
      method: formData.get("method"),
      accountDetails: formData.get("accountDetails"),
    });
    if (!parsed.success) return { error: firstErrorMessage(parsed.error) };

    const amount = parsed.data.amount;
    const balance = await getSellerBalance(seller.id);
    if (amount > balance) throw new AppError("موجودی حساب برای این برداشت کافی نیست.");

    const [withdrawal] = await db
      .insert(withdrawals)
      .values({
        sellerId: seller.id,
        amount,
        status: "REQUESTED",
        method: parsed.data.method,
        accountDetails: parsed.data.accountDetails,
      })
      .returning({ id: withdrawals.id });

    await db.insert(transactions).values({
      sellerId: seller.id,
      type: "WITHDRAWAL",
      amount: -amount,
      balanceAfter: balance - amount,
      referenceType: "withdrawal",
      referenceId: withdrawal.id,
      description: "درخواست برداشت وجه",
    });

    const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, "ADMIN"));
    for (const admin of admins) {
      await notify(admin.id, {
        type: "WITHDRAWAL",
        title: "درخواست برداشت جدید",
        link: "/admin/withdrawals",
      });
    }
    return { message: "درخواست برداشت شما ثبت شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function updateStoreAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const seller = await requireSeller();

    const parsed = sellerStoreSchema.safeParse({
      storeName: formData.get("storeName"),
      tagline: formData.get("tagline"),
      bio: formData.get("bio"),
    });

    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error) };
    }

    const [updatedSeller] = await db
      .update(sellers)
      .set({
        storeName: parsed.data.storeName,
        tagline: parsed.data.tagline,
        bio: parsed.data.bio,
      })
      .where(eq(sellers.id, seller.id))
      .returning({
        id: sellers.id,
      });

    if (!updatedSeller) {
      return { error: "فروشگاه یافت نشد." };
    }

    return { message: "اطلاعات فروشگاه ذخیره شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    console.error("[update-store]", err);
    return { error: "خطایی رخ داد." };
  }
}

export async function replyToReviewAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const seller = await requireSeller();
    const reviewId = Number(formData.get("reviewId"));
    const reply = String(formData.get("reply") ?? "").trim();
    if (reply.length < 2) throw new AppError("متن پاسخ را وارد کنید.");

    const [review] = await db
      .select({ productId: reviews.productId })
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);
    if (!review) throw new AppError("دیدگاه یافت نشد.", 404);

    const [product] = await db
      .select({ sellerId: products.sellerId })
      .from(products)
      .where(eq(products.id, review.productId))
      .limit(1);
    if (!product || product.sellerId !== seller.id) {
      throw new AppError("دسترسی غیرمجاز.", 403);
    }

    await db
      .update(reviews)
      .set({ sellerReply: reply, sellerRepliedAt: new Date() })
      .where(eq(reviews.id, reviewId));
    return { message: "پاسخ شما ثبت شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}

export async function answerQuestionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const seller = await requireSeller();
    const questionId = Number(formData.get("questionId"));
    const answer = String(formData.get("answer") ?? "").trim();
    if (answer.length < 2) throw new AppError("متن پاسخ را وارد کنید.");

    const [question] = await db
      .select({ productId: questions.productId })
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);
    if (!question) throw new AppError("سؤال یافت نشد.", 404);

    const [product] = await db
      .select({ sellerId: products.sellerId })
      .from(products)
      .where(eq(products.id, question.productId))
      .limit(1);
    if (!product || product.sellerId !== seller.id) {
      throw new AppError("دسترسی غیرمجاز.", 403);
    }

    await db
      .update(questions)
      .set({ sellerAnswer: answer, answeredAt: new Date() })
      .where(eq(questions.id, questionId));
    return { message: "پاسخ شما ثبت شد." };
  } catch (err) {
    if (err instanceof AppError) return { error: err.message };
    return { error: "خطایی رخ داد." };
  }
}
