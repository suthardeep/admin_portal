import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFiles, fetchFolders, uploadFiles, fetchVendors } from "./queryFns";
import { MediaFileParams, MediaFolderParams, VendorParams } from "../types/media.api";
import { PaginatedResponse, MediaItem, FolderResponse, VendorResponse } from "../types/media.types";

const MEDIA_FOLDER_QUERY_KEY = "media-folder";
const MEDIA_FILE_QUERY_KEY = "media-file";
const VENDORS_QUERY_KEY = "vendors";
const GC_TIME = 1000 * 60 * 5;
const STALE_TIME = 1000 * 60 * 5;

export const useFoldersApi = (params: MediaFolderParams) => {
  const shouldFetch = params.platformType !== "vendor" || !!params.accountId;
  
  return useQuery<FolderResponse>({
    queryKey: [MEDIA_FOLDER_QUERY_KEY, params.search, params.platformType, params.accountId],
    queryFn: () => fetchFolders(params),
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: shouldFetch,
  });
};

export const useFilesApi = (params: Omit<MediaFileParams, 'page'>) => {
  const shouldFetch = !!params.group && (params.platformType !== "vendor" || !!params.accountId);
  
  return useInfiniteQuery<PaginatedResponse<MediaItem>>({
    queryKey: [MEDIA_FILE_QUERY_KEY, params.group, params.search, params.platformType, params.accountId],
    queryFn: ({ pageParam = 1 }) => 
      fetchFiles({ ...params, page: pageParam as number, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.data.page);
      const totalPages = lastPage.data.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: shouldFetch,
  });
};

export const useVendorsApi = (params: Omit<VendorParams, 'page'>) => {
  return useInfiniteQuery<VendorResponse>({
    queryKey: [VENDORS_QUERY_KEY, params.search],
    queryFn: ({ pageParam = 1 }) => 
      fetchVendors({ ...params, page: pageParam as number, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta?.currentPage;
      const totalPages = lastPage.meta?.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useUploadFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: (_, variables) => {
      // Invalidate folders in case a new one was created implicitly
      queryClient.invalidateQueries({ queryKey: [MEDIA_FOLDER_QUERY_KEY] });
      // Invalidate specific folder files
      queryClient.invalidateQueries({ 
        queryKey: [MEDIA_FILE_QUERY_KEY, variables.group] 
      });
    },
  });
};