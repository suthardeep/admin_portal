import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sub-admin/sub-admin-details')({
  component: RouteComponent,
  beforeLoad: () => ({
  breadcrumb: {
    label: "Details",
    hideFromBreadcrumb: true, 
  },
}),
})

function RouteComponent() {
  return <div>
    <Outlet></Outlet>
  </div>
}

