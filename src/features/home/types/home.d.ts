import { BaseApiResponse, PaginatedResponse } from "@/types/baseApi";

// Enums
export type Platform = "FINTECH" | "CUSTOMER" | "VENDOR" | "RIDER";
export type AppStyling = "modern" | "classic" | "minimal";
export type CoinType = "FINTECH" | "PROTECT" | "UGC";
export type HomeStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

// Gradient color interface
export interface GradientColor {
  color: string;
  opacity: number;
}

// Hero styling interface
export interface HeroStyling {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  hasGradient?: boolean;
  gradientColors?: GradientColor[];
  backgroundImageUrl?: string;
  heroImage?: string;
}

// Section interface for API response
export interface Section {
  id: string;
  title: string;
  subtitle: string;
}

// Main Home Screen Interface matching new payload
export interface HomeScreen {
  id: string;
  platform: Platform;
  version: string;
  sections: Section[];
  isActive: boolean;
  published: boolean;
  versionName: string;
  appStyling: AppStyling;
  heroStyling: HeroStyling;
  coinType: CoinType;
  coinBadgeColor: string;
  coinBackgroundColor: string;
  searchTextColor: string;
  searchBackgroundColor: string;
  searchForegroundColor: string;
  searchIconColor: string;
  notificationIconColor: string;
  notificationIconDotColor: string;
  notificationBackgroundColor: string;
  locationIconColor: string;
  locationTypeColor: string;
  locationAddressColor: string;
  createdAt: string;
  updatedAt: string;
}

// API Payloads matching new structure
export interface CreateHomeScreenPayload {
  platform: Platform;
  version: string;
  sections: string[];
  isActive: boolean;
  published: boolean;
  versionName: string;
  appStyling: AppStyling;
  heroStyling: HeroStyling;
  coinType: CoinType;
  coinBadgeColor: string;
  coinBackgroundColor: string;
  searchTextColor: string;
  searchBackgroundColor: string;
  searchForegroundColor: string;
  searchIconColor: string;
  notificationIconColor: string;
  notificationIconDotColor: string;
  notificationBackgroundColor: string;
  locationIconColor: string;
  locationTypeColor: string;
  locationAddressColor: string;
}

export interface UpdateHomeScreenPayload extends CreateHomeScreenPayload {
  id: string;
}

// Query Parameters
export interface GetHomeScreensParams {
  page?: number;
  pageSize?: number;
  search?: string;
  platform?: Platform;
  status?: HomeStatus;
  active?: boolean;
}

// API Responses
export interface GetHomeScreensResponse extends BaseApiResponse<PaginatedResponse<HomeScreen>> {}

export interface GetHomeScreenByIdResponse extends BaseApiResponse<HomeScreen> {}

export interface CreateHomeScreenResponse extends BaseApiResponse<HomeScreen> {}

export interface UpdateHomeScreenResponse extends BaseApiResponse<HomeScreen> {}
