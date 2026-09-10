import VendorList from '@/features/vendors/pages/vendor-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/vendors/')({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Vendors List"
    }
  }),
})

function RouteComponent() {
  return <div className='h-full'>
    <VendorList />
  </div>
}