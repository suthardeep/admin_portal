import { z } from 'zod';

// Gradient color schema
const GradientColorSchema = z.object({
  color: z.string().min(1, 'Color is required'),
  opacity: z.number().min(0).max(100),
});

// Hero styling schema with conditional validation
const HeroStylingSchema = z.object({
  primaryColor: z.string().min(1, 'Primary color is required'),
  secondaryColor: z.string().min(1, 'Secondary color is required'),
  backgroundColor: z.string().min(1, 'Background color is required'),
  hasGradient: z.boolean().optional(),
  gradientColors: z.array(GradientColorSchema).optional(),
  backgroundImageUrl: z.string().optional(),
  heroImage: z.string().min(1, 'Hero background image is required'),
}).refine(
  (data) => {
    // If hasGradient is true, gradientColors must have at least one valid color
    if (data.hasGradient) {
      if (!data.gradientColors || data.gradientColors.length === 0) {
        return false;
      }
      // Also check that all gradient colors have valid color values (not empty)
      return data.gradientColors.every(gc => gc.color && gc.color.trim() !== '' && gc.color !== '#');
    }
    return true;
  },
  {
    message: 'At least one valid gradient color is required',
    path: ['gradientColors'],
  }
);

// Home Screen Form Schema matching the new payload structure
export const HomeScreenFormSchema = z.object({
  platform: z.enum(['CUSTOMER', 'VENDOR', 'ADMIN']).refine(val => val, {
    message: 'Platform is required',
  }),
  version: z.string().min(1, 'Version is required'),
  sections: z.array(z.string()).min(1, 'At least one section is required'),
  isActive: z.boolean().default(true),
  published: z.boolean().default(true),
  versionName: z.string().min(1, 'Version name is required'),
  appStyling: z.enum(['modern', 'classic', 'minimal']).default('modern'),
  
  // Hero styling object
  heroStyling: HeroStylingSchema,
  
  // Coin styling
  coinType: z.enum(['FINTECH', 'PROTECT', 'UGC']).refine(val => val, {
    message: 'Coin type is required',
  }),
  coinBadgeColor: z.string().min(1, 'Coin badge color is required'),
  coinBackgroundColor: z.string().min(1, 'Coin background color is required'),
  
  // Search styling
  searchTextColor: z.string().min(1, 'Search text color is required'),
  searchBackgroundColor: z.string().min(1, 'Search background color is required'),
  searchForegroundColor: z.string().min(1, 'Search foreground color is required'),
  searchIconColor: z.string().min(1, 'Search icon color is required'),
  
  // Notification styling
  notificationIconColor: z.string().min(1, 'Notification icon color is required'),
  notificationIconDotColor: z.string().min(1, 'Notification icon dot color is required'),
  notificationBackgroundColor: z.string().min(1, 'Notification background color is required'),
  
  // Location styling
  locationIconColor: z.string().min(1, 'Location icon color is required'),
  locationTypeColor: z.string().min(1, 'Location type color is required'),
  locationAddressColor: z.string().min(1, 'Location address color is required'),
});

export type HomeScreenFormData = z.infer<typeof HomeScreenFormSchema>;
export type HomeScreenMode = 'create' | 'edit';
