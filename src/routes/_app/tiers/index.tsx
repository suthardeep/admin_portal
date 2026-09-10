import { createFileRoute } from '@tanstack/react-router';
import TierList from '@/features/tiers/pages/tier-list';

export const Route = createFileRoute('/_app/tiers/')({
  component: TierList,
  staticData: {
    pageTitle: 'Tiers',
  },
});
