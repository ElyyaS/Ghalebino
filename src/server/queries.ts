import "server-only";

import {
  getMockActiveSellers,
  getMockBlogPostBySlug,
  getMockCategoryBySlug,
  getMockCollectionBySlug,
  getMockOrderItems,
  getMockPageBySlug,
  getMockProductBySlug,
  getMockProductFeatures,
  getMockProductImages,
  getMockProductLicenses,
  getMockProductRequirements,
  getMockProductTechnologies,
  getMockQuestions,
  getMockReviews,
  getMockSellerByUsername,
  getMockSellerProducts,
  getMockSellerQuestions,
  getMockSellerReviews,
  getMockSellerTransactions,
  getMockSellerWithdrawals,
  getMockSupportMessages,
  getMockSupportTickets,
  getMockTechnologyBySlug,
  getMockVisibleCategories,
  mockBlogPosts,
  mockCategories,
  mockCartItems,
  mockCollectionProducts,
  mockCollections,
  mockCoupons,
  mockLicenses,
  mockNotifications,
  mockOrderItems,
  mockOrders,
  mockProductLicenses,
  mockProducts,
  mockReports,
  mockReviewCriteria,
  mockReviews,
  mockSellers,
  mockSettings,
  mockSupportTickets,
  mockTechnologies,
  mockTransactions,
  mockWithdrawals,
  mockWishlist,
  mockComparisons,
  mockData,
} from "./mock-db";

import {
  getMockOrderRows,
  getMockProductDetail,
  getMockProductListItem,
  mockUsers,
  sortMockProducts,
} from "./mock-data";

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
  | "ARCHIVED";

const PAID_STATUSES = ["PAID", "COMPLETED"] as const;

type WishlistProduct = ProductListItem & {
  productId: number;
};

type AdminOrderRow = (typeof mockOrders)[number] & {
  customerName: string;
  productTitle: string;
  finalPrice: number;
  sellerShare: number;
  sellerName: string;
  licenseName: string;
  itemId: number;
  items: ReturnType<typeof getMockOrderItems>;
};

function effectivePrice(
  product: (typeof mockProducts)[number],
) {
  return product.salePrice ?? product.price;
}

function licensePrice(
  basePrice: number,
  multiplier: number,
  override: number | null,
) {
  return (
    override ??
    Math.round(basePrice * multiplier)
  );
}

function getUserName(
  userId: number | null | undefined,
) {
  if (userId == null) {
    return "کاربر";
  }

  return (
    mockUsers.find(
      (user) => user.id === userId,
    )?.name ?? "کاربر"
  );
}

function getSeller(sellerId: number) {
  return (
    mockSellers.find(
      (seller) => seller.id === sellerId,
    ) ?? null
  );
}

function getProduct(productId: number) {
  return (
    mockProducts.find(
      (product) => product.id === productId,
    ) ?? null
  );
}

function productMatches(
  product: (typeof mockProducts)[number],
  params: ListProductsParams,
) {
  if (product.deletedAt !== null) {
    return false;
  }

  if (
    params.status === undefined &&
    product.status !== "PUBLISHED"
  ) {
    return false;
  }

  if (params.status !== undefined) {
    const statuses = Array.isArray(params.status)
      ? params.status
      : [params.status];

    if (
      !statuses.includes(
        product.status as ProductStatus,
      )
    ) {
      return false;
    }
  }

  if (params.q) {
    const q = params.q.trim().toLowerCase();

    const haystack = [
      product.title,
      product.slug,
      product.shortDescription,
      product.description,
      product.seoTitle ?? "",
      product.seoDescription ?? "",
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(q)) {
      return false;
    }
  }

  if (
    params.categoryId !== undefined &&
    product.categoryId !== params.categoryId
  ) {
    return false;
  }

  if (params.technologyId !== undefined) {
    const hasTechnology =
      mockData.productTechnologies.some(
        (item) =>
          item.productId === product.id &&
          item.technologyId === params.technologyId,
      );

    if (!hasTechnology) {
      return false;
    }
  }

  if (
    params.sellerId !== undefined &&
    product.sellerId !== params.sellerId
  ) {
    return false;
  }

  if (
    params.minPrice !== undefined &&
    effectivePrice(product) < params.minPrice
  ) {
    return false;
  }

  if (
    params.maxPrice !== undefined &&
    effectivePrice(product) > params.maxPrice
  ) {
    return false;
  }

  if (
    params.minRating !== undefined &&
    product.ratingAvg < params.minRating
  ) {
    return false;
  }

  if (
    params.onSale &&
    product.salePrice === null
  ) {
    return false;
  }

  if (
    params.isFeatured !== undefined &&
    product.isFeatured !== params.isFeatured
  ) {
    return false;
  }

  if (
    params.isTrending !== undefined &&
    product.isTrending !== params.isTrending
  ) {
    return false;
  }

  if (
    params.isStaffPick !== undefined &&
    product.isStaffPick !== params.isStaffPick
  ) {
    return false;
  }

  return true;
}

