import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { 
    LoginPayload, 
    LoginResponse 
} from "../types/login";
import { User } from "@/types/user";


export const login = (data: LoginPayload): Promise<LoginResponse> => {
    return apiService({
        method: "POST",
        data: data,
        endpoint: apiPaths.auth.login, 
    });
}

export const getProfile = (): Promise<{ data: User }> => {
    return apiService({
        method: "GET",
        endpoint: apiPaths.auth.profile, 
    });
}