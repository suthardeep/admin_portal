import apiService from "@/api/apiService";
import { AdminProfileResponse } from "../types/profile";

export const getProfile = (): Promise<AdminProfileResponse> => {
  return apiService({
    method: "GET",
    endpoint: "admin/auth/profile",
  });
};