import ImageZoomDialog from "@/components/compound/ImageZoomDialog";
import { ROUTES } from "@/constants/routes";
import type { AuthStore } from "@/store/useAuthStore";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";
import { Toaster } from "sonner";
import "../styles/index.css";
import MediaDialog from "@/components/compound/MediaDialog";
import { AppRouterContext } from "@/types/router";

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: Root,
  beforeLoad: ({ location }) => {
    if (location.pathname === "" || location.pathname === "/") {
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
  },
  pendingMs: 0,
});

function Root() {
  return (
    <div className="dark:bg-neutral h-screen w-screen bg-[#FAFAFA]">
      <Toaster visibleToasts={6} />
      <Outlet />
      <ImageZoomDialog />
      <MediaDialog />
      {/* <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} /> */}
    </div>
  );
}

// Remove duplicate interface - using AppRouterContext from types/router.d.ts