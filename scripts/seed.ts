import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";

import * as schema from "../src/db/schema";

const scrypt = promisify(scryptCallback);

const databasePath = path.join(process.cwd(), "data", "ghalebino");

const client = new PGlite(databasePath);
const db = drizzle(client, { schema });

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

async function getOrCreateUser(data: {
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  bio: string | null;
}) {
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, data.email))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const passwordHash = await hashPassword(data.password);
  const now = new Date();

  const inserted = await db
    .insert(schema.users)
    .values({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      status: "ACTIVE",
      avatarUrl: null,
      bio: data.bio,
      emailVerifiedAt: now,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const user = inserted[0];

  if (!user) {
    throw new Error(`Failed to create user: ${data.email}`);
  }

  return user;
}

async function getOrCreateSeller(data: {
  userId: number;
  username: string;
  storeName: string;
  tagline: string;
  bio: string;
}) {
  const existing = await db
    .select()
    .from(schema.sellers)
    .where(eq(schema.sellers.userId, data.userId))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const now = new Date();

  const inserted = await db
    .insert(schema.sellers)
    .values({
      userId: data.userId,
      username: data.username,
      storeName: data.storeName,
      tagline: data.tagline,
      bio: data.bio,
      avatarUrl: null,
      coverUrl: null,
      rating: 0,
      ratingCount: 0,
      totalSales: 0,
      totalProducts: 0,
      responseTime: "کمتر از ۲ ساعت",
      status: "ACTIVE",
      approvedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const seller = inserted[0];

  if (!seller) {
    throw new Error(`Failed to create seller: ${data.username}`);
  }

  return seller;
}

async function getOrCreateCategory(data: {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}) {
  const existing = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, data.slug))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const inserted = await db
    .insert(schema.categories)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      sortOrder: data.sortOrder,
      isVisible: true,
    })
    .returning();

  if (!inserted[0]) {
    throw new Error(`Failed to create category: ${data.slug}`);
  }

  return inserted[0];
}

async function getOrCreateTechnology(data: {
  name: string;
  slug: string;
  kind: string;
  sortOrder: number;
}) {
  const existing = await db
    .select()
    .from(schema.technologies)
    .where(eq(schema.technologies.slug, data.slug))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const inserted = await db
    .insert(schema.technologies)
    .values({
      name: data.name,
      slug: data.slug,
      kind: data.kind,
      sortOrder: data.sortOrder,
      isVisible: true,
    })
    .returning();

  if (!inserted[0]) {
    throw new Error(`Failed to create technology: ${data.slug}`);
  }

  return inserted[0];
}

async function getOrCreateTag(data: {
  name: string;
  slug: string;
}) {
  const existing = await db
    .select()
    .from(schema.tags)
    .where(eq(schema.tags.slug, data.slug))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const inserted = await db
    .insert(schema.tags)
    .values(data)
    .returning();

  if (!inserted[0]) {
    throw new Error(`Failed to create tag: ${data.slug}`);
  }

  return inserted[0];
}

async function getOrCreateLicense(data: {
  name: string;
  key: string;
  description: string;
  terms: string;
  multiplier: number;
  sortOrder: number;
}) {
  const existing = await db
    .select()
    .from(schema.licenses)
    .where(eq(schema.licenses.key, data.key))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const inserted = await db
    .insert(schema.licenses)
    .values(data)
    .returning();

  if (!inserted[0]) {
    throw new Error(`Failed to create license: ${data.key}`);
  }

  return inserted[0];
}

async function getOrCreateReviewCriterion(data: {
  key: string;
  name: string;
  sortOrder: number;
}) {
  const existing = await db
    .select()
    .from(schema.reviewCriteria)
    .where(eq(schema.reviewCriteria.key, data.key))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const inserted = await db
    .insert(schema.reviewCriteria)
    .values(data)
    .returning();

  if (!inserted[0]) {
    throw new Error(`Failed to create review criterion: ${data.key}`);
  }

  return inserted[0];
}

const IMG = {
  ecommerce: "/images/previews/ecommerce.jpg",
  admin: "/images/previews/admin.jpg",
  corporate: "/images/previews/corporate.jpg",
  portfolio: "/images/previews/portfolio.jpg",
  landing: "/images/previews/landing.jpg",
  blog: "/images/previews/blog.jpg",
};

