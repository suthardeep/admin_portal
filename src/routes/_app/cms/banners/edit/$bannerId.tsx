import BannerForm from '@/features/banners/pages/banner-form/BannerForm';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/constants/routes';

export const Route = createFileRoute('/_app/cms/banners/edit/$bannerId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { bannerId } = Route.useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: ROUTES.CMS.BANNERS.LIST });
  };

  const handleCancel = () => {
    navigate({ to: ROUTES.CMS.BANNERS.LIST });
  };

  return (
    <div>
      <BannerForm
        mode="edit"
        bannerId={bannerId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
