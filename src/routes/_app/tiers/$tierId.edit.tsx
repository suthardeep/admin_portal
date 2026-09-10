import { createFileRoute } from '@tanstack/react-router';
import TierForm from '@/features/tiers/pages/tier-form';

export const Route = createFileRoute('/_app/tiers/$tierId/edit')({
  component: () => <TierForm mode="edit" />,
  staticData: {
    pageTitle: 'Edit Tier',
  },
});
