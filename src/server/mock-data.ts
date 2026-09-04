import type {
  CartLine,
  OrderRow,
  ProductDetail,
  ProductListItem,
  SellerPublic,
  TechnologyRef,
} from "@/lib/types";

const now = new Date();

export const mockCategories = [
  {
    id: 1,
    name: "وردپرس",
    slug: "wordpress",
    description: "قالب‌های حرفه‌ای وردپرس",
    icon: "LayoutTemplate",
    imageUrl: null,
    parentId: null,
    sortOrder: 1,
    isVisible: true,
    seoTitle: "قالب وردپرس",
    seoDescription: "بهترین قالب‌های وردپرس",
    createdAt: now,
  },
  {
    id: 2,
    name: "فروشگاهی",
    slug: "ecommerce",
    description: "قالب‌های فروشگاهی مدرن",
    icon: "ShoppingBag",
    imageUrl: null,
    parentId: null,
    sortOrder: 2,
    isVisible: true,
    seoTitle: "قالب فروشگاهی",
    seoDescription: "قالب‌های حرفه‌ای فروشگاهی",
    createdAt: now,
  },
  {
    id: 3,
    name: "شرکتی",
    slug: "corporate",
    description: "قالب‌های شرکتی و سازمانی",
    icon: "Building2",
    imageUrl: null,
    parentId: null,
    sortOrder: 3,
    isVisible: true,
    seoTitle: "قالب شرکتی",
    seoDescription: "قالب‌های حرفه‌ای شرکتی",
    createdAt: now,
  },
  {
    id: 4,
    name: "HTML",
    slug: "html",
    description: "قالب‌های HTML حرفه‌ای",
    icon: "Code2",
    imageUrl: null,
    parentId: null,
    sortOrder: 4,
    isVisible: true,
    seoTitle: "قالب HTML",
    seoDescription: "قالب‌های HTML مدرن",
    createdAt: now,
  },
  {
    id: 5,
    name: "React",
    slug: "react",
    description: "قالب‌های React",
    icon: "Atom",
    imageUrl: null,
    parentId: null,
    sortOrder: 5,
    isVisible: true,
    seoTitle: "قالب React",
    seoDescription: "قالب‌های حرفه‌ای React",
    createdAt: now,
  },
  {
    id: 6,
    name: "Next.js",
    slug: "nextjs",
    description: "قالب‌های Next.js",
    icon: "Layers",
    imageUrl: null,
    parentId: null,
    sortOrder: 6,
    isVisible: true,
    seoTitle: "قالب Next.js",
    seoDescription: "قالب‌های حرفه‌ای Next.js",
    createdAt: now,
  },
];

export const mockTechnologies = [
  {
    id: 1,
    name: "Next.js",
    slug: "nextjs",
    kind: "framework",
    icon: "Layers",
    sortOrder: 1,
    isVisible: true,
    createdAt: now,
  },
  {
    id: 2,
    name: "React",
    slug: "react",
    kind: "framework",
    icon: "Atom",
    sortOrder: 2,
    isVisible: true,
    createdAt: now,
  },
  {
    id: 3,
    name: "WordPress",
    slug: "wordpress",
    kind: "cms",
    icon: "Globe",
    sortOrder: 3,
    isVisible: true,
    createdAt: now,
  },
  {
    id: 4,
    name: "Tailwind CSS",
    slug: "tailwind-css",
    kind: "css",
    icon: "Palette",
    sortOrder: 4,
    isVisible: true,
    createdAt: now,
  },
  {
    id: 5,
    name: "TypeScript",
    slug: "typescript",
    kind: "language",
    icon: "Code2",
    sortOrder: 5,
    isVisible: true,
    createdAt: now,
  },
  {
    id: 6,
    name: "HTML",
    slug: "html",
    kind: "markup",
    icon: "Code",
    sortOrder: 6,
    isVisible: true,
    createdAt: now,
  },
];

