import { PaginationProps } from "@/api/types/pagination.types";

export type PlatformType = "admin" | "vendor" | "warehouse" | "customer";

export interface MediaFileParams extends Partial<PaginationProps> {
    group: string; // This maps to 'group' in the backend
    search?: string;
    platformType?: PlatformType;
    accountId?: string;
}

export interface MediaFolderParams {
    search?: string;
    platformType?: PlatformType;
    accountId?: string;
}

export interface UploadMediaProps {
    files: File[];
    group: string;
}

export interface VendorParams extends Partial<PaginationProps> {
    search?: string;
}