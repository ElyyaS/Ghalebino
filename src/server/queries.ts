import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  gt,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";

import {
  blogPosts,
  blogPostTags,
  blogTags,
  categories,
  cartItems,
  collectionProducts,
  collections,
  comparisons,
  coupons,
  downloads,
  licenses,
  notifications,
  orderItems,
  orders,
  pages,
  productFeatures,
  productImages,
  productLicenses,
  productRequirements,
  productTechnologies,
  productVersions,
  products,
  questions,
  reports,
  reviewCriteria,
  reviews,
  sellers,
  sellerApplications,
  settings,
  supportMessages,
  supportTickets,
  technologies,
  transactions,
  users,
  wishlist,
  withdrawals,
} from "@/db";

import { db } from "@/db";

import type {
  CartLine,
  OrderItemRow,
  OrderRow,
  ProductDetail,
  ProductListItem,
  QuestionItem,
  ReviewItem,
  SellerPublic,
  SortOption,
} from "@/lib/types";

export type ProductStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED"
  | "SUSPENDED"
  | "ARCHIVED";

const PAID_STATUSES = ["PAID", "COMPLETED"] as const;

type WishlistProduct = ProductListItem & {
  productId: number;
};

function effectivePrice(
  product: Pick<typeof products.$inferSelect, "price" | "salePrice">,
) {
  return product.salePrice ?? product.price;
}

function licensePrice(
  basePrice: number,
  multiplier: number,
  override: number | null,
) {
  return override ?? Math.round(basePrice * multiplier);
}

function productStatusFilter(
  status: ProductStatus | ProductStatus[] | undefined,
) {
  if (status === undefined) {
    return eq(products.status, "PUBLISHED");
  }

  const statuses = Array.isArray(status) ? status : [status];

  return statuses.length === 1
    ? eq(products.status, statuses[0])
    : inArray(products.status, statuses);
}

function productSearchFilter(q?: string) {
  if (!q?.trim()) {
    return undefined;
  }

  const value = `%${q.trim()}%`;

  return or(
    ilike(products.title, value),
    ilike(products.slug, value),
    ilike(products.shortDescription, value),
    ilike(products.description, value),
    ilike(products.seoTitle, value),
    ilike(products.seoDescription, value),
  );
}

function productSort(sort: SortOption) {
  switch (sort) {
    case "newest":
      return desc(products.createdAt);
    case "best_sellers":
      return desc(products.salesCount);
    case "highest_rated":
      return desc(products.ratingAvg);
    case "trending":
      return desc(products.views);
    case "recently_updated":
      return desc(products.lastUpdatedAt);
    case "price_asc":
      return asc(sql`coalesce(${products.salePrice}, ${products.price})`);
    case "price_desc":
      return desc(sql`coalesce(${products.salePrice}, ${products.price})`);
    case "relevance":
    default:
      return desc(products.salesCount);
  }
}

async function getProductListItemById(
  productId: number,
): Promise<ProductListItem | null> {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      shortDescription: products.shortDescription,
      price: products.price,
      salePrice: products.salePrice,
      ratingAvg: products.ratingAvg,
      ratingCount: products.ratingCount,
      salesCount: products.salesCount,
      currentVersion: products.currentVersion,
      lastUpdatedAt: products.lastUpdatedAt,
      status: products.status,
      demoUrl: products.demoUrl,
      sellerId: sellers.id,
      sellerName: sellers.storeName,
      sellerUsername: sellers.username,
      sellerRating: sellers.rating,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.id, productId),
        isNull(products.deletedAt),
      ),
    )
    .limit(1);

  const product = rows[0];

  if (!product) {
    return null;
  }

  const imageRows = await db
    .select({
      url: productImages.url,
    })
    .from(productImages)
    .where(
      and(
        eq(productImages.productId, productId),
        eq(productImages.isPrimary, true),
      ),
    )
    .orderBy(asc(productImages.sortOrder))
    .limit(1);

  return {
    ...product,
    imageUrl: imageRows[0]?.url ?? null,
  };
}

async function getProductListItemsByIds(
  ids: number[],
): Promise<ProductListItem[]> {
  if (ids.length === 0) {
    return [];
  }

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      shortDescription: products.shortDescription,
      price: products.price,
      salePrice: products.salePrice,
      ratingAvg: products.ratingAvg,
      ratingCount: products.ratingCount,
      salesCount: products.salesCount,
      currentVersion: products.currentVersion,
      lastUpdatedAt: products.lastUpdatedAt,
      status: products.status,
      demoUrl: products.demoUrl,
      sellerId: sellers.id,
      sellerName: sellers.storeName,
      sellerUsername: sellers.username,
      sellerRating: sellers.rating,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        inArray(products.id, ids),
        isNull(products.deletedAt),
      ),
    );

  const imageRows = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(
      and(
        inArray(productImages.productId, ids),
        eq(productImages.isPrimary, true),
      ),
    )
    .orderBy(asc(productImages.sortOrder));

  const imageMap = new Map<number, string>();

  for (const image of imageRows) {
    if (!imageMap.has(image.productId)) {
      imageMap.set(image.productId, image.url);
    }
  }

  const rowMap = new Map<number, ProductListItem>();

  for (const row of rows) {
    rowMap.set(row.id, {
      ...row,
      imageUrl: imageMap.get(row.id) ?? null,
      status: String(row.status),
    });
  }

  const result: ProductListItem[] = [];

  for (const id of ids) {
    const item = rowMap.get(id);

    if (item) {
      result.push(item);
    }
  }

  return result;
}

export type ListProductsParams = {
  q?: string;
  categoryId?: number;
  technologyId?: number;
  sellerId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onSale?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isStaffPick?: boolean;
  status?: ProductStatus | ProductStatus[];
  page?: number;
  perPage?: number;
  sort?: SortOption;
};

