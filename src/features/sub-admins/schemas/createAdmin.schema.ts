import { z } from "zod";

/*
 * REVERT GUIDE - To make profile image required again:
 * 1. In this file: Uncomment the required profileImageUrl validation and remove the optional one
 * 2. In CreateAdminForm.tsx: Change label back to "Profile picture", set required={true}
 * 3. In index.tsx: Remove the processedFormData logic
 * 4. In subAdmin.d.ts: Remove the ? from profileImageUrl in CreateSubAdminPayload
 */

// Media item schema for profile picture
const MediaItemSchema = z.object({
  id: z.string(),
  s3Url: z.string().url("Invalid URL format"),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});

// Main create admin schema - using exact API field names
export const CreateAdminSchema = z.object({
  // TODO: REVERT - Make profileImageUrl required again when ready
  // profileImageUrl: z.string()
  //   .min(1, "Profile picture is required")
  //   .url("Invalid profile image URL"),
  profileImageUrl: z.string()
    .optional()
    .default("https://via.placeholder.com/150/cccccc/ffffff?text=Profile"), // Temporary default
  firstName: z.string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z.string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters"),
  password: z.string()
    .optional() // Make password optional for edit mode
    .refine((val) => {
      // If password is provided, it should meet requirements
      if (val && val.length > 0) {
        return val.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val);
      }
      return true; // Allow empty password for edit mode
    }, {
      message: "Password must be at least 8 characters with uppercase, lowercase, and number"
    }),
  customRoleIds: z.array(z.string())
    .min(1, "At least one role is required"),
  allowSensitiveInfo: z.boolean().default(true),
});

export const RoleSchema = z.enum(["finance", "hr", "operations", "it"]);

export const CreateAdminSchemaWithRole = CreateAdminSchema.extend({
  role: RoleSchema,
});

// Type inference from schemas
export type CreateAdminFormData = z.infer<typeof CreateAdminSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;
export type Role = z.infer<typeof RoleSchema>;

// Create mode schema - password is required
export const CreateSubAdminPayloadSchema = CreateAdminSchema.extend({
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

// Update mode schema - password is optional but if provided, must meet requirements
export const UpdateSubAdminPayloadSchema = CreateAdminSchema.extend({
  password: z.string()
    .optional()
    .refine((val) => {
      // If password is provided and not empty, it should meet requirements
      if (val && val.length > 0) {
        return val.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val);
      }
      return true; // Allow empty/undefined password for edit mode
    }, {
      message: "Password must be at least 8 characters with uppercase, lowercase, and number"
    }),
});

// Type for API payload
export type CreateSubAdminPayload = z.infer<typeof CreateSubAdminPayloadSchema>;

// Export individual field schemas for granular validation if needed
export const AdminFieldSchemas = {
  firstName: CreateAdminSchema.shape.firstName,
  lastName: CreateAdminSchema.shape.lastName,
  email: CreateAdminSchema.shape.email,
  customRoleIds: CreateAdminSchema.shape.customRoleIds,
  allowSensitiveInfo: CreateAdminSchema.shape.allowSensitiveInfo,
  profileImageUrl: CreateAdminSchema.shape.profileImageUrl,
};