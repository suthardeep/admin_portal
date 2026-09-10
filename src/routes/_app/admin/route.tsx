import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: () => ({
    breadcrumb: {
      label: "Admin",
    },
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/admin"!</div>
}
