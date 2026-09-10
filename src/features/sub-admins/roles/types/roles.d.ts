// roles/types/rolesApi.d.ts
import { PaginationMeta } from "@/types/baseApi"; // Assumed path for PaginationMeta
// IMPORTANT: Type ko schema file se import kar rahe hain
import type { RolePermissionApi, CreateRolePayload } from '../schemas/roles.schema'; 

// --- Base Types ---
interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// --- Payloads (Re-exported from Schema) ---
// Type ko re-export kar rahe hain taki woh 'rolesApi' types se access ho sake
export { CreateRolePayload, RolePermissionApi }; 
export interface UpdateRolePayload extends CreateRolePayload {} 

// --- Get All Roles Types (Paginated) ---
export interface RoleListItemApi {
  id: string;
  name: string;
  adminUserCount?: number; // Number of users assigned to this role
  createdAt: string; // ISO date string
}

export interface PaginatedRoleList {
    data: RoleListItemApi[]; // The list of roles
    meta: PaginationMeta;    // The pagination metadata
}
export type GetAllRolesResponse = BaseApiResponse<PaginatedRoleList>; 

// --- Get Role Details Types ---
export interface RoleDetailsApi {
  id: string;
  name: string;
  permissions: RolePermissionApi[];
  createdBy: string;
  createdAt: string;
  
}
export type GetRoleDetailsResponse = BaseApiResponse<RoleDetailsApi>;

// --- Create/Update/Delete Response Types ---
export interface CreateRoleResponseData { id: string; }
export type CreateRoleResponse = BaseApiResponse<CreateRoleResponseData>;
export type UpdateRoleResponse = BaseApiResponse<null>;
export type DeleteRoleResponse = BaseApiResponse<null>;