import { RolesDetails } from "@/features/sub-admins/roles/pages/permission-details/PermissionDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/sub-admin/roles-permissions/$id")({
     beforeLoad : ()=>({
      breadcrumb:{
        label:"Roles Details" ,

      }

  })  ,
  component: RouteComponent,
  parseParams: (params) => ({
    ...params,
    mode: 'view' as const,
  }),
});

function RouteComponent() {
  return (
    <div className=" flex flex-col h-screen overflow-hidden" style={{ height: 'calc(100vh - 90px)' }}>
      <RolesDetails />
    </div>
  );
}