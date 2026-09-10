// Banner, CMS, and Home Configuration Options

// ============================================
// ENUMS
// ============================================

export enum PlatformEnum {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  RIDER = 'RIDER',
}

export enum ScreenTypeEnum {
  HOME = 'HOME',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CATEGORY = 'CATEGORY',
  PROFILE = 'PROFILE',
  ORDERS = 'ORDERS',
}

export enum SourceTypeEnum {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  BANNER = 'BANNER',
  BRAND = 'BRAND',
  UGC_USER = 'UGC_USER',
  UGC_REEL = 'UGC_REEL',
}

export enum DisplayTypeEnum {
  SLIDER = 'SLIDER',
  HORIZONTAL_LIST = 'HORIZONTAL_LIST',
  GRID = 'GRID',
  SINGLE_SLIDE = 'SINGLE_SLIDE',
}

export enum CtaTypeEnum {
  TEXT_BUTTON = 'TEXT_BUTTON',
  ICON_BUTTON = 'ICON_BUTTON',
}

export enum ActionTypeEnum {
  CATEGORY = 'CATEGORY',
  BRAND = 'BRAND',
  SEARCH = 'SEARCH',
  IN_APP_PAGE = 'IN_APP_PAGE',
  UGC_USER = 'UGC_USER',
  UGC_REEL = 'UGC_REEL',
}

export enum AlignmentEnum {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT',
}

export enum GradientDirectionEnum {
  TO_BOTTOM = 'TO_BOTTOM',
  TO_TOP = 'TO_TOP',
  TO_RIGHT = 'TO_RIGHT',
  TO_LEFT = 'TO_LEFT',
}

