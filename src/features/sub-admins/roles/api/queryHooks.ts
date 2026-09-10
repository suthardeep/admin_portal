// roles/api/queryHooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import rolesApi, { GetAllRolesParams } from './queryFns';
import { 
    CreateRoleResponse,
    GetAllRolesResponse,
    RoleListItemApi,
    GetRoleDetailsResponse,
    RoleDetailsApi,
    UpdateRolePayload,
    UpdateRoleResponse,
    DeleteRoleResponse
} from '../types/roles';
import { CreateRolePayload } from '../../schemas/roles.schema'; 
import { PaginationMeta } from '@/types/baseApi'; 

// Define query keys for effective caching and invalidation
export const rolesQueryKeys = {
    all: ['roles'] as const,
    // Key includes params to differentiate cached results for different pages/filters
    lists: (params: GetAllRolesParams) => [...rolesQueryKeys.all, 'list', params] as const,
    details: () => [...rolesQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...rolesQueryKeys.details(), id] as const,
};

// Define the shape of the data returned by the list hook
type RolesListResult = { data: RoleListItemApi[]; meta: PaginationMeta }; 

// --- GET All Roles Hook ---
export const useGetAllRolesQuery = (params: GetAllRolesParams) => {
    return useQuery<GetAllRolesResponse, Error, RolesListResult>({
        queryKey: rolesQueryKeys.lists(params), 
        queryFn: () => rolesApi.getAllRoles(params), 
        // Select function extracts data and meta from the nested response structure
        select: (response) => ({
            data: response.data.data, 
            meta: response.data.meta, 
        }), 
    });
};

export const useGetRoleDetailsQuery = (roleId: string) => {
    return useQuery<GetRoleDetailsResponse, Error, RoleDetailsApi>({
        queryKey: rolesQueryKeys.detail(roleId),
        queryFn: () => rolesApi.getRoleDetails(roleId),
        enabled: !!roleId, 
        select: (response) => response.data, 
    });
};


// --- Create Role Hook (useMutation) ---
export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<CreateRoleResponse, Error, CreateRolePayload>({
        mutationFn: (data: CreateRolePayload) => rolesApi.createRole(data),
        // Invalidate all role queries to ensure the list/table refreshes
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: rolesQueryKeys.all });
        }
    });
};

// --- Update Role Hook (useMutation) ---
export const useUpdateRoleMutation = () => {
    const queryClient = useQueryClient();
    type Variables = { roleId: string; data: UpdateRolePayload };
    
    return useMutation<UpdateRoleResponse, Error, Variables>({
        mutationFn: ({ roleId, data }) => rolesApi.updateRole({ roleId, data }),
        // Invalidate the roles list and specific details cache on success
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: rolesQueryKeys.all });
          queryClient.invalidateQueries({ queryKey: rolesQueryKeys.detail(variables.roleId) });
        },
    });
};

// --- Delete Role Hook (useMutation) ---
export const useDeleteRoleMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation<DeleteRoleResponse, Error, string>({
        mutationFn: (roleId: string) => rolesApi.deleteRole(roleId),
        // Invalidate all role queries to ensure the list/table refreshes
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: rolesQueryKeys.all });
        },
    });
};