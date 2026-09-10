import { apiService } from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  HomeScreen,
  CreateHomeScreenPayload,
  UpdateHomeScreenPayload,
  GetHomeScreensParams,
  GetHomeScreensResponse,
} from "../types/home";

const homeApi = {
  /**
   * Get all home screens with pagination and filters
   */
  getAll: async (params?: GetHomeScreensParams): Promise<GetHomeScreensResponse> => {
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : {};

    const response: any = await apiService({
      method: "GET",
      endpoint: apiPaths.home.getAll,
      params: cleanParams as Record<string, string | number | boolean>,
    });

    // The API already returns the correct structure: { data: [...], meta: {...} }
    // Transform it to match BaseApiResponse<PaginatedResponse<HomeScreen>>
    return {
      data: {
        data: response.data,
        meta: response.meta,
      },
      statusCode: response.statusCode || 200,
    };
  },

  /**
   * Get home screen by ID
   */
  getById: (homeId: string): Promise<HomeScreen> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.home.getById}/${homeId}`,
    });
  },

  /**
   * Create a new home screen
   */
  create: (data: CreateHomeScreenPayload): Promise<HomeScreen> => {
    return apiService({
      method: "POST",
      endpoint: apiPaths.home.create,
      data,
    });
  },

  /**
   * Update an existing home screen
   */
  update: (homeId: string, data: UpdateHomeScreenPayload): Promise<HomeScreen> => {
    return apiService({
      method: "POST",
      endpoint: `${apiPaths.home.updateById}/${homeId}`,
      data,
    });
  },

  /**
   * Delete a home screen
   */
  delete: (homeId: string): Promise<void> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.home.deleteById}/${homeId}`,
    });
  },
};

export default homeApi;
