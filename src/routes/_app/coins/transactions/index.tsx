import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/coins/transactions/')({
  component: CoinsTransactionsPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Coin Transactions"
    }
  }),
})

function CoinsTransactionsPage() {
  return (
    <ComingSoon 
      title="Coin Transactions"
      description="Coin transactions management is coming soon. Track all coin-related transactions here."
      routePath="/coins/transactions"
    />
  )
}