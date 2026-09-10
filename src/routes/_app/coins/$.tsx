import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/coins/$')({
  component: CoinsCatchAll,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Aavak Coins"
    }
  }),
})

function CoinsCatchAll() {
  const { _splat } = Route.useParams()
  
  return (
    <ComingSoon 
      title="Aavak Coins Management"
      description="Aavak Coins system is coming soon. Manage coin transactions, rewards, and user balances from here."
      routePath={`/coins/${_splat ?? ''}`}
    />
  )
}