import { useNavigate, createFileRoute } from '@tanstack/react-router';
import CategoryForm from '@/features/categories/components/CategoryForm';
import { ROUTES } from '@/constants/routes';

export const Route = createFileRoute('/_app/categories/$categoryId/view')({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: {
      label: "View Category"
    }
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { categoryId } = Route.useParams();

  const handleCancel = () => {
    navigate({ to: ROUTES.CATEGORY.LIST, replace: true });
  };

  const handleEdit = () => {
    navigate({ to: ROUTES.CATEGORY.EDIT(categoryId), replace: true });
  };

  return (
    <CategoryForm
      mode="view"
      categoryId={categoryId}
      onCancel={handleCancel}
      onEdit={handleEdit}
    />
  );
}