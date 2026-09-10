import { BaseApiResponse, PaginatedResponse } from "@/types/baseApi";

// Enums
export type SectionType = "PRODUCT" | "CATEGORY" | "BRAND" | "BANNER" | "CUSTOM";
export type AlignType = "LEFT" | "CENTER" | "RIGHT";
export type FontStyleType = "NORMAL" | "MEDIUM" | "SEMIBOLD" | "BOLD";
export type SourceType = "PRODUCT" | "CATEGORY" | "BANNER" | "VENDOR";
export type SelectionType = "MANUAL" | "AUTOMATIC";
export type CtaType = "TEXT_BUTTON" | "ICON_BUTTON" | "IMAGE_BUTTON";
export type ActionType = "CATEGORY" | "BRAND" | "PRODUCT" | "VENDOR" | "PAGE" | "EXTERNAL_URL" | "SEARCH" | "IN_APP_PAGE" | "UGC_USER" | "UGC_REEL";
export type DisplayType = "SLIDER" | "GRID" | "LIST" | "CAROUSEL";
export type GradientDirection = "TO_BOTTOM" | "TO_TOP" | "TO_LEFT" | "TO_RIGHT" | "TO_BOTTOM_RIGHT" | "TO_BOTTOM_LEFT";

// Decoration interfaces
export interface TextDecoration {
  color: string;
  align: AlignType;
  size: number;
  fontStyle: FontStyleType;
}

// Content Config
export interface ContentCondition {
  field: string;
  operator: string;
  value: number | string | string[];
}

export interface SelectedItem {
  id: string;
  name: string;
}

export interface ContentConfig {
  sourceType: SourceType;
  selectionType: SelectionType;
  selectedItems: SelectedItem[];
  conditions: ContentCondition[];
  limit: number;
  sort: string;
}

// CTA Config
export interface CtaTarget {
  id: string;
  name: string;
}

export interface CtaConfig {
  ctaType?: CtaType;
  label?: string;
  actionType?: ActionType;
  targets?: CtaTarget[];
}

// Display Settings
export interface SliderDisplaySettings {
  displayType: "SLIDER";
  interval?: number;
  autoPlay?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
}

export interface HorizontalListDisplaySettings {
  displayType: "HORIZONTAL_LIST";
  numberOfLines?: number;
  spacing?: number;
  itemWidth?: number;
}

export interface GridDisplaySettings {
  displayType: "GRID";
  columnsMax?: number;
  rowsMax?: number;
  gridSpacing?: number;
}

export interface SingleSlideDisplaySettings {
  displayType: "SINGLE_SLIDE";
}

export type DisplaySettings =
  | SliderDisplaySettings
  | HorizontalListDisplaySettings
  | GridDisplaySettings
  | SingleSlideDisplaySettings;

// Section Styling
export interface GradientStop {
  color: string;
  percentage: number;
}

export interface GradientConfig {
  stops: GradientStop[];
  direction: GradientDirection;
}

export interface SectionStyling {
  backgroundColor: string;
  hasGradient: boolean;
  gradientConfig: GradientConfig;
  roundness: number;
  backgroundImageUrl: string;
  hasTransparentBackground?: boolean;
}

// Main Section Interface
export interface Section {
  id: string;
  title: string;
  subtitle: string;
  sectionType: SectionType;
  logoUrl: string;
  titleDecoration: TextDecoration;
  subtitleDecoration: TextDecoration;
  contentConfig: ContentConfig;
  actionApi: string;
  displaySettings: DisplaySettings;
  sectionStyling: SectionStyling;
  hasCta: boolean;
  ctaConfig?: CtaConfig;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Payloads
export interface CreateSectionPayload {
  title: string;
  subtitle: string;
  sectionType: SectionType;
  logoUrl: string;
  titleDecoration: TextDecoration;
  subtitleDecoration: TextDecoration;
  contentConfig: ContentConfig;
  hasCta: boolean;
  ctaConfig?: CtaConfig;
  displaySettings: DisplaySettings;
  sectionStyling: SectionStyling;
  active: boolean;
}

export interface UpdateSectionPayload extends CreateSectionPayload {
  id: string;
}

// API Responses
export interface GetSectionsResponse extends BaseApiResponse<PaginatedResponse<Section>> {}

export interface GetSectionByIdResponse extends BaseApiResponse<Section> {}

export interface CreateSectionResponse extends BaseApiResponse<Section> {}

export interface UpdateSectionResponse extends BaseApiResponse<Section> {}
