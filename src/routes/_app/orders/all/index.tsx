import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/orders/all/')({
  component: AllOrdersPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "All Orders"
    }
  }),
})

function AllOrdersPage() {
  return (
    <ComingSoon 
      title="All Orders"
      description="Complete order management system is coming soon. View and manage all orders from here."
      routePath="/orders/all"
    />
  )
}