async function getOrCreateProduct(data: {
  sellerId: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: number;
  price: number;
  salePrice?: number | null;
  status?: "DRAFT" | "SUBMITTED" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
  isFeatured?: boolean;
  isTrending?: boolean;
  isStaffPick?: boolean;
  currentVersion: string;
  demoUrl?: string | null;
  documentationUrl?: string | null;
  supportNote?: string | null;
  salesCount?: number;
  views?: number;
}) {
  const existing = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.slug, data.slug))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const now = new Date();

  const inserted = await db
    .insert(schema.products)
    .values({
      sellerId: data.sellerId,
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      categoryId: data.categoryId,
      price: data.price,
      salePrice: data.salePrice ?? null,
      status: data.status ?? "PUBLISHED",
      isFeatured: data.isFeatured ?? false,
      isTrending: data.isTrending ?? false,
      isStaffPick: data.isStaffPick ?? false,
      currentVersion: data.currentVersion,
      lastUpdatedAt: now,
      publishedAt:
        (data.status ?? "PUBLISHED") === "PUBLISHED" ? now : null,
      views: data.views ?? 0,
      salesCount: data.salesCount ?? 0,
      ratingAvg: 0,
      ratingCount: 0,
      demoUrl: data.demoUrl ?? null,
      documentationUrl: data.documentationUrl ?? null,
      supportNote:
        data.supportNote ?? "پشتیبانی و به‌روزرسانی رایگان تا ۶ ماه",
      seoTitle: null,
      seoDescription: null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!inserted[0]) {
    throw new Error(`Failed to create product: ${data.slug}`);
  }

  return inserted[0];
}

