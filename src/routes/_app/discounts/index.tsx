import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/discounts/')({
  component: DiscountsPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Discounts & Offers"
    }
  }),
})

function DiscountsPage() {
  return (
    <ComingSoon 
      title="Discounts & Offers"
      description="Discount and offers management system is under development. Create and manage promotional campaigns here."
      routePath="/discounts"
    />
  )
}