function toProductListItems(
  products: typeof mockProducts,
): ProductListItem[] {
  return products
    .map((product) =>
      getMockProductListItem(product.id),
    )
    .filter(
      (
        item,
      ): item is ProductListItem =>
        item !== null,
    );
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
  const page = Math.max(
    1,
    params.page ?? 1,
  );

  const perPage = Math.max(
    1,
    params.perPage ?? 12,
  );

  const products =
    mockProducts.filter((product) =>
      productMatches(product, params),
    );

  let items =
    toProductListItems(products);

  items = sortMockProducts(
    items,
    params.sort ?? "relevance",
  );

  const total = items.length;
  const start = (page - 1) * perPage;

  return {
    items: items.slice(
      start,
      start + perPage,
    ),
    total,
    page,
    perPage,
    totalPages: Math.max(
      1,
      Math.ceil(total / perPage),
    ),
  };
}

export async function recordProductView(
  productId: number,
) {
  const product = getProduct(productId);

  if (product) {
    product.views += 1;
  }

  return true;
}

export async function getProductBySlug(
  slug: string,
): Promise<
  (ProductDetail & {
    createdAt: Date;
  }) | null
> {
  const product =
    getMockProductBySlug(slug);

  if (!product) {
    return null;
  }

  const detail =
    getMockProductDetail(product.id);

  if (!detail) {
    return null;
  }

  return {
    ...detail,
    createdAt: product.createdAt,
  };
}

export async function getProductLicense(
  productId: number,
  licenseId: number,
) {
  const row =
    mockProductLicenses.find(
      (item) =>
        item.productId === productId &&
        item.licenseId === licenseId &&
        item.isAvailable,
    );

  if (!row) {
    return null;
  }

  const license =
    mockLicenses.find(
      (item) => item.id === row.licenseId,
    );

  const product =
    getProduct(productId);

  if (!license || !product) {
    return null;
  }

  return {
    id: row.id,
    licenseId: license.id,
    name: license.name,
    key: license.key,
    multiplier: license.multiplier,
    override: row.price,
    price: licensePrice(
      effectivePrice(product),
      license.multiplier,
      row.price,
    ),
  };
}

export async function getCategories() {
  return getMockVisibleCategories();
}

export async function getCategoryBySlug(
  slug: string,
) {
  return getMockCategoryBySlug(slug);
}

export async function getTechnologies() {
  return [...mockTechnologies]
    .filter(
      (technology) =>
        technology.isVisible,
    )
    .sort(
      (a, b) =>
        a.sortOrder -
        b.sortOrder,
    );
}

export async function getTechnologyBySlug(
  slug: string,
) {
  return getMockTechnologyBySlug(slug);
}

export async function getAllCategories() {
  return [...mockCategories].sort(
    (a, b) =>
      a.sortOrder -
      b.sortOrder,
  );
}

export async function getAllTechnologies() {
  return [...mockTechnologies].sort(
    (a, b) =>
      a.sortOrder -
      b.sortOrder,
  );
}

