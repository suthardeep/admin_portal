import { PaginationMeta } from "@/types/baseApi";

// --- Base Types ---
interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// --- Tier Types ---
export interface Tier {
  id: string;
  name: string;
  platformCharges: number;
  platformChargesType: 'PERCENTAGE' | 'FIXED';
  closingFee: number;
  closingFeeType: 'PERCENTAGE' | 'FIXED';
  referralFee: number;
  referralFeeType: 'PERCENTAGE' | 'FIXED';
  aavakCoins: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTierPayload {
  name: string;
  platformCharges: number;
  platformChargesType: 'PERCENTAGE' | 'FIXED';
  closingFee: number;
  closingFeeType: 'PERCENTAGE' | 'FIXED';
  referralFee: number;
  referralFeeType: 'PERCENTAGE' | 'FIXED';
  aavakCoins: number;
}

// --- Category Hierarchy Types ---
export interface ChildCategory {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Subcategory {
  id?: string; // Optional for new subcategories
  name: string;
  imageUrl: string;
  children: ChildCategory[];
}

export interface CategoryHierarchy {
  name: string;
  imageUrl: string;
  subcategories: Subcategory[];
}

// --- Pricing & Charges Types ---
export interface CategoryPricing {
  min: number;
  max: number;
  tierId: string;
  // Tier details (populated from selected tier, read-only in form)
  platformCharges?: number;
  platformChargesType?: 'PERCENTAGE' | 'FIXED';
  closingFee?: number;
  closingFeeType?: 'PERCENTAGE' | 'FIXED';
  referralFee?: number;
  referralFeeType?: 'PERCENTAGE' | 'FIXED';
  aavakCoins?: number;
}

export interface ShippingCharges {
  local: number;
  regional: number;
  national: number;
}

export interface ReturnPolicy {
  returnPolicy: 'NO_RETURN' | 'RETURN_ONLY' | 'REPLACE_ONLY' | 'RETURN_REPLACE' | 'SERVICE_CENTER';
  returnReplacePeriodDays: number;
}

export interface RequiredDocument {
  id: string;
  name: string;
  children?: RequiredDocument[];
}

export interface MandatoryField {
  id: string;
  name: string;
  children?: MandatoryField[];
}

// --- Complete Category Types ---
export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  subcategories: Subcategory[];
  requiredDocuments: RequiredDocument[];
  mandatoryFields: MandatoryField[];
  pricing: CategoryPricing;
  charges: ShippingCharges;
  returnPolicy: ReturnPolicy;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// --- List View Types ---
export interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  level: number;
  parentId?: string;
  images: string[];
  subcategoryCount: number;
  childCategoryCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCategoryList {
  data: CategoryListItem[];
  meta: PaginationMeta;
}

// --- API Payload Types ---
export interface CreateCategoryPayload {
  category: {
    name: string;
    image: string;
  };
  subCategories: Array<{
    id?: string; // Optional for edit mode
    name: string;
    image: string;
    children: Array<{
      id?: string; // Optional for edit mode
      name: string;
      image: string;
    }>;
  }>;
  config: {
    requiredVendorDocuments: Array<{
      groupName: string;
      documents: string[];
    }>;
    mandatoryProductFields: Array<{
      groupName: string;
      fieldNames: string[];
    }>;
    returnPolicy: 'NO_RETURN' | 'RETURN_ONLY' | 'REPLACE_ONLY' | 'RETURN_REPLACE' | 'SERVICE_CENTER';
    returnReplacePeriodDays: number;
    pricing: {
      min: number;
      max: number;
      tier: {
        id: string;
        name: string;
        platformCharges: number;
        platformChargesType: 'PERCENTAGE' | 'FIXED';
        closingFee: number;
        closingFeeType: 'PERCENTAGE' | 'FIXED';
        referralFee: number;
        referralFeeType: 'PERCENTAGE' | 'FIXED';
        aavakCoins: number;
      };
      tierId: string;
    };
    charges: {
      local: number;
      regional: number;
      national: number;
    };
  };
}

export interface UpdateCategoryPayload {
  category: {
    name: string;
    image: string;
  };
  subCategories: Array<{
    id?: string; // Optional for edit mode
    name: string;
    image: string;
    children: Array<{
      id?: string; // Optional for edit mode
      name: string;
      image: string;
    }>;
  }>;
  config: {
    requiredVendorDocuments: Array<{
      groupName: string;
      documents: string[];
    }>;
    mandatoryProductFields: Array<{
      groupName: string;
      fieldNames: string[];
    }>;
    returnPolicy: 'NO_RETURN' | 'RETURN_ONLY' | 'REPLACE_ONLY' | 'RETURN_REPLACE' | 'SERVICE_CENTER';
    returnReplacePeriodDays: number;
    pricing: {
      min: number;
      max: number;
      tier: {
        id: string;
        name: string;
        platformCharges: number;
        platformChargesType: 'PERCENTAGE' | 'FIXED';
        closingFee: number;
        closingFeeType: 'PERCENTAGE' | 'FIXED';
        referralFee: number;
        referralFeeType: 'PERCENTAGE' | 'FIXED';
        aavakCoins: number;
      };
      tierId: string;
    };
    charges: {
      local: number;
      regional: number;
      national: number;
    };
  };
}

// --- API Response Types ---
export type GetAllCategoriesResponse = BaseApiResponse<PaginatedCategoryList>;
export type GetCategoryDetailsResponse = BaseApiResponse<Category>;
export type CreateCategoryResponse = BaseApiResponse<{ id: string }>;
export type UpdateCategoryResponse = BaseApiResponse<null>;
export type DeleteCategoryResponse = BaseApiResponse<null>;

// --- Tier API Response Types ---
export type GetAllTiersResponse = BaseApiResponse<{ data: Tier[]; meta: PaginationMeta }>;
export type GetTierByIdResponse = BaseApiResponse<Tier>;
export type CreateTierResponse = BaseApiResponse<{ id: string }>;
export type UpdateTierResponse = BaseApiResponse<null>;
export type DeleteTierResponse = BaseApiResponse<null>;

// --- Query Parameters ---
export interface GetAllCategoriesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export interface GetAllTiersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export interface UpdateCategoryParams {
  categoryId: string;
  data: UpdateCategoryPayload;
}

export interface UpdateTierParams {
  tierId: string;
  data: Partial<CreateTierPayload>;
}