import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from '@tanstack/react-router';
import { toast } from '@/components/toast/Sonner';
import { Button } from '@/components/base/Button';
import { RoleDetailsHeader } from '@/features/sub-admins/roles/components/RolesDetailHeader';
import { RolePermissionMatrix } from '@/features/sub-admins/roles/components/RolesPermissionMatrix';
import { availablePermissions, createEmptyPermissions, allModules, assignedRolesData } from '@/utils/assignRolesData';
import type { RolePermission } from '@/features/sub-admins/roles/components/RolesPermissionMatrix';
import { PaginationMeta } from '@/types/baseApi';
import { ROUTES } from '@/constants/routes';
import { useGetRoleDetailsQuery, useCreateRoleMutation, useUpdateRoleMutation } from '@/features/sub-admins/roles/api/queryHooks';
import { CreateRolePayloadSchema } from '@/features/sub-admins/schemas/roles.schema';

const transformComponentPermissionsToApiPayload = (
  componentPermissions: RolePermission[],
  roleName: string
) => {
  const apiPermissions = componentPermissions.map(item => ({
    module: item.module.toLowerCase(),
    view: item.permissions.view || false,
    add: item.permissions.add || false,
    edit: item.permissions.edit || false,
    delete: item.permissions.delete || false,
  }));

  return {
    name: roleName,
    modulePermissions: apiPermissions
  };
};

