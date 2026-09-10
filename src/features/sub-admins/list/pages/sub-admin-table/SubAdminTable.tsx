import { Table } from "@/components/table/Table";
import { ColumnDef, FilterConfig, PaginationConfig } from "@/components/table/table.types";
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";
import { useGetAllSubAdminsQuery } from "../../api/queryHooks";
import type { SubAdminListItemApi } from "../../types/subAdmin";
import { PaginationMeta } from "@/types/baseApi";

type SubAdmin = SubAdminListItemApi;

const SubAdminsTable: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
  });

  const handleCreateNewAdmin = () => {
    navigate({
      to: ROUTES.SUBADMIN.CREATE_NEW_ADMIN
    });
  };

  const {
    data: subAdminData,
    isLoading,
    isFetching,
    isError
  } = useGetAllSubAdminsQuery(params);

  const subAdmins: SubAdmin[] = subAdminData?.data || [];
  const meta: PaginationMeta | undefined = subAdminData?.meta;

  const columns: ColumnDef<SubAdmin>[] = useMemo(() => [
 {
  key: "admin",
  header: "ADMIN",
  cellType: "custom",
  render: (row) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-sm overflow-hidden bg-neutral-200">
        <img
          src={row.profileImageUrl as string}
          alt={`${row.firstName} ${row.lastName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/avatar-placeholder.png";
          }}
        />
      </div>

      <span className="font-normal text-sm text-body-content">
        {`${row.firstName || ""} ${row.lastName || ""}`.trim() || "Unnamed Admin"}
      </span>
    </div>
  )
} ,


    {
      key: "email",
      header: "EMAIL ID",
      cellType: "text",
      render: (row) => (
        <span className="font-normal text-sm text-body-content">{row.email}</span>
      ),
    },
    {
      key: "customRoleNames",
      header: "ROLES ASSIGNED",
      cellType: "text",
      align:"center" ,
      render: (row) => (
        <span className="font-normal text-sm text-body-content">
          {row.customRoleNames?.length || 0}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "STATUS",
      cellType: "custom",
            align:"center" ,

      render: (row) => (
        <span className={`px-2 py-1 rounded-full font-normal text-sm text-body-content ${
          row.isActive 
            ? 'bg-success-100 text-success-700' 
            : 'bg-error-100 text-error-700'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "DATE OF CREATION",
      cellType: "text",
            align:"center" ,

      sortable: true,
      render: (row) => (
        <span className="font-normal text-sm text-body-content">
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
  };

  const filters: FilterConfig[] = [];

  if (isError) {
    return <div className="p-4 text-error">Failed to load sub-admins data.</div>;
  }

  // Only show pagination if we have API data
  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined;

  return (
    <Table<SubAdmin>
      title="Sub-Admins"
      data={subAdmins}
      columns={columns}
      searchable
      onSearch={handleSearch}
      filters={filters}
      
      rowKey="id"
      selectedRows={selectedRows}
      onSelectionChange={(set) =>
        setSelectedRows(new Set(set as Set<string>))
      }
      actions={[
        {
          label: "Create Admin ",
          icon: "Plus",
          variant: "filled",
          onClick: handleCreateNewAdmin
        },
      ]}
      hoverable
      loading={isLoading || isFetching}
      pagination={pagination}
      rowActions={[
        {
          label: "View",
          icon: "Eye",
          onClick: (row) => {
            navigate({
              to: ROUTES.SUBADMIN.ADMIN_DETAILS(row.id)
            });
          },
        },
        {
          label: "Edit",
          icon: "FileTextIcon",
          onClick: (row) => {
            navigate({
              to: ROUTES.SUBADMIN.EDIT_ADMIN(row.id)
            });
          },
        },
    
      ]}
    />
  );
};

export default SubAdminsTable;