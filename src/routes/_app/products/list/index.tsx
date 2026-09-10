import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/products/list/')({
  component: ProductListPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Product List"
    }
  }),
})

function ProductListPage() {
  return (
    <ComingSoon 
      title="Product List"
      description="Product listing and management system is coming soon. View and manage all your products here."
      routePath="/products/list"
    />
  )
}