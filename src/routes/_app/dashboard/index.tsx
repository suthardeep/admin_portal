import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from '@/components/empty-states/ComingSoon'

export const Route = createFileRoute("/_app/dashboard/")({
     beforeLoad : ()=>({
      breadcrumb:{
        label:"Dashboard"
      }
  })  ,
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ComingSoon 
      title="Dashboard"
      description="Advanced analytics dashboard is coming soon. Get comprehensive insights into your business performance and key metrics."
      routePath="/dashboard"
    />
  );
}
