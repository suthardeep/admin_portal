import { createFileRoute } from '@tanstack/react-router';
import TierForm from '@/features/tiers/pages/tier-form';

export const Route = createFileRoute('/_app/tiers/create')({
  component: () => <TierForm mode="create" />,
  staticData: {
    pageTitle: 'Create Tier',
  },
});
