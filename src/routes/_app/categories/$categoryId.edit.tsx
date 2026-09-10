import { createFileRoute, useNavigate } from '@tanstack/react-router';
import CategoryForm from '@/features/categories/components/CategoryForm';
import { CategoryMode } from '@/features/categories/hooks/useCategory';
import { ROUTES } from '@/constants/routes';

interface CategoryEditSearch {
  mode?: CategoryMode;
}

export const Route = createFileRoute('/_app/categories/$categoryId/edit')({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Edit Category"
    }
  }),
  validateSearch: (search: Record<string, unknown>): CategoryEditSearch => {
    return {
      mode: search.mode === 'edit' || search.mode === 'create' ? search.mode : 'edit',
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { categoryId } = Route.useParams();
  const { mode = 'edit' } = Route.useSearch();

  const handleCancel = () => {
    // Use replace: true to prevent back button from returning to edit mode
    navigate({ to: ROUTES.CATEGORY.LIST, replace: true });
  };

  const handleSuccess = () => {
    navigate({ to: ROUTES.CATEGORY.LIST, replace: true });
  };

  return (
    <CategoryForm
      mode={mode}
      categoryId={categoryId}
      onCancel={handleCancel}
      onSuccess={handleSuccess}
    />
  );
}
