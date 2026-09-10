import CreateAdminPage from '@/features/sub-admins/list/pages/create-admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sub-admin/create-admin')({
     beforeLoad : ()=>({
      breadcrumb:{
        label:"Create Admin"
      }

  })  ,
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string | undefined,
    mode: search.mode as 'edit' | 'create' | undefined,
  }),
})

function RouteComponent() {
  return <CreateAdminPage />
}
