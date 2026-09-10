import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/reports/')({
  component: ReportsPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Reports & Analytics"
    }
  }),
})

function ReportsPage() {
  return (
    <ComingSoon 
      title="Reports & Analytics"
      description="Advanced reporting and analytics dashboard is under development. Get insights into your business performance."
      routePath="/reports"
    />
  )
}