export async function listProducts(
  params: ListProductsParams = {},
) {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? 12);

  const filters = [
    isNull(products.deletedAt),
    productStatusFilter(params.status),
    productSearchFilter(params.q),
  ];

  if (params.categoryId !== undefined) {
    filters.push(eq(products.categoryId, params.categoryId));
  }

  if (params.sellerId !== undefined) {
    filters.push(eq(products.sellerId, params.sellerId));
  }

  if (params.minPrice !== undefined) {
    filters.push(
      gte(
        sql`coalesce(${products.salePrice}, ${products.price})`,
        params.minPrice,
      ),
    );
  }

  if (params.maxPrice !== undefined) {
    filters.push(
      lte(
        sql`coalesce(${products.salePrice}, ${products.price})`,
        params.maxPrice,
      ),
    );
  }

  if (params.minRating !== undefined) {
    filters.push(gte(products.ratingAvg, params.minRating));
  }

  if (params.onSale) {
    filters.push(isNotNull(products.salePrice));
  }

  if (params.isFeatured !== undefined) {
    filters.push(eq(products.isFeatured, params.isFeatured));
  }

  if (params.isTrending !== undefined) {
    filters.push(eq(products.isTrending, params.isTrending));
  }

  if (params.isStaffPick !== undefined) {
    filters.push(eq(products.isStaffPick, params.isStaffPick));
  }

  if (params.technologyId !== undefined) {
    const technologyProducts = db
      .select({
        productId: productTechnologies.productId,
      })
      .from(productTechnologies)
      .where(
        eq(
          productTechnologies.technologyId,
          params.technologyId,
        ),
      );

    filters.push(inArray(products.id, technologyProducts));
  }

  const whereClause = and(...filters);

  const countRows = await db
    .select({
      count: count(),
    })
    .from(products)
    .where(whereClause);

  const total = Number(countRows[0]?.count ?? 0);
  const offset = (page - 1) * perPage;

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      shortDescription: products.shortDescription,
      price: products.price,
      salePrice: products.salePrice,
      ratingAvg: products.ratingAvg,
      ratingCount: products.ratingCount,
      salesCount: products.salesCount,
      currentVersion: products.currentVersion,
      lastUpdatedAt: products.lastUpdatedAt,
      status: products.status,
      demoUrl: products.demoUrl,
      sellerId: sellers.id,
      sellerName: sellers.storeName,
      sellerUsername: sellers.username,
      sellerRating: sellers.rating,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .orderBy(productSort(params.sort ?? "relevance"))
    .limit(perPage)
    .offset(offset);

  const ids = rows.map((row) => row.id);

  const imageRows =
    ids.length > 0
      ? await db
        .select({
          productId: productImages.productId,
          url: productImages.url,
        })
        .from(productImages)
        .where(
          and(
            inArray(productImages.productId, ids),
            eq(productImages.isPrimary, true),
          ),
        )
        .orderBy(asc(productImages.sortOrder))
      : [];

  const imageMap = new Map<number, string>();

  for (const image of imageRows) {
    if (!imageMap.has(image.productId)) {
      imageMap.set(image.productId, image.url);
    }
  }

  const items: ProductListItem[] = rows.map((row) => ({
    ...row,
    imageUrl: imageMap.get(row.id) ?? null,
    status: String(row.status),
  }));

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function recordProductView(
  productId: number,
) {
  const result = await db
    .update(products)
    .set({
      views: sql`${products.views} + 1`,
    })
    .where(
      and(
        eq(products.id, productId),
        isNull(products.deletedAt),
      ),
    )
    .returning({ id: products.id });

  return result.length > 0;
}

export async function getProductBySlug(
  slug: string,
): Promise<(ProductDetail & { createdAt: Date }) | null> {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      shortDescription: products.shortDescription,
      price: products.price,
      salePrice: products.salePrice,
      ratingAvg: products.ratingAvg,
      ratingCount: products.ratingCount,
      salesCount: products.salesCount,
      currentVersion: products.currentVersion,
      lastUpdatedAt: products.lastUpdatedAt,
      status: products.status,
      demoUrl: products.demoUrl,
      sellerId: sellers.id,
      sellerName: sellers.storeName,
      sellerUsername: sellers.username,
      sellerRating: sellers.rating,
      sellerBio: sellers.bio,
      sellerTagline: sellers.tagline,
      sellerAvatarUrl: sellers.avatarUrl,
      sellerSalesCount: sellers.totalSales,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      description: products.description,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      documentationUrl: products.documentationUrl,
      supportNote: products.supportNote,
      createdAt: products.createdAt,
    })
    .from(products)
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.slug, slug),
        eq(products.status, "PUBLISHED"),
        isNull(products.deletedAt),
      ),
    )
    .limit(1);

  const product = rows[0];

  if (!product) {
    return null;
  }

  const [
    imageRows,
    featureRows,
    requirementRows,
    technologyRows,
    licenseRows,
  ] = await Promise.all([
    db
      .select({
        url: productImages.url,
        alt: productImages.alt,
      })
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.sortOrder)),
    db
      .select({
        text: productFeatures.text,
      })
      .from(productFeatures)
      .where(eq(productFeatures.productId, product.id))
      .orderBy(asc(productFeatures.sortOrder)),
    db
      .select({
        text: productRequirements.text,
      })
      .from(productRequirements)
      .where(eq(productRequirements.productId, product.id))
      .orderBy(asc(productRequirements.sortOrder)),
    db
      .select({
        id: technologies.id,
        name: technologies.name,
        slug: technologies.slug,
        kind: technologies.kind,
      })
      .from(productTechnologies)
      .innerJoin(
        technologies,
        eq(productTechnologies.technologyId, technologies.id),
      )
      .where(eq(productTechnologies.productId, product.id))
      .orderBy(asc(technologies.sortOrder)),
    db
      .select({
        id: productLicenses.id,
        licenseId: licenses.id,
        licenseName: licenses.name,
        licenseKey: licenses.key,
        licenseDescription: licenses.description,
        licenseTerms: licenses.terms,
        multiplier: licenses.multiplier,
        override: productLicenses.price,
      })
      .from(productLicenses)
      .innerJoin(
        licenses,
        eq(productLicenses.licenseId, licenses.id),
      )
      .where(
        and(
          eq(productLicenses.productId, product.id),
          eq(productLicenses.isAvailable, true),
        ),
      )
      .orderBy(asc(licenses.sortOrder)),
  ]);

  const basePrice = effectivePrice(product);

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
    imageUrl: imageRows[0]?.url ?? null,
    demoUrl: product.demoUrl,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    sellerUsername: product.sellerUsername,
    sellerRating: product.sellerRating,
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    categorySlug: product.categorySlug,
    description: product.description,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    documentationUrl: product.documentationUrl,
    supportNote: product.supportNote,
    features: featureRows.map((item) => item.text),
    requirements: requirementRows.map((item) => item.text),
    images: imageRows,
    technologies: technologyRows,
    licenses: licenseRows.map((item) => ({
      id: item.id,
      licenseId: item.licenseId,
      licenseName: item.licenseName,
      licenseKey: item.licenseKey,
      price: licensePrice(
        basePrice,
        item.multiplier,
        item.override,
      ),
    })),
    sellerBio: product.sellerBio,
    sellerTagline: product.sellerTagline,
    sellerAvatarUrl: product.sellerAvatarUrl,
    sellerSalesCount: product.sellerSalesCount,
    createdAt: product.createdAt,
  };
}

