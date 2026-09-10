import { MenuItem } from "@/components/base/Sidebar";

export const sidebarMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "Home",
    path: "/dashboard",
  },
  {
    label: "Orders",
    icon: "Package",
    subItems: [
      { label: "All Orders", path: "/orders/all" },
      { label: "Initiated", path: "/orders/initiated" },
      { label: "Payment Confirmed", path: "/orders/payment_confirmed" },
      { label: "Payment Error", path: "/orders/payment_error" },
      { label: "Cancelled", path: "/orders/cancelled" },
      { label: "Preparing", path: "/orders/preparing" },
      { label: "Ready to Pickup", path: "/orders/ready_to_pickup" },
      { label: "On The Way", path: "/orders/on_the_way" },
    ],
  },
  {
    label: "Shipments",
    icon: "Truck",
    path: "/shipments",
  },
  {
    label: "Customers",
    icon: "User",
    path: "/customers",
  },
  {
    label: "Vendors",
    icon: "Store",
    subItems: [
      { label: "All Vendors", path: "/vendors" },
    ],
  },
  {
    label: "Products",
    icon: "Box",
    subItems: [
      { label: "Product List", path: "/products/list" },
      { label: "Add Product", path: "/products/add" },
    ],
  },
  {
    label: "Warehouse",
    icon: "Home",
    subItems: [
      { label: "Add Warehouse", path: "/warehouses/create" },
    ],
  },
  {
    label: "Categories",
    icon: "Grid",
    path: "/categories",
  },
  {
    label: "Tiers",
    icon: "Layers",
    path: "/tiers",
  },
  {
    label: "UGC Campaigns",
    icon: "PlayCircle",
    path: "/ugc-campaigns",
  },
  {
    label: "Aavak Coins",
    icon: "CircleDollarSign",
    subItems: [
      { label: "Summary", path: "/coins/summary" },
      { label: "Transactions", path: "/coins/transactions" },
    ],
  },
  {
    label: "Discounts & Offers",
    icon: "Percent",
    path: "/discounts",
  },
  {
    label: "Promote Products",
    icon: "Megaphone",
    path: "/promote-products",
  },
  {
    label: "Reports & Analytics",
    icon: "BarChart",
    path: "/reports",
  },
  {
    label: "Alerts & Requests",
    icon: "Bell",
    path: "/alerts",
  },
  {
    label: "Sub-Admins",
    icon: "UserCog",
    subItems: [
      { label: "Sub-Admins List", path: "/sub-admin" },
      { label: "Roles & Permissions", path: "/sub-admin/roles-permissions" },
    ],
  },
  {
    label: "CMS",
    icon: "FileText",
    subItems: [
      { label: "Sections", path: "/cms/sections" },
      { label: "Home", path: "/cms/home" },
      { label: "Banners", path: "/cms/banners" },
    ],
  },
];
