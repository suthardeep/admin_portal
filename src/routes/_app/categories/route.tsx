import CategoryList from '@/features/categories/pages/category-list'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  )
}
