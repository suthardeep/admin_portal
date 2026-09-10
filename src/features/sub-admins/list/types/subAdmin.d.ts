import { CreateAdminFormData, MediaItem, Role } from "../../schemas";
import { MinimalMediaProps } from "@/components/media-picker/types/media.types";
import { PaginationMeta } from "@/types/baseApi";

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  dateOfCreation: string;
  avatarUrl: string;
}

export interface CreateAdminFormProps {
  onSubmit?: (data: CreateAdminFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateAdminFormData>;
  className?: string;
  title?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
}

// --- API Types ---

// Base API Response
interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Create Sub-Admin Payload (API format)
export interface CreateSubAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for edit mode
  customRoleIds: string[]; // Multiple roles support
  // TODO: REVERT - Make profileImageUrl required (remove ?) when ready
  profileImageUrl?: string; // Temporarily optional
  allowSensitiveInfo: boolean;
}

// Sub-Admin List Item (API response format)
export interface SubAdminListItemApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  customRoleNames: string[]; // Array of role names assigned to the admin
  isActive: boolean;
  createdAt: string;
  profileImageUrl: string | null;
}

// Sub-Admin Details (API response format)
export interface SubAdminDetailsApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  customRoles: Array<{ id: string; name: string }>; // API returns customRoles array
  profileImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

// Paginated Sub-Admin List
export interface PaginatedSubAdminList {
  data: SubAdminListItemApi[];
  meta: PaginationMeta;
}

// API Response Types
export type GetAllSubAdminsResponse = BaseApiResponse<PaginatedSubAdminList>;
export type GetSubAdminDetailsResponse = BaseApiResponse<SubAdminDetailsApi>;
export type CreateSubAdminResponse = BaseApiResponse<{ id: string }>;
export type UpdateSubAdminResponse = BaseApiResponse<null>;
export type DeleteSubAdminResponse = BaseApiResponse<null>;

// Update Payload
export interface UpdateSubAdminPayload extends Partial<CreateSubAdminPayload> {}

// Re-export the Zod-inferred type for backward compatibility
export type AdminFormData = CreateAdminFormData;

// Export additional types
export type { CreateAdminFormData, MediaItem, Role };