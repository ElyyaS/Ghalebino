import "server-only";

import { listProducts } from "@/server/queries";
import type { ProductListItem, SortOption } from "@/lib/types";

export interface SearchFilters {
  q?: string;
  categoryId?: number;
  technologyId?: number;
  sellerId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onSale?: boolean;
}

export interface SearchQuery extends SearchFilters {
  page: number;
  perPage: number;
  sort: SortOption;
}

export interface SearchResult {
  items: ProductListItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface SearchProvider {
  search(query: SearchQuery): Promise<SearchResult>;
}

/**
 * Default provider backed by PostgreSQL full-ish text search.
 * The interface allows swapping in Meilisearch/Elasticsearch/Algolia later
 * without changing the rest of the application.
 */
export class DbSearchProvider implements SearchProvider {
  async search(query: SearchQuery): Promise<SearchResult> {
    return listProducts({ ...query, status: "PUBLISHED" });
  }
}

export const searchProvider: SearchProvider = new DbSearchProvider();
