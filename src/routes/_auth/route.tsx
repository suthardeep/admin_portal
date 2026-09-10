import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";
import AuthLayout from "./layout";
import { TokenUtil } from "@/utils/tokenUtil";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  validateSearch: () => ({}),
  beforeLoad: async ({ context }) => {
    // Check current token status and context
    const hasToken = TokenUtil.hasToken();

    if (hasToken && context.isLoggedIn) {
      console.log("✅ [AUTH ROUTE] User authenticated, redirecting to dashboard");
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
    
    console.log("✅ [AUTH ROUTE] No valid authentication, allowing access to auth pages");
  },
});