export async function getSellerByUsername(
  username: string,
): Promise<SellerPublic | null> {
  const seller =
    getMockSellerByUsername(username);

  if (
    !seller ||
    seller.status !== "ACTIVE"
  ) {
    return null;
  }

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

export async function getFeaturedSellers(
  limit = 6,
) {
  return getMockActiveSellers()
    .filter(
      (seller) =>
        seller.totalProducts > 0,
    )
    .slice(0, limit);
}

export async function getAllSellers() {
  return getMockActiveSellers();
}

export async function getCartLines(
  owner:
    | number
    | { userId: number }
    | { sessionKey: string },
): Promise<CartLine[]> {
  const items =
    mockCartItems.filter((item) => {
      if (typeof owner === "number") {
        return item.userId === owner;
      }

      if ("userId" in owner) {
        return item.userId === owner.userId;
      }

      return item.sessionKey === owner.sessionKey;
    });

  return items
    .map((item) => {
      const product =
        getProduct(item.productId);

      const seller = product
        ? getSeller(product.sellerId)
        : null;

      const image =
        getMockProductImages(
          item.productId,
        ).find(
          (img) => img.isPrimary,
        );

      const license =
        mockProductLicenses.find(
          (licenseItem) =>
            licenseItem.productId ===
              item.productId &&
            licenseItem.licenseId ===
              item.licenseId,
        );

      const licenseInfo = license
        ? mockLicenses.find(
            (licenseItem) =>
              licenseItem.id ===
              license.licenseId,
          )
        : null;

      if (
        !product ||
        !seller ||
        !license ||
        !licenseInfo
      ) {
        return null;
      }

      return {
        id: item.id,
        productId: product.id,
        productSlug: product.slug,
        productTitle: product.title,
        imageUrl: image?.url ?? null,
        sellerId: seller.id,
        sellerName: seller.storeName,
        licenseId: licenseInfo.id,
        licenseName: licenseInfo.name,
        unitPrice: licensePrice(
          effectivePrice(product),
          licenseInfo.multiplier,
          license.price,
        ),
      };
    })
    .filter(
      (item): item is CartLine =>
        item !== null,
    );
}

export async function getWishlistProducts(
  userId: number,
): Promise<WishlistProduct[]> {
  const wishlist =
    mockWishlist.filter(
      (item) => item.userId === userId,
    );

  const products: WishlistProduct[] = [];

  for (const wishlistItem of wishlist) {
    const product =
      getMockProductListItem(
        wishlistItem.productId,
      );

    if (!product) {
      continue;
    }

    products.push({
      ...product,
      productId: wishlistItem.productId,
    });
  }

  return products;
}

export async function getWishlistIds(
  userId: number,
) {
  return mockWishlist
    .filter(
      (item) => item.userId === userId,
    )
    .map(
      (item) => item.productId,
    );
}

export async function getComparisonProducts(
  userId: number,
) {
  const ids =
    mockComparisons
      .filter(
        (item) => item.userId === userId,
      )
      .map(
        (item) => item.productId,
      );

  return toProductListItems(
    mockProducts.filter(
      (product) =>
        ids.includes(product.id),
    ),
  );
}

export async function getOrders(
  userId: number,
): Promise<OrderRow[]> {
  return getMockOrderRows(userId);
}

export async function getOrderDetail(
  orderId: number,
  userId: number,
) {
  const order =
    mockOrders.find(
      (item) =>
        item.id === orderId &&
        item.userId === userId,
    );

  if (!order) {
    return null;
  }

  const items =
    mockOrderItems
      .filter(
        (item) =>
          item.orderId === orderId,
      )
      .map((item) => {
        const product =
          getProduct(item.productId);

        const image =
          product
            ? getMockProductImages(
                product.id,
              ).find(
                (img) =>
                  img.isPrimary,
              )
            : null;

        return {
          id: item.id,
          productId: item.productId,
          productSlug:
            product?.slug ?? "",
          productTitle:
            item.productTitle,
          imageUrl:
            image?.url ?? null,
          licenseName:
            item.licenseName,
          unitPrice:
            item.unitPrice,
          discount:
            item.discount,
          finalPrice:
            item.finalPrice,
          sellerName:
            getSeller(
              item.sellerId,
            )?.storeName ?? "",
        } satisfies OrderItemRow;
      });

  return {
    ...order,
    items,
  };
}

export async function getCustomerDownloads(
  userId: number,
) {
  const orderIds =
    mockOrders
      .filter(
        (order) =>
          order.userId === userId &&
          PAID_STATUSES.includes(
            order.status as
              (typeof PAID_STATUSES)[number],
          ),
      )
      .map(
        (order) => order.id,
      );

  const seen = new Set<number>();

  return mockOrderItems
    .filter((item) =>
      orderIds.includes(
        item.orderId,
      ),
    )
    .filter((item) => {
      if (seen.has(item.productId)) {
        return false;
      }

      seen.add(item.productId);

      return true;
    })
    .map((item) => {
      const product =
        getProduct(item.productId);

      const image =
        product
          ? getMockProductImages(
              product.id,
            ).find(
              (img) =>
                img.isPrimary,
            )
          : null;

      const license =
        mockProductLicenses.find(
          (licenseItem) =>
            licenseItem.productId ===
              item.productId &&
            licenseItem.licenseId ===
              item.licenseId,
        );

      const licenseInfo =
        license
          ? mockLicenses.find(
              (licenseItem) =>
                licenseItem.id ===
                license.licenseId,
            )
          : null;

      return {
        productId:
          item.productId,
        orderItemId:
          item.id,
        productSlug:
          product?.slug ?? "",
        productTitle:
          item.productTitle,
        imageUrl:
          image?.url ?? null,
        currentVersion:
          product?.currentVersion ?? "",
        version:
          product?.currentVersion ?? "",
        licenseName:
          licenseInfo?.name ??
          item.licenseName,
        lastUpdatedAt:
          product?.lastUpdatedAt ??
          item.createdAt,
        downloadedAt:
          item.createdAt,
      };
    });
}

export async function hasPurchased(
  userId: number,
  productId: number,
) {
  const orderIds =
    mockOrders
      .filter(
        (order) =>
          order.userId === userId &&
          PAID_STATUSES.includes(
            order.status as
              (typeof PAID_STATUSES)[number],
          ),
      )
      .map(
        (order) => order.id,
      );

  return mockOrderItems.some(
    (item) =>
      item.productId === productId &&
      orderIds.includes(
        item.orderId,
      ),
  );
}

export async function getReviews(
  productId: number,
): Promise<ReviewItem[]> {
  return getMockReviews(
    productId,
  ).map((review) => ({
    id: review.id,
    rating: review.rating,
    title: review.title,
    content: review.content,
    helpfulVotes:
      review.helpfulVotes,
    sellerReply:
      review.sellerReply,
    createdAt:
      review.createdAt,
    userName:
      getUserName(review.userId),
    orderItemId:
      review.orderItemId,
  }));
}

export async function getReviewSummary(
  productId: number,
) {
  const reviews =
    getMockReviews(productId);

  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  for (const review of reviews) {
    if (
      review.rating >= 1 &&
      review.rating <= 5
    ) {
      distribution[
        review.rating as keyof typeof distribution
      ] += 1;
    }
  }

  const count =
    reviews.length;

  const avg =
    count === 0
      ? 0
      : reviews.reduce(
          (sum, review) =>
            sum + review.rating,
          0,
        ) / count;

  return {
    avg,
    count,
    distribution,
  };
}

export async function getQuestions(
  productId: number,
): Promise<QuestionItem[]> {
  return getMockQuestions(
    productId,
  ).map((question) => ({
    id: question.id,
    question:
      question.question,
    sellerAnswer:
      question.sellerAnswer,
    createdAt:
      question.createdAt,
    userName:
      getUserName(question.userId),
  }));
}

export async function getReviewCriteria() {
  return [...mockReviewCriteria].sort(
    (a, b) =>
      a.sortOrder -
      b.sortOrder,
  );
}

export async function getUserReviews(
  userId: number,
) {
  return mockReviews
    .filter(
      (review) =>
        review.userId === userId,
    )
    .map((review) => {
      const product =
        getProduct(review.productId);

      return {
        ...review,
        userName:
          getUserName(review.userId),
        productId:
          review.productId,
        productSlug:
          product?.slug ?? "",
        productTitle:
          product?.title ?? "محصول",
      };
    });
}

export async function getUserTickets(
  userId: number,
) {
  return getMockSupportTickets(
    userId,
  );
}

export async function getTicketDetail(
  ticketId: number,
  owner:
    | number
    | { userId: number }
    | { sellerId: number },
  role?: string,
) {
  const ticket =
    mockSupportTickets.find(
      (item) =>
        item.id === ticketId,
    );

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
    typeof owner === "object" &&
      "sellerId" in owner
      ? owner.sellerId
      : undefined;

  const isAdmin =
    role === "ADMIN";

  const isSeller =
    sellerId !== undefined &&
    ticket.sellerId === sellerId;

  const isOwner =
    userId !== undefined &&
    ticket.userId === userId;

  if (
    !isAdmin &&
    !isSeller &&
    !isOwner
  ) {
    return null;
  }

  const messages =
    getMockSupportMessages(
      ticketId,
    ).map((message) => {
      const messageRecord =
        message as unknown as {
          userId?: number;
          authorId?: number;
          senderId?: number;
        };

      const authorId =
        messageRecord.authorId ??
        messageRecord.senderId ??
        messageRecord.userId;

      return {
        ...message,
        authorName:
          getUserName(authorId),
      };
    });

  return {
    ...ticket,
    status: ticket.status as string,
    messages,
  };
}

export async function getNotifications(
  userId: number,
) {
  return mockNotifications
    .filter(
      (item) =>
        item.userId === userId,
    )
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime(),
    );
}

