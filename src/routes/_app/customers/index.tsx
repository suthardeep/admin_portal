import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/customers/')({
  component: CustomersPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Customers"
    }
  }),
})

function CustomersPage() {
  return (
    <ComingSoon 
      title="Customer Management"
      description="Customer management system is under development. You'll be able to view and manage customer data here."
      routePath="/customers"
    />
  )
}