export async function getProductLicense(
  productId: number,
  licenseId: number,
) {
  const rows = await db
    .select({
      id: productLicenses.id,
      licenseId: licenses.id,
      name: licenses.name,
      key: licenses.key,
      multiplier: licenses.multiplier,
      override: productLicenses.price,
      productPrice: products.price,
      salePrice: products.salePrice,
    })
    .from(productLicenses)
    .innerJoin(
      licenses,
      eq(productLicenses.licenseId, licenses.id),
    )
    .innerJoin(
      products,
      eq(productLicenses.productId, products.id),
    )
    .where(
      and(
        eq(productLicenses.productId, productId),
        eq(productLicenses.licenseId, licenseId),
        eq(productLicenses.isAvailable, true),
        isNull(products.deletedAt),
      ),
    )
    .limit(1);

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    licenseId: row.licenseId,
    name: row.name,
    key: row.key,
    multiplier: row.multiplier,
    override: row.override,
    price: licensePrice(
      row.salePrice ?? row.productPrice,
      row.multiplier,
      row.override,
    ),
  };
}

export async function getCategories() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.isVisible, true))
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getCategoryBySlug(
  slug: string,
) {
  const rows = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.slug, slug),
        eq(categories.isVisible, true),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function getTechnologies() {
  return db
    .select()
    .from(technologies)
    .where(eq(technologies.isVisible, true))
    .orderBy(asc(technologies.sortOrder), asc(technologies.name));
}

