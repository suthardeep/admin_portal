import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import categoriesApi, { tiersApi } from './queryFunctions';
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  GetAllCategoriesResponse,
  CategoryListItem,
  GetCategoryDetailsResponse,
  Category,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  GetAllCategoriesParams,
  UpdateCategoryParams,
  // Tier types
  CreateTierPayload,
  GetAllTiersResponse,
  CreateTierResponse,
  UpdateTierResponse,
  DeleteTierResponse,
  GetAllTiersParams,
  UpdateTierParams,
  Tier,
} from '../types/category';
import { PaginationMeta } from '@/types/baseApi';

// Define query keys for effective caching and invalidation
export const categoriesQueryKeys = {
  all: ['categories'] as const,
  lists: (params: GetAllCategoriesParams) => [...categoriesQueryKeys.all, 'list', params] as const,
  details: () => [...categoriesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoriesQueryKeys.details(), id] as const,
};

export const tiersQueryKeys = {
  all: ['tiers'] as const,
  lists: (params: GetAllTiersParams) => [...tiersQueryKeys.all, 'list', params] as const,
  details: () => [...tiersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tiersQueryKeys.details(), id] as const,
};

// Define the shape of the data returned by the list hook
type CategoriesListResult = { data: CategoryListItem[]; meta: PaginationMeta };

// --- GET All Categories Hook ---
export const useGetAllCategoriesQuery = (params: GetAllCategoriesParams) => {
  return useQuery<GetAllCategoriesResponse | CategoriesListResult, Error, CategoriesListResult>({
    queryKey: categoriesQueryKeys.lists(params),
    queryFn: () => {
    
      return categoriesApi.getAllCategories(params);
    },
    // Select function extracts data and meta from the nested response structure
    select: (response) => {
     
      // Real API response needs extraction
      const apiResponse = response as GetAllCategoriesResponse;
      return {
        data: apiResponse.data.data,
        meta: apiResponse.data.meta,
      };
    },
  });
};

// --- GET Category Details Hook ---
export const useGetCategoryDetailsQuery = (categoryId: string) => {
  return useQuery<GetCategoryDetailsResponse, Error, Category>({
    queryKey: categoriesQueryKeys.detail(categoryId),
    queryFn: () => categoriesApi.getCategoryDetails(categoryId),
    enabled: !!categoryId,
    select: (response) => {
      // Transform API response to match Category type expected by the form
      const apiData = response.data as any;
      
      // Handle both old nested format and new flat format
      const category = apiData.category || { name: apiData.name, image: apiData.image };
      const subCategories = apiData.subCategories || [];
      const config = apiData.config || {};

      // Map subcategories with their children
      const subcategories = (subCategories || []).map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        imageUrl: sub.image || 'https://via.placeholder.com/150',
        children: (sub.children || []).map((child: any) => ({
          id: child.id,
          name: child.name,
          imageUrl: child.image || 'https://via.placeholder.com/150',
        })),
      }));

      // Map required documents to the form structure
      const requiredDocuments = (config?.requiredVendorDocuments || []).map((doc: any) => ({
        name: doc.groupName,
        children: doc.documents.map((docName: string) => ({ name: docName })),
      }));

      // Map mandatory fields to the form structure - handle new format
      const mandatoryFields = (config?.mandatoryProductFields || []).map((field: any) => ({
        name: field.groupName || field.name, // Support both formats
        children: field.fieldNames 
          ? field.fieldNames.map((fieldName: string) => ({ name: fieldName }))
          : [{ name: field.type || 'TEXT' }], // Fallback to old format
      }));

      return {
        id: category.id || apiData.id,
        name: category.name || apiData.name,
        imageUrl: category.image || apiData.image || 'https://via.placeholder.com/150',
        subcategories,
        requiredDocuments: requiredDocuments.length > 0 ? requiredDocuments : [{ name: '', children: [{ name: '' }] }],
        mandatoryFields: mandatoryFields.length > 0 ? mandatoryFields : [{ name: '', children: [{ name: '' }] }],
        pricing: {
          min: config?.pricing?.min || 0.01,
          max: config?.pricing?.max || 1000,
          tierId: config?.pricing?.tierId || config?.pricing?.tier?.id || '',
          platformCharges: config?.pricing?.tier?.platformCharges || 0,
          platformChargesType: config?.pricing?.tier?.platformChargesType || 'PERCENTAGE',
          closingFee: config?.pricing?.tier?.closingFee || 0,
          closingFeeType: config?.pricing?.tier?.closingFeeType || 'PERCENTAGE',
          referralFee: config?.pricing?.tier?.referralFee || 0,
          referralFeeType: config?.pricing?.tier?.referralFeeType || 'PERCENTAGE',
          aavakCoins: config?.pricing?.tier?.aavakCoins || 0,
        },
        charges: {
          local: config?.charges?.local || 10,
          regional: config?.charges?.regional || 20,
          national: config?.charges?.national || 30,
        },
        returnPolicy: {
          returnPolicy: config?.returnPolicy || 'NO_RETURN',
          returnReplacePeriodDays: config?.returnReplacePeriodDays || 0,
        },
        isActive: apiData.isActive || category.isActive,
        createdAt: apiData.createdAt || category.createdAt,
        updatedAt: apiData.updatedAt || category.updatedAt,
        createdBy: '',
      };
    },
  });
};

