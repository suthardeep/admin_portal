import { CategoryFormData } from "../schemas/category.schema";

/**
 * Transforms the API response for category details into the form data structure
 */
export const transformCategoryResponseToFormData = (
  response: any,
  tierDetails?: any
): CategoryFormData => {
  const { category, subCategories, config } = response;

  return {
    name: category.name || '',
    imageUrl: category.image || '',
    
    // Transform subcategories with proper structure
    subcategories: (subCategories || []).map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      imageUrl: sub.image || '',
      children: (sub.children || []).map((child: any) => ({
        id: child.id,
        name: child.name,
        imageUrl: child.image || '',
      })),
    })),
    
    // Transform required documents
    requiredDocuments: (config.requiredVendorDocuments || []).length > 0
      ? config.requiredVendorDocuments.map((doc: any) => ({
          name: doc.groupName || '',
          children: (doc.documents || []).map((docName: string) => ({
            name: docName,
          })),
        }))
      : [{ name: '', children: [{ name: '' }] }], // Default if empty
    
    // Transform mandatory fields
    mandatoryFields: (config.mandatoryProductFields || []).length > 0
      ? config.mandatoryProductFields.map((field: any) => ({
          name: field.name || '',
          children: [{ name: '' }], // API doesn't provide children, so default to one empty child
        }))
      : [{ name: '', children: [{ name: '' }] }], // Default if empty
    
    // Pricing with tier details
    pricing: {
      min: config.pricing?.min || 0.01,
      max: config.pricing?.max || 1000,
      tierId: config.pricing?.tierId || '',
      // If tier details are provided, include them (these are read-only)
      platformCharges: tierDetails?.platformCharges || 0,
      platformChargesType: tierDetails?.platformChargesType || 'PERCENTAGE',
      closingFee: tierDetails?.closingFee || 0,
      closingFeeType: tierDetails?.closingFeeType || 'PERCENTAGE',
      referralFee: tierDetails?.referralFee || 0,
      referralFeeType: tierDetails?.referralFeeType || 'PERCENTAGE',
      aavakCoins: tierDetails?.aavakCoins || 0,
    },
    
    // Charges
    charges: {
      local: config.charges?.local || 10,
      regional: config.charges?.regional || 20,
      national: config.charges?.national || 30,
    },
    
    // Return policy - handle missing returnReplacePeriodDays
    returnPolicy: {
      returnPolicy: config.returnPolicy || 'NO_RETURN',
      returnReplacePeriodDays: config.returnReplacePeriodDays || 0, // Default to 0 if not provided
    },
  };
};