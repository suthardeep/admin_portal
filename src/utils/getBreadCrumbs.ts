export interface Breadcrumb {
  label: string;
  path: string;
}

// Static mapping for route segments to display names
const ROUTE_LABELS: Record<string, string> = {
  // Main sections
  'dashboard': 'Dashboard',
  'categories': 'Categories',
  'vendors': 'Vendors',
  'products': 'Products',
  'orders': 'Orders',
  'customers': 'Customers',
  'reports': 'Reports',
  'alerts': 'Alerts',
  'discounts': 'Discounts',
  'coins': 'Coins',
  'ugc-campaigns': 'UGC Campaigns',
  'sub-admin': 'Sub Admin',
  'sub-admins': 'Sub Admins',
  'sub-admin-details': 'Details', // This prevents duplication
  'admin': 'Admin',
  'admins': 'Admins',
  'roles-permissions': 'Roles & Permissions',
  'cms': 'CMS',
  'sections': 'Sections',
  'home': 'Home',
  'banners': 'Banners',
  
  // Actions
  'create': 'Create',
  'edit': 'Edit',
  'view': 'View',
  'add': 'Add',
  'new': 'New',
  'update': 'Update',
  'delete': 'Delete',
  'create-admin': 'Create Admin',
  
  // Sub-sections
  'permissions': 'Permissions',
  'roles': 'Roles',
  'settings': 'Settings',
  'profile': 'Profile',
  'transactions': 'Transactions',
  'initiated': 'Initiated',
  'all': 'All Orders',
  'pending': 'Pending',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  
  // Generic ID patterns - when we detect an ID, use these labels based on parent context
  'details': 'Details',
  'info': 'Information',
  'manage': 'Manage',
};

// Function to check if a segment looks like an ID (UUID, number, etc.)
const isIdSegment = (segment: string): boolean => {
  // UUID pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // Number pattern
  const numberPattern = /^\d+$/;
  // MongoDB ObjectId pattern
  const objectIdPattern = /^[0-9a-f]{24}$/i;
  
  return uuidPattern.test(segment) || numberPattern.test(segment) || objectIdPattern.test(segment);
};

// Function to get appropriate label for ID segments based on context
const getIdLabel = (_segment: string, _previousSegment: string, nextSegment?: string): string => {
  // If next segment exists, it might give us context
  if (nextSegment) {
    if (nextSegment === 'edit') return 'Edit';
    if (nextSegment === 'view') return 'View';
    if (nextSegment === 'permissions') return 'Permissions';
  }
  
  return 'Details';
};

export const getBreadcrumbs = (): Breadcrumb[] => {
  const pathname = window.location.pathname;

  const baseBreadcrumb: Breadcrumb = {
    label: "Dashboard",
    path: "/dashboard",
  };

  const segments = pathname.split("/").filter(Boolean); // remove empty segments

  const dynamicBreadcrumbs: Breadcrumb[] = [];
  
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    const path = "/" + segments.slice(0, index + 1).join("/");
    const previousSegment = index > 0 ? segments[index - 1] : '';
    const nextSegment = index < segments.length - 1 ? segments[index + 1] : undefined;
    
    let label: string;
    let shouldSkip = false;
    
    // Skip "details" segment if previous segment was an ID
    if (segment.toLowerCase() === 'details' && index > 0 && isIdSegment(previousSegment)) {
      shouldSkip = true;
    }
    
    // Skip intermediate segments that would create duplication
    // For sub-admin-details pattern: /sub-admin/sub-admin-details/123
    if (segment === 'sub-admin-details' && previousSegment === 'sub-admin' && nextSegment && isIdSegment(nextSegment)) {
      shouldSkip = true;
    }
    
    // Skip action segments (edit, view) if previous segment was an ID that already got labeled with the action
    if ((segment === 'edit' || segment === 'view') && index > 0 && isIdSegment(previousSegment)) {
      shouldSkip = true;
    }
    
    if (shouldSkip) {
      continue;
    }
    
    // Check if this segment is an ID
    if (isIdSegment(segment)) {
      label = getIdLabel(segment, previousSegment, nextSegment);
    } else {
      // Use static mapping or fallback to formatted segment
      label = ROUTE_LABELS[segment.toLowerCase()] || 
             segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    }

    dynamicBreadcrumbs.push({ label, path });
  }

  // Avoid duplicating Dashboard if already on /dashboard
  if (pathname === "/dashboard") {
    return [baseBreadcrumb];
  }

  return [baseBreadcrumb, ...dynamicBreadcrumbs];
};