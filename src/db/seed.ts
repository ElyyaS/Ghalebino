import "dotenv/config";
import { db } from "./index";
import {
  blogPosts,
  categories,
  collections,
  collectionProducts,
  coupons,
  downloads,
  licenses,
  orderItems,
  orders,
  payments,
  productFeatures,
  productImages,
  productLicenses,
  productRequirements,
  productTags,
  productTechnologies,
  productVersions,
  products,
  questions,
  reviewCriteria,
  reviews,
  sellers,
  tags,
  technologies,
  transactions,
  users,
} from "./schema";
import { hashPassword } from "../lib/password";
import { eq } from "drizzle-orm";

const IMG = {
  ecommerce: "/images/previews/ecommerce.jpg",
  admin: "/images/previews/admin.jpg",
  corporate: "/images/previews/corporate.jpg",
  portfolio: "/images/previews/portfolio.jpg",
  landing: "/images/previews/landing.jpg",
  blog: "/images/previews/blog.jpg",
};

async function main() {
  const [existing] = await db.select({ id: users.id }).from(users).limit(1);
  if (existing) {
    console.log("Seed already present, skipping.");
    return;
  }

  const passwordHash = await hashPassword("password123");

  // Users
  const [admin] = await db
    .insert(users)
    .values({ email: "admin@ghalebi.local", name: "مدیر سیستم", passwordHash, role: "ADMIN", emailVerifiedAt: new Date() })
    .returning({ id: users.id });

  const sellerUsers = [
    { email: "seller@ghalebi.local", name: "آرمان رضایی" },
    { email: "negar@ghalebi.local", name: "نگار محمدی" },
    { email: "websazan@ghalebi.local", name: "رضا کریمی" },
    { email: "pixel@ghalebi.local", name: "مریم احمدی" },
  ];
  const sellerUserIds: number[] = [];
  for (const s of sellerUsers) {
    const [u] = await db
      .insert(users)
      .values({ email: s.email, name: s.name, passwordHash, role: "SELLER", emailVerifiedAt: new Date() })
      .returning({ id: users.id });
    sellerUserIds.push(u.id);
  }

  const [customer] = await db
    .insert(users)
    .values({ email: "customer@ghalebi.local", name: "سارا حسینی", passwordHash, role: "CUSTOMER", emailVerifiedAt: new Date() })
    .returning({ id: users.id });

  // Sellers
  const sellerMeta = [
    { userId: sellerUserIds[0], username: "arteka", storeName: "استودیو آرتکا", tagline: "قالب‌های حرفه‌ای React و Next.js", bio: "استودیو آرتکا با بیش از ۸ سال سابقه در طراحی و توسعه قالب‌های وب، محصولاتی با کیفیت بالا و استانداردهای مدرن ارائه می‌دهد." },
    { userId: sellerUserIds[1], username: "negarcode", storeName: "نگارکد", tagline: "طراحی رابط کاربری و قالب وردپرس", bio: "تیم نگارکد متخصص طراحی رابط کاربری و توسعه قالب‌های وردپرس برای کسب‌وکارهای ایرانی است." },
    { userId: sellerUserIds[2], username: "websazan", storeName: "وب‌سازان ایرانی", tagline: "قالب‌های HTML و فروشگاهی", bio: "وب‌سازان ایرانی از سال ۱۳۹۵ قالب‌های سبک و بهینه HTML و فروشگاهی می‌سازد." },
    { userId: sellerUserIds[3], username: "pixelstudio", storeName: "پیکسل استودیو", tagline: "داشبوردهای مدیریتی و UI Kit", bio: "پیکسل استودیو در زمینه داشبوردهای مدیریتی، رابط کاربری و کیت‌های طراحی فعالیت می‌کند." },
  ];
  const sellerIds: number[] = [];
  for (const m of sellerMeta) {
    const [s] = await db
      .insert(sellers)
      .values({ ...m, status: "ACTIVE", approvedAt: new Date(), totalProducts: 0 })
      .returning({ id: sellers.id });
    sellerIds.push(s.id);
  }

  // Categories
  const catDefs = [
    { name: "قالب HTML", slug: "html-templates", description: "قالب‌های HTML و CSS آماده برای وب‌سایت‌های سبک" },
    { name: "قالب React", slug: "react-templates", description: "قالب‌ها و کامپوننت‌های React مدرن" },
    { name: "قالب Next.js", slug: "nextjs-templates", description: "قالب‌های SSR و SSG بر پایه Next.js" },
    { name: "قالب وردپرس", slug: "wordpress-themes", description: "قالب‌های وردپرس فارسی و بهینه" },
    { name: "قالب فروشگاهی", slug: "ecommerce-templates", description: "قالب‌های فروشگاه اینترنتی و کسب‌وکار آنلاین" },
    { name: "قالب مدیریتی", slug: "admin-dashboards", description: "داشبوردها و پنل‌های مدیریتی" },
    { name: "رابط کاربری", slug: "ui-kits", description: "کیت‌های رابط کاربری و سیستم طراحی" },
    { name: "قالب لندینگ", slug: "landing-pages", description: "صفحات فرود و لندینگ‌پیج" },
    { name: "قالب نمونه کار", slug: "portfolio-templates", description: "قالب‌های پورتفولیو و معرفی کار" },
    { name: "قالب شرکتی", slug: "business-templates", description: "قالب‌های وب‌سایت شرکتی و سازمانی" },
  ];
  const catIds: number[] = [];
  for (let i = 0; i < catDefs.length; i++) {
    const [c] = await db.insert(categories).values({ ...catDefs[i], sortOrder: i }).returning({ id: categories.id });
    catIds.push(c.id);
  }

  // Technologies
  const techDefs = [
    { name: "HTML", slug: "html", kind: "language" },
    { name: "CSS", slug: "css", kind: "language" },
    { name: "JavaScript", slug: "javascript", kind: "language" },
    { name: "TypeScript", slug: "typescript", kind: "language" },
    { name: "Tailwind CSS", slug: "tailwind-css", kind: "library" },
    { name: "Bootstrap", slug: "bootstrap", kind: "library" },
    { name: "React", slug: "react", kind: "framework" },
    { name: "Next.js", slug: "nextjs", kind: "framework" },
    { name: "Vue.js", slug: "vuejs", kind: "framework" },
    { name: "Angular", slug: "angular", kind: "framework" },
    { name: "WordPress", slug: "wordpress", kind: "cms" },
    { name: "Laravel", slug: "laravel", kind: "framework" },
  ];
  const techIds: Record<string, number> = {};
  for (let i = 0; i < techDefs.length; i++) {
    const [t] = await db.insert(technologies).values({ ...techDefs[i], sortOrder: i }).returning({ id: technologies.id });
    techIds[techDefs[i].slug] = t.id;
  }

  // Licenses
  const [licensePersonal] = await db.insert(licenses).values({ name: "لایسنس شخصی", key: "personal", description: "استفاده شخصی و غیرتجاری", multiplier: 1, sortOrder: 0 }).returning({ id: licenses.id });
  const [licenseCommercial] = await db.insert(licenses).values({ name: "لایسنس تجاری", key: "commercial", description: "استفاده در پروژه‌های تجاری و مشتری", multiplier: 1.8, sortOrder: 1 }).returning({ id: licenses.id });
  const [licenseExtended] = await db.insert(licenses).values({ name: "لایسنس نامحدود", key: "extended", description: "استفاده نامحدود برای آژانس‌ها", multiplier: 4, sortOrder: 2 }).returning({ id: licenses.id });
  const licenseIds = [licensePersonal.id, licenseCommercial.id, licenseExtended.id];

  // Review criteria
  await db.insert(reviewCriteria).values([
    { key: "design", name: "کیفیت طراحی", sortOrder: 0 },
    { key: "code", name: "کیفیت کد", sortOrder: 1 },
    { key: "docs", name: "مستندات", sortOrder: 2 },
    { key: "usability", name: "سهولت استفاده", sortOrder: 3 },
    { key: "performance", name: "عملکرد", sortOrder: 4 },
    { key: "support", name: "پشتیبانی", sortOrder: 5 },
  ]);

  // Tags
  const tagNames = ["ریسپانسیو", "راست‌چین", "سئو", "سریع", "چندزبانه", "دارک مود"];
  const tagIds: Record<string, number> = {};
  for (const name of tagNames) {
    const [t] = await db.insert(tags).values({ name, slug: name.toLowerCase().replace(/\s+/g, "-") }).returning({ id: tags.id });
    tagIds[name] = t.id;
  }

  // Products
  type ProductDef = {
    seller: number;
    title: string;
    slug: string;
    short: string;
    desc: string;
    category: number;
    price: number;
    salePrice?: number;
    image: string;
    version: string;
    features: string[];
    requirements: string[];
    techs: string[];
    tags?: string[];
    featured?: boolean;
    trending?: boolean;
    staffPick?: boolean;
    status?: string;
    demoUrl?: string;
  };

  const P: ProductDef[] = [
    {
      seller: 2, title: "قالب فروشگاهی شاپینو", slug: "shopino-ecommerce", category: 4, price: 1850000, salePrice: 1290000,
      short: "قالب HTML فروشگاهی مدرن و سریع با طراحی ریسپانسیو، مناسب فروشگاه‌های اینترنتی.",
      desc: "شاپینو یک قالب فروشگاهی کامل و بهینه است که برای فروشگاه‌های اینترنتی طراحی شده. این قالب شامل صفحه اصلی، صفحه محصول، سبد خرید، وبلاگ و فرم‌های تماس است.\n\nویژگی‌های برجسته:\n• طراحی کاملاً ریسپانسیو و سازگار با موبایل\n• بهینه‌سازی شده برای سرعت بارگذاری\n• ساختار سئو شده با تگ‌های معنایی\n• پشتیبانی از حالت تاریک",
      image: IMG.ecommerce, version: "2.4.0", features: ["طراحی ریسپانسیو", "سئو شده", "حالت تاریک", "صفحات داخلی کامل", "فونت فارسی"], requirements: ["مرورگر مدرن", "دانش HTML/CSS پایه"], techs: ["html", "css", "javascript", "bootstrap"], tags: ["ریسپانسیو", "راست‌چین", "سئو"], featured: true, trending: true, demoUrl: "https://example.com/demo/shopino",
    },
    {
      seller: 0, title: "داشبورد مدیریتی آتریا", slug: "atria-admin-dashboard", category: 5, price: 2900000, salePrice: 2450000,
      short: "پنل مدیریتی React با بیش از ۴۰ کامپوننت، نمودار و صفحات آماده.",
      desc: "آتریا یک داشبورد مدیریتی جامع ساخته‌شده با React و Tailwind CSS است. این پنل شامل نمودارها، جداول، فرم‌ها و صفحات احراز هویت است و برای شروع سریع پروژه‌های مدیریتی ایده‌آل است.",
      image: IMG.admin, version: "3.1.0", features: ["۴۰+ کامپوننت", "نمودارهای تعاملی", "React + TypeScript", "Tailwind CSS", "احراز هویت آماده"], requirements: ["Node.js 18+", "آشنایی با React"], techs: ["react", "typescript", "tailwind-css"], tags: ["ریسپانسیو", "دارک مود"], featured: true, staffPick: true, demoUrl: "https://example.com/demo/atria",
    },
    {
      seller: 3, title: "قالب شرکتی نگار", slug: "negar-corporate", category: 9, price: 980000,
      short: "قالب شرکتی شیک برای معرفی کسب‌وکار، خدمات و تیم شما.",
      desc: "قالب نگار یک وب‌سایت شرکتی حرفه‌ای با طراحی مینیمال است که برای معرفی شرکت‌ها، خدمات و تیم کاری مناسب است.",
      image: IMG.corporate, version: "1.8.0", features: ["طراحی مینیمال", "بخش خدمات و تیم", "فرم تماس", "بهینه سرعت"], requirements: ["مرورگر مدرن"], techs: ["html", "css", "bootstrap"], tags: ["ریسپانسیو"],
    },
    {
      seller: 3, title: "قالب نمونه کار پرتره", slug: "portra-portfolio", category: 8, price: 690000, salePrice: 490000,
      short: "پورتفولیوی خلاقانه برای طراحان و فریلنسرها با گالری پروژه.",
      desc: "پرتره یک قالب نمونه کار مدرن و خلاقانه برای طراحان، عکاسان و فریلنسرهاست که پروژه‌ها را به شکلی چشمنواز نمایش می‌دهد.",
      image: IMG.portfolio, version: "1.2.0", features: ["گالری پروژه", "انیمیشن‌های ظریف", "بخش رزومه", "حالت تاریک"], requirements: ["مرورگر مدرن"], techs: ["html", "css", "javascript"], tags: ["دارک مود"], trending: true,
    },
    {
      seller: 0, title: "لندینگ استارتاپ نوا", slug: "nova-saas-landing", category: 7, price: 1150000, salePrice: 890000,
      short: "صفحه فرود SaaS با طراحی گرادیانی و بخش‌های قیمت‌گذاری و معرفی.",
      desc: "نوا یک لندینگ‌پیج حرفه‌ای برای استارتاپ‌ها و محصولات SaaS است که با تمرکز بر نرخ تبدیل طراحی شده است.",
      image: IMG.landing, version: "2.0.0", features: ["بخش قیمت‌گذاری", "CTA های متعدد", "تایمونیم مشتریان", "سازگار موبایل"], requirements: ["مرورگر مدرن"], techs: ["html", "css", "tailwind-css"], tags: ["ریسپانسیو"], featured: true, trending: true,
    },
    {
      seller: 1, title: "قالب مجله‌ای کاغذ", slug: "kaghaz-magazine", category: 0, price: 540000,
      short: "قالب بلاگ و مجله با تایپوگرافی عالی و چیدمان محتوایی.",
      desc: "کاغذ یک قالب مجله‌ای برای بلاگ‌ها و سایت‌های خبری است که با تایپوگرافی فارسی بهینه طراحی شده است.",
      image: IMG.blog, version: "1.5.0", features: ["تایپوگرافی فارسی", "صفحه مقاله", "دسته‌بندی و برچسب", "سئو شده"], requirements: ["مرورگر مدرن"], techs: ["html", "css", "javascript"], tags: ["سئو"],
    },
    {
      seller: 1, title: "قالب وردپرس کسب‌وکار ویار", slug: "viyar-wordpress-business", category: 3, price: 1650000,
      short: "قالب وردپرس فارسی با المنتور و ووکامرس برای سایت‌های شرکتی.",
      desc: "ویار یک قالب وردپرس فارسی است که با صفحه‌ساز المنتور و ووکامرس کاملاً سازگار است.",
      image: IMG.corporate, version: "4.2.0", features: ["سازگار با المنتور", "پشتیبانی ووکامرس", "فارسی و راست‌چین", "دموی یک‌کلیکی"], requirements: ["وردپرس 6+"], techs: ["wordpress", "css"], tags: ["راست‌چین"], featured: true,
    },
    {
      seller: 2, title: "قالب فروشگاهی الکترون", slug: "electron-store", category: 4, price: 2150000,
      short: "قالب فروشگاهی HTML با سبد خرید، صفحه محصول و فیلتر پیشرفته.",
      desc: "الکترون یک قالب فروشگاهی قدرتمند با صفحات محصول، دسته‌بندی، سبد خرید و تسویه حساب است.",
      image: IMG.ecommerce, version: "3.0.0", features: ["سبد خرید", "فیلتر محصولات", "صفحه محصول کامل", "ووکامرس فرانت"], requirements: ["مرورگر مدرن"], techs: ["html", "css", "javascript", "bootstrap"], tags: ["ریسپانسیو", "سریع"], trending: true,
    },
    {
      seller: 3, title: "داشبورد مدیریتی پالس", slug: "pulse-admin", category: 5, price: 2600000, salePrice: 2100000,
      short: "پنل ادمین سبک و مدرن با Vue و Tailwind برای مدیریت محصولات.",
      desc: "پالس یک داشبورد مدیریتی سریع ساخته‌شده با Vue.js است که برای مدیریت فروشگاه و محصولات مناسب است.",
      image: IMG.admin, version: "1.9.0", features: ["Vue 3", "نمودارها", "جداول داده", "مدیریت نقش"], requirements: ["Node.js 18+"], techs: ["vuejs", "javascript", "tailwind-css"], tags: ["دارک مود"], staffPick: true,
    },
    {
      seller: 0, title: "قالب Next.js فروشگاهی نِکست‌شاپ", slug: "nextshop", category: 2, price: 3200000, salePrice: 2750000,
      short: "فروشگاه اینترنتی کامل با Next.js App Router، سبد خرید و پرداخت.",
      desc: "نکست‌شاپ یک فروشگاه کامل ساخته‌شده با Next.js است که از رندر سمت سرور، سئو قوی و عملکرد بالا بهره می‌برد.",
      image: IMG.ecommerce, version: "1.3.0", features: ["Next.js App Router", "Server Components", "سئو قدرتمند", "سبد خرید و پرداخت"], requirements: ["Node.js 20+", "PostgreSQL"], techs: ["nextjs", "react", "typescript", "tailwind-css"], tags: ["سئو", "سریع"], featured: true, trending: true, staffPick: true, demoUrl: "https://example.com/demo/nextshop",
    },
    {
      seller: 1, title: "UI Kit دیزاین سیستم ریحان", slug: "reyhan-ui-kit", category: 6, price: 790000,
      short: "کیت رابط کاربری کامل با ۱۲۰+ کامپوننت در Figma و HTML.",
      desc: "ریحان یک سیستم طراحی کامل شامل کامپوننت‌های آماده در Figma و پیاده‌سازی HTML/Tailwind است.",
      image: IMG.landing, version: "2.1.0", features: ["۱۲۰+ کامپوننت", "فایل Figma", "Tailwind CSS", "تم روشن و تاریک"], requirements: ["Figma (برای فایل طراحی)"], techs: ["html", "tailwind-css"], tags: ["دارک مود"],
    },
    {
      seller: 2, title: "قالب لندینگ محصول مینو", slug: "minu-landing", category: 7, price: 460000, salePrice: 320000,
      short: "لندینگ‌پیج تک‌صفحه برای معرفی محصول یا اپلیکیشن.",
      desc: "مینو یک صفحه فرود تک‌صفحه و سبک است که برای معرفی اپلیکیشن‌ها و محصولات دیجیتال طراحی شده.",
      image: IMG.landing, version: "1.0.0", features: ["تک‌صفحه", "انیمیشن اسکرول", "فرم ثبت‌نام", "سبک و سریع"], requirements: ["مرورگر مدرن"], techs: ["html", "css"], tags: ["سریع"],
    },
    {
      seller: 3, title: "قالب شرکتی سیگما", slug: "sigma-corporate", category: 9, price: 880000,
      short: "وب‌سایت شرکتی چندصفحه با بخش خدمات، پروژه‌ها و وبلاگ.",
      desc: "سیگما یک قالب شرکتی چندصفحه برای سازمان‌ها و شرکت‌های بزرگ با بخش‌های متنوع است.",
      image: IMG.corporate, version: "1.4.0", features: ["چندصفحه", "بخش پروژه‌ها", "وبلاگ", "فرم استخدام"], requirements: ["مرورگر مدرن"], techs: ["html", "css", "javascript", "bootstrap"], tags: ["ریسپانسیو"],
    },
    {
      seller: 0, title: "داشبورد آنالیتیکس لومینا", slug: "lumina-analytics", category: 5, price: 2450000,
      short: "داشبورد تحلیلی React برای نمایش متریک‌ها و گزارش‌ها.",
      desc: "لومینا یک داشبورد تحلیلی با نمودارهای تعاملی برای نمایش داده‌ها و گزارش‌هاست.",
      image: IMG.admin, version: "2.6.0", features: ["نمودارهای تعاملی", "فیلتر تاریخ", "گزارش صادرات", "تم تاریک"], requirements: ["Node.js 18+"], techs: ["react", "typescript", "tailwind-css"], tags: ["دارک مود"], trending: true,
    },
    {
      seller: 1, title: "قالب نمونه کار استودیو", slug: "studio-portfolio", category: 8, price: 720000,
      short: "پورتفولیوی آژانسی با نمایش پروژه‌ها و تیم.",
      desc: "استودیو یک قالب پورتفولیو برای آژانس‌های خلاق با نمایش پروژه‌ها، خدمات و اعضای تیم است.",
      image: IMG.portfolio, version: "1.1.0", features: ["نمایش پروژه", "بخش خدمات", "تیم", "اسلایدر"], requirements: ["مرورگر مدرن"], techs: ["html", "css", "javascript"], tags: ["ریسپانسیو"],
    },
    {
      seller: 2, title: "قالب وردپرس فروشگاهی بازار", slug: "bazaar-woocommerce", category: 3, price: 1900000, salePrice: 1500000,
      short: "قالب وردپرس فروشگاهی کامل با ووکامرس و طراحی موبایل‌فرست.",
      desc: "بازار یک قالب فروشگاهی وردپرس با تمرکز بر تجربه کاربری موبایل و سرعت است.",
      image: IMG.ecommerce, version: "5.0.0", features: ["ووکامرس", "موبایل‌فرست", "فیلتر پیشرفته", "اسلایدر محصولات"], requirements: ["وردپرس 6+", "ووکامرس"], techs: ["wordpress", "css"], tags: ["ریسپانسیو", "سریع"], featured: true,
    },
    {
      seller: 3, title: "قالب بلاگ فارسی واژه", slug: "vajeh-blog", category: 0, price: 380000,
      short: "قالب بلاگ مینیمال با تمرکز بر خوانایی متن فارسی.",
      desc: "واژه یک قالب بلاگ مینیمال و خوانا است که برای نویسندگان و وبلاگ‌نویسان فارسی طراحی شده.",
      image: IMG.blog, version: "1.0.0", features: ["تایپوگرافی خوانا", "حالت مطالعه", "برچسب‌ها", "سئو"], requirements: ["مرورگر مدرن"], techs: ["html", "css"], tags: ["سئو"],
    },
    {
      seller: 0, title: "قالب React کامپوننت آرک", slug: "arc-react-components", category: 1, price: 1350000,
      short: "مجموعه کامپوننت‌های React آماده برای ساخت سریع رابط کاربری.",
      desc: "آرک مجموعه‌ای از کامپوننت‌های React باکیفیت است که توسعه رابط کاربری را سریع‌تر می‌کند.",
      image: IMG.landing, version: "1.6.0", features: ["TypeScript", "کامپوننت‌های قابل ترکیب", "Storybook", "تست‌شده"], requirements: ["Node.js 18+", "React 18+"], techs: ["react", "typescript", "tailwind-css"], tags: ["سریع"], staffPick: true,
    },
    {
      seller: 1, title: "قالب شرکتی در حال بررسی", slug: "pending-corporate-demo", category: 9, price: 600000,
      short: "نمونه محصول در انتظار بررسی (برای دموی فرآیند مدیریت).",
      desc: "این محصول نمونه‌ای از یک محصول ارسال‌شده برای بررسی است و در بازارچه عمومی نمایش داده نمی‌شود.",
      image: IMG.corporate, version: "1.0.0", features: ["ویژگی نمونه"], requirements: ["نیازمندی نمونه"], techs: ["html", "css"], status: "SUBMITTED",
    },
  ];

  const productIds: number[] = [];
  for (const p of P) {
    const [prod] = await db
      .insert(products)
      .values({
        sellerId: sellerIds[p.seller],
        title: p.title,
        slug: p.slug,
        shortDescription: p.short,
        description: p.desc,
        categoryId: catIds[p.category],
        price: p.price,
        salePrice: p.salePrice ?? null,
        status: (p.status as never) ?? "PUBLISHED",
        isFeatured: p.featured ?? false,
        isTrending: p.trending ?? false,
        isStaffPick: p.staffPick ?? false,
        currentVersion: p.version,
        lastUpdatedAt: new Date(),
        publishedAt: p.status === "SUBMITTED" ? null : new Date(),
        demoUrl: p.demoUrl,
        documentationUrl: "https://example.com/docs",
        supportNote: "پشتیبانی و به‌روزرسانی رایگان تا ۶ ماه",
        seoTitle: p.title,
        seoDescription: p.short,
        salesCount: Math.floor(Math.random() * 400) + 10,
        ratingAvg: 0,
        ratingCount: 0,
        views: Math.floor(Math.random() * 5000) + 200,
      })
      .returning({ id: products.id });
    productIds.push(prod.id);

    await db.insert(productImages).values([
      { productId: prod.id, url: p.image, alt: p.title, isPrimary: true, sortOrder: 0 },
      { productId: prod.id, url: "/images/placeholder-product.svg", alt: `${p.title} - نمای دوم`, isPrimary: false, sortOrder: 1 },
    ]);

    for (let i = 0; i < p.features.length; i++) {
      await db.insert(productFeatures).values({ productId: prod.id, text: p.features[i], sortOrder: i });
    }
    for (let i = 0; i < p.requirements.length; i++) {
      await db.insert(productRequirements).values({ productId: prod.id, text: p.requirements[i], sortOrder: i });
    }
    for (const slug of p.techs) {
      if (techIds[slug]) {
        await db.insert(productTechnologies).values({ productId: prod.id, technologyId: techIds[slug] }).onConflictDoNothing();
      }
    }
    for (const tag of p.tags ?? []) {
      if (tagIds[tag]) {
        await db.insert(productTags).values({ productId: prod.id, tagId: tagIds[tag] }).onConflictDoNothing();
      }
    }
    for (const lid of licenseIds) {
      await db.insert(productLicenses).values({ productId: prod.id, licenseId: lid });
    }
    await db.insert(productVersions).values({
      productId: prod.id,
      version: p.version,
      releaseDate: new Date(),
      changelog: "انتشار اولیه محصول",
      fileKey: `products/${prod.id}/${p.version}.zip`,
      fileSize: Math.floor(Math.random() * 4000000) + 500000,
      isActive: true,
    });
  }

  // Update seller totals
  for (let i = 0; i < sellerIds.length; i++) {
    const count = P.filter((p) => p.seller === i).length;
    await db.update(sellers).set({ totalProducts: count }).where(eq(sellers.id, sellerIds[i]));
  }

  // Reviews
  const reviewData = [
    { product: 0, user: customer.id, rating: 5, title: "عالی و کاربردی", content: "قالب بسیار تمیز و خوش‌ساخت است. نصب و راه‌اندازی آن ساده بود و پشتیبانی هم سریع پاسخ داد." },
    { product: 1, user: customer.id, rating: 4, title: "کامل و حرفه‌ای", content: "کامپوننت‌ها باکیفیت هستند، فقط مستندات می‌توانست کامل‌تر باشد." },
    { product: 4, user: customer.id, rating: 5, title: "نرخ تبدیل عالی", content: "برای کمپین تبلیغاتی استفاده کردم و نتیجه خوبی گرفتم." },
  ];
  const reviewIds: number[] = [];
  for (const r of reviewData) {
    const [rev] = await db
      .insert(reviews)
      .values({
        productId: productIds[r.product],
        userId: r.user,
        rating: r.rating,
        title: r.title,
        content: r.content,
        status: "PUBLISHED",
        sellerReply: r.rating < 5 ? "ممنون از بازخورد شما، حتماً مستندات را بهبود می‌دهیم." : null,
        sellerRepliedAt: r.rating < 5 ? new Date() : null,
      })
      .returning({ id: reviews.id });
    reviewIds.push(rev.id);
  }

  // Questions
  await db.insert(questions).values([
    { productId: productIds[0], userId: customer.id, question: "آیا این قالب با ووکامرس هم سازگار است؟", sellerAnswer: "نسخه HTML آن به صورت فرانت آماده است و برای وردپرس نسخه جداگانه داریم.", answeredAt: new Date() },
    { productId: productIds[1], userId: customer.id, question: "نمودارها از چه کتابخانه‌ای استفاده می‌کنند؟", sellerAnswer: "نمودارها با Chart.js پیاده‌سازی شده‌اند.", answeredAt: new Date() },
    { productId: productIds[4], userId: customer.id, question: "آیا فایل طراحی Figma هم ارائه می‌شود؟" },
  ]);

  // Collections
  const [col1] = await db.insert(collections).values({ name: "منتخب سردبیر", slug: "staff-picks", description: "بهترین قالب‌های هفته از نگاه تیم قالبی نو", kind: "MANUAL", sortOrder: 0 }).returning({ id: collections.id });
  const [col2] = await db.insert(collections).values({ name: "قالب‌های فروشگاهی", slug: "ecommerce-collection", description: "مجموعه‌ای برای راه‌اندازی فروشگاه آنلاین", kind: "MANUAL", sortOrder: 1 }).returning({ id: collections.id });
  const [col3] = await db.insert(collections).values({ name: "داشبورد و پنل مدیریت", slug: "dashboards", description: "پنل‌های مدیریتی و آنالیتیکس", kind: "MANUAL", sortOrder: 2 }).returning({ id: collections.id });

  const colProducts: Record<number, number[]> = {
    [col1.id]: [0, 1, 4, 9],
    [col2.id]: [0, 7, 10, 15],
    [col3.id]: [1, 8, 13],
  };
  for (const [colId, prods] of Object.entries(colProducts)) {
    for (let i = 0; i < prods.length; i++) {
      await db.insert(collectionProducts).values({ collectionId: Number(colId), productId: productIds[prods[i]], sortOrder: i });
    }
  }

  // Blog posts
  await db.insert(blogPosts).values([
    { authorId: admin.id, title: "چگونه بهترین قالب را برای پروژه خود انتخاب کنیم؟", slug: "how-to-choose-a-template", excerpt: "راهنمای جامع انتخاب قالب مناسب بر اساس نیاز، تکنولوژی و بودجه.", content: "انتخاب قالب مناسب یکی از مهم‌ترین تصمیم‌ها در شروع یک پروژه وب است.\n\nدر این مقاله نکات کلیدی انتخاب قالب را بررسی می‌کنیم: ابتدا نیازهای پروژه را مشخص کنید، سپس تکنولوژی مورد نظر را انتخاب و در نهایت کیفیت کد و پشتیبانی فروشنده را بسنجید.", coverImage: IMG.landing, status: "PUBLISHED", publishedAt: new Date(), seoTitle: "راهنمای انتخاب قالب" },
    { authorId: admin.id, title: "مقایسه React و Next.js برای پروژه‌های فروشگاهی", slug: "react-vs-nextjs", excerpt: "کدام فریمورک برای فروشگاه اینترنتی شما مناسب‌تر است؟", content: "در این مقاله React و Next.js را از نظر سئو، عملکرد و تجربه توسعه‌دهنده مقایسه می‌کنیم.\n\nNext.js به دلیل رندر سمت سرور برای فروشگاه‌های اینترنتی انتخاب بهتری است.", coverImage: IMG.ecommerce, status: "PUBLISHED", publishedAt: new Date(), seoTitle: "مقایسه React و Next.js" },
    { authorId: admin.id, title: "راهنمای شروع فروشندگی در مارکت‌پلیس‌ها", slug: "become-a-seller-guide", excerpt: "چگونه قالب‌های خود را بفروشید و درآمد کسب کنید.", content: "فروش قالب در مارکت‌پلیس‌ها می‌تواند منبع درآمد پایداری باشد.\n\nدر این مقاله مراحل آماده‌سازی، انتشار و بهینه‌سازی محصول را مرور می‌کنیم.", coverImage: IMG.corporate, status: "PUBLISHED", publishedAt: new Date(), seoTitle: "راهنمای فروشندگی" },
  ]);

  // Coupons
  await db.insert(coupons).values([
    { code: "GHALEBI10", type: "PERCENT", value: 10, minOrder: 0, scope: "PLATFORM", isActive: true },
    { code: "WELCOME500", type: "FIXED", value: 50000, minOrder: 500000, scope: "PLATFORM", isActive: true },
  ]);

  // A paid order for the demo customer (to enable downloads + verified reviews)
  async function createOrder(productIndex: number, licenseIndex: number) {
    const basePrice = P[productIndex].salePrice ?? P[productIndex].price;
    const multiplier = [1, 1.8, 4][licenseIndex];
    const unitPrice = Math.round(basePrice * multiplier);
    const sellerShare = Math.round(unitPrice * 0.8);
    const platformFee = unitPrice - sellerShare;

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber: `GHB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
        userId: customer.id,
        status: "PAID",
        subtotal: unitPrice,
        discount: 0,
        total: unitPrice,
        platformFee,
        paymentMethod: "mock",
        paidAt: new Date(),
      })
      .returning({ id: orders.id });

    const [item] = await db
      .insert(orderItems)
      .values({
        orderId: order.id,
        productId: productIds[productIndex],
        sellerId: sellerIds[P[productIndex].seller],
        licenseId: licenseIds[licenseIndex],
        productTitle: P[productIndex].title,
        licenseName: ["لایسنس شخصی", "لایسنس تجاری", "لایسنس نامحدود"][licenseIndex],
        unitPrice,
        discount: 0,
        finalPrice: unitPrice,
        sellerShare,
        platformFee,
      })
      .returning({ id: orderItems.id });

    await db.insert(payments).values({
      orderId: order.id,
      userId: customer.id,
      provider: "mock",
      providerRef: `MOCK-${order.id}`,
      amount: unitPrice,
      status: "SUCCEEDED",
      paidAt: new Date(),
    });

    await db.insert(transactions).values({
      sellerId: sellerIds[P[productIndex].seller],
      type: "SALE",
      amount: sellerShare,
      balanceAfter: sellerShare,
      referenceType: "order_item",
      referenceId: item.id,
      description: `فروش «${P[productIndex].title}»`,
    });

    await db.insert(downloads).values({
      userId: customer.id,
      orderItemId: item.id,
      productId: productIds[productIndex],
      versionId: 0,
      ipHash: "seed",
    });

    await db
      .update(products)
      .set({ salesCount: products.salesCount })
      .where(eq(products.id, productIds[productIndex]));

    return order;
  }

  await createOrder(0, 1);
  await createOrder(1, 0);
  await createOrder(4, 0);

  // Fix rating aggregates for reviewed products
  for (const r of reviewData) {
    const pid = productIds[r.product];
    const rows = await db.select({ rating: reviews.rating }).from(reviews).where(eq(reviews.productId, pid));
    const avg = rows.length ? rows.reduce((s, x) => s + x.rating, 0) / rows.length : 0;
    await db.update(products).set({ ratingAvg: Math.round(avg * 10) / 10, ratingCount: rows.length }).where(eq(products.id, pid));
  }

  console.log("Seed completed successfully.");
  console.log("Demo accounts (password: password123):");
  console.log("  Admin:    admin@ghalebi.local");
  console.log("  Seller:   seller@ghalebi.local");
  console.log("  Customer: customer@ghalebi.local");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
