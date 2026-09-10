import React, { useState } from "react";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import Dropdown from "@/components/base/Dropdown";
import { cn } from "@/utils/helpers";
import { CreateAdminFormData, CreateAdminSchema, CreateSubAdminPayloadSchema } from "../../../../schemas/createAdmin.schema";
import { CreateAdminFormProps } from "../../../types/subAdmin";
import { useGetAllRolesQuery } from "../../../../roles/api/queryHooks";

export const CreateAdminForm: React.FC<CreateAdminFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className,
  title = "Create Admin",
  submitButtonText = "Create Admin",
  cancelButtonText = "Cancel",
}) => {
  const isEditMode = title.includes('Edit'); // Detect edit mode from title
  // Fetch roles from API
  const { data: rolesData, isLoading: rolesLoading } = useGetAllRolesQuery({ 
    page: 1, 
    pageSize: 100 
  });

  const roleOptions = rolesData?.data?.map((role: { id: string; name: string }) => ({
    label: role.name,
    value: role.id
  })) || [];
  const [formData, setFormData] = useState<CreateAdminFormData>({
    profileImageUrl: initialData?.profileImageUrl || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    password: initialData?.password || "",
    customRoleIds: initialData?.customRoleIds || [],
    allowSensitiveInfo: initialData?.allowSensitiveInfo ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateAdminFormData, string>>>({});

  const handleChange = (field: keyof CreateAdminFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear existing error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Real-time field validation
  const validateField = (field: keyof CreateAdminFormData, value: any) => {
    try {
      // Use appropriate schema based on mode for password field
      const schema = isEditMode ? CreateAdminSchema : CreateSubAdminPayloadSchema;
      const fieldSchema = schema.shape[field];
      
      if (fieldSchema) {
        // Special handling for password in edit mode
        if (field === 'password' && isEditMode && (!value || value.trim() === '')) {
          // Don't validate empty password in edit mode
          setErrors((prev) => ({ ...prev, [field]: undefined }));
          return;
        }
        
        fieldSchema.parse(value);
        // Clear error if validation passes
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    } catch (error: any) {
      // Set error if validation fails
      if (error.issues && error.issues[0]) {
        setErrors((prev) => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const validate = (): boolean => {
    // Use appropriate schema based on mode
    const schema = isEditMode ? CreateAdminSchema : CreateSubAdminPayloadSchema;
    
    // Create validation data based on mode
    const validationData = { ...formData };
    
    // In edit mode, if password is empty, don't validate it
    if (isEditMode && (!formData.password || formData.password.trim() === '')) {
      delete validationData.password;
    }
    
    // Use appropriate Zod schema validation
    const result = schema.safeParse(validationData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateAdminFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof CreateAdminFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("bg-base-1 shadow-lg rounded-lg", className)}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-body-content/35">
        <h2 className="text-2xl font-semibold text-base-content">{title}</h2>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Left Column - Profile Picture */}
          <div>
            {/* TODO: REVERT - Make profile picture required again when ready */}
            <MediaPicker
              label="Profile picture "
              value={formData.profileImageUrl ? [{
                id: 'current',
                s3Url: formData.profileImageUrl
              }] : []}
              ids={formData.profileImageUrl ? 'current' : ''}
              urls={formData.profileImageUrl || ''}
              onChange={(items) => {
                const url = items.length > 0 ? items[0].s3Url : '';
                handleChange("profileImageUrl", url);
                validateField("profileImageUrl", url);
              }}
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
              required={true} // TODO: REVERT - Change back to required={true}
              error={errors.profileImageUrl}
            />
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("firstName", value);
                }}
                onBlur={(e) => validateField("firstName", e.target.value)}
                placeholder="Jeel"
                required
                error={errors.firstName}
              />

              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("lastName", value);
                }}
                onBlur={(e) => validateField("lastName", e.target.value)}
                placeholder="Thumar"
                required
                error={errors.lastName}
              />
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email ID"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("email", value);
                }}
                onBlur={(e) => validateField("email", e.target.value)}
                placeholder="example@mail.com"
                required
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("password", value);
                }}
                onBlur={(e) => validateField("password", e.target.value)}
                placeholder={isEditMode ? "Enter new password" : "Enter password"}
                togglePassword
                required={!isEditMode} // Required only in create mode
                error={errors.password}
              />
            </div>

            {/* Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown
                label="Roles"
                value={formData.customRoleIds}
                onChange={(value) => {
                  handleChange("customRoleIds", value);
                  validateField("customRoleIds", value);
                }}
                options={roleOptions}
                placeholder={rolesLoading ? "Loading roles..." : "Select roles"}
                required
                error={errors.customRoleIds}
                fullWidth
                disabled={rolesLoading}
                multiple={true} // Enable multiple selection
              />
            </div>

            {/* Allow Sensitive Info Radio Buttons */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-base-content">
                Allow Viewing Sensitive Information?
              </label>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => handleChange("allowSensitiveInfo", true)}
                  className="flex items-center gap-2 group"
                >
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
                  <span className="text-sm text-body-content group-hover:text-[var(--primary-600)] transition-colors">
                    Yes
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("allowSensitiveInfo", false)}
                  className="flex items-center gap-2 group"
                >
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
                  <span className="text-sm text-body-content group-hover:text-[var(--primary-600)] transition-colors">
                    No
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="px-6 py-4 border-t border-base-2 flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelButtonText}
          </Button>
        )}
        <Button type="submit" variant="filled">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default CreateAdminForm;