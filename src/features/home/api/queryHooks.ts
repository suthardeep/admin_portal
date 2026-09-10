import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import homeApi from "./queryFunctions";
import type {
  HomeScreen,
  CreateHomeScreenPayload,
  UpdateHomeScreenPayload,
  GetHomeScreensParams,
  GetHomeScreensResponse,
} from "../types/home";
import { toast } from "@/components/compound/Sonner";
import { showErrorToasts } from "@/utils/helpers";

// Query keys factory
export const homeKeys = {
  all: ["home"] as const,
  lists: () => [...homeKeys.all, "list"] as const,
  list: (params?: GetHomeScreensParams) => [...homeKeys.lists(), params] as const,
  details: () => [...homeKeys.all, "detail"] as const,
  detail: (id: string) => [...homeKeys.details(), id] as const,
};

/**
 * Hook to get all home screens with pagination and filters
 */
export const useGetHomeScreensQuery = (params?: GetHomeScreensParams) => {
  return useQuery<GetHomeScreensResponse, Error>({
    queryKey: homeKeys.list(params),
    queryFn: () => homeApi.getAll(params),
  });
};

/**
 * Hook to get home screen details by ID
 */
export const useGetHomeScreenDetailsQuery = (homeId: string) => {
  return useQuery<HomeScreen, Error>({
    queryKey: homeKeys.detail(homeId),
    queryFn: () => homeApi.getById(homeId),
    enabled: !!homeId && homeId !== '',
  });
};

/**
 * Hook to create a new home screen
 */
export const useCreateHomeScreenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<HomeScreen, Error, CreateHomeScreenPayload>({
    mutationFn: (data: CreateHomeScreenPayload) => homeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
      toast.success("Home screen created successfully!");
    },
    onError: (error) => {
      console.error("Create home screen error:", error);
      showErrorToasts(error);
    },
  });
};

/**
 * Hook to update an existing home screen
 */
export const useUpdateHomeScreenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<HomeScreen, Error, { homeId: string; data: UpdateHomeScreenPayload }>({
    mutationFn: ({ homeId, data }) => homeApi.update(homeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
      queryClient.invalidateQueries({ queryKey: homeKeys.detail(variables.homeId) });
      toast.success("Home screen updated successfully!");
    },
    onError: (error) => {
      console.error("Update home screen error:", error);
      showErrorToasts(error);
    },
  });
};

/**
 * Hook to delete a home screen
 */
export const useDeleteHomeScreenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (homeId: string) => homeApi.delete(homeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homeKeys.lists() });
      toast.success("Home screen deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete home screen error:", error);
      showErrorToasts(error);
    },
  });
};
