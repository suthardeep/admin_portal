// schemas/section.schema.ts
import { z } from 'zod';

// Text Decoration Schema
const TextDecorationSchema = z.object({
  color: z.string().min(1, 'Color is required'),
  alignment: z.enum(['left', 'center', 'right']),
  fontSize: z.number().min(1, 'Font size is required'),
  fontStyle: z.enum(['normal', 'medium', 'semibold', 'bold']),
});

// Content Condition Schema
const ContentConditionSchema = z.object({
  field: z.string(),
  operator: z.string(),
  value: z.union([z.number(), z.string(), z.array(z.string())]), // Support arrays for multi-select (category, banner)
});

// Selected Item Schema
const SelectedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Content Config Schema
const ContentConfigSchema = z.object({
  sourceType: z.enum(['PRODUCT', 'CATEGORY', 'BANNER', 'VENDOR'], {
    message: 'Please select a source type',
  }),
  selectionType: z.enum(['MANUAL', 'AUTOMATIC']),
  selectedItems: z.array(SelectedItemSchema).min(1, 'Please add atleast one item to this section'),
  conditions: z.array(ContentConditionSchema).optional(),
  limit: z.number(),
  sort: z.string(),
});

// CTA Target Schema
const CtaTargetSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// CTA Config Schema
const CtaConfigSchema = z.object({
  ctaType: z.enum(['TEXT_BUTTON', 'ICON_BUTTON', 'IMAGE_BUTTON']).optional(),
  label: z.string().optional(), // Label is optional
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
  targets: z.array(CtaTargetSchema).optional(), // Targets are optional
  configureTo: z.string().optional(), // For dropdown value (UI-only field)
}).optional();

// Display Settings Schemas
const SliderDisplaySettingsSchema = z.object({
  displayType: z.literal('SLIDER'),
  interval: z.any()
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Interval is required',
    })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Interval must be a valid number',
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1, {
      message: 'Interval must be at least 1',
    }),
  autoPlay: z.boolean().optional(),
  showDots: z.boolean().optional(),
  showArrows: z.boolean().optional(),
});

const HorizontalListDisplaySettingsSchema = z.object({
  displayType: z.literal('HORIZONTAL_LIST'),
  numberOfLines: z.any()
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Number of items is required',
    })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Number of items must be a valid number',
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1, {
      message: 'Number of items must be at least 1',
    }),
  spacing: z.any()
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Spacing is required',
    })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Spacing must be a valid number',
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 0, {
      message: 'Spacing cannot be negative',
    }),
  itemWidth: z.any()
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Item width is required',
    })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Item width must be a valid number',
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1, {
      message: 'Item width must be at least 1',
    }),
  autoPlay: z.boolean().optional(),
});

const GridDisplaySettingsSchema = z.object({
  displayType: z.literal('GRID'),
  columnsMax: z.any()
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Max columns is required',
    })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Max columns must be a valid number',
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1 && val <= 6, {
      message: 'Max columns must be between 1 and 6',
    }),
  rowsMax: z.any()
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Max rows is required',
    })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Max rows must be a valid number',
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1 && val <= 10, {
      message: 'Max rows must be between 1 and 10',
    }),
  gridSpacing: z.any()
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'Grid spacing is required',
    })
    .refine((val) => !isNaN(Number(val)), {
      message: 'Grid spacing must be a valid number',
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 0, {
      message: 'Grid spacing cannot be negative',
    }),
});

const SingleSlideDisplaySettingsSchema = z.object({
  displayType: z.literal('SINGLE_SLIDE'),
});

const DisplaySettingsSchema = z.discriminatedUnion('displayType', [
  SliderDisplaySettingsSchema,
  HorizontalListDisplaySettingsSchema,
  GridDisplaySettingsSchema,
  SingleSlideDisplaySettingsSchema,
]);

// Gradient Stop Schema
const GradientStopSchema = z.object({
  color: z.string(),
  percentage: z.number(),
});

