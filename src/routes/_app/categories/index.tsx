import CategoryList from '@/features/categories/pages/category-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/categories/')({
  component: RouteComponent,
beforeLoad: () => ({
    breadcrumb: {
      label: " Categories List"
    }
  }),
})


function RouteComponent() {
  return <div>

    <CategoryList></CategoryList>
  </div>
}
