// roles/schemas/roles.schema.ts
import { z } from "zod";

// 1. Schema for a single permission object in the payload
export const RolePermissionApiSchema = z.object({
  module: z.string(),
  view: z.boolean(),
  add: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
});

// 2. Schema for the Create/Update Role Payload
export const CreateRolePayloadSchema = z.object({
  name: z.string().min(1, "Role title is required"),
  modulePermissions: z.array(RolePermissionApiSchema).min(1, "At least one module permission is required"),
});

// 3. Type inference (Source of Truth for Payload Types)
export type CreateRolePayload = z.infer<typeof CreateRolePayloadSchema>;
export type RolePermissionApi = z.infer<typeof RolePermissionApiSchema>;