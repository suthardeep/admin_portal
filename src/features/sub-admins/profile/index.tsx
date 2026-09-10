import React from 'react';
import { toast } from '@/components/toast/Sonner';
import ProfileForm from './components/ProfileForm';
import { CreateAdminFormData } from '../schemas/createAdmin.schema';
import { useGetProfileQuery } from './api/queryHooks';

const ProfilePage: React.FC = () => {
  // API hook to fetch profile data
  const { data: profileData, isLoading, error } = useGetProfileQuery();

  if (isLoading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (error) {
    toast.error("Failed to load profile data");
    return <div className="p-10 text-center text-error">Failed to load profile data</div>;
  }

  // Transform profile data to match CreateAdminFormData structure
  const transformedData: CreateAdminFormData | undefined = profileData?.data ? {
    firstName: profileData.data.firstName,
    lastName: profileData.data.lastName,
    email: profileData.data.email,
    profileImageUrl: profileData.data.profileImageUrl || '',
    password: '', // Not used in profile view
    customRoleIds: profileData.data.customRoles?.map(role => role.id) || [],
    allowSensitiveInfo: profileData.data.allowSensitiveInfo ?? true
  } : undefined;

  return (
    <div className="min-h-screen bg-base-2">
      <div className="max-w-full mx-auto py-2">
        <ProfileForm
          title="My Profile"
          profileData={transformedData}
        />
      </div>
    </div>
  );
};

export default ProfilePage;