export async function getUnreadNotificationCount(
  userId: number,
) {
  return mockNotifications.filter(
    (item) =>
      item.userId === userId &&
      !item.isRead,
  ).length;
}

export async function getSellerByUserIdForDashboard(
  userId: number,
) {
  return (
    mockSellers.find(
      (seller) =>
        seller.userId === userId,
    ) ?? null
  );
}

export async function getSellerBalance(
  sellerId: number,
) {
  return mockTransactions
    .filter(
      (transaction) =>
        transaction.sellerId === sellerId,
    )
    .reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0,
    );
}

export async function getSellerStats(
  sellerId: number,
) {
  const products =
    getMockSellerProducts(
      sellerId,
    );

  const productIds =
    new Set(
      products.map(
        (product) => product.id,
      ),
    );

  const sellerOrders =
    mockOrders.filter(
      (order) =>
        PAID_STATUSES.includes(
          order.status as
            (typeof PAID_STATUSES)[number],
        ) &&
        mockOrderItems.some(
          (item) =>
            item.orderId === order.id &&
            item.sellerId === sellerId,
        ),
    );

  const items =
    mockOrderItems.filter(
      (item) =>
        item.sellerId === sellerId &&
        sellerOrders.some(
          (order) =>
            order.id === item.orderId,
        ),
    );

  const revenue =
    items.reduce(
      (sum, item) =>
        sum + item.finalPrice,
      0,
    );

  const earnings =
    items.reduce(
      (sum, item) =>
        sum + item.sellerShare,
      0,
    );

  const views =
    products.reduce(
      (sum, product) =>
        sum + product.views,
      0,
    );

  return {
    revenue,
    orderCount:
      sellerOrders.length,
    earnings,
    views,
    balance:
      await getSellerBalance(
        sellerId,
      ),
    productCount:
      productIds.size,
  };
}

