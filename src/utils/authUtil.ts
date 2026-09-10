import { TokenUtil } from "./tokenUtil";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/constants/routes";

export const AuthUtil = {
  logout: () => {
    // Clear token from storage
    TokenUtil.clearToken();
    
    // Clear auth state
    useAuthStore.getState().logout();
    
    // Redirect to login
    window.location.href = ROUTES.LOGIN;
  },
  
  isAuthenticated: () => {
    const hasToken = TokenUtil.hasToken();
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    return hasToken && isLoggedIn;
  }
};