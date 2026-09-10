// schemas/banner.schema.ts
import { z } from 'zod';

// CTA Target Schema
const CtaTargetSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// CTA Config Schema - Make it more flexible for different action types
const CtaConfigSchema = z.object({
  ctaType: z.enum(['TEXT_BUTTON', 'ICON_BUTTON', 'IMAGE_BUTTON']).optional(),
  label: z.string().optional(),
  actionType: z.enum([
    'CATEGORY', 
    'BRAND', 
    'PRODUCT', 
    'SEARCH', 
    'IN_APP_PAGE', 
    'UGC_USER', 
    'UGC_REEL',
    // Legacy support
    'VENDOR', 
    'PAGE', 
    'EXTERNAL_URL'
  ]).optional(),
  targets: z.array(CtaTargetSchema).optional(),
  // Support for multi-select values (comma-separated string)
  selectedValue: z.string().optional(),
}).optional();

export const BannerFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  platform: z.enum(['CUSTOMER', 'VENDOR', 'RIDER']),
  bannerType: z.enum(['ORGANIC', 'SPONSORED']).optional(),
  screenType: z.enum(['HOME', 'CATEGORY', 'PRODUCT', 'CART', 'PROFILE']).optional(),
  displayIndex: z.number().min(0).optional(),
  stateIds: z.array(z.string()).min(1, 'At least one state is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  ratio: z.string().min(1, 'Ratio is required'),
  roundness: z.number().min(0, 'Roundness must be 0 or greater'),
  mediaUrl: z.string().min(1, 'Media is required'),
  mediaType: z.enum(['IMAGE', 'VIDEO']).optional(),
  ctaConfig: CtaConfigSchema,
  note: z.string().optional().or(z.literal('')),
  active: z.boolean(),
});

export type BannerFormData = z.infer<typeof BannerFormSchema>;

export type BannerMode = 'create' | 'edit';