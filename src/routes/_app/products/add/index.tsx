import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/products/add/')({
  component: AddProductPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Add Product"
    }
  }),
})

function AddProductPage() {
  return (
    <ComingSoon 
      title="Add Product"
      description="Product creation system is coming soon. Add new products to your inventory here."
      routePath="/products/add"
    />
  )
}