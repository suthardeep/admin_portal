import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/vendors')({
  beforeLoad: () => ({
    breadcrumb: {
      label: "Vendors"
    }
  }),
})