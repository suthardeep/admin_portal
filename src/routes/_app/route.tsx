// src/routes/_app/route.tsx
import Header from "@/components/base/Header";
import { sidebarMenuItems } from "@/utils/sideBarMenuItems";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import Sidebar from "@/components/base/Sidebar";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { TokenUtil } from "@/utils/tokenUtil";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  beforeLoad: async ({ context }) => {
    const hasToken = TokenUtil.hasToken();
    
    if (!hasToken) {
      console.log("🚫 [APP ROUTE] No token, redirecting to login");
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
    
    if (!context.isLoggedIn) {
      console.log("🚫 [APP ROUTE] Not logged in, redirecting to login");
      throw redirect({
        to: ROUTES.LOGIN,
      });
    }
    
    console.log("✅ [APP ROUTE] User authenticated, allowing access");
  },
});

function AppLayout() {
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();

  const handleNavigation = (path: string) => {
    navigate({ to: path });
  };

  return (
    <div className="relative h-screen w-screen flex p-4 gap-4 bg-base-2">
      <div className="w-[18.75rem]">
        <Sidebar 
          menuItems={sidebarMenuItems} 
          logo="/aavak-logo.svg" 
          onNavigate={handleNavigation} 
        />
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <Header 
        />

<div className="flex-1 rounded-md flex flex-col min-h-0 overflow-scroll ">
            <Outlet />
        </div>
      </div>
    </div>
  );
}