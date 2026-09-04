import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

const now = () => sql`now()`;

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

export const roleEnum = pgEnum("role", ["ADMIN", "SELLER", "CUSTOMER"]);
export const userStatusEnum = pgEnum("user_status", ["ACTIVE", "SUSPENDED", "BANNED"]);
export const sellerApplicationStatusEnum = pgEnum("seller_application_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const sellerStatusEnum = pgEnum("seller_status", ["ACTIVE", "SUSPENDED"]);
export const productStatusEnum = pgEnum("product_status", [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "CHANGES_REQUESTED",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
  "SUSPENDED",
  "ARCHIVED",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PAYMENT_PROCESSING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUND_REQUESTED",
  "REFUNDED",
  "COMPLETED",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
]);
export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "REQUESTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "PROCESSING",
  "PAID",
  "FAILED",
]);
export const ticketStatusEnum = pgEnum("ticket_status", [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_CUSTOMER",
  "WAITING_FOR_SELLER",
  "RESOLVED",
  "CLOSED",
  "ESCALATED",
]);
export const reviewStatusEnum = pgEnum("review_status", ["PUBLISHED", "PENDING", "REJECTED"]);
export const couponTypeEnum = pgEnum("coupon_type", ["PERCENT", "FIXED"]);
export const couponScopeEnum = pgEnum("coupon_scope", ["PLATFORM", "SELLER"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "SALE",
  "WITHDRAWAL",
  "REFUND",
  "FEE",
  "ADJUSTMENT",
]);

export type Role = (typeof roleEnum.enumValues)[number];
export type ProductStatus = (typeof productStatusEnum.enumValues)[number];
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type WithdrawalStatus = (typeof withdrawalStatusEnum.enumValues)[number];
export type TicketStatus = (typeof ticketStatusEnum.enumValues)[number];

/* ------------------------------------------------------------------ */
/* Users & authentication                                              */
/* ------------------------------------------------------------------ */

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    role: roleEnum("role").notNull().default("CUSTOMER"),
    status: userStatusEnum("status").notNull().default("ACTIVE"),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("sessions_token_idx").on(t.tokenHash),
    index("sessions_user_idx").on(t.userId),
  ],
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Sellers                                                             */
/* ------------------------------------------------------------------ */

export const sellers = pgTable(
  "sellers",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    username: varchar("username", { length: 60 }).notNull(),
    storeName: varchar("store_name", { length: 120 }).notNull(),
    tagline: varchar("tagline", { length: 200 }),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    coverUrl: text("cover_url"),
    rating: real("rating").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    totalSales: integer("total_sales").notNull().default(0),
    totalProducts: integer("total_products").notNull().default(0),
    responseTime: varchar("response_time", { length: 60 }),
    status: sellerStatusEnum("status").notNull().default("ACTIVE"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("sellers_user_idx").on(t.userId),
    uniqueIndex("sellers_username_idx").on(t.username),
  ],
);

export const sellerApplications = pgTable(
  "seller_applications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    storeName: varchar("store_name", { length: 120 }).notNull(),
    description: text("description"),
    portfolioUrl: varchar("portfolio_url", { length: 255 }),
    status: sellerApplicationStatusEnum("status").notNull().default("PENDING"),
    reviewerNote: text("reviewer_note"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedBy: integer("reviewed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("seller_applications_user_idx").on(t.userId)],
);

/* ------------------------------------------------------------------ */
/* Taxonomy                                                            */
/* ------------------------------------------------------------------ */

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 60 }),
    imageUrl: text("image_url"),
    parentId: integer("parent_id").references((): any => categories.id, {
      onDelete: "set null",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)],
);

export const technologies = pgTable(
  "technologies",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    kind: varchar("kind", { length: 40 }).notNull().default("framework"),
    icon: varchar("icon", { length: 60 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("technologies_slug_idx").on(t.slug)],
);

export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
  },
  (t) => [uniqueIndex("tags_slug_idx").on(t.slug)],
);

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    sellerId: integer("seller_id")
      .notNull()
      .references(() => sellers.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
    price: integer("price").notNull().default(0),
    salePrice: integer("sale_price"),
    status: productStatusEnum("status").notNull().default("DRAFT"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isTrending: boolean("is_trending").notNull().default(false),
    isStaffPick: boolean("is_staff_pick").notNull().default(false),
    currentVersion: varchar("current_version", { length: 40 }).notNull().default("1.0.0"),
    lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    views: integer("views").notNull().default(0),
    salesCount: integer("sales_count").notNull().default(0),
    ratingAvg: real("rating_avg").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    demoUrl: varchar("demo_url", { length: 300 }),
    documentationUrl: varchar("documentation_url", { length: 300 }),
    supportNote: text("support_note"),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: text("seo_description"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_seller_idx").on(t.sellerId),
    index("products_status_idx").on(t.status),
    index("products_price_idx").on(t.price),
    index("products_rating_idx").on(t.ratingAvg),
    index("products_sales_idx").on(t.salesCount),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: varchar("alt", { length: 200 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

export const productFeatures = pgTable(
  "product_features",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    text: varchar("text", { length: 300 }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("product_features_product_idx").on(t.productId)],
);

export const productRequirements = pgTable(
  "product_requirements",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    text: varchar("text", { length: 300 }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("product_requirements_product_idx").on(t.productId)],
);

export const productVersions = pgTable(
  "product_versions",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 40 }).notNull(),
    releaseDate: timestamp("release_date", { withTimezone: true }).notNull().defaultNow(),
    changelog: text("changelog"),
    fileKey: varchar("file_key", { length: 255 }).notNull(),
    fileSize: integer("file_size").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("product_versions_product_idx").on(t.productId)],
);

export const productTechnologies = pgTable(
  "product_technologies",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    technologyId: integer("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.technologyId] })],
);

export const productTags = pgTable(
  "product_tags",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.tagId] })],
);