export async function getTechnologyBySlug(
  slug: string,
) {
  const rows = await db
    .select()
    .from(technologies)
    .where(
      and(
        eq(technologies.slug, slug),
        eq(technologies.isVisible, true),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function getAllCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function getAllTechnologies() {
  return db
    .select()
    .from(technologies)
    .orderBy(asc(technologies.sortOrder), asc(technologies.name));
}

export async function getSellerByUsername(
  username: string,
): Promise<SellerPublic | null> {
  const rows = await db
    .select({
      id: sellers.id,
      username: sellers.username,
      storeName: sellers.storeName,
      tagline: sellers.tagline,
      bio: sellers.bio,
      avatarUrl: sellers.avatarUrl,
      coverUrl: sellers.coverUrl,
      rating: sellers.rating,
      ratingCount: sellers.ratingCount,
      totalSales: sellers.totalSales,
      totalProducts: sellers.totalProducts,
      responseTime: sellers.responseTime,
      joinedAt: sellers.createdAt,
    })
    .from(sellers)
    .where(
      and(
        eq(sellers.username, username),
        eq(sellers.status, "ACTIVE"),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function getFeaturedSellers(
  limit = 6,
) {
  return db
    .select()
    .from(sellers)
    .where(
      and(
        eq(sellers.status, "ACTIVE"),
        gt(sellers.totalProducts, 0),
      ),
    )
    .orderBy(desc(sellers.rating), desc(sellers.totalSales))
    .limit(limit);
}

export async function getAllSellers() {
  return db
    .select()
    .from(sellers)
    .where(eq(sellers.status, "ACTIVE"))
    .orderBy(desc(sellers.rating), desc(sellers.totalSales));
}

export async function getAdminSellers() {
  return db
    .select({
      id: sellers.id,
      userId: sellers.userId,
      username: sellers.username,
      storeName: sellers.storeName,
      tagline: sellers.tagline,
      bio: sellers.bio,
      avatarUrl: sellers.avatarUrl,
      coverUrl: sellers.coverUrl,
      rating: sellers.rating,
      ratingCount: sellers.ratingCount,
      totalSales: sellers.totalSales,
      totalProducts: sellers.totalProducts,
      responseTime: sellers.responseTime,
      status: sellers.status,
      approvedAt: sellers.approvedAt,
      createdAt: sellers.createdAt,
      updatedAt: sellers.updatedAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(sellers)
    .innerJoin(users, eq(sellers.userId, users.id))
    .where(eq(sellers.status, "ACTIVE"))
    .orderBy(desc(sellers.createdAt));
}

export async function getCartLines(
  owner:
    | number
    | { userId: number }
    | { sessionKey: string },
): Promise<CartLine[]> {
  const ownerFilter =
    typeof owner === "number"
      ? eq(cartItems.userId, owner)
      : "userId" in owner
        ? eq(cartItems.userId, owner.userId)
        : eq(cartItems.sessionKey, owner.sessionKey);

  const rows = await db
    .select({
      id: cartItems.id,
      productId: products.id,
      productSlug: products.slug,
      productTitle: products.title,
      sellerId: sellers.id,
      sellerName: sellers.storeName,
      licenseId: licenses.id,
      licenseName: licenses.name,
      licenseMultiplier: licenses.multiplier,
      licenseOverride: productLicenses.price,
      productPrice: products.price,
      salePrice: products.salePrice,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .innerJoin(
      licenses,
      eq(cartItems.licenseId, licenses.id),
    )
    .leftJoin(
      productLicenses,
      and(
        eq(productLicenses.productId, cartItems.productId),
        eq(productLicenses.licenseId, cartItems.licenseId),
      ),
    )
    .where(
      and(
        ownerFilter,
        isNull(products.deletedAt),
      ),
    )
    .orderBy(desc(cartItems.createdAt));

  const ids = rows.map((row) => row.productId);

  const imageRows =
    ids.length > 0
      ? await db
        .select({
          productId: productImages.productId,
          url: productImages.url,
        })
        .from(productImages)
        .where(
          and(
            inArray(productImages.productId, ids),
            eq(productImages.isPrimary, true),
          ),
        )
      : [];

  const imageMap = new Map<number, string>();

  for (const image of imageRows) {
    if (!imageMap.has(image.productId)) {
      imageMap.set(image.productId, image.url);
    }
  }

  return rows.map((row) => ({
    id: row.id,
    productId: row.productId,
    productSlug: row.productSlug,
    productTitle: row.productTitle,
    imageUrl: imageMap.get(row.productId) ?? null,
    sellerId: row.sellerId,
    sellerName: row.sellerName,
    licenseId: row.licenseId,
    licenseName: row.licenseName,
    unitPrice: licensePrice(
      row.salePrice ?? row.productPrice,
      row.licenseMultiplier,
      row.licenseOverride,
    ),
  }));
}

export async function getWishlistProducts(
  userId: number,
): Promise<WishlistProduct[]> {
  const rows = await db
    .select({
      productId: wishlist.productId,
    })
    .from(wishlist)
    .where(eq(wishlist.userId, userId))
    .orderBy(desc(wishlist.createdAt));

  const ids = rows.map((row) => row.productId);
  const productsRows = await getProductListItemsByIds(ids);

  return productsRows.map((product) => ({
    ...product,
    productId: product.id,
  }));
}

export async function getWishlistIds(
  userId: number,
) {
  const rows = await db
    .select({
      productId: wishlist.productId,
    })
    .from(wishlist)
    .where(eq(wishlist.userId, userId));

  return rows.map((row) => row.productId);
}

export async function getComparisonProducts(
  userId: number,
) {
  const rows = await db
    .select({
      productId: comparisons.productId,
    })
    .from(comparisons)
    .where(eq(comparisons.userId, userId))
    .orderBy(desc(comparisons.createdAt));

  return getProductListItemsByIds(
    rows.map((row) => row.productId),
  );
}

export async function getOrders(
  userId: number,
): Promise<OrderRow[]> {
  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      subtotal: orders.subtotal,
      discount: orders.discount,
      total: orders.total,
      createdAt: orders.createdAt,
      itemsCount: count(orderItems.id),
    })
    .from(orders)
    .leftJoin(
      orderItems,
      eq(orderItems.orderId, orders.id),
    )
    .where(eq(orders.userId, userId))
    .groupBy(
      orders.id,
      orders.orderNumber,
      orders.status,
      orders.subtotal,
      orders.discount,
      orders.total,
      orders.createdAt,
    )
    .orderBy(desc(orders.createdAt));

  return rows.map((row) => ({
    ...row,
    itemsCount: Number(row.itemsCount),
  }));
}

export async function getOrderDetail(
  orderId: number,
  userId: number,
) {
  const orderRows = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.userId, userId),
      ),
    )
    .limit(1);

  const order = orderRows[0];

  if (!order) {
    return null;
  }

  const itemRows = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      productSlug: products.slug,
      productTitle: orderItems.productTitle,
      licenseName: orderItems.licenseName,
      unitPrice: orderItems.unitPrice,
      discount: orderItems.discount,
      finalPrice: orderItems.finalPrice,
      sellerName: sellers.storeName,
    })
    .from(orderItems)
    .innerJoin(
      products,
      eq(orderItems.productId, products.id),
    )
    .innerJoin(
      sellers,
      eq(orderItems.sellerId, sellers.id),
    )
    .where(eq(orderItems.orderId, orderId))
    .orderBy(asc(orderItems.id));

  const productIds = itemRows.map((item) => item.productId);

  const imageRows =
    productIds.length > 0
      ? await db
        .select({
          productId: productImages.productId,
          url: productImages.url,
        })
        .from(productImages)
        .where(
          and(
            inArray(productImages.productId, productIds),
            eq(productImages.isPrimary, true),
          ),
        )
      : [];

  const imageMap = new Map<number, string>();

  for (const image of imageRows) {
    if (!imageMap.has(image.productId)) {
      imageMap.set(image.productId, image.url);
    }
  }

  const items: OrderItemRow[] = itemRows.map((item) => ({
    ...item,
    imageUrl: imageMap.get(item.productId) ?? null,
  }));

  return {
    ...order,
    items,
  };
}

export async function getCustomerDownloads(
  userId: number,
) {
  const rows = await db
    .select({
      productId: orderItems.productId,
      orderItemId: orderItems.id,
      productSlug: products.slug,
      productTitle: orderItems.productTitle,
      licenseName: orderItems.licenseName,
      currentVersion: products.currentVersion,
      lastUpdatedAt: products.lastUpdatedAt,
      createdAt: orderItems.createdAt,
      version: productVersions.version,
    })
    .from(orderItems)
    .innerJoin(
      orders,
      eq(orderItems.orderId, orders.id),
    )
    .innerJoin(
      products,
      eq(orderItems.productId, products.id),
    )
    .leftJoin(
      productVersions,
      and(
        eq(productVersions.productId, orderItems.productId),
        eq(productVersions.isActive, true),
      ),
    )
    .where(
      and(
        eq(orders.userId, userId),
        inArray(orders.status, PAID_STATUSES),
      ),
    )
    .orderBy(desc(orderItems.createdAt));

  const seen = new Set<number>();
  const uniqueRows = rows.filter((row) => {
    if (seen.has(row.productId)) {
      return false;
    }

    seen.add(row.productId);
    return true;
  });

  const productIds = uniqueRows.map((row) => row.productId);

  const imageRows =
    productIds.length > 0
      ? await db
        .select({
          productId: productImages.productId,
          url: productImages.url,
        })
        .from(productImages)
        .where(
          and(
            inArray(productImages.productId, productIds),
            eq(productImages.isPrimary, true),
          ),
        )
      : [];

  const imageMap = new Map<number, string>();

  for (const image of imageRows) {
    if (!imageMap.has(image.productId)) {
      imageMap.set(image.productId, image.url);
    }
  }

  return uniqueRows.map((row) => ({
    productId: row.productId,
    orderItemId: row.orderItemId,
    productSlug: row.productSlug,
    productTitle: row.productTitle,
    imageUrl: imageMap.get(row.productId) ?? null,
    currentVersion: row.currentVersion,
    version: row.version ?? row.currentVersion,
    licenseName: row.licenseName,
    lastUpdatedAt: row.lastUpdatedAt,
    downloadedAt: row.createdAt,
  }));
}

export async function hasPurchased(
  userId: number,
  productId: number,
) {
  const rows = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .innerJoin(
      orders,
      eq(orderItems.orderId, orders.id),
    )
    .where(
      and(
        eq(orders.userId, userId),
        eq(orderItems.productId, productId),
        inArray(orders.status, PAID_STATUSES),
      ),
    )
    .limit(1);

  return rows.length > 0;
}

export async function getReviews(
  productId: number,
): Promise<ReviewItem[]> {
  const rows = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      content: reviews.content,
      helpfulVotes: reviews.helpfulVotes,
      sellerReply: reviews.sellerReply,
      createdAt: reviews.createdAt,
      userName: users.name,
      orderItemId: reviews.orderItemId,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(
      and(
        eq(reviews.productId, productId),
        eq(reviews.status, "PUBLISHED"),
      ),
    )
    .orderBy(desc(reviews.createdAt));

  return rows;
}

export async function getReviewSummary(
  productId: number,
) {
  const rows = await db
    .select({
      rating: reviews.rating,
      total: count(),
    })
    .from(reviews)
    .where(
      and(
        eq(reviews.productId, productId),
        eq(reviews.status, "PUBLISHED"),
      ),
    )
    .groupBy(reviews.rating);

  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  let total = 0;
  let weighted = 0;

  for (const row of rows) {
    const rating = row.rating;

    if (rating >= 1 && rating <= 5) {
      const amount = Number(row.total);
      distribution[rating as keyof typeof distribution] = amount;
      total += amount;
      weighted += rating * amount;
    }
  }

  return {
    avg: total === 0 ? 0 : weighted / total,
    count: total,
    distribution,
  };
}

export async function getQuestions(
  productId: number,
): Promise<QuestionItem[]> {
  return db
    .select({
      id: questions.id,
      question: questions.question,
      sellerAnswer: questions.sellerAnswer,
      createdAt: questions.createdAt,
      userName: users.name,
    })
    .from(questions)
    .innerJoin(users, eq(questions.userId, users.id))
    .where(
      and(
        eq(questions.productId, productId),
        eq(questions.status, "OPEN"),
      ),
    )
    .orderBy(desc(questions.createdAt));
}

export async function getReviewCriteria() {
  return db
    .select()
    .from(reviewCriteria)
    .orderBy(asc(reviewCriteria.sortOrder));
}

export async function getUserReviews(
  userId: number,
) {
  const rows = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      content: reviews.content,
      status: reviews.status,
      helpfulVotes: reviews.helpfulVotes,
      sellerReply: reviews.sellerReply,
      sellerRepliedAt: reviews.sellerRepliedAt,
      createdAt: reviews.createdAt,
      userId: reviews.userId,
      productId: reviews.productId,
      orderItemId: reviews.orderItemId,
      productSlug: products.slug,
      productTitle: products.title,
    })
    .from(reviews)
    .innerJoin(
      products,
      eq(reviews.productId, products.id),
    )
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt));

  return rows.map((row) => ({
    ...row,
    userName: undefined,
  }));
}

