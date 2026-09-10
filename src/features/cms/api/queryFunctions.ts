import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { BaseApiResponse } from "@/types/baseApi";
import type { Section, GetSectionsResponse, CreateSectionPayload, UpdateSectionPayload } from "../types/section";

const cmsApi = {
  // Get all sections
  getAll: (params?: { page?: number; pageSize?: number; search?: string }): Promise<GetSectionsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${apiPaths.sections.getAll}?${queryString}` : apiPaths.sections.getAll;

    return apiService({
      method: "GET",
      endpoint,
    });
  },

  // Get section by ID
  getById: (sectionId: string): Promise<BaseApiResponse<Section>> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.sections.getById}/${sectionId}`,
    });
  },

  // Create section
  create: (data: CreateSectionPayload): Promise<BaseApiResponse<Section>> => {
    return apiService({
      method: "POST",
      endpoint: apiPaths.sections.create,
      data,
    });
  },

  // Update section
  update: (sectionId: string, data: UpdateSectionPayload): Promise<BaseApiResponse<Section>> => {
    return apiService({
      method: "PUT",
      endpoint: `${apiPaths.sections.updateById}/${sectionId}`,
      data,
    });
  },

  // Delete section
  delete: (sectionId: string): Promise<BaseApiResponse<void>> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.sections.deleteById}/${sectionId}`,
    });
  },

  // Toggle section active status
  toggleActive: (sectionId: string): Promise<BaseApiResponse<Section>> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.sections.toggleActive}/${sectionId}/toggle-active`,
    });
  },
};

export default cmsApi;
