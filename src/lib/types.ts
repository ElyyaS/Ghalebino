export type ProductListItem = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  ratingAvg: number;
  ratingCount: number;
  salesCount: number;
  currentVersion: string;
  lastUpdatedAt: Date;
  status: string;
  imageUrl: string | null;
  demoUrl: string | null;
  sellerId: number;
  sellerName: string;
  sellerUsername: string;
  sellerRating: number;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
};

export type TechnologyRef = { id: number; name: string; slug: string; kind: string };

export type ProductLicenseRef = {
  id: number;
  licenseId: number;
  licenseName: string;
  licenseKey: string;
  price: number;
};

export type ProductDetail = ProductListItem & {
  description: string;
  seoTitle: string | null;
  seoDescription: string | null;
  documentationUrl: string | null;
  supportNote: string | null;
  features: string[];
  requirements: string[];
  images: { url: string; alt: string | null }[];
  technologies: TechnologyRef[];
  licenses: ProductLicenseRef[];
  sellerBio: string | null;
  sellerTagline: string | null;
  sellerAvatarUrl: string | null;
  sellerSalesCount: number;
};

export type SellerPublic = {
  id: number;
  username: string;
  storeName: string;
  tagline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  rating: number;
  ratingCount: number;
  totalSales: number;
  totalProducts: number;
  responseTime: string | null;
  joinedAt: Date;
};

export type ReviewItem = {
  id: number;
  rating: number;
  title: string | null;
  content: string | null;
  helpfulVotes: number;
  sellerReply: string | null;
  createdAt: Date;
  userName: string;
  orderItemId: number | null;
};

export type QuestionItem = {
  id: number;
  question: string;
  sellerAnswer: string | null;
  createdAt: Date;
  userName: string;
};

export type CartLine = {
  id: number;
  productId: number;
  productSlug: string;
  productTitle: string;
  imageUrl: string | null;
  sellerId: number;
  sellerName: string;
  licenseId: number;
  licenseName: string;
  unitPrice: number;
};

export type OrderItemRow = {
  id: number;
  productId: number;
  productSlug: string;
  productTitle: string;
  imageUrl: string | null;
  licenseName: string;
  unitPrice: number;
  discount: number;
  finalPrice: number;
  sellerName: string;
};

export type OrderRow = {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: Date;
  itemsCount: number;
};

export type SortOption =
  | "relevance"
  | "newest"
  | "best_sellers"
  | "highest_rated"
  | "trending"
  | "recently_updated"
  | "price_asc"
  | "price_desc";
