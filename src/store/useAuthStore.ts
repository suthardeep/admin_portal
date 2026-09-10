import { create } from "zustand";
import type { User } from "../types/user";
import { TokenUtil } from "@/utils/tokenUtil";

export interface AuthStore {
  isLoggedIn: boolean;
  user?: User;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: undefined,
  
  setAuth: (user: User) => {
    set({ user, isLoggedIn: true });
  },
  
  clearAuth: () => {
    set({ user: undefined, isLoggedIn: false });
  },
  
  logout: () => {
    TokenUtil.clearToken();
    set({ user: undefined, isLoggedIn: false });
  },
}));