// Gradient Config Schema
const GradientConfigSchema = z.object({
  stops: z.array(GradientStopSchema),
  direction: z.enum(['TO_BOTTOM', 'TO_TOP', 'TO_LEFT', 'TO_RIGHT', 'TO_BOTTOM_RIGHT', 'TO_BOTTOM_LEFT']),
});

// Gradient Color Schema (for UI state)
const GradientColorSchema = z.object({
  color: z.string(),
  opacity: z.number(),
});

// Section Styling Schema
const SectionStylingSchema = z.object({
  useTransparentBackground: z.boolean().optional(),
  backgroundColor: z.string(),
  hasGradient: z.boolean(),
  gradientConfig: GradientConfigSchema,
  gradientColors: z.array(GradientColorSchema).optional(),
  roundness: z.number(),
  backgroundImageUrl: z.string(),
});

// Main Section Form Schema with conditional CTA and gradient validation
export const SectionFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  sectionType: z.enum(['PRODUCT', 'CATEGORY', 'BRAND']),
  logoUrl: z.string().min(1, 'Title image/logo is required'),
  titleDecorations: TextDecorationSchema,
  subtitleDecorations: TextDecorationSchema,
  contentConfig: ContentConfigSchema,
  hasCTA: z.boolean(),
  cta: CtaConfigSchema,
  displaySettings: DisplaySettingsSchema,
  sectionStyling: SectionStylingSchema,
  active: z.boolean(),
})
.refine((data) => {
  // If CTA is enabled, label must not be empty
  if (data.hasCTA && data.cta) {
    // Only require label if CTA is actually enabled
    return data.cta.label && data.cta.label.trim().length > 0;
  }
  return true;
}, {
  message: "CTA label is required when CTA is enabled",
  path: ["cta", "label"],
})
.refine((data) => {
  // If CTA is enabled, either targets should be populated OR it should be a basic page selection
  if (data.hasCTA && data.cta) {
    const isUGCType = data.cta.actionType === 'UGC_USER' || data.cta.actionType === 'UGC_REEL';
    const hasBasicPageSelection = data.cta.configureTo && ['HOME', 'CART', 'ORDERS', 'PROFILE'].includes(data.cta.configureTo);
    const hasTargets = data.cta.targets && data.cta.targets.length > 0;
    
    // Allow if: UGC type OR has basic page selection OR has targets
    if (isUGCType || hasBasicPageSelection || hasTargets) {
      return true;
    }
    
    // If none of the above, require configuration
    return false;
  }
  return true;
}, {
  message: "Please configure CTA by selecting a category/banner/product or entering a page/URL",
  path: ["cta", "targets"],
})
.refine((data) => {
  // If gradient is enabled, gradient colors must be filled
  if (data.sectionStyling.hasGradient && data.sectionStyling.gradientColors) {
    return data.sectionStyling.gradientColors.every(gc => gc.color && gc.color !== '' && gc.color !== '#');
  }
  return true;
}, {
  message: "All gradient colors are required",
  path: ["sectionStyling", "gradientColors"],
})
.refine((data) => {
  // If transparent background is OFF, backgroundColor is required
  if (!data.sectionStyling.useTransparentBackground) {
    return data.sectionStyling.backgroundColor && data.sectionStyling.backgroundColor.length > 0;
  }
  return true;
}, {
  message: "Background color is required",
  path: ["sectionStyling", "backgroundColor"],
})
.refine((data) => {
  if (!data.sectionStyling.useTransparentBackground) {
    return data.sectionStyling.roundness >= 0;
  }
  return true;
}, {
  message: "Roundness is required",
  path: ["sectionStyling", "roundness"],
})
.refine((data) => {
  // If transparent background is OFF, backgroundImageUrl is required
  if (!data.sectionStyling.useTransparentBackground) {
    const url = data.sectionStyling.backgroundImageUrl;
    if (!url || url.length === 0) return false;
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}, {
  message: "Background image is required",
  path: ["sectionStyling", "backgroundImageUrl"],
});

export type SectionFormData = z.infer<typeof SectionFormSchema>;
export type SectionMode = 'create' | 'edit';
