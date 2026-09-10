import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'
import BannersPage  from '@/features/banners/pages/banner-list/BannersList'

export const Route = createFileRoute('/_app/cms/banners/')({
  component: Banners,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Banners"
    }
  }),
})

function Banners() {
  return (
   <BannersPage></BannersPage>
  )
}
