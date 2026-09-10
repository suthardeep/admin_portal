import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { MediaFileParams, UploadMediaProps, MediaFolderParams, VendorParams } from "../types/media.api";
import { FolderResponse, MediaItem, PaginatedResponse, VendorResponse } from "../types/media.types";

export const fetchFolders = (params: MediaFolderParams) => {
  const queryParams: any = {};
  
  if (params.search) queryParams.search = params.search;
  if (params.platformType) queryParams.platformType = params.platformType;
  if (params.accountId) queryParams.accountId = params.accountId;

  return apiService({
    method: "GET",
    endpoint: apiPaths.media.vendorFolders,
    params: queryParams
  }) as Promise<FolderResponse>;
};

export const fetchFiles = (params: MediaFileParams) => {
  const queryParams: any = {
    page: params.page || 1,
    pageSize: params.limit || 10,
    group: params.group,
    search: params.search || ''
  };

  if (params.platformType) queryParams.platformType = params.platformType;
  if (params.accountId) queryParams.accountId = params.accountId;

  return apiService({
    method: "GET",
    endpoint: apiPaths.media.vendorList,
    params: queryParams,
  }) as Promise<PaginatedResponse<MediaItem>>;
};

export const fetchVendors = (params: VendorParams) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.vendors.getAll,
    params: {
      page: params.page || 1,
      pageSize: params.limit || 20,
      search: params.search || ''
    },
  }) as Promise<VendorResponse>;
};

export const uploadFiles = (data: UploadMediaProps) => {
  const formData = new FormData();

  data.files.forEach((item) => {
    // Note: dont do file[0]... here as the backend expects multiple "files" keys and not array
    formData.append(`files`, item);
  });

  formData.append(`uploader`, "admin");
  formData.append(`platformType`, "admin");
  formData.append(`group`, data.group);

  return apiService({
    method: "POST",
    endpoint: apiPaths.media.bulkUpload,
    headers: {
      "Content-type": "multipart/form-data",
    },
    data: formData,
  });
};