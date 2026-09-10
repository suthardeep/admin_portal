import { createFileRoute } from '@tanstack/react-router';
import VendorDetailsPage from '@/features/vendors/pages/vendor-details/VendorDetailsPage';

export const Route = createFileRoute('/_app/vendors/$vendorId')({
  component: VendorDetailsPage,
});
