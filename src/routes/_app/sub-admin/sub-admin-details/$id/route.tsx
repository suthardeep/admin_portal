import AdminDetails from '@/features/sub-admins/list/pages/sub-admin-details'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sub-admin/sub-admin-details/$id')({
  beforeLoad: () => ({
    breadcrumb: {
      label: "Sub-Admin Details",
    },
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='h-full'><AdminDetails></AdminDetails></div>
}
