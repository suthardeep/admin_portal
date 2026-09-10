import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { ProfileResponse } from "../types/profile";

export const getProfile = (): Promise<ProfileResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.auth.profile,
  });
};