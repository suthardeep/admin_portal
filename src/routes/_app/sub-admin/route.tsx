    import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sub-admin')({
  beforeLoad: () => ({
    breadcrumb: {
      label: "Sub-Admins",


    },
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet /> 
    </div>
  )
}