export const mockUsers = [
  {
    id: 1,
    email: "admin@ghalebino.test",
    passwordHash: "mock",
    name: "مدیر قالبی نو",
    role: "ADMIN" as const,
    status: "ACTIVE" as const,
    avatarUrl: null,
    bio: "مدیریت قالبی نو",
    emailVerifiedAt: now,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    email: "seller@ghalebino.test",
    passwordHash: "mock",
    name: "علی احمدی",
    role: "SELLER" as const,
    status: "ACTIVE" as const,
    avatarUrl: null,
    bio: "طراح و توسعه‌دهنده وب",
    emailVerifiedAt: now,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    email: "customer@ghalebino.test",
    passwordHash: "mock",
    name: "کاربر آزمایشی",
    role: "CUSTOMER" as const,
    status: "ACTIVE" as const,
    avatarUrl: null,
    bio: null,
    emailVerifiedAt: now,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockSellers = [
  {
    id: 1,
    userId: 2,
    username: "no-digital",
    storeName: "استودیو دیجیتال نو",
    tagline: "طراحی قالب‌های مدرن و حرفه‌ای",
    bio: "تیم طراحی و توسعه قالب‌های حرفه‌ای برای کسب‌وکارهای ایرانی",
    avatarUrl: null,
    coverUrl: null,
    rating: 4.9,
    ratingCount: 128,
    totalSales: 1840,
    totalProducts: 24,
    responseTime: "کمتر از ۲ ساعت",
    status: "ACTIVE" as const,
    approvedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockProducts = [
  {
    id: 1,
    sellerId: 1,
    title: "قالب فروشگاهی نئوشاپ",
    slug: "neoshop",
    shortDescription: "قالب فروشگاهی مدرن با Next.js و Tailwind CSS",
    description:
      "قالب فروشگاهی حرفه‌ای و سریع مناسب فروشگاه‌های آنلاین مدرن.",
    categoryId: 2,
    price: 890000,
    salePrice: 690000,
    status: "PUBLISHED" as const,
    isFeatured: true,
    isTrending: true,
    isStaffPick: true,
    currentVersion: "2.4.0",
    lastUpdatedAt: now,
    publishedAt: now,
    views: 18420,
    salesCount: 384,
    ratingAvg: 4.9,
    ratingCount: 87,
    demoUrl: "https://example.com",
    documentationUrl: null,
    supportNote: "پشتیبانی ۶ ماهه",
    seoTitle: "قالب فروشگاهی نئوشاپ",
    seoDescription: "قالب حرفه‌ای فروشگاهی Next.js",
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    sellerId: 1,
    title: "قالب شرکتی آریا",
    slug: "aria-corporate",
    shortDescription: "قالب شرکتی حرفه‌ای و واکنش‌گرا",
    description: "قالب مدرن برای شرکت‌ها، استارتاپ‌ها و سازمان‌ها.",
    categoryId: 3,
    price: 720000,
    salePrice: null,
    status: "PUBLISHED" as const,
    isFeatured: true,
    isTrending: false,
    isStaffPick: true,
    currentVersion: "1.8.2",
    lastUpdatedAt: now,
    publishedAt: now,
    views: 12600,
    salesCount: 245,
    ratingAvg: 4.8,
    ratingCount: 62,
    demoUrl: "https://example.com",
    documentationUrl: null,
    supportNote: "پشتیبانی ۳ ماهه",
    seoTitle: "قالب شرکتی آریا",
    seoDescription: "قالب حرفه‌ای شرکتی",
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    sellerId: 1,
    title: "قالب داشبورد نکسوس",
    slug: "nexus-dashboard",
    shortDescription: "داشبورد مدیریتی حرفه‌ای با React و Tailwind",
    description: "مجموعه کامل صفحات داشبورد برای پروژه‌های SaaS.",
    categoryId: 5,
    price: 650000,
    salePrice: 490000,
    status: "PUBLISHED" as const,
    isFeatured: false,
    isTrending: true,
    isStaffPick: false,
    currentVersion: "3.1.0",
    lastUpdatedAt: now,
    publishedAt: now,
    views: 22100,
    salesCount: 517,
    ratingAvg: 4.7,
    ratingCount: 114,
    demoUrl: "https://example.com",
    documentationUrl: null,
    supportNote: "پشتیبانی ۶ ماهه",
    seoTitle: "قالب داشبورد نکسوس",
    seoDescription: "قالب داشبورد React",
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    sellerId: 1,
    title: "قالب وردپرس مگاپرس",
    slug: "megapress",
    shortDescription: "قالب مجله و خبری حرفه‌ای وردپرس",
    description: "قالب سریع و حرفه‌ای برای سایت‌های خبری و مجله‌ای.",
    categoryId: 1,
    price: 590000,
    salePrice: null,
    status: "PUBLISHED" as const,
    isFeatured: false,
    isTrending: true,
    isStaffPick: true,
    currentVersion: "5.2.1",
    lastUpdatedAt: now,
    publishedAt: now,
    views: 31900,
    salesCount: 742,
    ratingAvg: 4.9,
    ratingCount: 156,
    demoUrl: "https://example.com",
    documentationUrl: null,
    supportNote: "پشتیبانی یک‌ساله",
    seoTitle: "قالب وردپرس مگاپرس",
    seoDescription: "قالب خبری وردپرس",
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    sellerId: 1,
    title: "قالب لندینگ فلکس",
    slug: "flex-landing",
    shortDescription: "لندینگ پیج مدرن برای محصولات و استارتاپ‌ها",
    description: "قالب سبک و سریع مناسب معرفی محصول و خدمات.",
    categoryId: 4,
    price: 390000,
    salePrice: 290000,
    status: "PUBLISHED" as const,
    isFeatured: true,
    isTrending: false,
    isStaffPick: false,
    currentVersion: "1.5.0",
    lastUpdatedAt: now,
    publishedAt: now,
    views: 9800,
    salesCount: 198,
    ratingAvg: 4.6,
    ratingCount: 43,
    demoUrl: "https://example.com",
    documentationUrl: null,
    supportNote: "پشتیبانی ۳ ماهه",
    seoTitle: "قالب لندینگ فلکس",
    seoDescription: "قالب Landing Page",
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    sellerId: 1,
    title: "قالب SaaS پرو",
    slug: "saas-pro",
    shortDescription: "قالب کامل SaaS با Next.js",
    description: "قالب آماده برای ساخت سریع محصولات SaaS.",
    categoryId: 6,
    price: 990000,
    salePrice: 790000,
    status: "PUBLISHED" as const,
    isFeatured: false,
    isTrending: true,
    isStaffPick: true,
    currentVersion: "2.0.0",
    lastUpdatedAt: now,
    publishedAt: now,
    views: 16400,
    salesCount: 321,
    ratingAvg: 4.8,
    ratingCount: 71,
    demoUrl: "https://example.com",
    documentationUrl: null,
    supportNote: "پشتیبانی ۶ ماهه",
    seoTitle: "قالب SaaS پرو",
    seoDescription: "قالب SaaS با Next.js",
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockProductImages = mockProducts.map((product, index) => ({
  id: index + 1,
  productId: product.id,
  url: `https://picsum.photos/seed/ghalebino-${product.id}/800/500`,
  alt: product.title,
  sortOrder: 0,
  isPrimary: true,
}));

export const mockProductFeatures = mockProducts.flatMap((product) => [
  {
    id: product.id * 10 + 1,
    productId: product.id,
    text: "کاملاً واکنش‌گرا",
    sortOrder: 1,
  },
  {
    id: product.id * 10 + 2,
    productId: product.id,
    text: "طراحی مدرن و حرفه‌ای",
    sortOrder: 2,
  },
  {
    id: product.id * 10 + 3,
    productId: product.id,
    text: "مستندات کامل",
    sortOrder: 3,
  },
]);

export const mockProductRequirements = mockProducts.flatMap((product) => [
  {
    id: product.id * 10 + 1,
    productId: product.id,
    text: "Node.js 20 یا بالاتر",
    sortOrder: 1,
  },
  {
    id: product.id * 10 + 2,
    productId: product.id,
    text: "npm یا pnpm",
    sortOrder: 2,
  },
]);

export const mockProductTechnologies = [
  { productId: 1, technologyId: 1 },
  { productId: 1, technologyId: 4 },
  { productId: 1, technologyId: 5 },
  { productId: 2, technologyId: 1 },
  { productId: 2, technologyId: 4 },
  { productId: 3, technologyId: 2 },
  { productId: 3, technologyId: 4 },
  { productId: 4, technologyId: 3 },
  { productId: 5, technologyId: 6 },
  { productId: 5, technologyId: 4 },
  { productId: 6, technologyId: 1 },
  { productId: 6, technologyId: 4 },
];

export const mockLicenses = [
  {
    id: 1,
    name: "شخصی",
    key: "PERSONAL",
    description: "استفاده در یک پروژه شخصی",
    terms: "یک دامنه و یک پروژه",
    multiplier: 1,
    sortOrder: 1,
  },
  {
    id: 2,
    name: "تجاری",
    key: "COMMERCIAL",
    description: "استفاده تجاری",
    terms: "استفاده در پروژه تجاری",
    multiplier: 1.8,
    sortOrder: 2,
  },
  {
    id: 3,
    name: "نامحدود",
    key: "UNLIMITED",
    description: "استفاده در پروژه‌های متعدد",
    terms: "استفاده نامحدود",
    multiplier: 3,
    sortOrder: 3,
  },
];

export const mockProductLicenses = mockProducts.flatMap((product) =>
  mockLicenses.map((license, index) => ({
    id: product.id * 10 + index + 1,
    productId: product.id,
    licenseId: license.id,
    price: null,
    isAvailable: true,
  })),
);

export const mockReviews = [
  {
    id: 1,
    productId: 1,
    userId: 4,
    orderItemId: 1,
    rating: 5,
    title: "فوق‌العاده",
    content: "قالب بسیار تمیز و حرفه‌ای بود.",
    status: "PUBLISHED" as const,
    helpfulVotes: 24,
    sellerReply: "ممنون از اعتماد شما.",
    sellerRepliedAt: now,
    createdAt: now,
  },
  {
    id: 2,
    productId: 3,
    userId: 4,
    orderItemId: 2,
    rating: 5,
    title: "عالی",
    content: "مستندات و ساختار پروژه خیلی خوبه.",
    status: "PUBLISHED" as const,
    helpfulVotes: 17,
    sellerReply: null,
    sellerRepliedAt: null,
    createdAt: now,
  },
];

export const mockQuestions = [
  {
    id: 1,
    productId: 1,
    userId: 4,
    question: "آیا سورس کامل قالب ارائه می‌شود؟",
    sellerAnswer: "بله، سورس کامل در اختیار خریدار قرار می‌گیرد.",
    answeredAt: now,
    status: "ANSWERED",
    createdAt: now,
  },
];

export const mockReviewCriteria = [
  { id: 1, key: "design", name: "طراحی", sortOrder: 1 },
  { id: 2, key: "code", name: "کیفیت کدنویسی", sortOrder: 2 },
  { id: 3, key: "documentation", name: "مستندات", sortOrder: 3 },
  { id: 4, key: "support", name: "پشتیبانی", sortOrder: 4 },
];

export const mockWishlist = [
  {
    userId: 4,
    productId: 1,
    createdAt: now,
  },
  {
    userId: 4,
    productId: 6,
    createdAt: now,
  },
];

export const mockComparisons = [
  {
    userId: 4,
    productId: 1,
    createdAt: now,
  },
  {
    userId: 4,
    productId: 6,
    createdAt: now,
  },
];

export const mockCartItems = [
  {
    id: 1,
    userId: 4,
    sessionKey: null,
    productId: 1,
    licenseId: 2,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockOrders = [
  {
    id: 1,
    orderNumber: "GN-100001",
    userId: 4,
    status: "COMPLETED" as const,
    subtotal: 690000,
    discount: 0,
    couponId: null,
    total: 690000,
    platformFee: 69000,
    paymentMethod: "mock",
    paidAt: now,
    refundedAt: null,
    cancellationReason: null,
    metadata: {},
    createdAt: now,
    updatedAt: now,
  },
];

export const mockOrderItems = [
  {
    id: 1,
    orderId: 1,
    productId: 1,
    sellerId: 1,
    licenseId: 2,
    productTitle: "قالب فروشگاهی نئوشاپ",
    licenseName: "تجاری",
    unitPrice: 690000,
    discount: 0,
    finalPrice: 690000,
    sellerShare: 621000,
    platformFee: 69000,
    createdAt: now,
  },
];

export const mockTransactions = [
  {
    id: 1,
    sellerId: 1,
    type: "SALE" as const,
    amount: 621000,
    balanceAfter: 621000,
    referenceType: "ORDER",
    referenceId: 1,
    description: "فروش قالب نئوشاپ",
    createdAt: now,
  },
];

export const mockWithdrawals = [
  {
    id: 1,
    sellerId: 1,
    amount: 300000,
    status: "REQUESTED" as const,
    method: "bank",
    accountDetails: "حساب تستی",
    adminNote: null,
    payoutReference: null,
    requestedAt: now,
    processedAt: null,
    processedBy: null,
  },
];

export const mockNotifications = [
  {
    id: 1,
    userId: 4,
    type: "ORDER",
    title: "خرید شما با موفقیت انجام شد",
    body: "قالب نئوشاپ به سفارش شما اضافه شد.",
    link: "/dashboard/orders/1",
    isRead: false,
    createdAt: now,
  },
];

export const mockSupportTickets = [
  {
    id: 1,
    ticketNumber: "TKT-10001",
    userId: 4,
    sellerId: 1,
    subject: "سؤال درباره نصب قالب",
    type: "PRODUCT",
    status: "OPEN" as const,
    priority: "NORMAL",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockSupportMessages = [
  {
    id: 1,
    ticketId: 1,
    authorId: 4,
    authorRole: "CUSTOMER",
    content: "سلام، برای نصب قالب راهنمایی می‌خواستم.",
    createdAt: now,
  },
  {
    id: 2,
    ticketId: 1,
    authorId: 2,
    authorRole: "SELLER",
    content: "سلام، مستندات نصب داخل فایل محصول قرار دارد.",
    createdAt: now,
  },
];

export const mockReports = [
  {
    id: 1,
    reporterId: 4,
    targetType: "PRODUCT",
    targetId: 1,
    reason: "OTHER",
    details: null,
    status: "OPEN",
    reviewerNote: null,
    reviewedAt: null,
    reviewedBy: null,
    createdAt: now,
  },
];

export const mockCoupons = [
  {
    id: 1,
    code: "WELCOME20",
    type: "PERCENT" as const,
    value: 20,
    minOrder: 300000,
    maxUses: 1000,
    usedCount: 37,
    expiresAt: new Date(now.getTime() + 30 * 86400000),
    scope: "PLATFORM" as const,
    sellerId: null,
    isActive: true,
    createdAt: now,
  },
];

export const mockCollections = [
  {
    id: 1,
    name: "منتخب قالبی نو",
    slug: "ghalebino-picks",
    description: "منتخب بهترین قالب‌های مارکت",
    kind: "MANUAL",
    imageUrl: null,
    isVisible: true,
    sortOrder: 1,
    createdAt: now,
  },
];

export const mockCollectionProducts = [
  {
    collectionId: 1,
    productId: 1,
    sortOrder: 1,
  },
  {
    collectionId: 1,
    productId: 3,
    sortOrder: 2,
  },
  {
    collectionId: 1,
    productId: 6,
    sortOrder: 3,
  },
];

export const mockBlogPosts = [
  {
    id: 1,
    authorId: 1,
    title: "چطور یک قالب حرفه‌ای برای پروژه انتخاب کنیم؟",
    slug: "how-to-choose-web-template",
    excerpt: "راهنمای انتخاب قالب مناسب برای پروژه‌های وب",
    content:
      "در انتخاب قالب باید به کیفیت کدنویسی، طراحی، مستندات و پشتیبانی توجه کنید.",
    coverImage: null,
    status: "PUBLISHED",
    publishedAt: now,
    seoTitle: "راهنمای انتخاب قالب",
    seoDescription: "چطور بهترین قالب سایت را انتخاب کنیم؟",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    authorId: 1,
    title: "Next.js چیست و چرا محبوب شده است؟",
    slug: "what-is-nextjs",
    excerpt: "آشنایی با Next.js و کاربردهای آن",
    content: "Next.js یک فریم‌ورک مدرن برای ساخت برنامه‌های React است.",
    coverImage: null,
    status: "PUBLISHED",
    publishedAt: now,
    seoTitle: "Next.js چیست؟",
    seoDescription: "معرفی Next.js",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockPages = [
  {
    id: 1,
    slug: "about",
    title: "درباره قالبی نو",
    content:
      "قالبی نو یک مارکت‌پلیس تخصصی برای خرید و فروش قالب‌های وب است.",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockSettings = [
  {
    key: "site_name",
    value: "قالبی نو",
    updatedAt: now,
  },
  {
    key: "support_email",
    value: "support@ghalebino.test",
    updatedAt: now,
  },
];

export function getMockSellerPublic(sellerId: number): SellerPublic | null {
  const seller = mockSellers.find((item) => item.id === sellerId);

  if (!seller) return null;

  return {
    id: seller.id,
    username: seller.username,
    storeName: seller.storeName,
    tagline: seller.tagline,
    bio: seller.bio,
    avatarUrl: seller.avatarUrl,
    coverUrl: seller.coverUrl,
    rating: seller.rating,
    ratingCount: seller.ratingCount,
    totalSales: seller.totalSales,
    totalProducts: seller.totalProducts,
    responseTime: seller.responseTime,
    joinedAt: seller.createdAt,
  };
}

export function getMockProductListItem(
  productId: number,
): ProductListItem | null {
  const product = mockProducts.find((item) => item.id === productId);

  if (!product) return null;

  const seller = mockSellers.find((item) => item.id === product.sellerId);
  const category = mockCategories.find(
    (item) => item.id === product.categoryId,
  );
  const image = mockProductImages.find(
    (item) => item.productId === product.id && item.isPrimary,
  );

  if (!seller || !category) return null;

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    shortDescription: product.shortDescription,
    price: product.price,
    salePrice: product.salePrice,
    ratingAvg: product.ratingAvg,
    ratingCount: product.ratingCount,
    salesCount: product.salesCount,
    currentVersion: product.currentVersion,
    lastUpdatedAt: product.lastUpdatedAt,
    status: product.status,
    imageUrl: image?.url ?? null,
    demoUrl: product.demoUrl,
    sellerId: seller.id,
    sellerName: seller.storeName,
    sellerUsername: seller.username,
    sellerRating: seller.rating,
    categoryId: category.id,
    categoryName: category.name,
    categorySlug: category.slug,
  };
}

export function getMockProductDetail(productId: number): ProductDetail | null {
  const product = mockProducts.find((item) => item.id === productId);

  if (!product) return null;

  const base = getMockProductListItem(productId);
  const seller = mockSellers.find((item) => item.id === product.sellerId);

  if (!base || !seller) return null;

  const technologies: TechnologyRef[] = mockProductTechnologies
    .filter((item) => item.productId === productId)
    .map((item) =>
      mockTechnologies.find((tech) => tech.id === item.technologyId),
    )
    .filter(
      (item): item is (typeof mockTechnologies)[number] => Boolean(item),
    )
    .map((tech) => ({
      id: tech.id,
      name: tech.name,
      slug: tech.slug,
      kind: tech.kind,
    }));

  const licenses = mockProductLicenses
    .filter((item) => item.productId === productId && item.isAvailable)
    .map((item) => {
      const license = mockLicenses.find((l) => l.id === item.licenseId);

      if (!license) return null;

      const effective =
        product.salePrice != null ? product.salePrice : product.price;

      return {
        id: item.id,
        licenseId: license.id,
        licenseName: license.name,
        licenseKey: license.key,
        price:
          item.price != null
            ? item.price
            : Math.round(effective * license.multiplier),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const images = mockProductImages
    .filter((item) => item.productId === productId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    ...base,
    description: product.description,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    documentationUrl: product.documentationUrl,
    supportNote: product.supportNote,
    features: mockProductFeatures
      .filter((item) => item.productId === productId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => item.text),
    requirements: mockProductRequirements
      .filter((item) => item.productId === productId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => item.text),
    images: images.map((item) => ({
      url: item.url,
      alt: item.alt,
    })),
    technologies,
    licenses,
    sellerBio: seller.bio,
    sellerTagline: seller.tagline,
    sellerAvatarUrl: seller.avatarUrl,
    sellerSalesCount: seller.totalSales,
  };
}

export function sortMockProducts(
  items: ProductListItem[],
  sort:
    | "relevance"
    | "newest"
    | "best_sellers"
    | "highest_rated"
    | "trending"
    | "recently_updated"
    | "price_asc"
    | "price_desc",
) {
  const result = [...items];

  switch (sort) {
    case "best_sellers":
      return result.sort(
        (a, b) => b.salesCount - a.salesCount || b.ratingAvg - a.ratingAvg,
      );

    case "highest_rated":
      return result.sort(
        (a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount,
      );

    case "trending":
      return result.sort(
        (a, b) =>
          (mockProducts.find((p) => p.id === b.id)?.views ?? 0) -
          (mockProducts.find((p) => p.id === a.id)?.views ?? 0),
      );

    case "price_asc":
      return result.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
      );

    case "price_desc":
      return result.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
      );

    case "recently_updated":
    case "newest":
    case "relevance":
    default:
      return result.sort(
        (a, b) =>
          b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime(),
      );
  }
}

export function getMockProducts(): ProductListItem[] {
  return mockProducts
    .filter(
      (product) =>
        product.status === "PUBLISHED" && product.deletedAt === null,
    )
    .map((product) => getMockProductListItem(product.id))
    .filter((item): item is ProductListItem => Boolean(item));
}

export function getMockOrderRows(userId: number): OrderRow[] {
  return mockOrders
    .filter((order) => order.userId === userId)
    .map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      createdAt: order.createdAt,
      itemsCount: mockOrderItems.filter(
        (item) => item.orderId === order.id,
      ).length,
    }));
}

export const mockData = {
  categories: mockCategories,
  technologies: mockTechnologies,
  users: mockUsers,
  sellers: mockSellers,
  products: mockProducts,
  productImages: mockProductImages,
  productFeatures: mockProductFeatures,
  productRequirements: mockProductRequirements,
  productTechnologies: mockProductTechnologies,
  licenses: mockLicenses,
  productLicenses: mockProductLicenses,
  reviews: mockReviews,
  questions: mockQuestions,
  reviewCriteria: mockReviewCriteria,
  wishlist: mockWishlist,
  comparisons: mockComparisons,
  cartItems: mockCartItems,
  orders: mockOrders,
  orderItems: mockOrderItems,
  transactions: mockTransactions,
  withdrawals: mockWithdrawals,
  notifications: mockNotifications,
  supportTickets: mockSupportTickets,
  supportMessages: mockSupportMessages,
  reports: mockReports,
  coupons: mockCoupons,
  collections: mockCollections,
  collectionProducts: mockCollectionProducts,
  blogPosts: mockBlogPosts,
  pages: mockPages,
  settings: mockSettings,
};