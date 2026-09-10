import { useQuery } from "@tanstack/react-query";
import productsApi, { type GetProductsResponse, type Product } from "./queryFunctions";

// Query keys factory
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: () => [...productKeys.lists()] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Hook to get all products
 */
export const useGetProductsQuery = () => {
  return useQuery<GetProductsResponse, Error, Product[]>({
    queryKey: productKeys.list(),
    queryFn: () => productsApi.getAll(),
    select: (response) => response.data.data, // Extract data from nested structure
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get product by ID
 */
export const useGetProductByIdQuery = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productsApi.getById(productId),
    enabled: !!productId,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
  });
};
