import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/promote-products/')({
  component: PromoteProductsPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Promote Products"
    }
  }),
})

function PromoteProductsPage() {
  return (
    <ComingSoon 
      title="Promote Products"
      description="Product promotion system is coming soon. Boost your product visibility and sales here."
      routePath="/promote-products"
    />
  )
}