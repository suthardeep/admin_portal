import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/coins/summary/')({
  component: CoinsSummaryPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Coins Summary"
    }
  }),
})

function CoinsSummaryPage() {
  return (
    <ComingSoon 
      title="Aavak Coins Summary"
      description="Coins summary dashboard is coming soon. View overall coin statistics and analytics here."
      routePath="/coins/summary"
    />
  )
}