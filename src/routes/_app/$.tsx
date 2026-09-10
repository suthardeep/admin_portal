import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute('/_app/$')({
  component: AppCatchAll,
})

function AppCatchAll() {
  const { _splat } = Route.useParams()
  
  return (
    <ComingSoon 
      title="Page Under Development"
      description="This page is currently under development. We're working hard to bring you this feature soon!"
      routePath={`/${_splat ?? ''}`}
    />
  )
}