export const ROUTES = {
  DASHBOARD: "/dashboard",
  ORDERS: {
    ALL: `/orders/all`,
    INITIATED: "/orders/initiated",
    PAYMENT_CONFIRMED: "/orders/payment_confirmed",
    PAYMENT_ERROR: "/orders/payment_error",
    CANCELLED: "/orders/cancelled",
    PREPARING: "/orders/preparing",
    READY_TO_PICKUP: "/orders/ready_to_pickup",
    ON_THE_WAY: "/orders/on_the_way",
    DELIVERED: "/orders/delivered",
    DETAILS: (orderDetails: string) => `/orders/details/${orderDetails}`,
    CREATE_ORDER: `/orders/create`,
    REVIEW_ORDER: `/orders/create/review`,
  },
  RIDERS: {
    ALL_RIDERS: {
      ROOT: `/riders/all-riders`,
      ADD: `/riders/all-riders/add`,
      EDIT: (riderId: string) => `/riders/all-riders/edit/${riderId}`,
      DETAILS: (riderId: string) => `/riders/all-riders/details/${riderId}`,
    },
    SHIFT_MANAGEMENT: `/riders/shift-management`,
  },
  PRODUCTS: {
    GLOBAL_STORE: {
      ROOT: `/products/global-store`,
      CREATE: `/products/global-store/create`,
      EDIT: (productId: string) => `/products/global-store/edit/${productId}`,
    },
    PRODUCT_EDIT_REQUESTS: {
      LIST: `/products/product-edit-requests`,
    },
  },
  MAPS: `/maps`,
  STORES: {
    ALL_STORES: {
      ROOT: `/stores/all-stores`,
      ADD: `/stores/all-stores`,
      EDIT: (storeId: string) => `/stores/all-stores/edit/${storeId}`,
      DETAILS: (storeId: string) => `/stores/all-stores/details/${storeId}`,
      PRODUCTS: {
        ROOT: (storeId: string) => `/stores/all-stores/products/${storeId}`,
        CREATE: (storeId: string) =>
          `/stores/all-stores/products/${storeId}/create`,
        PRODUCT_DETAILS: (storeId: string, productId: string) =>
          `/stores/all-stores/products/${storeId}/${productId}`,
        EDIT: (storeId: string, productId: string) =>
          `/stores/all-stores/products/${storeId}/${productId}/edit`,
      },
      MENU: (storeId: string) => `/stores/all-stores/menu/${storeId}`,
      MANAGE_ADDONS: (storeId: string) =>
        `/stores/all-stores/manage-addons/${storeId}`,
    },
    RESTAURANTS: {
      ROOT: `/stores/restaurants`,
    },
    SUPERMARKETS: {
      ROOT: `/stores/supermarkets`,
    },
    OWNERS: {
      ROOT: `/stores/owners`,
    },
  },

  CATEGORY: {
    LIST: "/categories",
    CREATE: "/categories/create",
    EDIT: (categoryId: string) => `/categories/${categoryId}/edit`,
    VIEW: (categoryId: string) => `/categories/${categoryId}/view`
  },
  TIER: {
    LIST: "/tiers",
    CREATE: "/tiers/create",
    EDIT: (tierId: string) => `/tiers/${tierId}/edit`,
  },
  WAREHOUSE: {
    LIST: "/warehouses",
    CREATE: "/warehouses/create",
    EDIT: (warehouseId: string) => `/warehouses/edit/${warehouseId}`,
    DETAILS: (warehouseId: string) => `/warehouses/${warehouseId}`,
  },
  VENDOR: {
    LIST: "/vendors",
    CREATE: "/vendors/create",
    EDIT: (vendorId: string) => `/vendors/${vendorId}/edit`,
    VIEW: (vendorId: string) => `/vendors/${vendorId}/view`
  },
  SHIPMENTS: {
    LIST: "/shipments",
    INITIATE: "/shipments/initiate",
    DETAILS: (shipmentId: string) => `/shipments/${shipmentId}`,
    TRACK: (shipmentId: string) => `/shipments/track/${shipmentId}`,
  },
  SETTINGS: {
    ROOT: `/settings`,
    ZONES: {
      ROOT: `/settings/zones`,
      CREATE: `/settings/zones/create`,
      EDIT: (uniqueId: string) => `/settings/zones/edit/${uniqueId}`,
      DETAILS: (uniqueId: string) => `/settings/zones/details/${uniqueId}`,
    },
    MEDIA_GALLERY: `/settings/media-gallery`,
    STAFF: {
      ROOT: `/settings/staff`,
      ADD: `/settings/staff/add`,
      EDIT: (staffId: string) => `/settings/staff/edit/${staffId}`,
    },
    ROLES_PERMISSIONS: {
      ROOT: `/settings/roles-permissions`,
      ADD: `/settings/roles-permissions/add`,
      EDIT: (roleId: string) => `/settings/roles-permissions/edit/${roleId}`,
    },
    INFO_UPDATE_REQUESTS: `/settings/info-update-requests`,
  },
  UNAUTHORIZED: "/unauthorized",
  CMS: {
    SECTIONS: {
      LIST: `/cms/sections`,
      CREATE: `/cms/sections/create`,
      EDIT: (sectionId: string) => `/cms/sections/${sectionId}/edit`,
    },
    HOME: {
      LIST: `/cms/home`,
      CREATE: `/cms/home/create`,
      EDIT: (homeId: string) => `/cms/home/edit/${homeId}`,
    },
    BANNERS: {
      LIST: `/cms/banners`,
      CREATE: `/cms/banners/create`,
      EDIT: (bannerId: string) => `/cms/banners/edit/${bannerId}`,
      TRANSACTIONS: `/cms/banners/transactions`,
    },
  },

  SUBADMIN:{
    ROOT: "/sub-admin",
    CREATE_NEW_ADMIN: "/sub-admin/create-admin",
    ADMIN_DETAILS: (adminId: string) => `/sub-admin/sub-admin-details/${adminId}`,
    EDIT_ADMIN: (adminId: string) => `/sub-admin/create-admin?id=${adminId}&mode=edit`,
    ROLES_AND_PERMISSIONS: "/sub-admin/roles-permissions",
    CREATE_NEW_ROLE: "/sub-admin/roles-permissions/create",
    ROLE_DETAILS: (roleId: string) => `/sub-admin/roles-permissions/${roleId}`,
    EDIT_ROLE: (roleId: string) => `/sub-admin/roles-permissions/${roleId}/edit`,
  },
  PROFILE: "/profile",
  LOGIN: `/login`,
};