export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  key: varchar("key", { length: 60 }).notNull(),
  description: text("description"),
  terms: text("terms"),
  multiplier: real("multiplier").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const productLicenses = pgTable(
  "product_licenses",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    licenseId: integer("license_id")
      .notNull()
      .references(() => licenses.id, { onDelete: "cascade" }),
    price: integer("price"),
    isAvailable: boolean("is_available").notNull().default(true),
  },
  (t) => [
    uniqueIndex("product_licenses_unique_idx").on(t.productId, t.licenseId),
  ],
);

/* ------------------------------------------------------------------ */
/* Reviews & questions                                                 */
/* ------------------------------------------------------------------ */

export const reviewCriteria = pgTable("review_criteria", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 60 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderItemId: integer("order_item_id"),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 160 }),
    content: text("content"),
    status: reviewStatusEnum("status").notNull().default("PUBLISHED"),
    helpfulVotes: integer("helpful_votes").notNull().default(0),
    sellerReply: text("seller_reply"),
    sellerRepliedAt: timestamp("seller_replied_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("reviews_product_idx").on(t.productId),
    index("reviews_user_idx").on(t.userId),
  ],
);

export const reviewRatings = pgTable(
  "review_ratings",
  {
    id: serial("id").primaryKey(),
    reviewId: integer("review_id")
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    criterionId: integer("criterion_id")
      .notNull()
      .references(() => reviewCriteria.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
  },
  (t) => [uniqueIndex("review_ratings_unique_idx").on(t.reviewId, t.criterionId)],
);

export const questions = pgTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    sellerAnswer: text("seller_answer"),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
    status: varchar("status", { length: 20 }).notNull().default("OPEN"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("questions_product_idx").on(t.productId)],
);

/* ------------------------------------------------------------------ */
/* Customer features                                                   */
/* ------------------------------------------------------------------ */

export const wishlist = pgTable(
  "wishlist",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.productId] })],
);

export const comparisons = pgTable(
  "comparisons",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.productId] })],
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
    sessionKey: varchar("session_key", { length: 80 }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    licenseId: integer("license_id")
      .notNull()
      .references(() => licenses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("cart_user_idx").on(t.userId), index("cart_session_idx").on(t.sessionKey)],
);

/* ------------------------------------------------------------------ */
/* Orders, payments & ledger                                           */
/* ------------------------------------------------------------------ */

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: varchar("order_number", { length: 40 }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    status: orderStatusEnum("status").notNull().default("PENDING"),
    subtotal: integer("subtotal").notNull().default(0),
    discount: integer("discount").notNull().default(0),
    couponId: integer("coupon_id"),
    total: integer("total").notNull().default(0),
    platformFee: integer("platform_fee").notNull().default(0),
    paymentMethod: varchar("payment_method", { length: 60 }).notNull().default("mock"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    cancellationReason: text("cancellation_reason"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("orders_number_idx").on(t.orderNumber),
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    sellerId: integer("seller_id")
      .notNull()
      .references(() => sellers.id),
    licenseId: integer("license_id").notNull(),
    productTitle: varchar("product_title", { length: 220 }).notNull(),
    licenseName: varchar("license_name", { length: 120 }).notNull(),
    unitPrice: integer("unit_price").notNull().default(0),
    discount: integer("discount").notNull().default(0),
    finalPrice: integer("final_price").notNull().default(0),
    sellerShare: integer("seller_share").notNull().default(0),
    platformFee: integer("platform_fee").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("order_items_order_idx").on(t.orderId),
    index("order_items_product_idx").on(t.productId),
    index("order_items_seller_idx").on(t.sellerId),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    provider: varchar("provider", { length: 60 }).notNull().default("mock"),
    providerRef: varchar("provider_ref", { length: 120 }),
    amount: integer("amount").notNull().default(0),
    status: paymentStatusEnum("status").notNull().default("PENDING"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("payments_order_idx").on(t.orderId)],
);

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    sellerId: integer("seller_id")
      .notNull()
      .references(() => sellers.id, { onDelete: "cascade" }),
    type: transactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull().default(0),
    balanceAfter: integer("balance_after").notNull().default(0),
    referenceType: varchar("reference_type", { length: 40 }),
    referenceId: integer("reference_id"),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("transactions_seller_idx").on(t.sellerId)],
);