export async function getSellerProducts(
  sellerId: number,
) {
  return getMockSellerProducts(
    sellerId,
  );
}

export async function getSellerTransactions(
  sellerId: number,
) {
  return getMockSellerTransactions(
    sellerId,
  );
}

export async function getSellerWithdrawals(
  sellerId: number,
) {
  return getMockSellerWithdrawals(
    sellerId,
  );
}

export async function getSellerProductForEdit(
  sellerId: number,
  productId: number,
) {
  const product =
    mockProducts.find(
      (item) =>
        item.id === productId &&
        item.sellerId === sellerId,
    );

  if (!product) {
    return null;
  }

  return {
    ...product,
    images:
      getMockProductImages(
        productId,
      ),
    features:
      getMockProductFeatures(
        productId,
      ).map(
        (feature) =>
          feature.text,
      ),
    requirements:
      getMockProductRequirements(
        productId,
      ).map(
        (requirement) =>
          requirement.text,
      ),
    technologies:
      getMockProductTechnologies(
        productId,
      ),
    technologyIds:
      getMockProductTechnologies(
        productId,
      ).map(
        (technology) =>
          technology.technologyId,
      ),
    licenses:
      getMockProductLicenses(
        productId,
      ),
  };
}

export async function getSellerOrders(
  sellerId: number,
) {
  return mockOrderItems
    .filter(
      (item) =>
        item.sellerId === sellerId,
    )
    .map((item) => {
      const order =
        mockOrders.find(
          (candidate) =>
            candidate.id === item.orderId,
        );

      const product =
        getProduct(item.productId);

      const customer =
        order
          ? mockUsers.find(
              (user) =>
                user.id === order.userId,
            )
          : null;

      return {
        ...(order ?? {}),
        orderId:
          order?.id ?? item.orderId,
        orderNumber:
          order?.orderNumber ?? "",
        createdAt:
          order?.createdAt ??
          item.createdAt,
        status:
          order?.status ?? "PAID",
        productId:
          item.productId,
        productTitle:
          item.productTitle ||
          product?.title ||
          "محصول",
        customerName:
          customer?.name ?? "کاربر",
        finalPrice:
          item.finalPrice,
        sellerShare:
          item.sellerShare,
        unitPrice:
          item.unitPrice,
        discount:
          item.discount,
        licenseName:
          item.licenseName,
      };
    })
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime(),
    );
}

