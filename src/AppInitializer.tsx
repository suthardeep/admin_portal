import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AppShimmer from "./components/empty-states/AppShimmer";
import GlobalNotFound from "./components/empty-states/GlobalNotFound";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./store/useAuthStore";
import { queryClient } from "./lib/queryClient";
import { TokenUtil } from "./utils/tokenUtil";
import { getProfile } from "./features/auth/login/api/queryFunctions";
import { DEV_USER } from "./utils/devUser";

export const router = createRouter({
  routeTree,
  context: {
    isLoggedIn: TokenUtil.hasToken(),
    queryClient,
  },
  scrollRestoration: true,
  defaultErrorComponent: (e : any) => <GlobalNotFound error={e?.error} />,
  defaultPendingComponent: () => <AppShimmer />,
  defaultNotFoundComponent: () => <GlobalNotFound />,
});

export type AppRouter = typeof router;

const AuthInitializer = () => {
  const { user, setAuth, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const hasToken = TokenUtil.hasToken();

  // Update router context when token status changes
  useEffect(() => {
    router.update({
      context: {
        isLoggedIn: hasToken,
        queryClient,
      },
    });
  }, [hasToken]);

  useEffect(() => {
    const checkAuth = async () => {


    

      if (!hasToken) {
        clearAuth();
        setIsChecking(false);
        return;
      }

      try {
        console.log("🔍 [AUTH INIT] Token found, validating with profile API");
        const response = await getProfile();
        
        if (response?.data) {
          console.log("✅ [AUTH INIT] Profile API success, setting auth", response.data);
          setAuth(response.data);
        } else {
          console.log("❌ [AUTH INIT] Profile API returned no data, clearing auth");
          TokenUtil.clearToken();
          clearAuth();
        }
      } catch (error) {
        console.error("💥 [AUTH INIT] Profile API failed:", error);
        TokenUtil.clearToken();
        clearAuth();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [hasToken, setAuth, clearAuth]);

  if (isChecking) {
    return <AppShimmer />;
  }

  return (
    <RouterProvider
      router={router}
      context={{
        isLoggedIn: hasToken && !!user,
        queryClient,
      }}
    />
  );
};

export default AuthInitializer;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