export enum MediaTypeEnum {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum HomePageStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum ConditionOperatorEnum {
  EQ = 'eq',           // equals
  NE = 'ne',           // not equals
  GT = 'gt',           // greater than
  LT = 'lt',           // less than
  GTE = 'gte',         // greater than or equal
  LTE = 'lte',         // less than or equal
  CONTAINS = 'contains', // string contains
  IN = 'in',           // value in array
  NIN = 'nin',         // not in array
}

export enum AspectRatioEnum {
  RATIO_16_9 = '16:9',
  RATIO_4_3 = '4:3',
  RATIO_3_2 = '3:2',
  RATIO_2_1 = '2:1',
  RATIO_1_1 = '1:1',
}

// ============================================
// DROPDOWN OPTIONS
// ============================================

// Platform Options
export const PLATFORM_OPTIONS = [
  { label: 'Customer', value: PlatformEnum.CUSTOMER },
  { label: 'Vendor', value: PlatformEnum.VENDOR },
];

// Screen Type / Page Options
export const SCREEN_TYPE_OPTIONS = [
  { label: 'Home Page', value: ScreenTypeEnum.HOME },
  { label: 'Cart Page', value: ScreenTypeEnum.CART },
  { label: 'Checkout Page', value: ScreenTypeEnum.CHECKOUT },
  { label: 'Product Detail Page', value: ScreenTypeEnum.PRODUCT_DETAIL },
  { label: 'Category Page', value: ScreenTypeEnum.CATEGORY },
  { label: 'Profile Page', value: ScreenTypeEnum.PROFILE },
  { label: 'Orders Page', value: ScreenTypeEnum.ORDERS },
];

// State Options (Indian States)
export const STATE_OPTIONS = [
  { label: 'Andhra Pradesh', value: 'AP' },
  { label: 'Arunachal Pradesh', value: 'AR' },
  { label: 'Assam', value: 'AS' },
  { label: 'Bihar', value: 'BR' },
  { label: 'Chhattisgarh', value: 'CG' },
  { label: 'Goa', value: 'GA' },
  { label: 'Gujarat', value: 'GJ' },
  { label: 'Haryana', value: 'HR' },
  { label: 'Himachal Pradesh', value: 'HP' },
  { label: 'Jharkhand', value: 'JH' },
  { label: 'Karnataka', value: 'KA' },
  { label: 'Kerala', value: 'KL' },
  { label: 'Madhya Pradesh', value: 'MP' },
  { label: 'Maharashtra', value: 'MH' },
  { label: 'Manipur', value: 'MN' },
  { label: 'Meghalaya', value: 'ML' },
  { label: 'Mizoram', value: 'MZ' },
  { label: 'Nagaland', value: 'NL' },
  { label: 'Odisha', value: 'OR' },
  { label: 'Punjab', value: 'PB' },
  { label: 'Rajasthan', value: 'RJ' },
  { label: 'Sikkim', value: 'SK' },
  { label: 'Tamil Nadu', value: 'TN' },
  { label: 'Telangana', value: 'TG' },
  { label: 'Tripura', value: 'TR' },
  { label: 'Uttar Pradesh', value: 'UP' },
  { label: 'Uttarakhand', value: 'UK' },
  { label: 'West Bengal', value: 'WB' },
  { label: 'Delhi', value: 'DL' },
  { label: 'Chandigarh', value: 'CH' },
  { label: 'Puducherry', value: 'PY' },
  { label: 'Jammu & Kashmir', value: 'JK' },
  { label: 'Ladakh', value: 'LA' },
];

// Source Type Options (Section Types)
export const SOURCE_TYPE_OPTIONS = [
  { label: 'Product', value: SourceTypeEnum.PRODUCT },
  { label: 'Category', value: SourceTypeEnum.CATEGORY },
  { label: 'Banner', value: SourceTypeEnum.BANNER },
  { label: 'UGC User', value: SourceTypeEnum.UGC_USER },
  { label: 'UGC Reel', value: SourceTypeEnum.UGC_REEL },
];

// Display Type Options
export const DISPLAY_TYPE_OPTIONS = [
  { label: 'Slider', value: DisplayTypeEnum.SLIDER },
  { label: 'Horizontal List', value: DisplayTypeEnum.HORIZONTAL_LIST },
  { label: 'Grid', value: DisplayTypeEnum.GRID },
  { label: 'Single Slide', value: DisplayTypeEnum.SINGLE_SLIDE },
];

// Banner Type Options
export const BANNER_TYPE_OPTIONS = [
  { label: 'Organic', value: 'ORGANIC' },
  { label: 'Sponsored', value: 'SPONSORED' },
];

// Media Type Options
export const MEDIA_TYPE_OPTIONS = [
  { label: 'Image', value: MediaTypeEnum.IMAGE },
  { label: 'Video', value: MediaTypeEnum.VIDEO },
];

// CTA Type Options
export const CTA_TYPE_OPTIONS = [
  { label: 'Text Button', value: CtaTypeEnum.TEXT_BUTTON },
  { label: 'Icon Button', value: CtaTypeEnum.ICON_BUTTON },
];

// Action Type Options
export const ACTION_TYPE_OPTIONS = [
  { label: 'Category', value: ActionTypeEnum.CATEGORY },
  { label: 'Brand', value: ActionTypeEnum.BRAND },
  { label: 'Search', value: ActionTypeEnum.SEARCH },
  { label: 'In-App Page', value: ActionTypeEnum.IN_APP_PAGE },
  { label: 'UGC User', value: ActionTypeEnum.UGC_USER },
  { label: 'UGC Reel', value: ActionTypeEnum.UGC_REEL },
];

// Additional action type for products
export const ENHANCED_ACTION_TYPE_OPTIONS = [
  { label: 'Category', value: ActionTypeEnum.CATEGORY },
  { label: 'Brand', value: ActionTypeEnum.BRAND },
  { label: 'Search', value: ActionTypeEnum.SEARCH },
  { label: 'In-App Page', value: ActionTypeEnum.IN_APP_PAGE },
  { label: 'UGC User', value: ActionTypeEnum.UGC_USER },
  { label: 'UGC Reel', value: ActionTypeEnum.UGC_REEL },
];

// Alignment Options
export const ALIGNMENT_OPTIONS = [
  { label: 'Left', value: AlignmentEnum.LEFT },
  { label: 'Center', value: AlignmentEnum.CENTER },
  { label: 'Right', value: AlignmentEnum.RIGHT },
];

// Gradient Direction Options
export const GRADIENT_DIRECTION_OPTIONS = [
  { label: 'To Bottom', value: GradientDirectionEnum.TO_BOTTOM },
  { label: 'To Top', value: GradientDirectionEnum.TO_TOP },
  { label: 'To Right', value: GradientDirectionEnum.TO_RIGHT },
  { label: 'To Left', value: GradientDirectionEnum.TO_LEFT },
];

// Aspect Ratio Options
export const ASPECT_RATIO_OPTIONS = [
  { label: '16:9 (Widescreen)', value: AspectRatioEnum.RATIO_16_9 },
  { label: '4:3 (Standard)', value: AspectRatioEnum.RATIO_4_3 },
  { label: '3:2', value: AspectRatioEnum.RATIO_3_2 },
  { label: '2:1', value: AspectRatioEnum.RATIO_2_1 },
  { label: '1:1 (Square)', value: AspectRatioEnum.RATIO_1_1 },
];

// Home Page Status Options
export const HOME_PAGE_STATUS_OPTIONS = [
  { label: 'Draft', value: HomePageStatusEnum.DRAFT },
  { label: 'Published', value: HomePageStatusEnum.PUBLISHED },
];

// Condition Operator Options
export const CONDITION_OPERATOR_OPTIONS = [
  { label: 'Equals (=)', value: ConditionOperatorEnum.EQ },
  { label: 'Not Equals (≠)', value: ConditionOperatorEnum.NE },
  { label: 'Greater Than (>)', value: ConditionOperatorEnum.GT },
  { label: 'Less Than (<)', value: ConditionOperatorEnum.LT },
  { label: 'Greater Than or Equal (≥)', value: ConditionOperatorEnum.GTE },
  { label: 'Less Than or Equal (≤)', value: ConditionOperatorEnum.LTE },
  { label: 'Contains', value: ConditionOperatorEnum.CONTAINS },
  { label: 'In Array', value: ConditionOperatorEnum.IN },
  { label: 'Not In Array', value: ConditionOperatorEnum.NIN },
];

// Helper function to get label from value
export const getLabelFromValue = (options: { label: string; value: string }[], value: string): string => {
  return options.find(opt => opt.value === value)?.label || value;
};

// Helper function to get screen type label
export const getScreenTypeLabel = (value: string): string => {
  return getLabelFromValue(SCREEN_TYPE_OPTIONS, value);
};

// Helper function to get platform label
export const getPlatformLabel = (value: string): string => {
  return getLabelFromValue(PLATFORM_OPTIONS, value);
};

// Helper function to get state label
export const getStateLabel = (value: string): string => {
  return getLabelFromValue(STATE_OPTIONS, value);
};
