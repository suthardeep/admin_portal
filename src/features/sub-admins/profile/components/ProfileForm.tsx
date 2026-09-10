import React from "react";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { Input } from "@/components/base/Input";
import Dropdown from "@/components/base/Dropdown";
import { cn } from "@/utils/helpers";
import { CreateAdminFormData } from "../../schemas/createAdmin.schema";
import { useGetAllRolesQuery } from "../../roles/api/queryHooks";

interface ProfileFormProps {
  profileData?: CreateAdminFormData;
  className?: string;
  title?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  className,
  title = "My Profile",
}) => {
  // Fetch roles from API
  const { data: rolesData, isLoading: rolesLoading } = useGetAllRolesQuery({ 
    page: 1, 
    pageSize: 100 
  });

  const roleOptions = rolesData?.data?.map((role: { id: string; name: string }) => ({
    label: role.name,
    value: role.id
  })) || [];

  const formData: CreateAdminFormData = {
    profileImageUrl: profileData?.profileImageUrl || "",
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    email: profileData?.email || "",
    password: "", 
    customRoleIds: profileData?.customRoleIds || [],
    allowSensitiveInfo: profileData?.allowSensitiveInfo ?? true,
  };

  return (
    <div className={cn("bg-base-1 shadow-lg rounded-lg", className)}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-body-content/35">
        <h2 className="text-2xl font-semibold text-base-content">{title}</h2>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Left Column - Profile Picture */}
          <div>
            <MediaPicker
              label="Profile picture"
              value={formData.profileImageUrl ? [{
                id: 'current',
                s3Url: formData.profileImageUrl
              }] : []}
              ids={formData.profileImageUrl ? 'current' : ''}
              urls={formData.profileImageUrl || ''}
              onChange={() => {}} // Read-only
              maxFiles={1}
              orientation="grid"
              gridConfig={{
                cols: 1,
                gap: "gap-0",
              }}
              itemSizeConfig={{
                aspectRatio: "square",
                width: "w-[280px]",
                height: "h-[200px]",
              }}
              sizeConfig={{
                width: "w-full",
                maxWidth: "max-w-[280px]",
              }}
              iconConfig={{
                size: "lg",
              }}
              textConfig={{
                size: "sm",
                show: true,
              }}

              disabled={true}
            />
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={() => {}} // Read-only
                placeholder="Jeel"
                disabled={true}
                readOnly={true}
              />

              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={() => {}} // Read-only
                placeholder="Thumar"
                disabled={true}
                readOnly={true}
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email ID"
                type="email"
                value={formData.email}
                onChange={() => {}} // Read-only
                placeholder="example@mail.com"
                disabled={true}
                readOnly={true}
              />
            </div>

            {/* Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown
                label="Roles"
                value={formData.customRoleIds}
                onChange={() => {}} // Read-only
                options={roleOptions}
                placeholder={rolesLoading ? "Loading roles..." : "Select roles"}
                fullWidth
                disabled={true} // Read-only
                multiple={true}
              />
            </div>

            {/* Allow Sensitive Info Radio Buttons */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-base-content">
                Allow Viewing Sensitive Information?
              </label>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      formData.allowSensitiveInfo
                        ? "border-[var(--primary-600)] bg-base-100"
                        : "border-[var(--input-border)] bg-base-100"
                    )}
                  >
                    {formData.allowSensitiveInfo && (
                      <div className="w-3 h-3 rounded-full bg-[var(--primary-600)]" />
                    )}
                  </div>
                  <span className="text-sm text-body-content">
                    Yes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      !formData.allowSensitiveInfo
                        ? "border-[var(--primary-600)] bg-base-100"
                        : "border-[var(--input-border)] bg-base-100"
                    )}
                  >
                    {!formData.allowSensitiveInfo && (
                      <div className="w-3 h-3 rounded-full bg-[var(--primary-600)]" />
                    )}
                  </div>
                  <span className="text-sm text-body-content">
                    No
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;