import React, { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig } from "@/components/table/table.types";
import { useGetAllTiersQuery, useDeleteTierMutation } from '../../api/queryHooks';
import type { Tier } from '@/features/categories/types/category';
import { PaginationMeta } from "@/types/baseApi";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/base/Button';

const TierList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<Tier | null>(null);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
  });

  const handleCreateTier = () => {
    navigate({ to: ROUTES.TIER.CREATE });
  };

  const {
    data: tierData,
    isLoading,
    isFetching,
    isError
  } = useGetAllTiersQuery(params);

  const deleteTierMutation = useDeleteTierMutation();

  const tiers: Tier[] = tierData?.data || [];
  const meta: PaginationMeta | undefined = tierData?.meta;

  const formatChargeDisplay = (value: number, type: 'PERCENTAGE' | 'FIXED') => {
    return type === 'PERCENTAGE' ? `${value}%` : `₹${value}`;
  };

  const columns: ColumnDef<Tier>[] = useMemo(() => [
    {
      key: "name",
      header: "TIER NAME",
      cellType: "text",
      width: "8%",
      render: (row) => (
        <span className="text-sm text-base-content">{row.name}</span>
      )
    },
    {
      key: "platformCharges",
      header: "PLATFORM CHARGES",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">
          {formatChargeDisplay(row.platformCharges, row.platformChargesType)}
        </span>
      )
    },
    {
      key: "closingFee",
      header: "CLOSING FEE",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">
          {formatChargeDisplay(row.closingFee, row.closingFeeType)}
        </span>
      )
    },
    {
      key: "referralFee",
      header: "REFERRAL FEE",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">
          {formatChargeDisplay(row.referralFee, row.referralFeeType)}
        </span>
      )
    },
    {
      key: "aavakCoins",
      header: "AAVAK COINS",
      cellType: "text",
      align: "center",
      render: (row) => (
        <span className="text-sm text-base-content">{row.aavakCoins}</span>
      )
    },
    {
      key: "createdAt",
      header: "CREATED ON",
      cellType: "text",
      sortable: true,
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {new Date(row.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </span>
      )
    },
  ], []);

  const handlePageChange = (newPage: number) => {
    const pageNumber = typeof newPage === 'string' ? parseInt(newPage, 10) : newPage;
    setParams(prev => ({ ...prev, page: pageNumber }));
  };

  const handleSearch = (searchTerm: string) => {
    setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleDeleteClick = (tier: Tier) => {
    setTierToDelete(tier);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (tierToDelete) {
      deleteTierMutation.mutate(tierToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setTierToDelete(null);
        },
        onError: (error) => {
          console.error('Failed to delete tier:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTierToDelete(null);
  };

  const handleEditClick = (tier: Tier) => {
    navigate({ to: ROUTES.TIER.EDIT(tier.id) });
  };

  if (isError) {
    return <div className="p-4 text-error">Failed to load tiers data.</div>;
  }

  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined;

  return (
    <>
      <Table<Tier>
        data={tiers}
        columns={columns}
        searchable
        onSearch={handleSearch}
        filters={[]}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectionChange={(set) =>
          setSelectedRows(new Set(set as Set<string>))
        }
        maxHeight="calc(100vh - 198px)"
        actions={[{
          label: "Create Tier",
          onClick: handleCreateTier,
          icon: "Plus"
        }

         
        ]}
        hoverable
        loading={isLoading || isFetching}
        pagination={pagination}
        className='flex-1'
        containsAction={true}
        rowActions={[
          {
            label: "Edit",
            icon: "Edit",
            onClick: handleEditClick,
          },
          {
            label: "Delete",
            icon: "Trash2",
            onClick: handleDeleteClick,
          },
        ]}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        close={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        title="Delete Tier"
        name={tierToDelete?.name as string}
        isDeleting={deleteTierMutation.isPending}
      />
    </>
  );
};

export default TierList;