export async function getUserTickets(
  userId: number,
) {
  return db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.userId, userId))
    .orderBy(desc(supportTickets.createdAt));
}

export async function getTicketDetail(
  ticketId: number,
  owner:
    | number
    | { userId: number }
    | { sellerId: number },
  role?: string,
) {
  const ticketRows = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.id, ticketId))
    .limit(1);

  const ticket = ticketRows[0];

  if (!ticket) {
    return null;
  }

  const userId =
    typeof owner === "number"
      ? owner
      : "userId" in owner
        ? owner.userId
        : undefined;

  const sellerId =
    typeof owner === "object" && "sellerId" in owner
      ? owner.sellerId
      : undefined;

  const authorized =
    role === "ADMIN" ||
    (userId !== undefined && ticket.userId === userId) ||
    (sellerId !== undefined && ticket.sellerId === sellerId);

  if (!authorized) {
    return null;
  }

  const messages = await db
    .select({
      id: supportMessages.id,
      ticketId: supportMessages.ticketId,
      authorId: supportMessages.authorId,
      authorRole: supportMessages.authorRole,
      content: supportMessages.content,
      createdAt: supportMessages.createdAt,
      authorName: users.name,
    })
    .from(supportMessages)
    .innerJoin(
      users,
      eq(supportMessages.authorId, users.id),
    )
    .where(eq(supportMessages.ticketId, ticketId))
    .orderBy(asc(supportMessages.createdAt));

  return {
    ...ticket,
    status: ticket.status as string,
    messages,
  };
}

export async function getNotifications(
  userId: number,
) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotificationCount(
  userId: number,
) {
  const rows = await db
    .select({
      count: count(),
    })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false),
      ),
    );

  return Number(rows[0]?.count ?? 0);
}

export async function getSellerByUserIdForDashboard(
  userId: number,
) {
  const rows = await db
    .select()
    .from(sellers)
    .where(eq(sellers.userId, userId))
    .limit(1);

  return rows[0] ?? null;
}

