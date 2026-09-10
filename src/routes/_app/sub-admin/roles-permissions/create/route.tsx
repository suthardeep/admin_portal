import { RolesDetails } from "@/features/sub-admins/roles/pages/permission-details/PermissionDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/sub-admin/roles-permissions/create")({
     beforeLoad : ()=>({
      breadcrumb:{
        label:"Create Roles"
      }

  })  ,
  component: RouteComponent,

  parseParams: () => ({
    mode: 'create' as const,
  }),
});

function RouteComponent() {
  return (
    <div className=" flex flex-col h-screen overflow-hidden" style={{ height: 'calc(100vh - 90px)' }}>
      <RolesDetails />
    </div>
  );
}