export const withdrawals = pgTable(
  "withdrawals",
  {
    id: serial("id").primaryKey(),
    sellerId: integer("seller_id")
      .notNull()
      .references(() => sellers.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    status: withdrawalStatusEnum("status").notNull().default("REQUESTED"),
    method: varchar("method", { length: 60 }).notNull().default("bank"),
    accountDetails: text("account_details"),
    adminNote: text("admin_note"),
    payoutReference: varchar("payout_reference", { length: 120 }),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    processedBy: integer("processed_by").references(() => users.id),
  },
  (t) => [index("withdrawals_seller_idx").on(t.sellerId)],
);

export const downloads = pgTable(
  "downloads",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderItemId: integer("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull(),
    versionId: integer("version_id").notNull(),
    ipHash: varchar("ip_hash", { length: 80 }),
    downloadedAt: timestamp("downloaded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("downloads_user_idx").on(t.userId)],
);

/* ------------------------------------------------------------------ */
/* Coupons                                                             */
/* ------------------------------------------------------------------ */

export const coupons = pgTable(
  "coupons",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 60 }).notNull(),
    type: couponTypeEnum("type").notNull(),
    value: integer("value").notNull(),
    minOrder: integer("min_order").notNull().default(0),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    scope: couponScopeEnum("scope").notNull().default("PLATFORM"),
    sellerId: integer("seller_id").references(() => sellers.id, { onDelete: "cascade" }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("coupons_code_idx").on(t.code)],
);

export const couponProducts = pgTable(
  "coupon_products",
  {
    couponId: integer("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.couponId, t.productId] })],
);

export const couponCategories = pgTable(
  "coupon_categories",
  {
    couponId: integer("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.couponId, t.categoryId] })],
);

/* ------------------------------------------------------------------ */
/* Support, reports, notifications                                     */
/* ------------------------------------------------------------------ */

export const supportTickets = pgTable(
  "support_tickets",
  {
    id: serial("id").primaryKey(),
    ticketNumber: varchar("ticket_number", { length: 40 }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sellerId: integer("seller_id").references(() => sellers.id, { onDelete: "set null" }),
    subject: varchar("subject", { length: 200 }).notNull(),
    type: varchar("type", { length: 40 }).notNull().default("GENERAL"),
    status: ticketStatusEnum("status").notNull().default("OPEN"),
    priority: varchar("priority", { length: 20 }).notNull().default("NORMAL"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("support_tickets_number_idx").on(t.ticketNumber),
    index("support_tickets_user_idx").on(t.userId),
    index("support_tickets_seller_idx").on(t.sellerId),
  ],
);

export const supportMessages = pgTable(
  "support_messages",
  {
    id: serial("id").primaryKey(),
    ticketId: integer("ticket_id")
      .notNull()
      .references(() => supportTickets.id, { onDelete: "cascade" }),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    authorRole: varchar("author_role", { length: 20 }).notNull().default("CUSTOMER"),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("support_messages_ticket_idx").on(t.ticketId)],
);

export const reports = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    reporterId: integer("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: varchar("target_type", { length: 20 }).notNull(),
    targetId: integer("target_id").notNull(),
    reason: varchar("reason", { length: 60 }).notNull(),
    details: text("details"),
    status: varchar("status", { length: 20 }).notNull().default("OPEN"),
    reviewerNote: text("reviewer_note"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedBy: integer("reviewed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reports_target_idx").on(t.targetType, t.targetId)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 40 }).notNull().default("GENERAL"),
    title: varchar("title", { length: 200 }).notNull(),
    body: text("body"),
    link: varchar("link", { length: 300 }),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("notifications_user_idx").on(t.userId, t.isRead)],
);

/* ------------------------------------------------------------------ */
/* CMS, blog, audit                                                    */
/* ------------------------------------------------------------------ */

export const collections = pgTable(
  "collections",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description"),
    kind: varchar("kind", { length: 20 }).notNull().default("MANUAL"),
    imageUrl: text("image_url"),
    isVisible: boolean("is_visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("collections_slug_idx").on(t.slug)],
);

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: integer("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.productId] })],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    status: varchar("status", { length: 20 }).notNull().default("DRAFT"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: text("seo_description"),
    ...timestamps,
  },
  (t) => [uniqueIndex("blog_posts_slug_idx").on(t.slug)],
);

export const blogTags = pgTable(
  "blog_tags",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
  },
  (t) => [uniqueIndex("blog_tags_slug_idx").on(t.slug)],
);

export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => blogTags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    actorId: integer("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 80 }).notNull(),
    resourceType: varchar("resource_type", { length: 40 }).notNull(),
    resourceId: integer("resource_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_logs_resource_idx").on(t.resourceType, t.resourceId)],
);

export const settings = pgTable("settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: jsonb("value").$type<unknown>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pages = pgTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("pages_slug_idx").on(t.slug)],
);
