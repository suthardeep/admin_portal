import { BannerFormSchema } from '@/features/banners/schemas/banners.schema'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/cms/banners')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Outlet></Outlet>
  )
}
