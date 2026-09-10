import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  GetAllVendorsResponse,
  GetVendorDetailsResponse,
  DeleteVendorResponse,
  ApproveVendorResponse,
  RejectVendorResponse,
  GetAllVendorsParams,
  ApproveVendorPayload,
  RejectVendorPayload,
} from '../types/vendor';

const vendorsApi = {
  // Get all vendors with pagination and search
  getAllVendors: (params: GetAllVendorsParams): Promise<GetAllVendorsResponse> => {
    // Filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;

    return apiService({
      method: "GET",
      endpoint: apiPaths.vendors.getAll,
      params: cleanParams,
    });
  },

  // Get vendor by ID
  getVendorById: (vendorId: string): Promise<GetVendorDetailsResponse> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.vendors.getAll}/${vendorId}`,
    });
  },

  // Delete vendor
  deleteVendor: (vendorId: string): Promise<DeleteVendorResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.vendors.getAll}/${vendorId}`,
    });
  },

  // Toggle vendor status
  toggleVendorStatus: (vendorId: string): Promise<DeleteVendorResponse> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.vendors.getAll}/${vendorId}/toggle-status`,
    });
  },

  // Approve vendor
  approveVendor: (vendorId: string, data?: ApproveVendorPayload): Promise<ApproveVendorResponse> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.vendors.getAll}/${vendorId}/verify`,
      data,
    });
  },

  // Reject vendor
  rejectVendor: (vendorId: string, data: RejectVendorPayload): Promise<RejectVendorResponse> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.vendors.getAll}/${vendorId}/reject`,
      data,
    });
  },
};

export default vendorsApi;
