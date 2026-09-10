// sub-admins/api/queryHooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import subAdminsApi, { GetAllSubAdminsParams, UpdateSubAdminParams } from './queryFns';
import type {
  CreateSubAdminPayload,
  GetAllSubAdminsResponse,
  SubAdminListItemApi,
  GetSubAdminDetailsResponse,
  SubAdminDetailsApi,
  CreateSubAdminResponse,
  UpdateSubAdminResponse,
  DeleteSubAdminResponse,
} from '../types/subAdmin';
import { PaginationMeta } from '@/types/baseApi';

// Define query keys for effective caching and invalidation
export const subAdminsQueryKeys = {
  all: ['subAdmins'] as const,
  lists: (params: GetAllSubAdminsParams) => [...subAdminsQueryKeys.all, 'list', params] as const,
  details: () => [...subAdminsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...subAdminsQueryKeys.details(), id] as const,
};

// Define the shape of the data returned by the list hook
type SubAdminsListResult = { data: SubAdminListItemApi[]; meta: PaginationMeta };

// --- GET All Sub-Admins Hook ---
export const useGetAllSubAdminsQuery = (params: GetAllSubAdminsParams) => {
  return useQuery<GetAllSubAdminsResponse, Error, SubAdminsListResult>({
    queryKey: subAdminsQueryKeys.lists(params),
    queryFn: () => subAdminsApi.getAllSubAdmins(params),
    // Select function extracts data and meta from the nested response structure
    select: (response) => ({
      data: response.data.data,
      meta: response.data.meta,
    }),
  });
};

// --- GET Sub-Admin Details Hook ---
export const useGetSubAdminDetailsQuery = (adminId: string) => {
  return useQuery<GetSubAdminDetailsResponse, Error, SubAdminDetailsApi>({
    queryKey: subAdminsQueryKeys.detail(adminId),
    queryFn: () => subAdminsApi.getSubAdminDetails(adminId),
    enabled: !!adminId,
    select: (response) => response.data,
  });
};

// --- Create Sub-Admin Hook (useMutation) ---
export const useCreateSubAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateSubAdminResponse, Error, CreateSubAdminPayload>({
    mutationFn: (data: CreateSubAdminPayload) => subAdminsApi.createSubAdmin(data),
    // Invalidate all sub-admin queries to ensure the list/table refreshes
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subAdminsQueryKeys.all });
    },
  });
};

// --- Update Sub-Admin Hook (useMutation) ---
export const useUpdateSubAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateSubAdminResponse, Error, UpdateSubAdminParams>({
    mutationFn: ({ adminId, data }) => subAdminsApi.updateSubAdmin({ adminId, data }),
    // Invalidate the sub-admins list and specific details cache on success
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subAdminsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: subAdminsQueryKeys.detail(variables.adminId) });
    },
  });
};

// --- Delete Sub-Admin Hook (useMutation) ---
export const useDeleteSubAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteSubAdminResponse, Error, string>({
    mutationFn: (adminId: string) => subAdminsApi.deleteSubAdmin(adminId),
    // Invalidate all sub-admin queries after deletion
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subAdminsQueryKeys.all });
    },
  });
};