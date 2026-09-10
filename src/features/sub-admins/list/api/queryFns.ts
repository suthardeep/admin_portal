// sub-admins/api/queryFns.ts
import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  CreateSubAdminPayload,
  UpdateSubAdminPayload,
  GetAllSubAdminsResponse,
  GetSubAdminDetailsResponse,
  CreateSubAdminResponse,
  UpdateSubAdminResponse,
  DeleteSubAdminResponse,
} from "../types/subAdmin";

// Parameters for getting all sub-admins
export interface GetAllSubAdminsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Parameters for updating sub-admin
export interface UpdateSubAdminParams {
  adminId: string;
  data: UpdateSubAdminPayload;
}

const subAdminsApi = {
  // Get all sub-admins with pagination and search
  getAllSubAdmins: (params: GetAllSubAdminsParams): Promise<GetAllSubAdminsResponse> => {
    // Filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;
    
    return apiService({
      method: "GET",
      endpoint: apiPaths.subAdmins.getAll,
      params: cleanParams,
    });
  },

  // Get sub-admin details by ID
  getSubAdminDetails: (adminId: string): Promise<GetSubAdminDetailsResponse> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.subAdmins.getById}/${adminId}`,
    });
  },

  // Create new sub-admin
  createSubAdmin: (data: CreateSubAdminPayload): Promise<CreateSubAdminResponse> => {
    console.log('🔥 API createSubAdmin called with data:', data);
    console.log('🔥 API endpoint:', apiPaths.subAdmins.create);
    return apiService({
      method: "POST",
      endpoint: apiPaths.subAdmins.create,
      data: data,
    });
  },

  // Update existing sub-admin
  updateSubAdmin: ({ adminId, data }: UpdateSubAdminParams): Promise<UpdateSubAdminResponse> => {
    return apiService({
      method: "PUT",
      endpoint: `${apiPaths.subAdmins.updateById}/${adminId}`,
      data: data,
    });
  },

  // Delete sub-admin
  deleteSubAdmin: (adminId: string): Promise<DeleteSubAdminResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.subAdmins.deleteById}/${adminId}`,
    });
  },
};

export default subAdminsApi;