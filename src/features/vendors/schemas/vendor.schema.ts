import { z } from "zod";

/* =====================================================
   Vendor Schema
===================================================== */

export const VendorSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must not exceed 100 characters"),

  email: z
    .string()
    .email("Valid email is required"),

  mobile: z
    .string()
    .min(10, "Valid mobile number is required")
    .max(15, "Mobile number must not exceed 15 characters"),

  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(200, "Business name must not exceed 200 characters"),

  verificationStatus: z.enum([
    "pending",
    "under_review", 
    "verified",
    "rejected"
  ]),

  isActive: z.boolean().default(true),
});

/* =====================================================
   Form Schema (UI layer)
===================================================== */

export const VendorFormSchema = VendorSchema;

/* =====================================================
   API Payload Schemas
===================================================== */

export const UpdateVendorPayloadSchema = VendorSchema.partial();

/* =====================================================
   Types
===================================================== */

export type VendorFormData = z.infer<typeof VendorFormSchema>;
export type UpdateVendorPayload = z.infer<typeof UpdateVendorPayloadSchema>;

/* =====================================================
   Individual Field Schemas (Granular Validation)
===================================================== */

export const VendorFieldSchemas = {
  fullName: VendorSchema.shape.fullName,
  email: VendorSchema.shape.email,
  mobile: VendorSchema.shape.mobile,
  businessName: VendorSchema.shape.businessName,
  verificationStatus: VendorSchema.shape.verificationStatus,
  isActive: VendorSchema.shape.isActive,
};