import BannerForm from '@/features/banners/pages/banner-form/BannerForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/cms/banners/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <BannerForm mode='create'></BannerForm>
  </div>
}
