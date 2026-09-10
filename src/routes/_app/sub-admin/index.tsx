import SubAdminsTable from '@/features/sub-admins/list/pages/sub-admin-table/SubAdminTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sub-admin/')({
  beforeLoad: () => ({
    breadcrumb: {
      label: "Sub-Admins",
                  hideFromBreadcrumb: true, 

      
      
      
    },
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>

    <SubAdminsTable></SubAdminsTable>


  </div>
}
