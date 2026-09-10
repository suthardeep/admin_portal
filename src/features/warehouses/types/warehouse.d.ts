import { PaginationMeta } from "@/types/baseApi";

// --- Base Types ---
interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// --- Address Types ---
export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

// --- Category Types ---
export interface WarehouseCategory {
  id: string;
  name: string;
  image?: string;
}

// --- Zone Structure Types ---
export interface Level {
  id: string;
  name: string;
}

export interface Bay {
  id: string;
  name: string;
  levels: Level[];
}

export interface Aisle {
  id: string;
  name: string;
  bays: Bay[];
}

export interface Zone {
  id: string;
  name: string;
  aisles: Aisle[];
}

// --- Warehouse Types ---
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  managerName: string;
  managerEmail: string;
  managerMobile: string;
  numberOfDeliveryStaff: number;
  address: Address;
  categories?: WarehouseCategory[];
  totalSqFt: number;
  totalZones: number;
  zones: Zone[];
  isActive: boolean;
  metadata?: any;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Warehouse List Item (for table display) ---
export interface WarehouseListItem {
  id: string;
  name?: string;
  managerName: string;
  managerEmail: string;
  managerMobile: string;
  totalSqFt: string; // API returns this as string in list
  address: Address;
  createdAt?: string;
}

// --- Form Types (for create/update without IDs) ---
export interface FormLevel {
  name: string;
}

export interface FormBay {
  name: string;
  levels: FormLevel[];
}

export interface FormAisle {
  name: string;
  bays: FormBay[];
}

export interface FormZone {
  name: string;
  aisles: FormAisle[];
}

export interface CreateWarehousePayload {
  name: string;
  managerName: string;
  managerEmail: string;
  managerMobile: string;
  managerPassword: string;
  numberOfDeliveryStaff: number;
  address: Address;
  categories?: WarehouseCategory[];
  totalSqFt: number;
  totalZones: number;
  zones: FormZone[]; // Form zones without IDs
}

export interface UpdateWarehousePayload extends Omit<CreateWarehousePayload, 'managerPassword'> {
  managerPassword?: string;
}

// --- API Query Parameters ---
export interface GetAllWarehousesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface UpdateWarehouseParams {
  warehouseId: string;
  data: UpdateWarehousePayload;
}

// --- API Response Types ---
export interface GetAllWarehousesResponse extends BaseApiResponse<{
  data: WarehouseListItem[];
  meta: PaginationMeta;
}> {}

export interface GetWarehouseByIdResponse extends BaseApiResponse<Warehouse> {}

export interface CreateWarehouseResponse extends BaseApiResponse<Warehouse> {}

export interface UpdateWarehouseResponse extends BaseApiResponse<Warehouse> {}

export interface DeleteWarehouseResponse extends BaseApiResponse<null> {}