export async function getSellerBalance(
  sellerId: number,
) {
  const rows = await db
    .select({
      amount: sql<number>`coalesce(sum(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .where(eq(transactions.sellerId, sellerId));

  return Number(rows[0]?.amount ?? 0);
}

export async function getSellerStats(
  sellerId: number,
) {
  const paidItems = await db
    .select({
      orderId: orderItems.orderId,
      finalPrice: orderItems.finalPrice,
      sellerShare: orderItems.sellerShare,
    })
    .from(orderItems)
    .innerJoin(
      orders,
      eq(orderItems.orderId, orders.id),
    )
    .where(
      and(
        eq(orderItems.sellerId, sellerId),
        inArray(orders.status, PAID_STATUSES),
      ),
    );

  const productsRows = await db
    .select({
      id: products.id,
      views: products.views,
    })
    .from(products)
    .where(
      and(
        eq(products.sellerId, sellerId),
        isNull(products.deletedAt),
      ),
    );

  const orderIds = new Set(
    paidItems.map((item) => item.orderId),
  );

  const revenue = paidItems.reduce(
    (sum, item) => sum + item.finalPrice,
    0,
  );

  const earnings = paidItems.reduce(
    (sum, item) => sum + item.sellerShare,
    0,
  );

  const views = productsRows.reduce(
    (sum, product) => sum + product.views,
    0,
  );

  return {
    revenue,
    orderCount: orderIds.size,
    earnings,
    views,
    balance: await getSellerBalance(sellerId),
    productCount: productsRows.length,
  };
}

export async function getSellerProducts(
  sellerId: number,
) {
  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.sellerId, sellerId),
        isNull(products.deletedAt),
      ),
    )
    .orderBy(desc(products.createdAt));
}

export async function getSellerTransactions(
  sellerId: number,
) {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.sellerId, sellerId))
    .orderBy(desc(transactions.createdAt));
}

export async function getSellerWithdrawals(
  sellerId: number,
) {
  return db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.sellerId, sellerId))
    .orderBy(desc(withdrawals.requestedAt));
}

export async function getSellerProductForEdit(
  sellerId: number,
  productId: number,
) {
  const productRows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.id, productId),
        eq(products.sellerId, sellerId),
      ),
    )
    .limit(1);

  const product = productRows[0];

  if (!product) {
    return null;
  }

  const [
    imageRows,
    featureRows,
    requirementRows,
    technologyRows,
    licenseRows,
  ] = await Promise.all([
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.sortOrder)),
    db
      .select()
      .from(productFeatures)
      .where(eq(productFeatures.productId, productId))
      .orderBy(asc(productFeatures.sortOrder)),
    db
      .select()
      .from(productRequirements)
      .where(eq(productRequirements.productId, productId))
      .orderBy(asc(productRequirements.sortOrder)),
    db
      .select({
        id: technologies.id,
        technologyId: technologies.id,
        name: technologies.name,
        slug: technologies.slug,
        kind: technologies.kind,
        icon: technologies.icon,
      })
      .from(productTechnologies)
      .innerJoin(
        technologies,
        eq(productTechnologies.technologyId, technologies.id),
      )
      .where(eq(productTechnologies.productId, productId))
      .orderBy(asc(technologies.sortOrder)),
    db
      .select({
        id: productLicenses.id,
        productId: productLicenses.productId,
        licenseId: licenses.id,
        licenseName: licenses.name,
        licenseKey: licenses.key,
        price: productLicenses.price,
        isAvailable: productLicenses.isAvailable,
        multiplier: licenses.multiplier,
      })
      .from(productLicenses)
      .innerJoin(
        licenses,
        eq(productLicenses.licenseId, licenses.id),
      )
      .where(eq(productLicenses.productId, productId))
      .orderBy(asc(licenses.sortOrder)),
  ]);

  return {
    ...product,
    images: imageRows,
    features: featureRows.map((feature) => feature.text),
    requirements: requirementRows.map(
      (requirement) => requirement.text,
    ),
    technologies: technologyRows,
    technologyIds: technologyRows.map(
      (technology) => technology.technologyId,
    ),
    licenses: licenseRows,
  };
}

export async function getSellerOrders(
  sellerId: number,
) {
  const rows = await db
    .select({
      orderId: orders.id,
      orderNumber: orders.orderNumber,
      orderStatus: orders.status,
      orderCreatedAt: orders.createdAt,
      productId: orderItems.productId,
      productTitle: orderItems.productTitle,
      customerName: users.name,
      finalPrice: orderItems.finalPrice,
      sellerShare: orderItems.sellerShare,
      unitPrice: orderItems.unitPrice,
      discount: orderItems.discount,
      licenseName: orderItems.licenseName,
    })
    .from(orderItems)
    .innerJoin(
      orders,
      eq(orderItems.orderId, orders.id),
    )
    .innerJoin(
      users,
      eq(orders.userId, users.id),
    )
    .where(eq(orderItems.sellerId, sellerId))
    .orderBy(desc(orders.createdAt));

  return rows.map((row) => ({
    id: row.orderId,
    orderId: row.orderId,
    orderNumber: row.orderNumber,
    createdAt: row.orderCreatedAt,
    status: row.orderStatus,
    productId: row.productId,
    productTitle: row.productTitle,
    customerName: row.customerName,
    finalPrice: row.finalPrice,
    sellerShare: row.sellerShare,
    unitPrice: row.unitPrice,
    discount: row.discount,
    licenseName: row.licenseName,
  }));
}

export async function getSellerReviews(
  sellerId: number,
) {
  const rows = await db
    .select({
      id: reviews.id,
      productId: reviews.productId,
      userId: reviews.userId,
      rating: reviews.rating,
      title: reviews.title,
      content: reviews.content,
      status: reviews.status,
      helpfulVotes: reviews.helpfulVotes,
      sellerReply: reviews.sellerReply,
      sellerRepliedAt: reviews.sellerRepliedAt,
      createdAt: reviews.createdAt,
      orderItemId: reviews.orderItemId,
      userName: users.name,
      productTitle: products.title,
      productSlug: products.slug,
    })
    .from(reviews)
    .innerJoin(
      products,
      eq(reviews.productId, products.id),
    )
    .innerJoin(
      users,
      eq(reviews.userId, users.id),
    )
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(reviews.createdAt));

  return rows;
}

export async function getSellerQuestions(
  sellerId: number,
) {
  const rows = await db
    .select({
      id: questions.id,
      productId: questions.productId,
      userId: questions.userId,
      question: questions.question,
      sellerAnswer: questions.sellerAnswer,
      answeredAt: questions.answeredAt,
      status: questions.status,
      createdAt: questions.createdAt,
      userName: users.name,
      productTitle: products.title,
      productSlug: products.slug,
    })
    .from(questions)
    .innerJoin(
      products,
      eq(questions.productId, products.id),
    )
    .innerJoin(
      users,
      eq(questions.userId, users.id),
    )
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(questions.createdAt));

  return rows;
}

export async function getSellerTickets(
  sellerId: number,
) {
  return db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.sellerId, sellerId))
    .orderBy(desc(supportTickets.createdAt));
}

export async function getAdminStats() {
  const [
    revenueRows,
    orderRows,
    userRows,
    productRows,
    sellerRows,
    pendingProductRows,
    pendingApplicationRows,
    pendingWithdrawalRows,
    reportRows,
  ] = await Promise.all([
    db
      .select({
        revenue: sql<number>`coalesce(sum(${orders.total}), 0)`,
      })
      .from(orders)
      .where(inArray(orders.status, PAID_STATUSES)),
    db
      .select({ count: count() })
      .from(orders),
    db
      .select({ count: count() })
      .from(users),
    db
      .select({ count: count() })
      .from(products)
      .where(isNull(products.deletedAt)),
    db
      .select({ count: count() })
      .from(sellers)
      .where(eq(sellers.status, "ACTIVE")),
    db
      .select({ count: count() })
      .from(products)
      .where(
        and(
          isNull(products.deletedAt),
          inArray(products.status, [
            "SUBMITTED",
            "UNDER_REVIEW",
            "CHANGES_REQUESTED",
          ]),
        ),
      ),
    db
      .select({ count: count() })
      .from(sellerApplications)
      .where(eq(sellerApplications.status, "PENDING")),
    db
      .select({ count: count() })
      .from(withdrawals)
      .where(eq(withdrawals.status, "REQUESTED")),
    db
      .select({ count: count() })
      .from(reports)
      .where(eq(reports.status, "OPEN")),
  ]);

  const revenue = Number(revenueRows[0]?.revenue ?? 0);
  const orderCount = Number(orderRows[0]?.count ?? 0);
  const userCount = Number(userRows[0]?.count ?? 0);
  const productCount = Number(productRows[0]?.count ?? 0);
  const sellerCount = Number(sellerRows[0]?.count ?? 0);
  const pendingProducts = Number(
    pendingProductRows[0]?.count ?? 0,
  );
  const pendingSellerApplications = Number(
    pendingApplicationRows[0]?.count ?? 0,
  );
  const pendingWithdrawals = Number(
    pendingWithdrawalRows[0]?.count ?? 0,
  );
  const openReports = Number(
    reportRows[0]?.count ?? 0,
  );

  return {
    revenue,
    orderCount,
    ordersCount: orderCount,
    userCount,
    usersCount: userCount,
    productCount,
    productsCount: productCount,
    sellerCount,
    sellersCount: sellerCount,
    pendingProducts,
    pendingSellerApplications,
    pendingSellers: pendingSellerApplications,
    pendingWithdrawals,
    openReports,
  };
}

export async function getAdminUsers() {
  return db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));
}

export async function getAdminSellerApplications() {
  const rows = await db
    .select({
      id: sellerApplications.id,
      userId: sellerApplications.userId,
      userName: users.name,
      userEmail: users.email,
      username: sellers.username,
      storeName: sellerApplications.storeName,
      status: sellerApplications.status,
      description: sellerApplications.description,
      portfolioUrl: sellerApplications.portfolioUrl,
      reviewerNote: sellerApplications.reviewerNote,
      reviewedAt: sellerApplications.reviewedAt,
      createdAt: sellerApplications.createdAt,
    })
    .from(sellerApplications)
    .innerJoin(
      users,
      eq(sellerApplications.userId, users.id),
    )
    .leftJoin(
      sellers,
      eq(sellerApplications.userId, sellers.userId),
    )
    .orderBy(desc(sellerApplications.createdAt));

  return rows;
}

export async function getAdminProducts() {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      shortDescription: products.shortDescription,
      price: products.price,
      salePrice: products.salePrice,
      ratingAvg: products.ratingAvg,
      ratingCount: products.ratingCount,
      salesCount: products.salesCount,
      currentVersion: products.currentVersion,
      lastUpdatedAt: products.lastUpdatedAt,
      status: products.status,
      demoUrl: products.demoUrl,
      sellerId: sellers.id,
      sellerName: sellers.storeName,
      sellerUsername: sellers.username,
      sellerRating: sellers.rating,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(isNull(products.deletedAt))
    .orderBy(desc(products.createdAt));

  const ids = rows.map((row) => row.id);

  const imageRows =
    ids.length > 0
      ? await db
        .select({
          productId: productImages.productId,
          url: productImages.url,
        })
        .from(productImages)
        .where(
          and(
            inArray(productImages.productId, ids),
            eq(productImages.isPrimary, true),
          ),
        )
      : [];

  const imageMap = new Map<number, string>();

  for (const image of imageRows) {
    if (!imageMap.has(image.productId)) {
      imageMap.set(image.productId, image.url);
    }
  }

  return rows.map((row) => ({
    ...row,
    imageUrl: imageMap.get(row.id) ?? null,
  }));
}

export async function getAdminProductDetail(
  productId: number,
) {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      shortDescription: products.shortDescription,
      price: products.price,
      salePrice: products.salePrice,
      ratingAvg: products.ratingAvg,
      ratingCount: products.ratingCount,
      salesCount: products.salesCount,
      currentVersion: products.currentVersion,
      lastUpdatedAt: products.lastUpdatedAt,
      status: products.status,
      demoUrl: products.demoUrl,
      sellerId: sellers.id,
      sellerName: sellers.storeName,
      sellerUsername: sellers.username,
      sellerRating: sellers.rating,
      sellerBio: sellers.bio,
      sellerTagline: sellers.tagline,
      sellerAvatarUrl: sellers.avatarUrl,
      sellerSalesCount: sellers.totalSales,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      description: products.description,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      documentationUrl: products.documentationUrl,
      supportNote: products.supportNote,
      createdAt: products.createdAt,
    })
    .from(products)
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, productId))
    .limit(1);

  const product = rows[0];

  if (!product) {
    return null;
  }

  const [
    images,
    features,
    requirements,
    technologyRows,
    licenseRows,
  ] = await Promise.all([
    db
      .select({
        url: productImages.url,
        alt: productImages.alt,
      })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.sortOrder)),
    db
      .select({ text: productFeatures.text })
      .from(productFeatures)
      .where(eq(productFeatures.productId, productId))
      .orderBy(asc(productFeatures.sortOrder)),
    db
      .select({ text: productRequirements.text })
      .from(productRequirements)
      .where(eq(productRequirements.productId, productId))
      .orderBy(asc(productRequirements.sortOrder)),
    db
      .select({
        id: technologies.id,
        name: technologies.name,
        slug: technologies.slug,
        kind: technologies.kind,
      })
      .from(productTechnologies)
      .innerJoin(
        technologies,
        eq(productTechnologies.technologyId, technologies.id),
      )
      .where(eq(productTechnologies.productId, productId))
      .orderBy(asc(technologies.sortOrder)),
    db
      .select({
        id: productLicenses.id,
        licenseId: licenses.id,
        licenseName: licenses.name,
        licenseKey: licenses.key,
        multiplier: licenses.multiplier,
        override: productLicenses.price,
      })
      .from(productLicenses)
      .innerJoin(
        licenses,
        eq(productLicenses.licenseId, licenses.id),
      )
      .where(eq(productLicenses.productId, productId))
      .orderBy(asc(licenses.sortOrder)),
  ]);

  const basePrice = effectivePrice(product);

  return {
    ...product,
    imageUrl: images[0]?.url ?? null,
    features: features.map((item) => item.text),
    requirements: requirements.map((item) => item.text),
    images,
    technologies: technologyRows,
    licenses: licenseRows.map((item) => ({
      id: item.id,
      licenseId: item.licenseId,
      licenseName: item.licenseName,
      licenseKey: item.licenseKey,
      price: licensePrice(
        basePrice,
        item.multiplier,
        item.override,
      ),
    })),
  };
}

export async function getAdminWithdrawals() {
  const rows = await db
    .select({
      id: withdrawals.id,
      sellerId: withdrawals.sellerId,
      amount: withdrawals.amount,
      status: withdrawals.status,
      method: withdrawals.method,
      accountDetails: withdrawals.accountDetails,
      adminNote: withdrawals.adminNote,
      payoutReference: withdrawals.payoutReference,
      requestedAt: withdrawals.requestedAt,
      processedAt: withdrawals.processedAt,
      processedBy: withdrawals.processedBy,
      sellerName: sellers.storeName,
      sellerUsername: sellers.username,
    })
    .from(withdrawals)
    .innerJoin(
      sellers,
      eq(withdrawals.sellerId, sellers.id),
    )
    .orderBy(desc(withdrawals.requestedAt));

  return rows.map((row) => ({
    ...row,
    seller: {
      id: row.sellerId,
      storeName: row.sellerName,
      username: row.sellerUsername,
    },
  }));
}

export async function getAdminReports() {
  const rows = await db
    .select({
      id: reports.id,
      reporterId: reports.reporterId,
      targetType: reports.targetType,
      targetId: reports.targetId,
      reason: reports.reason,
      details: reports.details,
      status: reports.status,
      reviewerNote: reports.reviewerNote,
      reviewedAt: reports.reviewedAt,
      reviewedBy: reports.reviewedBy,
      createdAt: reports.createdAt,
      reporterName: users.name,
      reporterEmail: users.email,
    })
    .from(reports)
    .innerJoin(
      users,
      eq(reports.reporterId, users.id),
    )
    .orderBy(desc(reports.createdAt));

  return rows.map((row) => ({
    ...row,
    reporter: {
      id: row.reporterId,
      name: row.reporterName,
      email: row.reporterEmail,
    },
  }));
}

export async function getAdminCoupons() {
  return db
    .select()
    .from(coupons)
    .orderBy(desc(coupons.createdAt));
}

export async function getAdminOrders() {
  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      userId: orders.userId,
      status: orders.status,
      subtotal: orders.subtotal,
      discount: orders.discount,
      total: orders.total,
      platformFee: orders.platformFee,
      paymentMethod: orders.paymentMethod,
      paidAt: orders.paidAt,
      refundedAt: orders.refundedAt,
      cancellationReason: orders.cancellationReason,
      metadata: orders.metadata,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      customerName: users.name,
      itemId: orderItems.id,
      productTitle: orderItems.productTitle,
      finalPrice: orderItems.finalPrice,
      sellerShare: orderItems.sellerShare,
      sellerName: sellers.storeName,
      licenseName: orderItems.licenseName,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .leftJoin(
      orderItems,
      eq(orderItems.orderId, orders.id),
    )
    .leftJoin(
      sellers,
      eq(orderItems.sellerId, sellers.id),
    )
    .orderBy(desc(orders.createdAt));

  const grouped = new Map<
    number,
    {
      order: typeof rows[number];
      items: typeof rows;
    }
  >();

  for (const row of rows) {
    const existing = grouped.get(row.id);

    if (existing) {
      existing.items.push(row);
    } else {
      grouped.set(row.id, {
        order: row,
        items: [row],
      });
    }
  }

  return Array.from(grouped.values()).flatMap(
    ({ order, items }) => {
      const validItems = items.filter(
        (item) => item.itemId !== null,
      );

      if (validItems.length === 0) {
        return [
          {
            ...order,
            productTitle: "سفارش",
            finalPrice: order.total,
            sellerShare: 0,
            sellerName: "فروشنده",
            licenseName: "",
            itemId: 0,
            items,
          },
        ];
      }

      return validItems.map((item) => ({
        ...order,
        productTitle: item.productTitle ?? "محصول",
        finalPrice: item.finalPrice ?? 0,
        sellerShare: item.sellerShare ?? 0,
        sellerName: item.sellerName ?? "فروشنده",
        licenseName: item.licenseName ?? "",
        itemId: item.itemId ?? 0,
        items,
      }));
    },
  );
}

export async function getCollections() {
  return db
    .select()
    .from(collections)
    .where(eq(collections.isVisible, true))
    .orderBy(
      asc(collections.sortOrder),
      asc(collections.name),
    );
}

export async function getCollectionBySlug(
  slug: string,
) {
  const collectionRows = await db
    .select()
    .from(collections)
    .where(
      and(
        eq(collections.slug, slug),
        eq(collections.isVisible, true),
      ),
    )
    .limit(1);

  const collection = collectionRows[0];

  if (!collection) {
    return null;
  }

  const productRows = await db
    .select({
      productId: collectionProducts.productId,
    })
    .from(collectionProducts)
    .where(
      eq(
        collectionProducts.collectionId,
        collection.id,
      ),
    )
    .orderBy(asc(collectionProducts.sortOrder));

  const productIds = productRows.map(
    (row) => row.productId,
  );

  const productList = await getProductListItemsByIds(
    productIds,
  );

  return {
    ...collection,
    productIds,
    products: productList,
  };
}

export async function getBlogPosts(
  limit?: number,
) {
  const query = db
    .select({
      id: blogPosts.id,
      authorId: blogPosts.authorId,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      coverImage: blogPosts.coverImage,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      seoTitle: blogPosts.seoTitle,
      seoDescription: blogPosts.seoDescription,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.authorId, users.id))
    .where(eq(blogPosts.status, "PUBLISHED"))
    .orderBy(desc(blogPosts.publishedAt));

  const posts = limit
    ? await query.limit(limit)
    : await query;

  return posts.map((post) => ({
    ...post,
    author: {
      id: post.authorId,
      name: post.authorName,
      email: post.authorEmail,
    },
  }));
}

export async function getBlogPost(
  slug: string,
) {
  const rows = await db
    .select({
      id: blogPosts.id,
      authorId: blogPosts.authorId,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      coverImage: blogPosts.coverImage,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      seoTitle: blogPosts.seoTitle,
      seoDescription: blogPosts.seoDescription,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.authorId, users.id))
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.status, "PUBLISHED"),
      ),
    )
    .limit(1);

  const post = rows[0];

  if (!post) {
    return null;
  }

  const tags = await db
    .select({
      id: blogTags.id,
      name: blogTags.name,
      slug: blogTags.slug,
    })
    .from(blogPostTags)
    .innerJoin(
      blogTags,
      eq(blogPostTags.tagId, blogTags.id),
    )
    .where(eq(blogPostTags.postId, post.id));

  return {
    ...post,
    author: {
      id: post.authorId,
      name: post.authorName,
      email: post.authorEmail,
    },
    tags,
  };
}

export async function getAdminBlogPosts() {
  const rows = await db
    .select({
      id: blogPosts.id,
      authorId: blogPosts.authorId,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      coverImage: blogPosts.coverImage,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      seoTitle: blogPosts.seoTitle,
      seoDescription: blogPosts.seoDescription,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.authorId, users.id))
    .orderBy(desc(blogPosts.createdAt));

  return rows.map((post) => ({
    ...post,
    author: {
      id: post.authorId,
      name: post.authorName,
      email: post.authorEmail,
    },
  }));
}

export async function getPage(
  slug: string,
) {
  const rows = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}

export async function getSiteSettings() {
  const rows = await db
    .select({
      key: settings.key,
      value: settings.value,
    })
    .from(settings);

  return Object.fromEntries(
    rows.map((setting) => [
      setting.key,
      setting.value,
    ]),
  );
}