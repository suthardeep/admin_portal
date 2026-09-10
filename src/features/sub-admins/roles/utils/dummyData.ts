import { PaginationMeta } from "@/types/baseApi";
import { Permission, RolePermission } from "../components/RolesPermissionMatrix";

export const rolesData: any[] = [
  {
    id: "1",
    role: "Admin",
    assignedUsers: 12,
    dateOfCreation: "2024-01-12",
  },
  {
    id: "2",
    role: "Manager",
    assignedUsers: 8,
    dateOfCreation: "2024-02-18",
  },
  {
    id: "3",
    role: "Inventory Supervisor",
    assignedUsers: 5,
    dateOfCreation: "2024-03-05",
  },
  {
    id: "4",
    role: "Delivery Staff",
    assignedUsers: 15,
    dateOfCreation: "2024-04-12",
  },
];



export const availablePermissions: Permission[] = [
  { key: 'view', label: 'VIEW' },
  { key: 'add', label: 'ADD' },
  { key: 'edit', label: 'EDIT' },
  { key: 'delete', label: 'DELETE' },
];

// Assigned Roles Data (View Mode)
export const assignedRolesData: RolePermission[] = [
  {
    module: 'Dashboard',
    permissions: { view: true, add: false, edit: false, delete: false }
  },
  {
    module: 'Orders',
    permissions: { view: true, add: true, edit: false, delete: false }
  },
  {
    module: 'Customers',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Vendors',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Products',
    permissions: { view: false, add: true, edit: false, delete: false }
  },
  {
    module: 'Warehouse',
    permissions: { view: true, add: false, edit: false, delete: false }
  },
  {
    module: 'Inventory',
    permissions: { view: true, add: true, edit: true, delete: false }
  },
  {
    module: 'Reports',
    permissions: { view: true, add: false, edit: false, delete: false }
  },
];

// Assign Roles Data (Edit Mode - All unchecked by default)
export const assignRolesData: RolePermission[] = [
  {
    module: 'Dashboard',
    permissions: { view: true, add: false, edit: false, delete: false }
  },
  {
    module: 'Orders',
    permissions: { view: true, add: true, edit: false, delete: false }
  },
  {
    module: 'Customers',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Vendors',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Products',
    permissions: { view: false, add: true, edit: false, delete: false }
  },
  {
    module: 'Warehouse',
    permissions: { view: true, add: false, edit: false, delete: false }
  },
  {
    module: 'Inventory',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Reports',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Settings',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Users',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
];

// All modules list (for creating new roles)
export const allModules = [
  'Dashboard',
  'Orders',
  'Customers',
  'Vendors',
  'Products',
  'Warehouse',
  'Inventory',
  'Reports',
  'Settings',
  'Users',
  'Analytics',
  'Billing',
  'Notifications',
  'Integrations',
];

// Mock pagination meta for assigned roles
export const assignedRolesPaginationMeta: PaginationMeta = {
  currentPage: 1,
  pageSize: 10,
  totalRows: 8,
  totalPages: 1,
  hasPrevPage: false,
  hasNextPage: false,
  currentRows: 8,
};

// Mock pagination meta for assign roles
export const assignRolesPaginationMeta: PaginationMeta = {
  currentPage: 1,
  pageSize: 10,
  totalRows: 10,
  totalPages: 1,
  hasPrevPage: false,
  hasNextPage: false,
  currentRows: 10,
};

// Different role presets
export const adminRolePermissions: RolePermission[] = allModules.map(module => ({
  module,
  permissions: { view: true, add: true, edit: true, delete: true }
}));

export const managerRolePermissions: RolePermission[] = allModules.map(module => ({
  module,
  permissions: { 
    view: true, 
    add: module !== 'Settings' && module !== 'Users', 
    edit: module !== 'Settings' && module !== 'Users', 
    delete: false 
  }
}));

export const viewerRolePermissions: RolePermission[] = allModules.map(module => ({
  module,
  permissions: { view: true, add: false, edit: false, delete: false }
}));

// Helper function to create empty permissions for a module
