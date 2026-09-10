import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/warehouse/')({
  component: WarehousePage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Warehouse"
    }
  }),
})

function WarehousePage() {
  return (
    <ComingSoon 
      title="Warehouse Management"
      description="Warehouse management system is coming soon. Manage inventory, stock levels, and warehouse operations from here."
      routePath="/warehouse"
    />
  )
}