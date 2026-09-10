import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { BaseApiResponse } from "@/types/baseApi";

export interface Product {
  id: string;
  name: string;
  externalSku?: string;
  thumbnailUrl?: string;
  categoryName?: string;
  pricing?: {
    minPrice: number | null;
    maxPrice: number | null;
  };
  basePrice?: number | null;
  settlementPrice?: number | null;
  quantity?: number;
  status?: string;
  rating?: number;
  ratingCount?: number;
  vendorId?: string;
  vendorName?: string;
  updatedAt?: string;
}

export interface PaginatedMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  currentRows: number;
  totalRows: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetProductsResponse extends BaseApiResponse<{
  data: Product[];
  meta: PaginatedMeta;
}> {}

const productsApi = {
  // Get all products
  getAll: (): Promise<GetProductsResponse> => {
    return apiService({
      method: "GET",
      endpoint: apiPaths.products.getAll,
    });
  },

  // Get product by ID
  getById: (productId: string): Promise<BaseApiResponse<Product>> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.products.getById}/${productId}`,
    });
  },
};

export default productsApi;
