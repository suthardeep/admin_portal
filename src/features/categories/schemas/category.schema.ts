import { z } from "zod";

/* =====================================================
   Base Schemas
===================================================== */

export const ChildCategorySchema = z.object({
  id: z.string().optional(), // Optional ID for existing categories
  name: z.string().min(1, "Child category name is required"),
  imageUrl: z.string().min(1, "Valid image is required").url("Must be a valid URL"),
});

export const SubcategorySchema = z.object({
  id: z.string().optional(), // Optional ID for existing categories
  name: z.string().min(1, "Subcategory name is required"),
  imageUrl: z.string().min(1, "Valid image is required").url("Must be a valid URL"),
  children: z.array(ChildCategorySchema).default([]),
});

export const RequiredDocumentSchema = z.object({
  name: z.string().min(1, "Document group name is required"),
  children: z.array(
    z.object({
      name: z.string().min(1, "Document name is required"),
    })
  ).min(1, "At least one document is required in each group").max(2, "Maximum 2 documents allowed per group"),
});

export const MandatoryFieldSchema = z.object({
  name: z.string().min(1, "Field group name is required"),
  children: z.array(
    z.object({
      name: z.string().min(1, "Field name is required"),
    })
  ).min(1, "At least one field is required in each group").max(2, "Maximum 2 fields allowed per group"),
});

/* =====================================================
   Pricing Schema
===================================================== */

export const CategoryPricingSchema = z
  .object({
    min: z.number()
      .min(0.01, "Minimum price must be greater than 0")
      .positive("Minimum price cannot be negative"),
    max: z.number()
      .min(0.01, "Maximum price must be greater than 0")
      .positive("Maximum price cannot be negative"),
    tierId: z.string().min(1, "Tier selection is required"),
    // Tier details (read-only, populated from selected tier)
    platformCharges: z.number().optional(),
    platformChargesType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
    closingFee: z.number().optional(),
    closingFeeType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
    referralFee: z.number().optional(),
    referralFeeType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
    aavakCoins: z.number().optional(),
  })
  .refine((data) => data.max >= data.min, {
    message: "Maximum price must be greater than or equal to minimum price",
    path: ["max"],
  });

/* =====================================================
   Shipping Charges
===================================================== */

export const ShippingChargesSchema = z.object({
  local: z.number()
    .min(0.01, "Local charges must be greater than 0")
    .positive("Local charges cannot be negative"),
  regional: z.number()
    .min(0.01, "Regional charges must be greater than 0")
    .positive("Regional charges cannot be negative"),
  national: z.number()
    .min(0.01, "National charges must be greater than 0")
    .positive("National charges cannot be negative"),
});

/* =====================================================
   Return Policy
===================================================== */

export const ReturnPolicySchema = z
  .object({
    returnPolicy: z.enum([
      "NO_RETURN",
      "RETURN_ONLY",
      "REPLACE_ONLY",
      "RETURN_REPLACE",
      "SERVICE_CENTER",
    ]),

    returnReplacePeriodDays: z.number().min(0, "Period must be 0 or greater"),
  })
  .refine((data) => {
    if (data.returnPolicy === "NO_RETURN") {
      return data.returnReplacePeriodDays === 0;
    }
    return data.returnReplacePeriodDays > 0;
  }, {
    message: "Period must be greater than 0 for return/replacement options",
    path: ["returnReplacePeriodDays"],
  });

/* =====================================================
   Main Category Schema
===================================================== */

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must not exceed 100 characters"),

  imageUrl: z.string().min(1, "Valid category image required").url("Must be a valid URL"),

  subcategories: z.array(SubcategorySchema).default([]),

  requiredDocuments: z
    .array(RequiredDocumentSchema)
    .min(1, "At least one document group is required"),

  mandatoryFields: z
    .array(MandatoryFieldSchema)
    .min(1, "At least one field group is required"),

  pricing: CategoryPricingSchema,

  charges: ShippingChargesSchema,

  returnPolicy: ReturnPolicySchema,
});

/* =====================================================
   Tier Schema
===================================================== */

export const TierSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  platformCharges: z.number().min(0, "Platform charges cannot be negative"),
  platformChargesType: z.enum(["PERCENTAGE", "FIXED"]),
  closingFee: z.number().min(0, "Closing fee cannot be negative"),
  closingFeeType: z.enum(["PERCENTAGE", "FIXED"]),
  referralFee: z.number().min(0, "Referral fee cannot be negative"),
  referralFeeType: z.enum(["PERCENTAGE", "FIXED"]),
  aavakCoins: z.number().min(0, "Aavak coins cannot be negative"),
});

/* =====================================================
   Form Schema (UI layer)
===================================================== */

export const CategoryFormSchema = CategorySchema;

/* =====================================================
   API Payload Schemas
===================================================== */

export const CreateCategoryPayloadSchema = CategorySchema;

export const UpdateCategoryPayloadSchema = CategorySchema.partial();

/* =====================================================
   Types
===================================================== */

export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
export type CreateCategoryPayload = z.infer<typeof CreateCategoryPayloadSchema>;
export type UpdateCategoryPayload = z.infer<typeof UpdateCategoryPayloadSchema>;
export type TierFormData = z.infer<typeof TierSchema>;

/* =====================================================
   Individual Field Schemas (Granular Validation)
===================================================== */

export const CategoryFieldSchemas = {
  name: CategorySchema.shape.name,
  imageUrl: CategorySchema.shape.imageUrl,
  subcategories: CategorySchema.shape.subcategories,
  requiredDocuments: CategorySchema.shape.requiredDocuments,
  mandatoryFields: CategorySchema.shape.mandatoryFields,
  pricing: CategorySchema.shape.pricing,
  charges: CategorySchema.shape.charges,
  returnPolicy: CategorySchema.shape.returnPolicy,
};