import SectionForm from '@/features/cms/pages/components/SectionForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/cms/sections/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <SectionForm mode='create'></SectionForm>
  </div>
}