export async function getSellerReviews(
  sellerId: number,
) {
  return getMockSellerReviews(
    sellerId,
  ).map((review) => {
    const product =
      getProduct(review.productId);

    return {
      ...review,
      userName:
        getUserName(review.userId),
      productTitle:
        product?.title ?? "محصول",
      productSlug:
        product?.slug ?? "",
    };
  });
}

export async function getSellerQuestions(
  sellerId: number,
) {
  return getMockSellerQuestions(
    sellerId,
  ).map((question) => {
    const product =
      getProduct(question.productId);

    return {
      ...question,
      userName:
        getUserName(question.userId),
      productTitle:
        product?.title ?? "محصول",
      productSlug:
        product?.slug ?? "",
    };
  });
}

export async function getSellerTickets(
  sellerId: number,
) {
  return mockSupportTickets
    .filter(
      (ticket) =>
        ticket.sellerId === sellerId,
    )
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime(),
    );
}

export async function getAdminStats() {
  const paidOrders =
    mockOrders.filter((order) =>
      PAID_STATUSES.includes(
        order.status as
          (typeof PAID_STATUSES)[number],
      ),
    );

  const pendingProducts =
    mockProducts.filter(
      (product) =>
        [
          "SUBMITTED",
          "UNDER_REVIEW",
          "CHANGES_REQUESTED",
        ].includes(product.status),
    );

  const pendingApplications =
    mockSellers.filter(
      (seller) =>
        seller.status !== "ACTIVE",
    );

  const pendingWithdrawals =
    mockWithdrawals.filter(
      (withdrawal) =>
        withdrawal.status === "REQUESTED",
    );

  const openReports =
    mockReports.filter(
      (report) =>
        report.status === "OPEN",
    );

  const productsCount =
    mockProducts.filter(
      (product) =>
        product.deletedAt === null,
    ).length;

  const sellersCount =
    mockSellers.filter(
      (seller) =>
        seller.status === "ACTIVE",
    ).length;

  return {
    revenue:
      paidOrders.reduce(
        (sum, order) =>
          sum + order.total,
        0,
      ),
    orderCount:
      mockOrders.length,
    ordersCount:
      mockOrders.length,
    userCount:
      mockUsers.length,
    usersCount:
      mockUsers.length,
    productCount:
      productsCount,
    productsCount,
    sellerCount:
      sellersCount,
    sellersCount,
    pendingProducts:
      pendingProducts.length,
    pendingSellerApplications:
      pendingApplications.length,
    pendingSellers:
      pendingApplications.length,
    pendingWithdrawals:
      pendingWithdrawals.length,
    openReports:
      openReports.length,
  };
}

export async function getAdminUsers() {
  return mockUsers;
}

export async function getAdminSellerApplications() {
  return mockSellers.map(
    (seller) => {
      const user =
        mockUsers.find(
          (candidate) =>
            candidate.id === seller.userId,
        );

      const status:
        | "PENDING"
        | "APPROVED"
        | "REJECTED" =
        "PENDING";

      return {
        id: seller.id,
        userId: seller.userId,
        userName:
          user?.name ?? "کاربر",
        userEmail:
          user?.email ?? "",
        username:
          seller.username,
        storeName:
          seller.storeName,
        status,
        description:
          seller.bio ?? "",
        portfolioUrl:
          seller.coverUrl ?? null,
        createdAt:
          seller.createdAt,
        user,
      };
    },
  );
}

export async function getAdminProducts() {
  return toProductListItems(
    mockProducts.filter(
      (product) =>
        product.deletedAt === null,
    ),
  );
}

export async function getAdminProductDetail(
  productId: number,
) {
  const product =
    getProduct(productId);

  const detail =
    getMockProductDetail(
      productId,
    );

  if (!product || !detail) {
    return null;
  }

  return {
    ...detail,
    createdAt:
      product.createdAt,
  };
}

