import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/alerts/')({
  component: AlertsPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Alerts & Requests"
    }
  }),
})

function AlertsPage() {
  return (
    <ComingSoon 
      title="Alerts & Requests"
      description="Alerts and requests management system is coming soon. Stay updated with important notifications."
      routePath="/alerts"
    />
  )
}