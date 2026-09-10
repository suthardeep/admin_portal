import React from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import AdminDetailsCard from "./components/AdminDetailCard";
import LogsTable from "./components/LogsTable";
import { logsData } from "../../utils/dummyData";
import { ROUTES } from "@/constants/routes";
import { useGetSubAdminDetailsQuery } from "../../api/queryHooks";

export const AdminDetails = () => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const adminId = (params as any).id;

  const { data: adminData, isLoading, isError } = useGetSubAdminDetailsQuery(adminId);

  const adminDetails = adminData ? {
    profileImage: adminData.profileImageUrl || undefined,
    name: `${adminData.firstName || ''} ${adminData.lastName || ''}`.trim() || 'Unnamed Admin',
    email: adminData.email,
    assignedRole: adminData.customRoles?.length > 0 
      ? adminData.customRoles.map(role => role.name).join(', ')
      : 'No roles assigned',
    dateCreated: new Date(adminData.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    sensitiveInfoAllowed: true, // Default value since API doesn't return this yet
  } : null;

  const handleBackClick = () => {
    navigate({ to: ROUTES.SUBADMIN.ROOT });
  };

  const handleViewRolesClick = () => {
    navigate({ to: ROUTES.SUBADMIN.ROLES_AND_PERMISSIONS });
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading admin details...</div>;
  }

  if (isError || !adminDetails) {
    return <div className="p-10 text-center text-error">Failed to load admin details.</div>;
  }

  return (
    <div className="min-h-screen bg-base-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Details Card */}
        <AdminDetailsCard
          profileImage={adminDetails.profileImage}
          name={adminDetails.name}
          email={adminDetails.email}
          assignedRole={adminDetails.assignedRole}
          dateCreated={adminDetails.dateCreated}
          sensitiveInfoAllowed={adminDetails.sensitiveInfoAllowed}
          onBackClick={handleBackClick}
          onViewRolesClick={handleViewRolesClick}
        />

        {/* Logs Table */}


        <div className="">

        <LogsTable data={logsData} title="Logs" />

        </div>
      </div>
    </div>
  );
};

export default AdminDetails;