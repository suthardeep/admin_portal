import { Permission, RolePermission } from "@/features/sub-admins/roles/components/RolesPermissionMatrix";
export const assignedRolesData: RolePermission[] = [
  {
    module: 'Dashboard',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Orders',
    permissions: { view: false, add: false, edit: false, delete: false }
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
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Warehouse',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Categories',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'UGC Campaigns',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Aavak Coins',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Discounts & Offers',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Promote Products',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Reports & Analytics',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Alerts & Requests',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Sub-Admins',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'CMS',
    permissions: { view: false, add: false, edit: false, delete: false }
  },
  {
    module: 'Banners',
    permissions: { view: false, add: false, edit: false, delete: false }
  }
];





export const availablePermissions: Permission[] = [
  { key: 'view', label: 'VIEW' },
  { key: 'add', label: 'ADD' },
  { key: 'edit', label: 'EDIT' },
  { key: 'delete', label: 'DELETE' },
];



export const allModules: string[] = [
  "Dashboard",
  "Orders",
  "Customers",
  "Vendors",
  "Products",
  "Warehouse",
  "Categories",
  "UGC Campaigns",
  "Aavak Coins",
  "Discounts & Offers",
  "Promote Products",
  "Reports & Analytics",
  "Alerts & Requests",
  "Sub-Admins",
  "CMS",
  "Banners"
];



export const createEmptyPermissions = (modules: string[]): RolePermission[] => {
  return modules.map(module => ({
    module,
    permissions: { view: false, add: false, edit: false, delete: false }
  }));
};


