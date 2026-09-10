import React, { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Table } from "@/components/table/Table";
import { ColumnDef, PaginationConfig } from "@/components/table/table.types";
import { useGetAllCategoriesQuery, useDeleteCategoryMutation } from '../../api/queryHooks';
import { CategoryListItem } from '../../types/category';
import { PaginationMeta } from "@/types/baseApi";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { ROUTES } from '@/constants/routes';

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryListItem | null>(null);

  const [params, setParams] = useState({ 
    page: 1, 
    pageSize: 10,
    search: '', 
  });

  const handleCreateCategory = () => {
    navigate({ to: ROUTES.CATEGORY.CREATE });
  };

  const { 
    data: categoryData, 
    isLoading, 
    isFetching, 
    isError 
  } = useGetAllCategoriesQuery(params);

  const deleteCategoryMutation = useDeleteCategoryMutation();
  
  const categories: CategoryListItem[] = categoryData?.data || [];
  const meta: PaginationMeta | undefined = categoryData?.meta;

  const columns: ColumnDef<CategoryListItem>[] = useMemo(() => [
    {
      key: "name", 
      header: "CATEGORY NAME",
      cellType: "text",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images && row.images.length > 0 && (
            <img 
              src={row.images[0]} 
              alt={row.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <p className=" text-sm font-normal text-body-content">{row.name}</p>
            
          </div>
        </div>
      )
    },
    {
      key: "subcategoryCount", 
      header: "SUB CATEGORIES",
      cellType: "text",
      align: "center",
    },
    {
      key: "childCategoryCount", 
      header: "CHILD CATEGORIES",
      cellType: "text",
      align: "center",
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

  const handleDeleteClick = (category: CategoryListItem) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        },
        onError: (error) => {
          console.error('Failed to delete category:', error);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleViewCategory = (categoryId: string) => {
    navigate({ to: ROUTES.CATEGORY.VIEW(categoryId) });
  };

  const handleEditCategory = (categoryId: string) => {
    navigate({ to: ROUTES.CATEGORY.EDIT(categoryId) });
  };

  if (isError) {
    return <div className="p-4 text-error">Failed to load categories data.</div>;
  }

  const pagination: PaginationConfig | undefined = meta ? {
    meta: meta,
    onPageChange: handlePageChange,
    showTotal: true
  } : undefined;

  return (
    <>
      <Table<CategoryListItem>
        title="Categories"
        data={categories} 
        columns={columns}
        searchable
        onSearch={handleSearch} 
        // filters={[]}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectionChange={(set) =>
          setSelectedRows(new Set(set as Set<string>))
        }

        maxHeight="calc(100vh - 198px)" 
        
        actions={[{
          label: "Create Category",
          icon: "Plus",
          variant: "filled",
          onClick: handleCreateCategory
        }]}
        hoverable
        loading={isLoading || isFetching} 
        pagination={pagination}
        rowActions={[
          {
            label: "View",
            icon: "Eye",
            onClick: (row) => handleViewCategory(row.id),
          },
          {
            label: "Edit",
            icon: "FileText",
            onClick: (row) => handleEditCategory(row.id),
          },
          
        ]}

      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        close={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        title="Delete Category"
        name={categoryToDelete?.name}
        isDeleting={deleteCategoryMutation.isPending}
      />
    </>
  );
};

export default CategoryList;