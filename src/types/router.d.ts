import { QueryClient } from "@tanstack/react-query";

// src/types/router.ts (or wherever you keep your types)
export type BreadcrumbConfig = {
  label: string;
  path?: string;
};

export interface AppRouterContext {
  breadcrumb?: BreadcrumbConfig;
    isLoggedIn?: boolean;
      queryClient: QueryClient;


}