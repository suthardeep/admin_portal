import RolesTable from '@/features/sub-admins/roles/pages/permission-table/RolesTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sub-admin/roles-permissions/')({
  beforeLoad: () => ({
    breadcrumb: {
      label: "Roles & Permissions",
      
      
    },
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <RolesTable />
    </div>
  )
}
