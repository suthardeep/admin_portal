import { createFileRoute } from '@tanstack/react-router'
import AddHomeScreen from '@/features/home/pages/AddHomeScreen'

export const Route = createFileRoute('/_app/cms/home/edit/$homeId')({
  component: RouteComponent,
  staticData: {
    pageTitle: 'Edit Home Screen',
  },
})

function RouteComponent() {
  const { homeId } = Route.useParams()

  return <AddHomeScreen mode="edit" homeId={homeId} />
}
