import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig } from "@/components/table/table.types";
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";
import { useGetAllRolesQuery, useDeleteRoleMutation } from "../../api/queryHooks"; 
import { RoleListItemApi } from "../../types/roles"; 
import { PaginationMeta } from "@/types/baseApi";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/toast/Sonner";
import { showErrorToasts } from "@/utils/helpers";

type Roles = RoleListItemApi; 

const RolesTable: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleListItemApi | null>(null);
  const navigate = useNavigate();

  const [params, setParams] = useState({ 
    page: 1, 
    pageSize: 10,
    search: '', 
  });
  
  const handleCreateNewRole = () => {
    navigate({
      to: ROUTES.SUBADMIN.CREATE_NEW_ROLE
    })
  }
  
  const { 
    data: roleData, 
    isLoading, 
    isFetching, 
    isError 
  } = useGetAllRolesQuery(params);

  const deleteRoleMutation = useDeleteRoleMutation();
  
  const roles: Roles[] = roleData?.data || [];
  const meta: PaginationMeta | undefined = roleData?.meta;

  const columns: ColumnDef<Roles>[] = useMemo(() => [
    {
      key: "name", 
      header: "ROLE",
      cellType: "text",
      render: (row) => (
        <span className="font-normal text-sm text-base-content">{row.name}</span>
      ),
    },
    {
      key: "adminUserCount", 
      header: "ASSIGNED USERS",
      cellType: "text",
      align: "center",
      render: (row) => (
        <span className="font-normal text-sm text-base-content">{row.adminUserCount}</span>
      ),
    },
    {
      key: "createdAt", 
      header: "CREATED ON",
      cellType: "text",
      sortable: true,
      render: (row) => (
        <span className="font-normal text-sm text-base-content">
          {new Date(row.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </span>
      )
    },
  ], []);

  const handlePageChange = (newPage: number) => {
    // Ensure newPage is a number
    const pageNumber = typeof newPage === 'string' ? parseInt(newPage, 10) : newPage;
    setParams(prev => ({ ...prev, page: pageNumber }));
  };

  const handleSearch = (searchTerm: string) => {
    setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }

  const handleDeleteClick = (role: RoleListItemApi) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete.id, {
        onSuccess: () => {
          toast.success(`Role '${roleToDelete.name}' deleted successfully!`);
          setDeleteDialogOpen(false);
          setRoleToDelete(null);
        },
        onError: (error) => {
          console.error('Failed to delete role:', error);
          showErrorToasts(error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };


  if (isError) {
    return <div className="p-4 text-error">Failed to load roles data.</div>
  }

  // Only show pagination if we have API data
  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined

  return (
    <>
      <Table<Roles>
        title="Roles & Permissions"
        data={roles} 
        columns={columns}
        searchable
        onSearch={handleSearch} 
        filters={[]}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectionChange={(set) =>
          setSelectedRows(new Set(set as Set<string>))
        }
        actions={[{
          label:"Create New Role" ,
          icon:"Plus" ,
          variant:"filled",
          onClick:handleCreateNewRole
        }]}
        hoverable
        loading={isLoading || isFetching} 
        
        pagination={pagination}

        rowActions={[
          {
            label: "View",
            icon: "Eye",
            onClick: (row) => {
              navigate({
                to: ROUTES.SUBADMIN.ROLE_DETAILS(row.id)
              });
            },
          },
          {
            label: "Edit",
            icon: "FileText",
            onClick: (row) => {
              navigate({
                to: ROUTES.SUBADMIN.EDIT_ROLE(row.id)
              });
            },
          },
          {
            label: "Delete",
            icon: "Trash2",
            onClick: (row) => handleDeleteClick(row),
            variant: "default",
          },
        ]}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        close={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        title="Delete Role"
        name={roleToDelete?.name}
        isDeleting={deleteRoleMutation.isPending}
      />
    </>
  );
};

export default RolesTable;