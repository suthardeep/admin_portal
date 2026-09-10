import { createFileRoute } from '@tanstack/react-router'
import SectionList from '@/features/cms/pages/section-list/SectionList'

export const Route = createFileRoute('/_app/cms/sections/')({
  component: SectionList,
  beforeLoad: () => ({
    breadcrumb: {
      label: "CMS"
    }
  }),
})

