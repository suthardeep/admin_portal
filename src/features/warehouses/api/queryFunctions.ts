import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  GetAllWarehousesParams,
  GetAllWarehousesResponse,
  GetWarehouseByIdResponse,
  CreateWarehouseResponse,
  UpdateWarehouseResponse,
  DeleteWarehouseResponse,
  CreateWarehousePayload,
  UpdateWarehouseParams,
} from "../types/warehouse";

const warehousesApi = {
  // Get all warehouses with pagination and search
  getAllWarehouses: (params: GetAllWarehousesParams = {}): Promise<GetAllWarehousesResponse> => {
    // Filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;

    return apiService({
      method: "GET",
      endpoint: apiPaths.warehouses.getAll,
      params: cleanParams,
    });
  },

  // Get warehouse details by ID
  getWarehouseById: (warehouseId: string): Promise<GetWarehouseByIdResponse> => {
    return apiService({
      method: "GET",
      endpoint: `${apiPaths.warehouses.getById}/${warehouseId}`,
    });
  },

  // Create new warehouse
  createWarehouse: (data: CreateWarehousePayload): Promise<CreateWarehouseResponse> => {
   
    return apiService({
      method: "POST",
      endpoint: apiPaths.warehouses.create,
      data: data,
    });
  },

  // Update existing warehouse
  updateWarehouse: ({ warehouseId, data }: UpdateWarehouseParams): Promise<UpdateWarehouseResponse> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.warehouses.updateById}/${warehouseId}`,
      data: data,
    });
  },

  // Delete warehouse
  deleteWarehouse: (warehouseId: string): Promise<DeleteWarehouseResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.warehouses.deleteById}/${warehouseId}`,
    });
  },
};

export default warehousesApi;