import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/orders/payment_confirmed/')({
  component: PaymentConfirmedOrdersPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Payment Confirmed"
    }
  }),
})

function PaymentConfirmedOrdersPage() {
  return (
    <ComingSoon 
      title="Payment Confirmed Orders"
      description="Payment confirmed orders management is coming soon. Track orders with successful payments here."
      routePath="/orders/payment_confirmed"
    />
  )
}