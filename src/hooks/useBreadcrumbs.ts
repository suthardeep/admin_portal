// src/hooks/useBreadcrumbs.ts
import { useMatches } from "@tanstack/react-router";
import { useMemo } from "react";

type Breadcrumb = {
  label: string;
  path?: string;
};

type BreadcrumbContext = {
  label: string;
  hideFromBreadcrumb?: boolean; // Option to hide specific routes
};

export const useBreadcrumbs = (): Breadcrumb[] => {
  const matches = useMatches();

  const breadcrumbs = useMemo(() => {
    return matches
      .filter((match) => {
        const breadcrumb = match.context?.breadcrumb as BreadcrumbContext | undefined;
        // Filter out routes without breadcrumbs or marked as hidden
        return breadcrumb && !breadcrumb.hideFromBreadcrumb;
      })
      .map((match) => {
        const breadcrumb = match.context.breadcrumb as BreadcrumbContext;
        return {
          label: breadcrumb.label,
          path: match.pathname,
        };
      });
  }, [matches]);

  return breadcrumbs;
};