import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import tiersApi from './queryFunctions';
import type {
  CreateTierPayload,
  GetAllTiersResponse,
  GetTierByIdResponse,
  CreateTierResponse,
  UpdateTierResponse,
  DeleteTierResponse,
  GetAllTiersParams,
  UpdateTierParams,
  Tier,
} from '@/features/categories/types/category';
import { PaginationMeta } from '@/types/baseApi';
import { toast } from '@/components/compound/Sonner';

export const tiersQueryKeys = {
  all: ['tiers'] as const,
  lists: (params: GetAllTiersParams) => [...tiersQueryKeys.all, 'list', params] as const,
  details: () => [...tiersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tiersQueryKeys.details(), id] as const,
};

// Define the shape of the data returned by the tiers list hook
type TiersListResult = { data: Tier[]; meta: PaginationMeta };

// --- GET All Tiers Hook ---
export const useGetAllTiersQuery = (params: GetAllTiersParams) => {
  return useQuery<GetAllTiersResponse, Error, TiersListResult>({
    queryKey: tiersQueryKeys.lists(params),
    queryFn: () => tiersApi.getAllTiers(params),
    select: (response) => ({
      data: response.data.data,
      meta: response.data.meta,
    }),
  });
};

// --- GET Tier By ID Hook ---
export const useGetTierByIdQuery = (tierId: string) => {
  return useQuery<GetTierByIdResponse, Error, Tier>({
    queryKey: tiersQueryKeys.detail(tierId),
    queryFn: () => tiersApi.getTierById(tierId),
    select: (response) => response.data,
    enabled: !!tierId,
  });
};

// --- Create Tier Hook (useMutation) ---
export const useCreateTierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateTierResponse, Error, CreateTierPayload>({
    mutationFn: (data: CreateTierPayload) => tiersApi.createTier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tiersQueryKeys.all });
      toast.success('Tier created successfully');
    },
    onError: () => {
      toast.error('Failed to create tier');
    },
  });
};

// --- Update Tier Hook (useMutation) ---
export const useUpdateTierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateTierResponse, Error, UpdateTierParams>({
    mutationFn: ({ tierId, data }) => tiersApi.updateTier({ tierId, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tiersQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: tiersQueryKeys.detail(variables.tierId) });
      toast.success('Tier updated successfully');
    },
    onError: () => {
      toast.error('Failed to update tier');
    },
  });
};

// --- Delete Tier Hook (useMutation) ---
export const useDeleteTierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteTierResponse, Error, string>({
    mutationFn: (tierId: string) => tiersApi.deleteTier(tierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tiersQueryKeys.all });
      toast.success('Tier deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete tier');
    },
  });
};
