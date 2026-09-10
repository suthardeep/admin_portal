import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import cmsApi from "./queryFunctions";
import type {
  Section,
  CreateSectionPayload,
  UpdateSectionPayload,
  GetSectionByIdResponse,
  GetSectionsResponse,
  CreateSectionResponse,
  UpdateSectionResponse,
} from "../types/section";
import type { PaginatedResponse } from "@/types/baseApi";
import { toast } from "@/components/compound/Sonner";
import { showErrorToasts } from "@/utils/helpers";

// Query keys factory
export const sectionKeys = {
  all: ["sections"] as const,
  lists: () => [...sectionKeys.all, "list"] as const,
  list: (params?: { page?: number; pageSize?: number; search?: string }) =>
    [...sectionKeys.lists(), params] as const,
  details: () => [...sectionKeys.all, "detail"] as const,
  detail: (id: string) => [...sectionKeys.details(), id] as const,
};

/**
 * Hook to get all sections with pagination and search
 */
export const useGetSectionsQuery = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => {
  return useQuery<GetSectionsResponse>({
    queryKey: sectionKeys.list(params),
    queryFn: () => cmsApi.getAll(params),
  });
};

/**
 * Hook to get section details by ID
 */
export const useGetSectionDetailsQuery = (sectionId: string) => {
  return useQuery<Section>({
    queryKey: sectionKeys.detail(sectionId),
    queryFn: async () => {
      const response = await cmsApi.getById(sectionId);
      return response.data; // Extract the actual section data
    },
    enabled: !!sectionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new section
 */
export const useCreateSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateSectionResponse, Error, CreateSectionPayload>({
    mutationFn: (data: CreateSectionPayload) => cmsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
      toast.success("Section created successfully!");
    },
    onError: (error) => {
      console.error("Create section error:", error);
      showErrorToasts(error);
    },
  });
};

/**
 * Hook to update an existing section
 */
export const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateSectionResponse, Error, { sectionId: string; data: UpdateSectionPayload }>({
    mutationFn: ({ sectionId, data }) => cmsApi.update(sectionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
      queryClient.invalidateQueries({ queryKey: sectionKeys.detail(variables.sectionId) });
      toast.success("Section updated successfully!");
    },
    onError: (error) => {
      console.error("Update section error:", error);
      showErrorToasts(error);
    },
  });
};

/**
 * Hook to delete a section
 */
export const useDeleteSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) => cmsApi.delete(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
      toast.success("Section deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Delete section error:", error);
      showErrorToasts(error);
    },
  });
};
