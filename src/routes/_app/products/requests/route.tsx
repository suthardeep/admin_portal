import RequestTable from '@/features/products/pages/requests/components/RequestTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/requests')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RequestTable></RequestTable>
  )
}
