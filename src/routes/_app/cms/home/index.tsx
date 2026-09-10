import { createFileRoute } from '@tanstack/react-router'
import HomeScreenList from '@/features/home/pages/HomeScreenList'

export const Route = createFileRoute('/_app/cms/home/')({
  component: RouteComponent,
  staticData: {
    pageTitle: 'Home Screens',
  },
})

function RouteComponent() {
  return <HomeScreenList />
}
