import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  CreateBannerPayload,
  UpdateBannerPayload,
  GetAllBannersResponse,
  GetBannerDetailsResponse,
  CreateBannerResponse,
  UpdateBannerResponse,
  DeleteBannerResponse,
  GetAllBannersParams,
  UpdateBannerParams,
} from "../types/banner";

const bannersApi = {
  // Get all banners with pagination and search
  getAllBanners: (params: GetAllBannersParams): Promise<GetAllBannersResponse> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;

    return apiService({
      method: "GET",
      endpoint: apiPaths.banners.getAll,
      params: cleanParams,
    });
  },

  // Get banner details by ID
  getBannerDetails: (bannerId: string): Promise<GetBannerDetailsResponse> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.banners.getById}/${bannerId}`,
    });
  },

  // Create new banner
  createBanner: (data: CreateBannerPayload): Promise<CreateBannerResponse> => {
    console.log('🔥 API createBanner called with data:', data);
    console.log('🔥 API endpoint:', apiPaths.banners.create);
    return apiService({
      method: "POST",
      endpoint: apiPaths.banners.create,
      data: data,
    });
  },

  // Update existing banner
  updateBanner: ({ bannerId, data }: UpdateBannerParams): Promise<UpdateBannerResponse> => {
    return apiService({
      method: "PUT",
      endpoint: `${apiPaths.banners.updateById}/${bannerId}`,
      data: data,
    });
  },

  // Delete banner
  deleteBanner: (bannerId: string): Promise<DeleteBannerResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.banners.deleteById}/${bannerId}`,
    });
  },
};

export default bannersApi;