export const RolesDetails = () => {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  let mode: 'create' | 'view' | 'edit' | undefined;
  if (currentPath.includes('/create')) {
    mode = 'create';
  } else if (currentPath.includes('/edit')) {
    mode = 'edit';
  } else if (currentPath.match(/\/roles-permissions\/[^/]+$/)) {
    mode = 'view';
  }

  if (!mode) {
    mode = (params as any).mode as 'create' | 'view' | 'edit' | undefined;
  }

  const roleIdFromParams = (params as any).id as string | undefined;
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';
  const roleId = roleIdFromParams || '';

  const shouldFetchRole = !isCreateMode && roleId.length > 0;
  const roleDetailsQuery = useGetRoleDetailsQuery(roleId);
  const roleDetailsApi = shouldFetchRole ? roleDetailsQuery.data : undefined;
  const isDetailsLoading = shouldFetchRole ? roleDetailsQuery.isLoading : false;
  const isDetailsError = shouldFetchRole ? roleDetailsQuery.isError : false;

  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const [editableRoleTitle, setEditableRoleTitle] = useState('');
  const [permissionsData, setPermissionsData] = useState<RolePermission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isCreateMode) {
      setEditableRoleTitle('New Role');
      setPermissionsData(createEmptyPermissions(allModules));
    } else if (roleDetailsApi) {
      setEditableRoleTitle(roleDetailsApi.name);

      const backendPermissionsMap = new Map();
      roleDetailsApi.permissions.forEach(apiPermission => {
        backendPermissionsMap.set(apiPermission.module.toLowerCase(), {
          view: apiPermission.view,
          add: apiPermission.add,
          edit: apiPermission.edit,
          delete: apiPermission.delete,
        });
      });

      const mergedPermissions = assignedRolesData.map(moduleData => {
        const moduleKey = moduleData.module.toLowerCase();
        const backendPerms = backendPermissionsMap.get(moduleKey);
        return {
          module: moduleData.module,
          permissions: backendPerms || { view: false, add: false, edit: false, delete: false }
        };
      });

      setPermissionsData(mergedPermissions);
    }
  }, [isCreateMode, roleDetailsApi]);

  const roleHeaderDetails = useMemo(() => {
    if (isCreateMode) {
      return {
        roleTitle: 'New Role',
        assignedUsers: 0,
        dateCreated: new Date().toISOString().split('T')[0],
      };
    }

    if (roleDetailsApi) {
      return {
        roleTitle: roleDetailsApi.name,
        assignedUsers: 0,
        dateCreated: roleDetailsApi.createdAt,
      };
    }

    return { roleTitle: 'Loading...', assignedUsers: 0, dateCreated: '' };
  }, [isCreateMode, roleDetailsApi]);

  const paginationMeta: PaginationMeta = {
    currentPage: currentPage,
    pageSize: 10,
    totalRows: permissionsData.length,
    totalPages: Math.ceil(permissionsData.length / 10),
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < Math.ceil(permissionsData.length / 10),
    currentRows: permissionsData.length,
  };

  const handleEditClick = () => {
    navigate({ to: ROUTES.SUBADMIN.EDIT_ROLE(roleId) });
  };

  const handleSaveClick = async () => {
    if (isSaving) return;

    const payload = transformComponentPermissionsToApiPayload(
      permissionsData,
      editableRoleTitle
    );

    const validationResult = CreateRolePayloadSchema.safeParse(payload);
    if (!validationResult.success) {
      toast.error("Validation failed. Check role title and permissions.");
      console.error(validationResult.error);
      return;
    }

    const validatedData = validationResult.data;

    try {
      if (isCreateMode) {
        await createMutation.mutateAsync(validatedData);
        toast.success(`Role '${editableRoleTitle}' created successfully!`);
        navigate({ to: ROUTES.SUBADMIN.ROLES_AND_PERMISSIONS });
      } else if (roleId) {
        await updateMutation.mutateAsync({ roleId: roleId, data: validatedData });
        toast.success(`Role '${editableRoleTitle}' updated successfully!`);
        navigate({ to: ROUTES.SUBADMIN.ROLE_DETAILS(roleId), replace: true });
      }
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message || "Failed to save role.";
      toast.error(errorMessage);
    }
  };

  const handleCancelClick = () => {
    if (isCreateMode) {
      navigate({ to: ROUTES.SUBADMIN.ROLES_AND_PERMISSIONS });
    } else if (roleId) {
      navigate({ to: ROUTES.SUBADMIN.ROLE_DETAILS(roleId), replace: true });
    }
  };

  const handlePermissionChange = (module: string, permission: string, value: boolean) => {
    setPermissionsData(prev =>
      prev.map(row =>
        row.module === module
          ? { ...row, permissions: { ...row.permissions, [permission]: value } }
          : row
      )
    );
  };

  const handleSelectAll = (permission: string, value: boolean) => {
    setPermissionsData(prev =>
      prev.map(row => ({
        ...row,
        permissions: { ...row.permissions, [permission]: value }
      }))
    );
  };

  if (isDetailsLoading || (shouldFetchRole && permissionsData.length === 0 && !isCreateMode)) {
    return <div className="p-8">Loading Role Details...</div>;
  }

  if (isDetailsError) {
    return <div className="p-8">Failed to load role details.</div>;
  }

  if (shouldFetchRole && !roleDetailsApi) {
    return <div className="p-8">Role details not found.</div>;
  }

  return (
    <div className="flex flex-col h-full ">
      {/* Fixed Header */}
      <div className="flex-shrink-0 mb-4">
        <RoleDetailsHeader
          mode={mode || 'view'}
          roleTitle={roleHeaderDetails.roleTitle}
          assignedUsers={roleHeaderDetails.assignedUsers}
          dateCreated={roleHeaderDetails.dateCreated}
          editableRoleTitle={editableRoleTitle}
          isEditMode={isEditMode}
          onEditClick={handleEditClick}
          onSaveClick={handleSaveClick}
          onCancelClick={handleCancelClick}
          onRoleTitleChange={setEditableRoleTitle}
        />
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 min-h-0">
        <RolePermissionMatrix
          title="Module Permissions"
          mode={isViewMode ? 'view' : 'edit'}
          permissions={availablePermissions}
          data={permissionsData}
          onPermissionChange={handlePermissionChange}
          onSelectAll={handleSelectAll}
          showSelectAllRow={true}
          showPagination={false}
          meta={paginationMeta}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Fixed Footer Buttons */}
      {!isViewMode && (
        <div className="flex-shrink-0 bg-white border-t border-base-3 py-4 px-4 rounded-lg">
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleCancelClick}
              variant="outline"
              color="primary"
              size="md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              variant="filled"
              color="primary"
              size="md"
              disabled={isSaving}
            >
              {isCreateMode ? 'Create' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};