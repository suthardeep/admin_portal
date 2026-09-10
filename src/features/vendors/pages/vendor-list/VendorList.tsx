import React, { useState, useMemo } from 'react';
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig } from "@/components/table/table.types";
import { useGetAllVendorsQuery, useDeleteVendorMutation, useApproveVendorMutation, useRejectVendorMutation } from '../../api/queryHooks';
import { VendorListItem } from '../../types/vendor';
import { PaginationMeta } from "@/types/baseApi";
import DeleteDialog from "@/components/compound/DeleteDialog";
import AcceptVendorDialog from '../../components/AcceptVendorDialog';
import RejectionModal from '../../components/RejectionModal';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@/components/compound/Sonner';

const VendorList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<VendorListItem | null>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorListItem | null>(null);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    verificationStatus: 'under_review',
  });

  const {
    data: vendorData,
    isLoading,
    isFetching,
    isError
  } = useGetAllVendorsQuery(params);

  const deleteVendorMutation = useDeleteVendorMutation();
  const approveVendorMutation = useApproveVendorMutation();
  const rejectVendorMutation = useRejectVendorMutation();

  const vendors: VendorListItem[] = vendorData?.data || [];
  const meta: PaginationMeta | undefined = vendorData?.meta;

  const columns: ColumnDef<VendorListItem>[] = useMemo(() => [
    {
      key: "fullName", 
      header: "NAME",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">{row.fullName || 'N/A'}</span>
      )
    },
    {
      key: "email", 
      header: "EMAIL",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">{row.email || 'N/A'}</span>
      )
    },
    {
      key: "mobile", 
      header: "NUMBER",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">{row.mobile}</span>
      )
    },
    {
      key: "businessName", 
      header: "BUSINESS",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">{row.businessName || 'N/A'}</span>
      )
    },
    {
      key: "city", 
      header: "FROM",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">{row.city || 'N/A'}</span>
      )
    },
    {
      key: "state", 
      header: "Status",
      cellType: "text",
      render: (row) => (
        <span className="text-sm text-base-content">{row.state || 'N/A'}</span>
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

  const handleDeleteClick = (vendor: VendorListItem) => {
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (vendorToDelete) {
      deleteVendorMutation.mutate(vendorToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setVendorToDelete(null);
        },
        onError: (error) => {
          console.error('Failed to delete vendor:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  const handleAcceptClick = (vendor: VendorListItem) => {
    setSelectedVendor(vendor);
    setIsAcceptDialogOpen(true);
  };

  const handleAcceptConfirm = () => {
    if (selectedVendor) {
      approveVendorMutation.mutate(selectedVendor.id, {
        onSuccess: () => {
          toast.success('Vendor approved successfully');
          setIsAcceptDialogOpen(false);
          setSelectedVendor(null);
        },
        onError: (error) => {
          toast.error('Failed to approve vendor');
          console.error('Approval error:', error);
        },
      });
    }
  };

  const handleRejectClick = (vendor: VendorListItem) => {
    setSelectedVendor(vendor);
    setIsRejectionModalOpen(true);
  };

  const handleRejectionSubmit = (data: { title: string; description: string }) => {
    if (selectedVendor) {
      rejectVendorMutation.mutate(
        {
          vendorId: selectedVendor.id,
          data: { 
            rejectionTitle: data.title,
            rejectionDescription: data.description
          },
        },
        {
          onSuccess: () => {
            toast.success('Vendor rejected successfully');
            setIsRejectionModalOpen(false);
            setSelectedVendor(null);
          },
          onError: (error) => {
            toast.error('Failed to reject vendor');
            console.error('Rejection error:', error);
          },
        }
      );
    }
  };

  if (isError) {
    return <div className="p-4 text-error">Failed to load vendors data.</div>;
  }

  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined;

  return (
    <>
      <Table<VendorListItem>
        data={vendors}
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
        actions={[]}
        hoverable
        loading={isLoading || isFetching}
        pagination={pagination}
        className='flex-1'
        containsAction={true}
        rowActions={[
          {
            label: "View Details",
            icon: "Eye",
            onClick: (row) => navigate({ to: `/vendors/${row.id}` }),
          },
          {
            label: "Accept",
            icon: "CheckCircle",
            onClick: handleAcceptClick,
          },
          {
            label: "Reject",
            icon: "XCircle",
            onClick: handleRejectClick,
          },
        ]}
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        close={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        title="Delete Vendor"
        name={vendorToDelete?.fullName as string}
        isDeleting={deleteVendorMutation.isPending}
      />

      <AcceptVendorDialog
        isOpen={isAcceptDialogOpen}
        close={() => {
          setIsAcceptDialogOpen(false);
          setSelectedVendor(null);
        }}
        onAccept={handleAcceptConfirm}
        isAccepting={approveVendorMutation.isPending}
        vendorName={selectedVendor?.fullName || ''}
      />

      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => {
          setIsRejectionModalOpen(false);
          setSelectedVendor(null);
        }}
        onSubmit={handleRejectionSubmit}
        isSubmitting={rejectVendorMutation.isPending}
      />
    </>
  );
};

export default VendorList;