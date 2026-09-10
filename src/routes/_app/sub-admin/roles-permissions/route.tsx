import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sub-admin/roles-permissions')({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Roles & Permissions",
      hideFromBreadcrumb: true,
    },
  }),
})

function RouteComponent() {
  return <Outlet />   
}
