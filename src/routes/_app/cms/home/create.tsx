import { createFileRoute } from '@tanstack/react-router'
import AddHomeScreen from '@/features/home/pages/AddHomeScreen'

export const Route = createFileRoute('/_app/cms/home/create')({
  component: RouteComponent,
  staticData: {
    pageTitle: 'Create Home Screen',
  },
})

function RouteComponent() {
  return <AddHomeScreen mode="create" />
}
