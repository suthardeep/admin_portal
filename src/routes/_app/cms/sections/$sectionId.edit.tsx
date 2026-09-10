import { createFileRoute } from '@tanstack/react-router'
import SectionForm from '@/features/cms/pages/components/SectionForm'

export const Route = createFileRoute('/_app/cms/sections/$sectionId/edit')({
  component: EditSectionPage,
  beforeLoad: () => ({
    breadcrumb: {
      label: "Edit Section"
    }
  }),
})

function EditSectionPage() {
  const { sectionId } = Route.useParams()
  return <SectionForm mode="edit" sectionId={sectionId} />
}
