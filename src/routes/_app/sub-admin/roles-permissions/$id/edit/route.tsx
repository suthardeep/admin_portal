import { RolesDetails } from "@/features/sub-admins/roles/pages/permission-details/PermissionDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/sub-admin/roles-permissions/$id/edit")({
     beforeLoad : ()=>({
      breadcrumb:{
        label:"Edit Role"
      }

  })  ,
  component: RouteComponent,
  parseParams: (params) => ({
    ...params,
    mode: 'edit' as const,
  }),
});

function RouteComponent() {
  return (
    <div>
      <RolesDetails />
    </div>
  );
}