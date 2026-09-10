import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths"; 
import { 
    CreateRolePayload, 
    CreateRoleResponse,
    GetAllRolesResponse,
    GetRoleDetailsResponse,
    UpdateRolePayload,
    UpdateRoleResponse,
    DeleteRoleResponse
} from "../types/roles";

export interface GetAllRolesParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

const rolesApi = {
    createRole: (data: CreateRolePayload): Promise<CreateRoleResponse> => {
        return apiService({
            method: "POST",
            data: data,
            endpoint: apiPaths.roles.create, 
        });
    },

    getAllRoles: (params: any): Promise<GetAllRolesResponse> => {
        return apiService({
            method: "GET",
            endpoint: apiPaths.roles.getAll, 
            params:params
        });
    },

    getRoleDetails: (roleId: string): Promise<GetRoleDetailsResponse> => {
        return apiService({
            method: "GET",
            endpoint: `${apiPaths.roles.getById}/${roleId}`, 
        });
    },

    updateRole: ({ roleId, data }: { roleId: string, data: UpdateRolePayload }): Promise<UpdateRoleResponse> => {
        return apiService({
            method: "PATCH",
            data: data,
            endpoint: `${apiPaths.roles.updateById}/${roleId}`, 
        });
    },

    deleteRole: (roleId: string): Promise<DeleteRoleResponse> => {
        return apiService({
            method: "DELETE",
            endpoint: `${apiPaths.roles.deleteById}/${roleId}`, 
        });
    }
};

export default rolesApi;