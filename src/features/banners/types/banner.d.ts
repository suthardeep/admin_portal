import { PaginationMeta } from '@/types/baseApi';

// Banner types
export interface CTATarget {
  id: string;
  name: string;
}

export interface CTAConfig {
  ctaType: 'TEXT_BUTTON' | 'ICON_BUTTON' | 'IMAGE_BUTTON';
  label: string;
  actionType: 'CATEGORY' | 'BRAND' | 'PRODUCT' | 'VENDOR' | 'PAGE' | 'EXTERNAL_URL';
  targets: CTATarget[];
}

export interface Banner {
  id: string;
  title: string;
  platform: 'CUSTOMER' | 'VENDOR';
  bannerType: 'ORGANIC' | 'SPONSORED';
  screenType: 'HOME' | 'CATEGORY' | 'PRODUCT' | 'CART' | 'PROFILE';
  displayIndex: number;
  stateIds: string[];
  startTime: string;
  endTime: string;
  ratio: string;
  roundness: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  ctaConfig: CTAConfig;
  rank: number;
  active: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerPayload {
  title: string;
  platform: 'CUSTOMER' | 'VENDOR';
  bannerType: 'ORGANIC' | 'SPONSORED';
  screenType: 'HOME' | 'CATEGORY' | 'PRODUCT' | 'CART' | 'PROFILE';
  displayIndex: number;
  stateIds: string[];
  startTime: string;
  endTime: string;
  ratio: string;
  roundness: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  ctaConfig: CTAConfig;
  note?: string;
  active: boolean;
}

export interface UpdateBannerPayload extends CreateBannerPayload {}

// API Response types
export interface GetAllBannersResponse {
  data: {
    data: Banner[];
    meta: PaginationMeta;
  };
}

export interface GetBannerDetailsResponse {
  data: Banner;
}

export interface CreateBannerResponse {
  data: Banner;
}

export interface UpdateBannerResponse {
  data: Banner;
}

export interface DeleteBannerResponse {
  message: string;
}

// API Params types
export interface GetAllBannersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface UpdateBannerParams {
  bannerId: string;
  data: UpdateBannerPayload;
}
