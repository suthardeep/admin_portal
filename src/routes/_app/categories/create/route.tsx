import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import CategoryForm from '@/features/categories/components/CategoryForm';
import { ROUTES } from '@/constants/routes';

export const Route = createFileRoute('/_app/categories/create')({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Create Category"
    }
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string | undefined,
    mode: search.mode as 'edit' | 'create' | 'view' | undefined,
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { id, mode } = Route.useSearch();
  
  const categoryMode = mode || 'create';
  const categoryId = (categoryMode === 'edit' || categoryMode === 'view') ? id : undefined;

  const handleCancel = () => {
    // Use replace: true to prevent back button from returning to create mode
    navigate({ to: ROUTES.CATEGORY.LIST, replace: true });
  };

  const handleSuccess = () => {
    // Use replace: true to prevent back button from returning to create mode
    navigate({ to: ROUTES.CATEGORY.LIST, replace: true });
  };

  // For view mode, we can use the same form but make it read-only
  // For now, redirect view to edit mode
  if (categoryMode === 'view') {
    return (
      <CategoryForm
        mode="edit"
        categoryId={categoryId}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <CategoryForm
      mode={categoryMode as 'create' | 'edit'}
      categoryId={categoryId}
      onCancel={handleCancel}
      onSuccess={handleSuccess}
    />
  );
}
