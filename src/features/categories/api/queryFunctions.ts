import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  GetAllCategoriesResponse,
  GetCategoryDetailsResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  GetAllCategoriesParams,
  UpdateCategoryParams,
  // Tier types
  CreateTierPayload,
  GetAllTiersResponse,
  CreateTierResponse,
  UpdateTierResponse,
  DeleteTierResponse,
  GetAllTiersParams,
  UpdateTierParams,
} from "../types/category";

const categoriesApi = {
  // Get all categories with pagination and search
  getAllCategories: (params: GetAllCategoriesParams): Promise<GetAllCategoriesResponse> => {
    // Filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;
    
    return apiService({
      method: "GET",
      endpoint: apiPaths.categories.getAll,
      params: cleanParams,
    });
  },

  // Get category details by ID
  getCategoryDetails: (categoryId: string): Promise<GetCategoryDetailsResponse> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.categories.getById}/${categoryId}`,
    });
  },

  // Create new category
  createCategory: (data: CreateCategoryPayload): Promise<CreateCategoryResponse> => {
    console.log('🔥 API createCategory called with data:', data);
    console.log('🔥 API endpoint:', apiPaths.categories.create);
    return apiService({
      method: "POST",
      endpoint: apiPaths.categories.create,
      data: data,
    });
  },

  // Update existing category
  updateCategory: ({ categoryId, data }: UpdateCategoryParams): Promise<UpdateCategoryResponse> => {
    return apiService({
      method: "PUT",
      endpoint: `${apiPaths.categories.updateById}/${categoryId}`,
      data: data,
    });
  },

  // Delete category
  deleteCategory: (categoryId: string): Promise<DeleteCategoryResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.categories.deleteById}/${categoryId}`,
    });
  },

  // Toggle category active status
  toggleCategoryStatus: (categoryId: string): Promise<UpdateCategoryResponse> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.categories.toggleStatus}/${categoryId}`,
    });
  },
};

// Tiers API
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

export default categoriesApi;
export { tiersApi };