async function main() {
  const admin = await getOrCreateUser({
    email: "admin@ghalebino.test",
    password: "admin",
    name: "مدیر قالبی نو",
    role: "ADMIN",
    bio: "مدیریت قالبی نو",
  });

  const seller = await getOrCreateUser({
    email: "seller@ghalebino.test",
    password: "seller",
    name: "آرمان رضایی",
    role: "SELLER",
    bio: "طراح و توسعه‌دهنده وب",
  });

  const seller1 = await getOrCreateUser({
    email: "seller1@ghalebino.test",
    password: "seller1",
    name: "نگار محمدی",
    role: "SELLER",
    bio: "طراح رابط کاربری و توسعه‌دهنده قالب",
  });

  const seller2 = await getOrCreateUser({
    email: "seller2@ghalebino.test",
    password: "seller2",
    name: "رضا کریمی",
    role: "SELLER",
    bio: "توسعه‌دهنده قالب‌های HTML و فروشگاهی",
  });

  const seller3 = await getOrCreateUser({
    email: "seller3@ghalebino.test",
    password: "seller3",
    name: "مریم احمدی",
    role: "SELLER",
    bio: "طراح داشبورد و سیستم‌های رابط کاربری",
  });

  const customer = await getOrCreateUser({
    email: "customer@ghalebino.test",
    password: "customer",
    name: "کاربر آزمایشی",
    role: "CUSTOMER",
    bio: null,
  });

  const arteka = await getOrCreateSeller({
    userId: seller.id,
    username: "arteka",
    storeName: "استودیو آرتکا",
    tagline: "قالب‌های حرفه‌ای React و Next.js",
    bio: "استودیو آرتکا با بیش از ۸ سال سابقه در طراحی و توسعه قالب‌های وب، محصولاتی با کیفیت بالا و استانداردهای مدرن ارائه می‌دهد.",
  });

  const negarcode = await getOrCreateSeller({
    userId: seller1.id,
    username: "negarcode",
    storeName: "نگارکد",
    tagline: "طراحی رابط کاربری و قالب وردپرس",
    bio: "تیم نگارکد متخصص طراحی رابط کاربری و توسعه قالب‌های وردپرس برای کسب‌وکارهای ایرانی است.",
  });

  const websazan = await getOrCreateSeller({
    userId: seller2.id,
    username: "websazan",
    storeName: "وب‌سازان ایرانی",
    tagline: "قالب‌های HTML و فروشگاهی",
    bio: "وب‌سازان ایرانی از سال ۱۳۹۵ قالب‌های سبک و بهینه HTML و فروشگاهی می‌سازد.",
  });

  const pixelstudio = await getOrCreateSeller({
    userId: seller3.id,
    username: "pixelstudio",
    storeName: "پیکسل استودیو",
    tagline: "داشبوردهای مدیریتی و UI Kit",
    bio: "پیکسل استودیو در زمینه داشبوردهای مدیریتی، رابط کاربری و کیت‌های طراحی فعالیت می‌کند.",
  });

  const categories = await Promise.all([
    getOrCreateCategory({
      name: "قالب HTML",
      slug: "html-templates",
      description: "قالب‌های HTML و CSS آماده برای وب‌سایت‌های سبک",
      sortOrder: 0,
    }),
    getOrCreateCategory({
      name: "قالب React",
      slug: "react-templates",
      description: "قالب‌ها و کامپوننت‌های React مدرن",
      sortOrder: 1,
    }),
    getOrCreateCategory({
      name: "قالب Next.js",
      slug: "nextjs-templates",
      description: "قالب‌های SSR و SSG بر پایه Next.js",
      sortOrder: 2,
    }),
    getOrCreateCategory({
      name: "قالب وردپرس",
      slug: "wordpress-themes",
      description: "قالب‌های وردپرس فارسی و بهینه",
      sortOrder: 3,
    }),
    getOrCreateCategory({
      name: "قالب فروشگاهی",
      slug: "ecommerce-templates",
      description: "قالب‌های فروشگاه اینترنتی و کسب‌وکار آنلاین",
      sortOrder: 4,
    }),
    getOrCreateCategory({
      name: "قالب مدیریتی",
      slug: "admin-dashboards",
      description: "داشبوردها و پنل‌های مدیریتی",
      sortOrder: 5,
    }),
    getOrCreateCategory({
      name: "رابط کاربری",
      slug: "ui-kits",
      description: "کیت‌های رابط کاربری و سیستم طراحی",
      sortOrder: 6,
    }),
    getOrCreateCategory({
      name: "قالب لندینگ",
      slug: "landing-pages",
      description: "صفحات فرود و لندینگ‌پیج",
      sortOrder: 7,
    }),
    getOrCreateCategory({
      name: "قالب نمونه کار",
      slug: "portfolio-templates",
      description: "قالب‌های پورتفولیو و معرفی کار",
      sortOrder: 8,
    }),
    getOrCreateCategory({
      name: "قالب شرکتی",
      slug: "business-templates",
      description: "قالب‌های وب‌سایت شرکتی و سازمانی",
      sortOrder: 9,
    }),
  ]);

  console.log(`Categories seeded: ${categories.length}`);

  const technologies = await Promise.all([
    getOrCreateTechnology({
      name: "HTML",
      slug: "html",
      kind: "language",
      sortOrder: 0,
    }),
    getOrCreateTechnology({
      name: "CSS",
      slug: "css",
      kind: "language",
      sortOrder: 1,
    }),
    getOrCreateTechnology({
      name: "JavaScript",
      slug: "javascript",
      kind: "language",
      sortOrder: 2,
    }),
    getOrCreateTechnology({
      name: "TypeScript",
      slug: "typescript",
      kind: "language",
      sortOrder: 3,
    }),
    getOrCreateTechnology({
      name: "Tailwind CSS",
      slug: "tailwind-css",
      kind: "library",
      sortOrder: 4,
    }),
    getOrCreateTechnology({
      name: "Bootstrap",
      slug: "bootstrap",
      kind: "library",
      sortOrder: 5,
    }),
    getOrCreateTechnology({
      name: "React",
      slug: "react",
      kind: "framework",
      sortOrder: 6,
    }),
    getOrCreateTechnology({
      name: "Next.js",
      slug: "nextjs",
      kind: "framework",
      sortOrder: 7,
    }),
    getOrCreateTechnology({
      name: "Vue.js",
      slug: "vuejs",
      kind: "framework",
      sortOrder: 8,
    }),
    getOrCreateTechnology({
      name: "Angular",
      slug: "angular",
      kind: "framework",
      sortOrder: 9,
    }),
    getOrCreateTechnology({
      name: "WordPress",
      slug: "wordpress",
      kind: "cms",
      sortOrder: 10,
    }),
    getOrCreateTechnology({
      name: "Laravel",
      slug: "laravel",
      kind: "framework",
      sortOrder: 11,
    }),
  ]);

  console.log(`Technologies seeded: ${technologies.length}`);

  const tags = await Promise.all([
    getOrCreateTag({
      name: "ریسپانسیو",
      slug: "responsive",
    }),
    getOrCreateTag({
      name: "راست‌چین",
      slug: "rtl",
    }),
    getOrCreateTag({
      name: "سئو",
      slug: "seo",
    }),
    getOrCreateTag({
      name: "سریع",
      slug: "fast",
    }),
    getOrCreateTag({
      name: "چندزبانه",
      slug: "multilingual",
    }),
    getOrCreateTag({
      name: "دارک مود",
      slug: "dark-mode",
    }),
  ]);

  console.log(`Tags seeded: ${tags.length}`);

  const licenses = await Promise.all([
    getOrCreateLicense({
      name: "لایسنس شخصی",
      key: "personal",
      description: "استفاده برای یک پروژه شخصی یا غیرتجاری",
      terms: "این لایسنس فقط برای استفاده شخصی و غیرتجاری معتبر است.",
      multiplier: 1,
      sortOrder: 0,
    }),
    getOrCreateLicense({
      name: "لایسنس تجاری",
      key: "commercial",
      description: "استفاده برای پروژه‌های تجاری و کسب‌وکارها",
      terms: "این لایسنس برای استفاده تجاری در یک پروژه معتبر است.",
      multiplier: 1.8,
      sortOrder: 1,
    }),
    getOrCreateLicense({
      name: "لایسنس نامحدود",
      key: "extended",
      description: "استفاده گسترده و نامحدود از محصول",
      terms: "این لایسنس امکان استفاده گسترده و بدون محدودیت پروژه‌ای را فراهم می‌کند.",
      multiplier: 4,
      sortOrder: 2,
    }),
  ]);

  console.log(`Licenses seeded: ${licenses.length}`);

    const reviewCriteria = await Promise.all([
    getOrCreateReviewCriterion({
      key: "design",
      name: "کیفیت طراحی",
      sortOrder: 0,
    }),
    getOrCreateReviewCriterion({
      key: "code",
      name: "کیفیت کد",
      sortOrder: 1,
    }),
    getOrCreateReviewCriterion({
      key: "docs",
      name: "مستندات",
      sortOrder: 2,
    }),
    getOrCreateReviewCriterion({
      key: "usability",
      name: "سهولت استفاده",
      sortOrder: 3,
    }),
    getOrCreateReviewCriterion({
      key: "performance",
      name: "عملکرد",
      sortOrder: 4,
    }),
    getOrCreateReviewCriterion({
      key: "support",
      name: "پشتیبانی",
      sortOrder: 5,
    }),
  ]);

  console.log(`Review criteria seeded: ${reviewCriteria.length}`);

    const products = await Promise.all([
    getOrCreateProduct({
      sellerId: arteka.id,
      title: "داشبورد مدیریتی آتریا",
      slug: "atria-admin-dashboard",
      shortDescription: "داشبورد مدیریتی حرفه‌ای و مدرن",
      description: "یک داشبورد مدیریتی کامل و حرفه‌ای برای پروژه‌های مدرن.",
      categoryId: categories[5].id,
      price: 2900000,
      salePrice: 2450000,
      currentVersion: "3.1.0",
      isFeatured: true,
      isStaffPick: true,
      demoUrl: "https://example.com/demo/atria",
    }),

    getOrCreateProduct({
      sellerId: arteka.id,
      title: "لندینگ استارتاپ نوا",
      slug: "nova-saas-landing",
      shortDescription: "لندینگ مدرن برای استارتاپ‌ها و SaaS",
      description: "قالب لندینگ مدرن و سریع برای معرفی محصولات و سرویس‌های آنلاین.",
      categoryId: categories[7].id,
      price: 1150000,
      salePrice: 890000,
      currentVersion: "2.0.0",
      isFeatured: true,
      isTrending: true,
    }),

    getOrCreateProduct({
      sellerId: arteka.id,
      title: "قالب Next.js فروشگاهی نِکست‌شاپ",
      slug: "nextshop",
      shortDescription: "قالب فروشگاهی مدرن بر پایه Next.js",
      description: "قالب فروشگاهی حرفه‌ای برای پروژه‌های مدرن Next.js.",
      categoryId: categories[2].id,
      price: 3200000,
      salePrice: 2750000,
      currentVersion: "1.3.0",
      isFeatured: true,
      isTrending: true,
      isStaffPick: true,
      demoUrl: "https://example.com/demo/nextshop",
    }),

    getOrCreateProduct({
      sellerId: arteka.id,
      title: "داشبورد آنالیتیکس لومینا",
      slug: "lumina-analytics",
      shortDescription: "داشبورد حرفه‌ای تحلیل داده و آمار",
      description: "داشبورد مدرن برای نمایش داده‌ها، آمار و گزارش‌های مدیریتی.",
      categoryId: categories[5].id,
      price: 2450000,
      currentVersion: "2.6.0",
      isTrending: true,
    }),

    getOrCreateProduct({
      sellerId: arteka.id,
      title: "قالب React کامپوننت آرک",
      slug: "arc-react-components",
      shortDescription: "مجموعه کامپوننت‌های مدرن React",
      description: "مجموعه‌ای از کامپوننت‌های کاربردی برای پروژه‌های React.",
      categoryId: categories[1].id,
      price: 1350000,
      currentVersion: "1.6.0",
      isStaffPick: true,
    }),

    getOrCreateProduct({
      sellerId: negarcode.id,
      title: "قالب فروشگاهی شاپینو",
      slug: "shopino-ecommerce",
      shortDescription: "قالب فروشگاهی سبک و حرفه‌ای",
      description: "قالب فروشگاهی مدرن و ریسپانسیو برای کسب‌وکارهای آنلاین.",
      categoryId: categories[4].id,
      price: 1850000,
      salePrice: 1290000,
      currentVersion: "2.4.0",
      isFeatured: true,
      isTrending: true,
      demoUrl: "https://example.com/demo/shopino",
    }),

    getOrCreateProduct({
      sellerId: negarcode.id,
      title: "قالب مجله‌ای کاغذ",
      slug: "kaghaz-magazine",
      shortDescription: "قالب مجله و وبلاگ فارسی",
      description: "قالب سبک و مناسب مجله‌های اینترنتی و وبلاگ‌های فارسی.",
      categoryId: categories[0].id,
      price: 540000,
      currentVersion: "1.5.0",
    }),

    getOrCreateProduct({
      sellerId: negarcode.id,
      title: "قالب وردپرس کسب‌وکار ویار",
      slug: "viyar-wordpress-business",
      shortDescription: "قالب وردپرس حرفه‌ای برای کسب‌وکار",
      description: "قالب وردپرس فارسی و بهینه برای وب‌سایت‌های تجاری.",
      categoryId: categories[3].id,
      price: 1650000,
      currentVersion: "4.2.0",
      isFeatured: true,
    }),

    getOrCreateProduct({
      sellerId: negarcode.id,
      title: "UI Kit دیزاین سیستم ریحان",
      slug: "reyhan-ui-kit",
      shortDescription: "کیت رابط کاربری و دیزاین سیستم",
      description: "مجموعه‌ای از عناصر رابط کاربری برای طراحی سریع‌تر محصولات.",
      categoryId: categories[6].id,
      price: 790000,
      currentVersion: "2.1.0",
    }),

    getOrCreateProduct({
      sellerId: negarcode.id,
      title: "قالب نمونه کار استودیو",
      slug: "studio-portfolio",
      shortDescription: "قالب نمونه کار مینیمال و حرفه‌ای",
      description: "قالب مناسب معرفی نمونه کارها و پروژه‌های شخصی یا استودیویی.",
      categoryId: categories[8].id,
      price: 720000,
      currentVersion: "1.1.0",
    }),

    getOrCreateProduct({
      sellerId: negarcode.id,
      title: "قالب شرکتی در حال بررسی",
      slug: "pending-corporate-demo",
      shortDescription: "قالب شرکتی در حال بررسی",
      description: "محصول آزمایشی با وضعیت در حال بررسی.",
      categoryId: categories[9].id,
      price: 600000,
      currentVersion: "1.0.0",
      status: "SUBMITTED",
    }),

    getOrCreateProduct({
      sellerId: websazan.id,
      title: "قالب فروشگاهی الکترون",
      slug: "electron-store",
      shortDescription: "قالب فروشگاهی سریع و ریسپانسیو",
      description: "قالب فروشگاهی سبک و بهینه برای فروشگاه‌های اینترنتی.",
      categoryId: categories[4].id,
      price: 2150000,
      currentVersion: "3.0.0",
      isTrending: true,
    }),

    getOrCreateProduct({
      sellerId: websazan.id,
      title: "قالب لندینگ محصول مینو",
      slug: "minu-landing",
      shortDescription: "لندینگ ساده و سریع برای معرفی محصول",
      description: "قالب لندینگ سبک برای معرفی محصولات و کمپین‌های تبلیغاتی.",
      categoryId: categories[7].id,
      price: 460000,
      salePrice: 320000,
      currentVersion: "1.0.0",
    }),

    getOrCreateProduct({
      sellerId: websazan.id,
      title: "قالب وردپرس فروشگاهی بازار",
      slug: "bazaar-woocommerce",
      shortDescription: "قالب وردپرس فروشگاهی حرفه‌ای",
      description: "قالب فروشگاهی وردپرس مناسب فروشگاه‌های اینترنتی.",
      categoryId: categories[3].id,
      price: 1900000,
      salePrice: 1500000,
      currentVersion: "5.0.0",
      isFeatured: true,
    }),

    getOrCreateProduct({
      sellerId: websazan.id,
      title: "قالب شرکتی نگار",
      slug: "negar-corporate",
      shortDescription: "قالب شرکتی سبک و ریسپانسیو",
      description: "قالب شرکتی مناسب معرفی خدمات و کسب‌وکار.",
      categoryId: categories[9].id,
      price: 980000,
      currentVersion: "1.8.0",
    }),

    getOrCreateProduct({
      sellerId: pixelstudio.id,
      title: "قالب نمونه کار پرتره",
      slug: "portra-portfolio",
      shortDescription: "قالب نمونه کار مدرن و دارک",
      description: "قالب مینیمال برای نمایش نمونه کارها و پروژه‌های خلاقانه.",
      categoryId: categories[8].id,
      price: 690000,
      salePrice: 490000,
      currentVersion: "1.2.0",
      isTrending: true,
    }),

    getOrCreateProduct({
      sellerId: pixelstudio.id,
      title: "داشبورد مدیریتی پالس",
      slug: "pulse-admin",
      shortDescription: "داشبورد مدیریتی مدرن با Vue",
      description: "داشبورد مدیریتی مدرن برای پروژه‌های تحت وب.",
      categoryId: categories[5].id,
      price: 2600000,
      salePrice: 2100000,
      currentVersion: "1.9.0",
      isStaffPick: true,
    }),

    getOrCreateProduct({
      sellerId: pixelstudio.id,
      title: "قالب شرکتی سیگما",
      slug: "sigma-corporate",
      shortDescription: "قالب شرکتی حرفه‌ای و ریسپانسیو",
      description: "قالب شرکتی مناسب معرفی خدمات، شرکت و سازمان‌ها.",
      categoryId: categories[9].id,
      price: 880000,
      currentVersion: "1.4.0",
    }),

    getOrCreateProduct({
      sellerId: pixelstudio.id,
      title: "قالب بلاگ فارسی واژه",
      slug: "vajeh-blog",
      shortDescription: "قالب سبک و سریع برای وبلاگ فارسی",
      description: "قالب وبلاگ فارسی با تمرکز بر سرعت و سئو.",
      categoryId: categories[0].id,
      price: 380000,
      currentVersion: "1.0.0",
    }),
  ]);

  console.log(`Products seeded: ${products.length}`);

  console.log("Seed completed.");

  console.log(`Admin: ${admin.email} (${admin.id})`);

  console.log(`Seller: ${seller.email} (${seller.id})`);
  console.log(`Seller 1: ${seller1.email} (${seller1.id})`);
  console.log(`Seller 2: ${seller2.email} (${seller2.id})`);
  console.log(`Seller 3: ${seller3.email} (${seller3.id})`);

  console.log(`Customer: ${customer.email} (${customer.id})`);

  console.log(`Store: ${arteka.username} (${arteka.id})`);
  console.log(`Store: ${negarcode.username} (${negarcode.id})`);
  console.log(`Store: ${websazan.username} (${websazan.id})`);
  console.log(`Store: ${pixelstudio.username} (${pixelstudio.id})`);

  await client.close();
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  await client.close();
  process.exit(1);
});