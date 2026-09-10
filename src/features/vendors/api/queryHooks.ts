import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import vendorsApi from './queryFunctions';
import type {
  GetAllVendorsResponse,
  GetVendorDetailsResponse,
  VendorListItem,
  VendorDetails,
  DeleteVendorResponse,
  ApproveVendorResponse,
  RejectVendorResponse,
  GetAllVendorsParams,
  RejectVendorPayload,
} from '../types/vendor';
import { PaginationMeta } from '@/types/baseApi';

// Define query keys for effective caching and invalidation
export const vendorsQueryKeys = {
  all: ['vendors'] as const,
  lists: (params: GetAllVendorsParams) => [...vendorsQueryKeys.all, 'list', params] as const,
  details: () => [...vendorsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...vendorsQueryKeys.details(), id] as const,
};

// Define the shape of the data returned by the list hook
type VendorsListResult = { data: VendorListItem[]; meta: PaginationMeta };

// --- GET All Vendors Hook ---
export const useGetAllVendorsQuery = (params: GetAllVendorsParams) => {
  return useQuery<GetAllVendorsResponse | VendorsListResult, Error, VendorsListResult>({
    queryKey: vendorsQueryKeys.lists(params),
    queryFn: () => {
      return vendorsApi.getAllVendors(params);
    },
    // Select function extracts data and meta from the nested response structure
    select: (response) => {
      // Real API response needs extraction
      const apiResponse = response as GetAllVendorsResponse;
      return {
        data: apiResponse.data.data,
        meta: apiResponse.data.meta,
      };
    },
  });
};

// --- Delete Vendor Hook (useMutation) ---
export const useDeleteVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteVendorResponse, Error, string>({
    mutationFn: (vendorId: string) => vendorsApi.deleteVendor(vendorId),
    // Invalidate all vendor queries after deletion
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorsQueryKeys.all });
    },
  });
};

// --- Toggle Vendor Status Hook (useMutation) ---
export const useToggleVendorStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteVendorResponse, Error, string>({
    mutationFn: (vendorId: string) => vendorsApi.toggleVendorStatus(vendorId),
    // Invalidate queries to refresh the data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorsQueryKeys.all });
    },
  });
};

// --- GET Vendor Details Hook ---
export const useGetVendorDetailsQuery = (vendorId: string) => {
  return useQuery<GetVendorDetailsResponse, Error, VendorDetails>({
    queryKey: vendorsQueryKeys.detail(vendorId),
    queryFn: () => vendorsApi.getVendorById(vendorId),
    select: (response) => response.data,
    enabled: !!vendorId,
  });
};

// --- Approve Vendor Hook (useMutation) ---
export const useApproveVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveVendorResponse, Error, string>({
    mutationFn: (vendorId: string) => vendorsApi.approveVendor(vendorId),
    onSuccess: (_, vendorId) => {
      queryClient.invalidateQueries({ queryKey: vendorsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: vendorsQueryKeys.detail(vendorId) });
    },
  });
};

// --- Reject Vendor Hook (useMutation) ---
export const useRejectVendorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RejectVendorResponse, Error, { vendorId: string; data: RejectVendorPayload }>({
    mutationFn: ({ vendorId, data }) => vendorsApi.rejectVendor(vendorId, data),
    onSuccess: (_, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: vendorsQueryKeys.detail(vendorId) });
    },
  });
};