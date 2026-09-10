import { useQuery } from "@tanstack/react-query";
import brandsApi, { type GetBrandsResponse, type Brand } from "./queryFunctions";

// Query keys factory
export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: () => [...brandKeys.lists()] as const,
  details: () => [...brandKeys.all, "detail"] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

/**
 * Hook to get all brands
 */
export const useGetBrandsQuery = () => {
  return useQuery<GetBrandsResponse, Error, Brand[]>({
    queryKey: brandKeys.list(),
    queryFn: () => brandsApi.getAll(),
    select: (response) => response.data.data, // Extract data from nested structure
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get brand by ID
 */
export const useGetBrandByIdQuery = (brandId: string) => {
  return useQuery({
    queryKey: brandKeys.detail(brandId),
    queryFn: () => brandsApi.getById(brandId),
    enabled: !!brandId,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
  });
};
