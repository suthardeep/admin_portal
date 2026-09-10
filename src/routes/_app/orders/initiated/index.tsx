import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/orders/initiated/')({
  component: InitiatedOrdersPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Initiated Orders"
    }
  }),
})

function InitiatedOrdersPage() {
  return (
    <ComingSoon 
      title="Initiated Orders"
      description="Initiated orders management is coming soon. Track newly created orders here."
      routePath="/orders/initiated"
    />
  )
}