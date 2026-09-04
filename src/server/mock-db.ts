import {
  mockCategories,
  mockTechnologies,
  mockSellers,
  mockProducts,
  mockProductImages,
  mockProductFeatures,
  mockProductRequirements,
  mockProductTechnologies,
  mockProductLicenses,
  mockLicenses,
  mockReviews,
  mockQuestions,
  mockReviewCriteria,
  mockWishlist,
  mockComparisons,
  mockCartItems,
  mockOrders,
  mockOrderItems,
  mockTransactions,
  mockWithdrawals,
  mockNotifications,
  mockSupportTickets,
  mockSupportMessages,
  mockReports,
  mockCoupons,
  mockCollections,
  mockCollectionProducts,
  mockBlogPosts,
  mockPages,
  mockSettings,
} from "./mock-data";

export {
  mockCategories,
  mockTechnologies,
  mockSellers,
  mockProducts,
  mockProductImages,
  mockProductFeatures,
  mockProductRequirements,
  mockProductTechnologies,
  mockProductLicenses,
  mockLicenses,
  mockReviews,
  mockQuestions,
  mockReviewCriteria,
  mockWishlist,
  mockComparisons,
  mockCartItems,
  mockOrders,
  mockOrderItems,
  mockTransactions,
  mockWithdrawals,
  mockNotifications,
  mockSupportTickets,
  mockSupportMessages,
  mockReports,
  mockCoupons,
  mockCollections,
  mockCollectionProducts,
  mockBlogPosts,
  mockPages,
  mockSettings,
};

export const mockData = {
  categories: mockCategories,
  technologies: mockTechnologies,
  sellers: mockSellers,
  products: mockProducts,
  productImages: mockProductImages,
  productFeatures: mockProductFeatures,
  productRequirements: mockProductRequirements,
  productTechnologies: mockProductTechnologies,
  productLicenses: mockProductLicenses,
  licenses: mockLicenses,
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

export function getMockCategoryBySlug(slug: string) {
  return mockCategories.find((category) => category.slug === slug) ?? null;
}

export function getMockTechnologyBySlug(slug: string) {
  return mockTechnologies.find((technology) => technology.slug === slug) ?? null;
}

export function getMockSellerByUsername(username: string) {
  return (
    mockSellers.find((seller) => seller.username === username) ?? null
  );
}

export function getMockProductBySlug(slug: string) {
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

export function getMockPageBySlug(slug: string) {
  return mockPages.find((page) => page.slug === slug) ?? null;
}

export function getMockBlogPostBySlug(slug: string) {
  return mockBlogPosts.find((post) => post.slug === slug) ?? null;
}

export function getMockCollectionBySlug(slug: string) {
  return mockCollections.find((collection) => collection.slug === slug) ?? null;
}

export function getMockVisibleCategories() {
  return mockCategories
    .filter((category) => category.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getMockActiveSellers() {
  return mockSellers
    .filter((seller) => seller.status === "ACTIVE")
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      return b.totalSales - a.totalSales;
    });
}

export function getMockPublishedProducts() {
  return mockProducts.filter((product) => product.status === "PUBLISHED");
}

export function getMockProductImages(productId: number) {
  return mockProductImages.filter((image) => image.productId === productId);
}

export function getMockProductFeatures(productId: number) {
  return mockProductFeatures
    .filter((feature) => feature.productId === productId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getMockProductRequirements(productId: number) {
  return mockProductRequirements
    .filter((requirement) => requirement.productId === productId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getMockProductTechnologies(productId: number) {
  return mockProductTechnologies.filter(
    (technology) => technology.productId === productId,
  );
}

export function getMockProductLicenses(productId: number) {
  return mockProductLicenses.filter(
    (license) => license.productId === productId,
  );
}

export function getMockReviews(productId: number) {
  return mockReviews
    .filter(
      (review) =>
        review.productId === productId && review.status === "PUBLISHED",
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockQuestions(productId: number) {
  return mockQuestions
    .filter((question) => question.productId === productId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockCartItems(userId: number) {
  return mockCartItems.filter((item) => item.userId === userId);
}

export function getMockWishlist(userId: number) {
  return mockWishlist.filter((item) => item.userId === userId);
}

export function getMockComparisons(userId: number) {
  return mockComparisons.filter((item) => item.userId === userId);
}

export function getMockOrders(userId: number) {
  return mockOrders
    .filter((order) => order.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockOrderItems(orderId: number) {
  return mockOrderItems.filter((item) => item.orderId === orderId);
}

export function getMockNotifications(userId: number) {
  return mockNotifications
    .filter((notification) => notification.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockSupportTickets(userId: number) {
  return mockSupportTickets
    .filter((ticket) => ticket.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockSupportMessages(ticketId: number) {
  return mockSupportMessages
    .filter((message) => message.ticketId === ticketId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export function getMockSellerProducts(sellerId: number) {
  return mockProducts
    .filter((product) => product.sellerId === sellerId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockSellerReviews(sellerId: number) {
  const sellerProductIds = new Set(
    mockProducts
      .filter((product) => product.sellerId === sellerId)
      .map((product) => product.id),
);

  return mockReviews
    .filter((review) => sellerProductIds.has(review.productId))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockSellerQuestions(sellerId: number) {
  const sellerProductIds = new Set(
    mockProducts
      .filter((product) => product.sellerId === sellerId)
      .map((product) => product.id),
  );

  return mockQuestions
    .filter((question) => sellerProductIds.has(question.productId))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockSellerTransactions(sellerId: number) {
  return mockTransactions
    .filter((transaction) => transaction.sellerId === sellerId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getMockSellerWithdrawals(sellerId: number) {
  return mockWithdrawals
    .filter((withdrawal) => withdrawal.sellerId === sellerId)
    .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
}