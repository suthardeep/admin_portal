import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/ugc-campaigns/')({
  component: UGCCampaignsPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "UGC Campaigns"
    }
  }),
})

function UGCCampaignsPage() {
  return (
    <ComingSoon 
      title="UGC Campaigns"
      description="User Generated Content campaigns management is under development. Create and manage marketing campaigns here."
      routePath="/ugc-campaigns"
    />
  )
}