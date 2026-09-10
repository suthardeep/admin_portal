import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/compound/Sonner";
import { showErrorToasts } from "@/utils/helpers";
import warehousesApi from "./queryFunctions";
import type {
  GetAllWarehousesParams,
  CreateWarehousePayload,
  UpdateWarehouseParams,
  GetAllWarehousesResponse,
  Warehouse,
  WarehouseListItem,
} from "../types/warehouse";
import { PaginationMeta } from "@/types/baseApi";

// Query Keys
export const warehouseKeys = {
  all: ['warehouses'] as const,
  lists: (params: GetAllWarehousesParams) => [...warehouseKeys.all, 'list', params] as const,
  details: () => [...warehouseKeys.all, 'detail'] as const,
  detail: (id: string) => [...warehouseKeys.details(), id] as const,
};

// Define the shape of the data returned by the list hook
type WarehousesListResult = { data: WarehouseListItem[]; meta: PaginationMeta };

// Get all warehouses query
export const useGetAllWarehousesQuery = (params: GetAllWarehousesParams = {}) => {
  return useQuery<GetAllWarehousesResponse, Error, WarehousesListResult>({
    queryKey: warehouseKeys.lists(params),
    queryFn: () => warehousesApi.getAllWarehouses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => {
      // Extract data and meta from the nested response structure
      const apiResponse = response as GetAllWarehousesResponse;
      return {
        data: apiResponse.data.data,
        meta: apiResponse.data.meta,
      };
    },
  });
};

// Get warehouse by ID query
export const useGetWarehouseByIdQuery = (warehouseId: string) => {
  return useQuery({
    queryKey: warehouseKeys.detail(warehouseId),
    queryFn: () => warehousesApi.getWarehouseById(warehouseId),
    enabled: !!warehouseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create warehouse mutation
export const useCreateWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWarehousePayload) => warehousesApi.createWarehouse(data),
    onSuccess: (response) => {
      toast.success("Warehouse created successfully!");
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
    },
    onError: (error: any) => {
      console.error("Create warehouse error:", error);
      showErrorToasts(error);
    },
  });
};

// Update warehouse mutation
export const useUpdateWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateWarehouseParams) => warehousesApi.updateWarehouse(params),
    onSuccess: (response, variables) => {
      toast.success("Warehouse updated successfully!");
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(variables.warehouseId) });
    },
    onError: (error: any) => {
      console.error("Update warehouse error:", error);
      showErrorToasts(error);
    },
  });
};

// Delete warehouse mutation
export const useDeleteWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (warehouseId: string) => warehousesApi.deleteWarehouse(warehouseId),
    onSuccess: () => {
      toast.success("Warehouse deleted successfully!");
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
    },
    onError: (error: any) => {
      console.error("Delete warehouse error:", error);
      showErrorToasts(error);
    },
  });
};