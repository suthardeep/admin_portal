import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  CreateTierPayload,
  GetAllTiersResponse,
  GetTierByIdResponse,
  CreateTierResponse,
  UpdateTierResponse,
  DeleteTierResponse,
  GetAllTiersParams,
  UpdateTierParams,
} from "@/features/categories/types/category";

const tiersApi = {
  // Get all tiers with pagination and search
  getAllTiers: (params: GetAllTiersParams): Promise<GetAllTiersResponse> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;

    return apiService({
      method: "GET",
      endpoint: apiPaths.tiers.getAll,
      params: cleanParams,
    });
  },

  // Get tier by ID
  getTierById: (tierId: string): Promise<GetTierByIdResponse> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.tiers.getById}/${tierId}`,
    });
  },

  // Create new tier
  createTier: (data: CreateTierPayload): Promise<CreateTierResponse> => {
    return apiService({
      method: "POST",
      endpoint: apiPaths.tiers.create,
      data: data,
    });
  },

  // Update existing tier
  updateTier: ({ tierId, data }: UpdateTierParams): Promise<UpdateTierResponse> => {
    return apiService({
      method: "PUT",
      endpoint: `${apiPaths.tiers.updateById}/${tierId}`,
      data: data,
    });
  },

  // Delete tier
  deleteTier: (tierId: string): Promise<DeleteTierResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.tiers.deleteById}/${tierId}`,
    });
  },
};

export default tiersApi;
