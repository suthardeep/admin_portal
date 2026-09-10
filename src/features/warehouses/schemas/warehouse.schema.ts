import { z } from 'zod';

// Address schema
const AddressSchema = z.object({
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits'),
});

// Category schema
const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Level schema
const LevelSchema = z.object({
  name: z.string().min(1, 'Level name is required'),
});

// Bay schema
const BaySchema = z.object({
  name: z.string().min(1, 'Bay name is required'),
  levels: z.array(LevelSchema).min(1, 'At least one level is required'),
});

// Aisle schema
const AisleSchema = z.object({
  name: z.string().min(1, 'Aisle name is required'),
  bays: z.array(BaySchema).min(1, 'At least one bay is required'),
});

// Zone schema
const ZoneSchema = z.object({
  name: z.string().min(1, 'Zone name is required'),
  aisles: z.array(AisleSchema).min(1, 'At least one aisle is required'),
});

export const warehouseSchema = z.object({
  name: z.string().min(1, 'Warehouse name is required'),
  managerName: z.string().min(1, 'Manager name is required'),
  managerEmail: z.string().email('Invalid email address'),
  managerMobile: z.string().min(10, 'Mobile number must be at least 10 digits').max(13, 'Mobile number must be valid'),
  managerPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  numberOfDeliveryStaff: z.number().min(0, 'Number of delivery staff must be 0 or greater'),
  address: AddressSchema,
  categories: z.array(CategorySchema).optional(),
  totalSqFt: z.number().min(1, 'Total square feet is required'),
  totalZones: z.number().min(1, 'Total zones must be at least 1'),
  zones: z.array(ZoneSchema).min(1, 'At least one zone is required'),
});

// Create mode schema (password required)
export const createWarehouseSchema = warehouseSchema.extend({
  managerPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Edit mode schema (password optional - only validate if provided and not empty)
export const editWarehouseSchema = warehouseSchema.extend({
  managerPassword: z.union([
    z.string().min(8, 'Password must be at least 8 characters'),
    z.literal(''),
  ]).optional(),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
