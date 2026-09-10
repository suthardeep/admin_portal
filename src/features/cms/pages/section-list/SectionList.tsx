import React, { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig } from "@/components/table/table.types";
import { useGetSectionsQuery, useDeleteSectionMutation } from '../../api/queryHooks';
import { Section } from '../../types/section';
import { PaginationMeta } from "@/types/baseApi";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { ROUTES } from '@/constants/routes';
import { prettyDate } from '@/utils/formatDateTime';

const SectionList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
  });

  const handleCreateSection = () => {
    navigate({ to: ROUTES.CMS.SECTIONS.CREATE });
  };

  const {
    data: sectionData,
    isLoading,
    isFetching,
    isError
  } = useGetSectionsQuery(params);

  const deleteSectionMutation = useDeleteSectionMutation();

  const sections: Section[] = (sectionData?.data?.data as Section[]) || [];
  const meta: PaginationMeta | undefined = sectionData?.data?.meta;

  const columns: ColumnDef<Section>[] = useMemo(() => [
    {
      key: "title",
      header: "TITLE",
      cellType: "text",
    },
    {
      key: "displaySettings",
      header: "Display Type",
      cellType: "text",
      align: "center",
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {row.displaySettings?.displayType?.replace('_', ' ') || 'N/A'}
        </span>
      )
    },
    {
      key: "createdAt",
      header: "Created on",
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
      header: "Updated on",
      cellType: "text",
      sortable: true,
      render: (row) => (
        <span className="font-light text-sm text-base-content">
          {new Date(row.updatedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </span>
      )
    },
    {
      key: "active",
      header: "Status",
      cellType: "badge",
      valueFormatter: (value) => value ? 'Active' : 'Inactive',
      badgeConfig: {
        variant: 'soft',
      } ,
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

  const handleDeleteClick = (section: Section) => {
    setSectionToDelete(section);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sectionToDelete) {
      deleteSectionMutation.mutate(sectionToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSectionToDelete(null);
        },
        onError: (error) => {
          console.error('Failed to delete section:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const handleEditSection = (sectionId: string) => {
    navigate({ to: ROUTES.CMS.SECTIONS.EDIT(sectionId) });
  };

  if (isError) {
    return <div className="p-4 text-error">Failed to load sections data.</div>;
  }

  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined;

  return (
    <>
      <Table<Section>
        data={sections}
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
          label: "Add Section",
          icon: "Plus",
          variant: "filled",
          onClick: handleCreateSection
        }]}
        hoverable
        loading={isLoading || isFetching}
        pagination={pagination}
        rowActions={[
          {
            label: "Edit",
            icon: "Edit",
            onClick: (row) => handleEditSection(row.id),
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
        title="Delete Section"
        name={sectionToDelete?.title}
        isDeleting={deleteSectionMutation.isPending}
      />
    </>
  );
};

export default SectionList;
