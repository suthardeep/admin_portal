import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { BaseApiResponse } from "@/types/baseApi";

export interface Brand {
  id: string;
  vendorId: string;
  brandName: string;
  natureOfBusiness: string;
  website?: string;
  socialMedia?: string;
  brandLogoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface GetBrandsResponse extends BaseApiResponse<{
  data: Brand[];
  meta: PaginatedMeta;
}> {}

const brandsApi = {
  // Get all brands
  getAll: (): Promise<GetBrandsResponse> => {
    return apiService({
      method: "GET",
      endpoint: apiPaths.brands.getAll,
    });
  },

  // Get brand by ID
  getById: (brandId: string): Promise<BaseApiResponse<Brand>> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.brands.getById}/${brandId}`,
    });
  },
};

export default brandsApi;
