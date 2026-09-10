import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import bannersApi from './queryFunctions';
import type {
  CreateBannerPayload,
  GetAllBannersResponse,
  Banner,
  CreateBannerResponse,
  UpdateBannerResponse,
  DeleteBannerResponse,
  GetAllBannersParams,
  UpdateBannerParams,
} from '../types/banner';
import { PaginationMeta } from '@/types/baseApi';

// Define query keys for effective caching and invalidation
export const bannersQueryKeys = {
  all: ['banners'] as const,
  lists: (params: GetAllBannersParams) => [...bannersQueryKeys.all, 'list', params] as const,
  details: () => [...bannersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...bannersQueryKeys.details(), id] as const,
};

// Define the shape of the data returned by the list hook
type BannersListResult = { data: Banner[]; meta: PaginationMeta };

// --- GET All Banners Hook ---
export const useGetBannersQuery = (params: GetAllBannersParams) => {
  return useQuery<GetAllBannersResponse | BannersListResult, Error, BannersListResult>({
    queryKey: bannersQueryKeys.lists(params),
    queryFn: () => {
      return bannersApi.getAllBanners(params);
    },
    // Select function extracts data and meta from the response structure
    select: (response) => {
      // Check if response has nested data structure
      const apiResponse = response as any;

      // Handle both flat and nested response formats
      if (apiResponse.data?.data) {
        // Nested format: { data: { data: [], meta: {} } }
        return {
          data: apiResponse.data.data,
          meta: apiResponse.data.meta,
        };
      } else if (apiResponse.data) {
        // Flat format: { data: [], meta: {} }
        return {
          data: apiResponse.data,
          meta: apiResponse.meta,
        };
      }

      // Fallback
      return {
        data: [],
        meta: {
          currentPage: 1,
          pageSize: 6,
          totalRows: 0,
          totalPages: 1,
          currentRows: 0,
          hasPrevPage: false,
          hasNextPage: false,
        },
      };
    },
  });
};

// --- GET Banner Details Hook ---
export const useGetBannerDetailsQuery = (bannerId: string) => {
  return useQuery<any, Error, Banner>({
    queryKey: bannersQueryKeys.detail(bannerId),
    queryFn: () => bannersApi.getBannerDetails(bannerId),
    enabled: !!bannerId && bannerId !== '',
    select: (response) => {
      // Handle flat structure first: { id, title, platform, ... }
      // This is when API returns the banner object directly
      if (response && 'id' in response && 'title' in response && 'platform' in response) {
        return response as Banner;
      }

      // Handle nested structure: { data: { id, title, ... } }
      if (response?.data && typeof response.data === 'object' && 'id' in response.data) {
        return response.data as Banner;
      }

      // Fallback
      return response as Banner;
    },
  });
};

// --- Create Banner Hook (useMutation) ---
export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateBannerResponse, Error, CreateBannerPayload>({
    mutationFn: (data: CreateBannerPayload) => bannersApi.createBanner(data),
    // Invalidate all banner queries to ensure the list/table refreshes
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannersQueryKeys.all });
    },
  });
};

// --- Update Banner Hook (useMutation) ---
export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateBannerResponse, Error, UpdateBannerParams>({
    mutationFn: ({ bannerId, data }) => bannersApi.updateBanner({ bannerId, data }),
    // Invalidate the banners list and specific details cache on success
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bannersQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: bannersQueryKeys.detail(variables.bannerId) });
    },
  });
};

// --- Delete Banner Hook (useMutation) ---
export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteBannerResponse, Error, string>({
    mutationFn: (bannerId: string) => bannersApi.deleteBanner(bannerId),
    // Invalidate all banner queries after deletion
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannersQueryKeys.all });
    },
  });
};
