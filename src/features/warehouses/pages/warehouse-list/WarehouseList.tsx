import React, { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig } from "@/components/table/table.types";
import { useGetAllWarehousesQuery, useDeleteWarehouseMutation } from '../../api/queryHooks';
import { WarehouseListItem } from '../../types/warehouse';
import { PaginationMeta } from "@/types/baseApi";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { ROUTES } from '@/constants/routes';

const WarehouseList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<WarehouseListItem | null>(null);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
  });

  const handleCreateWarehouse = () => {
    navigate({ to: ROUTES.WAREHOUSE.CREATE });
  };

  const handleViewWarehouse = (warehouseId: string) => {
    const viewUrl = ROUTES.WAREHOUSE.DETAILS(warehouseId);
    navigate({ to: viewUrl });
  }

  const {
    data: warehouseData,
    isLoading,
    isFetching,
    isError
  } = useGetAllWarehousesQuery(params);

  const deleteWarehouseMutation = useDeleteWarehouseMutation();

  const warehouses: WarehouseListItem[] = warehouseData?.data || [];
  const meta: PaginationMeta | undefined = warehouseData?.meta;

  const columns: ColumnDef<WarehouseListItem>[] = useMemo(() => [
   
    {
      key: "managerName",
      header: "MANAGER",
      cellType: "text",
      render: (row) => {
        // Extract first name only
        const firstName = row.managerName ? row.managerName.split(' ')[0] : 'N/A';
        return (
          <span className="font-normal text-sm text-base-content">
            {firstName}
          </span>
        );
      }
    },
    {
      key: "managerEmail",
      header: "EMAIL ID",
      cellType: "text",
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {row.managerEmail || 'N/A'}
        </span>
      )
    },
    {
      key: "managerMobile",
      header: "MOBILE NO",
      cellType: "text",
      align: "center",
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {row.managerMobile || 'N/A'}
        </span>
      )
    },
    {
      key: "totalSqFt",
      header: "SQ FEET",
      cellType: "text",
      align: "center",
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {row.totalSqFt ? `${parseFloat(row.totalSqFt).toFixed(0)}` : 'N/A'}
        </span>
      )
    },
    {
      key: "address",
      header: "ADDRESS",
      cellType: "text",
      render: (row) => {
        // Show only city and state to keep it compact
        const shortAddress = row.address ? 
          `${row.address.city}, ${row.address.state}` : 'N/A';
        return (
          <div className="max-w-[120px]">
            <span className="font-light text-sm text-base-content truncate block">
              {shortAddress}
            </span>
          </div>
        );
      }
    },
  ], []);

  const handlePageChange = (newPage: number) => {
    const pageNumber = typeof newPage === 'string' ? parseInt(newPage, 10) : newPage;
    setParams(prev => ({ ...prev, page: pageNumber }));
  };

  const handleSearch = (searchTerm: string) => {
    setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleDeleteClick = (warehouse: WarehouseListItem) => {
    setWarehouseToDelete(warehouse);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (warehouseToDelete) {
      deleteWarehouseMutation.mutate(warehouseToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setWarehouseToDelete(null);
        },
        onError: (error) => {
          console.error('Failed to delete warehouse:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setWarehouseToDelete(null);
  };

  const handleEditWarehouse = (warehouseId: string) => {
    console.log('✏️ Edit warehouse clicked:', warehouseId);
    const editUrl = ROUTES.WAREHOUSE.EDIT(warehouseId);
    console.log('📍 Navigating to edit URL:', editUrl);
    navigate({ to: editUrl });
  };

  if (isError) {
    return <div className="p-4 text-error">Failed to load warehouses data.</div>;
  }

  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined;

  return (
    <>
      <Table<WarehouseListItem>
        title="Warehouses"
        data={warehouses}
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
          label: "Add Warehouse",
          icon: "Plus",
          variant: "filled",
          onClick: handleCreateWarehouse
        }]}
        hoverable
        loading={isLoading || isFetching}
        pagination={pagination}
        rowActions={[
          {
            label: "View",
            icon: "Eye",
            onClick: (row) => handleViewWarehouse(row.id),
          } ,
          {
            label: "Edit",
            icon: "Edit",
            onClick: (row) => handleEditWarehouse(row.id),
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
        title="Delete Warehouse"
        name={warehouseToDelete?.name || warehouseToDelete?.managerName || 'this warehouse'}
        isDeleting={deleteWarehouseMutation.isPending}
      />
    </>
  );
};

export default WarehouseList;