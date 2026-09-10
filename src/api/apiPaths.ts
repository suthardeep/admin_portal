export const apiPaths = {
  auth: {
    login: "admin/auth/login",
    profile: "admin/auth/profile",
    verifyTokens: "auth/verify-tokens",
    logout: "auth/logout",
    sendOtp:"auth/send-otp" ,
    verifyOtp:"auth/verify-otp"
  },
  dashboard: "dashboard",
  careers: "career",
  events: "events",
  highlight: "highlight",
  upload: "upload" ,

  media:{
    upload: "media/upload",
    bulkUpload: "media/bulk-upload",
    vendorList: "media/list",
    vendorFolders: "media/groups",
    list: "media/list",
    folders: "media/groups",
    deleteMany: "media/delete",
    changeFolder: "media/change-folder",
    fetchByid: "media",
    delete: "media"
  },


  roles:{
    create:"roles" ,
    getAll:"roles" ,
    getById:"roles" ,
    updateById:"roles",
    deleteById:"roles"
  },

  subAdmins: {
    create: "/admin/sub-admins",
    getAll: "admin/sub-admins", 
    getById: "admin/sub-admins",
    updateById: "admin/sub-admins",
    deleteById: "admin/sub-admins"
  },

  categories: {
    create: "categories",
    getAll: "categories",
    getById: "categories",
    updateById: "categories",
    deleteById: "categories",
    toggleStatus: "categories/toggle-status"
  },

  tiers: {
    create: "categories/pricing-tiers",
    getAll: "categories/pricing-tiers",
    getById: "categories/pricing-tiers",
    updateById: "categories/pricing-tiers",
    deleteById: "categories/pricing-tiers"
  },

  vendors: {
    getAll: "admin/vendors"
  },

  products: {
    getAll: "admin/products",
    getById: "admin/products",
  },

  brands: {
    getAll: "admin/vendors/brands",
    getById: "admin/brands",
  },

  sections: {
    create: "section/create",
    getAll: "section/list",
    getById: "section",
    updateById: "section",
    deleteById: "section",
    toggleActive: "section"
  },

  banners: {
    create: "banner/create",
    getAll: "banner/list",
    getById: "banner",
    updateById: "banner",
    deleteById: "banner"
  },

  home: {
    create: "homepage/create",
    getAll: "homepage/list",
    getById: "homepage/details",
    updateById: "homepage/edit",
    deleteById: "homepage/delete"
  },

  warehouses: {
    create: "admin/warehouses",
    getAll: "admin/warehouses",
    getById: "admin/warehouses",
    updateById: "admin/warehouses",
    deleteById: "admin/warehouses"
  },

  shipments: {
    create: "admin/shipments",
    getAll: "admin/shipments",
    getById: "admin/shipments",
    updateById: "admin/shipments",
    deleteById: "admin/shipments",
    deliveryPartners: "admin/shipments/delivery-partners",
    track: "admin/shipments/track"
  }
} as const;

