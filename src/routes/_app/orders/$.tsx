import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/orders/$')({
  component: OrdersCatchAll,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Orders"
    }
  }),
})

function OrdersCatchAll() {
  const { _splat } = Route.useParams()
  
  return (
    <ComingSoon 
      title="Orders Management"
      description="Order management system is coming soon. You'll be able to track and manage all orders from here."
      routePath={`/orders/${_splat ?? ''}`}
    />
  )
}