export async function getAdminWithdrawals() {
  return mockWithdrawals.map(
    (withdrawal) => {
      const seller =
        getSeller(
          withdrawal.sellerId,
        );

      return {
        ...withdrawal,
        seller,
        sellerName:
          seller?.storeName ??
          "فروشنده",
        sellerUsername:
          seller?.username ?? "",
      };
    },
  );
}

export async function getAdminReports() {
  return mockReports.map(
    (report) => ({
      ...report,
      reporter:
        mockUsers.find(
          (user) =>
            user.id === report.reporterId,
        ) ?? null,
      reporterName:
        getUserName(
          report.reporterId,
        ),
    }),
  );
}

export async function getAdminCoupons() {
  return mockCoupons;
}

export async function getAdminOrders(): Promise<
  AdminOrderRow[]
> {
  const result: AdminOrderRow[] = [];

  for (const order of mockOrders) {
    const customer =
      mockUsers.find(
        (user) =>
          user.id === order.userId,
      );

    const items =
      getMockOrderItems(order.id);

    if (items.length === 0) {
      result.push({
        ...order,
        customerName:
          customer?.name ?? "کاربر",
        productTitle:
          "سفارش",
        finalPrice:
          order.total,
        sellerShare:
          0,
        sellerName:
          "فروشنده",
        licenseName:
          "",
        itemId:
          0,
        items,
      });

      continue;
    }

    for (const item of items) {
      result.push({
        ...order,
        customerName:
          customer?.name ?? "کاربر",
        productTitle:
          item.productTitle,
        finalPrice:
          item.finalPrice,
        sellerShare:
          item.sellerShare,
        sellerName:
          getSeller(
            item.sellerId,
          )?.storeName ??
          "فروشنده",
        licenseName:
          item.licenseName,
        itemId:
          item.id,
        items,
      });
    }
  }

  return result;
}

export async function getCollections() {
  return mockCollections
    .filter(
      (collection) =>
        collection.isVisible,
    )
    .sort(
      (a, b) =>
        a.sortOrder -
        b.sortOrder,
    );
}

export async function getCollectionBySlug(
  slug: string,
) {
  const collection =
    getMockCollectionBySlug(
      slug,
    );

  if (!collection) {
    return null;
  }

  const productIds =
    mockCollectionProducts
      .filter(
        (item) =>
          item.collectionId ===
          collection.id,
      )
      .sort(
        (a, b) =>
          a.sortOrder -
          b.sortOrder,
      )
      .map(
        (item) =>
          item.productId,
      );

  const products =
    toProductListItems(
      productIds
        .map((id) =>
          getProduct(id),
        )
        .filter(
          (
            product,
          ): product is (typeof mockProducts)[number] =>
            product !== null,
        ),
    );

  return {
    ...collection,
    productIds,
    products,
  };
}

export async function getBlogPosts(
  limit?: number,
) {
  const posts =
    mockBlogPosts
      .filter(
        (post) =>
          post.status === "PUBLISHED",
      )
      .sort(
        (a, b) =>
          (b.publishedAt?.getTime() ?? 0) -
          (a.publishedAt?.getTime() ?? 0),
      )
      .map((post) => ({
        ...post,
        author:
          mockUsers.find(
            (user) =>
              user.id === post.authorId,
          ) ?? null,
        authorName:
          getUserName(
            post.authorId,
          ),
      }));

  return limit
    ? posts.slice(0, limit)
    : posts;
}

export async function getBlogPost(
  slug: string,
) {
  const post =
    getMockBlogPostBySlug(slug);

  if (
    !post ||
    post.status !== "PUBLISHED"
  ) {
    return null;
  }

  return {
    ...post,
    author:
      mockUsers.find(
        (user) =>
          user.id === post.authorId,
      ) ?? null,
    authorName:
      getUserName(
        post.authorId,
      ),
  };
}

export async function getAdminBlogPosts() {
  return [
    ...mockBlogPosts,
  ].sort(
    (a, b) =>
      b.createdAt.getTime() -
      a.createdAt.getTime(),
  );
}

export async function getPage(
  slug: string,
) {
  return getMockPageBySlug(slug);
}

export async function getSiteSettings() {
  return Object.fromEntries(
    mockSettings.map(
      (setting) => [
        setting.key,
        setting.value,
      ],
    ),
  );
}