// --- Create Category Hook (useMutation) ---
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCategoryResponse, Error, CreateCategoryPayload>({
    mutationFn: (data: CreateCategoryPayload) => categoriesApi.createCategory(data),
    // Invalidate all category queries to ensure the list/table refreshes
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
};

// --- Update Category Hook (useMutation) ---
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateCategoryResponse, Error, UpdateCategoryParams>({
    mutationFn: ({ categoryId, data }) => categoriesApi.updateCategory({ categoryId, data }),
    // Invalidate the categories list and specific details cache on success
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.detail(variables.categoryId) });
    },
  });
};

// --- Delete Category Hook (useMutation) ---
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCategoryResponse, Error, string>({
    mutationFn: (categoryId: string) => categoriesApi.deleteCategory(categoryId),
    // Invalidate all category queries after deletion
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
};

// --- Toggle Category Status Hook (useMutation) ---
export const useToggleCategoryStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateCategoryResponse, Error, string>({
    mutationFn: (categoryId: string) => categoriesApi.toggleCategoryStatus(categoryId),
    // Invalidate queries to refresh the data
    onSuccess: (_, categoryId) => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.detail(categoryId) });
    },
  });
};

// ===== TIER HOOKS =====

// Define the shape of the data returned by the tiers list hook
type TiersListResult = { data: Tier[]; meta: PaginationMeta };

// --- GET All Tiers Hook ---
export const useGetAllTiersQuery = (params: GetAllTiersParams) => {
  return useQuery<GetAllTiersResponse, Error, TiersListResult>({
    queryKey: tiersQueryKeys.lists(params),
    queryFn: () => tiersApi.getAllTiers(params),
    select: (response) => ({
      data: response.data.data,
      meta: response.data.meta,
    }),
  });
};

// --- Create Tier Hook (useMutation) ---
export const useCreateTierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateTierResponse, Error, CreateTierPayload>({
    mutationFn: (data: CreateTierPayload) => tiersApi.createTier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tiersQueryKeys.all });
    },
  });
};

// --- Update Tier Hook (useMutation) ---
export const useUpdateTierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateTierResponse, Error, UpdateTierParams>({
    mutationFn: ({ tierId, data }) => tiersApi.updateTier({ tierId, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tiersQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: tiersQueryKeys.detail(variables.tierId) });
    },
  });
};

// --- Delete Tier Hook (useMutation) ---
export const useDeleteTierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteTierResponse, Error, string>({
    mutationFn: (tierId: string) => tiersApi.deleteTier(tierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tiersQueryKeys.all });
    },
  });
};