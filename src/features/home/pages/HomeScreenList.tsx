import React, { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig } from "@/components/table/table.types";
import { useGetHomeScreensQuery, useDeleteHomeScreenMutation } from '../api/queryHooks';
import { HomeScreen } from '../types/home';
import { PaginationMeta } from "@/types/baseApi";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { ROUTES } from '@/constants/routes';


const HomeScreenList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [homeScreenToDelete, setHomeScreenToDelete] = useState<HomeScreen | null>(null);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
  });

  const handleCreateHomeScreen = () => {
    navigate({ to: ROUTES.CMS.HOME.CREATE });
  };

  const {
    data: homeScreenData,
    isLoading,
    isFetching,
    isError
  } = useGetHomeScreensQuery(params);

  const deleteHomeScreenMutation = useDeleteHomeScreenMutation();

  const homeScreens: HomeScreen[] = homeScreenData?.data?.data || [];
  const meta: PaginationMeta | undefined = homeScreenData?.data?.meta;

  const columns: ColumnDef<HomeScreen>[] = useMemo(() => [
    {
      key: "version",
      header: "VERSION",
      cellType: "text",
    },
    {
      key: "versionName",
      header: "VERSION NAME",
      cellType: "text",
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {row.versionName || 'N/A'}
        </span>
      )
    },
    {
      key: "platform",
      header: "APP TYPE",
      cellType: "text",
    },
    {
      key: "createdAt",
      header: "CREATED",
      cellType: "text",
      sortable: true,
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {new Date(row.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </span>
      )
    },
    {
      key: "updatedAt",
      header: "UPDATED",
      cellType: "text",
      sortable: true,
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {new Date(row.updatedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </span>
      )
    },
    {
      key: "isActive",
      header: "STATUS",
      cellType: "badge",
      valueFormatter: (value) => value ? 'Active' : 'Inactive',
      badgeConfig: {
        variant: 'soft',
        colorMap: {
          'Active': 'green',
          'Inactive': 'red'
        }
      },
      align: "center",
    },
  ], []);

  const handlePageChange = (newPage: number) => {
    const pageNumber = typeof newPage === 'string' ? parseInt(newPage, 10) : newPage;
    setParams(prev => ({ ...prev, page: pageNumber }));
  };

  const handleSearch = (searchTerm: string) => {
    setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleDeleteClick = (homeScreen: HomeScreen) => {
    setHomeScreenToDelete(homeScreen);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (homeScreenToDelete) {
      deleteHomeScreenMutation.mutate(homeScreenToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setHomeScreenToDelete(null);
        },
        onError: (error) => {
          console.error('Failed to delete home screen:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setHomeScreenToDelete(null);
  };

  const handleEditHomeScreen = (homeScreenId: string) => {
    navigate({ to: ROUTES.CMS.HOME.EDIT(homeScreenId) });
  };

  if (isError) {
    return <div className="p-4 text-error">Failed to load home screens data.</div>;
  }

  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined;

  return (
    <>
      <Table<HomeScreen>
        title="Home Screens"
        data={homeScreens}
        columns={columns}
        searchable
        onSearch={handleSearch}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectionChange={(set) =>
          setSelectedRows(new Set(set as Set<string>))
        }

        maxHeight="calc(100vh - 198px)"

        actions={[{
          label: "Add Home Screen",
          icon: "Plus",
          variant: "filled",
          onClick: handleCreateHomeScreen
        }]}
        hoverable
        loading={isLoading || isFetching}
        pagination={pagination}
        rowActions={[
          {
            label: "Edit",
            icon: "Edit",
            onClick: (row) => handleEditHomeScreen(row.id),
          },
          {
            label: "Delete",
            icon: "Trash2",
            onClick: (row) => handleDeleteClick(row),
          },
        ]}

      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        close={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        title="Delete Home Screen"
        name={homeScreenToDelete?.version}
        isDeleting={deleteHomeScreenMutation.isPending}
      />
    </>
  );
};

export default HomeScreenList;
