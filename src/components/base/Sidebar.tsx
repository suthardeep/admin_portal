import React, { useState, forwardRef } from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import SidebarProfile from './SidebarProfile';
import { cn } from '@/utils/helpers';
import { useAuthStore } from '@/store/useAuthStore';

export interface SubMenuItem {
  label: string;
  path: string;
  icon?: string;
}

export interface MenuItem {
  label: string;
  path?: string;
  icon: string;
  subItems?: SubMenuItem[];
  badge?: string | number;
}

export interface SidebarProps {
  logo: string;
  logoAlt?: string;
  menuItems: MenuItem[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  className?: string;
  containerClassName?: string;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      logo,
      logoAlt = "Logo",
      menuItems,
      activePath,
      onNavigate,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [userExpanded, setUserExpanded] = useState(false);
    const [internalActivePath, setInternalActivePath] = useState(activePath || '');
    const { user } = useAuthStore();

    // Get user data from store
    const userName = user ? `${user.firstName} ${user.lastName}` : "Admin User";
    const userRole = user?.role || "Admin";
    const userAvatar = user?.imageUrl;


    

    React.useEffect(() => {
      if (activePath !== undefined) {
        setInternalActivePath(activePath);
      }
    }, [activePath]);

const toggleExpand = (item: MenuItem) => {
  const isCurrentlyExpanded = expandedItems.includes(item.label);

  if (isCurrentlyExpanded) {
    setExpandedItems(prev => prev.filter(i => i !== item.label));
    return;
  }

  setExpandedItems([item.label]);

  if (item.subItems && item.subItems.length > 0) {
    const firstChildPath = item.subItems[0].path;
    handleNavigation(firstChildPath);
  } 
  else if (item.path) {
    handleNavigation(item.path);
  }
};


    const handleNavigation = (path: string) => {
      setInternalActivePath(path);
      onNavigate?.(path);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "sidebar flex flex-col h-full  rounded-lg overflow-hidden bg-base-1",
          "shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.06),0px_4px_6px_-1px_rgba(0,0,0,0.1)]",
          containerClassName
        )}
        {...props}
      >
        <SidebarHeader 
          logo={logo}
          logoAlt={logoAlt}
          userRole={userRole}
          className={className}
        />

        <SidebarMenu
          menuItems={menuItems}
          expandedItems={expandedItems}
          internalActivePath={internalActivePath}
          onToggleExpand={toggleExpand}
          onNavigate={handleNavigation}
        />

        <SidebarProfile
          userExpanded={userExpanded}
          onUserExpand={setUserExpanded}
        />
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";
export default Sidebar;