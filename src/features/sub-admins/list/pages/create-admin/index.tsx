import React from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { toast } from '@/components/toast/Sonner';
import CreateAdminForm from './components/CreateAdminForm';
import { CreateAdminFormData, CreateSubAdminPayloadSchema, UpdateSubAdminPayloadSchema } from '../../../schemas/createAdmin.schema';
import { ROUTES } from '@/constants/routes';
import { useCreateSubAdminMutation, useGetSubAdminDetailsQuery, useUpdateSubAdminMutation } from '../../api/queryHooks';

interface SearchParams {
  id?: string;
  mode?: 'edit' | 'create';
}

const CreateAdminPage: React.FC = () => {
  const search = useSearch({ strict: false }) as SearchParams;
  const navigate = useNavigate();
  
  const isEditMode = search.mode === 'edit' && search.id;
  const adminId = search.id;

  // API hooks
  const createMutation = useCreateSubAdminMutation();
  const updateMutation = useUpdateSubAdminMutation();
  const { data: adminData, isLoading } = useGetSubAdminDetailsQuery(adminId || '');

  const handleSubmit = async (formData: CreateAdminFormData) => {
    console.log('🚀 Form submitted with data:', formData);
    
    try {
      // TODO: REVERT - Remove this default profile image logic when ready
      // Ensure profileImageUrl has a default value if empty
      const processedFormData = {
        ...formData,
        profileImageUrl: formData.profileImageUrl || "https://via.placeholder.com/150/cccccc/ffffff?text=Profile"
      };
      
      console.log('📦 API Payload:', processedFormData);
      
      // Use appropriate schema based on mode
      const schema = isEditMode ? UpdateSubAdminPayloadSchema : CreateSubAdminPayloadSchema;
      const validationResult = schema.safeParse(processedFormData);
      if (!validationResult.success) {
        console.error('❌ Validation failed:', validationResult.error);
        toast.error("Validation failed. Please check all fields.");
        return;
      }

      console.log('✅ Validation passed, calling API...');
      console.log('🔄 isEditMode:', isEditMode, 'adminId:', adminId);

      if (isEditMode && adminId) {
        console.log('📝 Updating admin...');
        // Remove password from payload if it's empty in edit mode
        const updateData = { ...validationResult.data };
        if (!updateData.password || updateData.password.trim() === '') {
          delete updateData.password;
          console.log('🔒 Password field removed from update payload (empty)');
        } else {
          console.log('🔒 Password field included in update payload (new password provided)');
        }
        
        console.log('📦 Final update payload:', updateData);
        
        await updateMutation.mutateAsync({
          adminId,
          data: updateData,
        });
        toast.success(`Admin '${formData.firstName} ${formData.lastName}' updated successfully!`);
      } else {
        console.log('➕ Creating new admin...');
        const result = await createMutation.mutateAsync(validationResult.data);
        console.log('✅ Create result:', result);
        toast.success(`Admin '${formData.firstName} ${formData.lastName}' created successfully!`);
      }
      
      // Navigate back to sub-admin list with replace to prevent back button issues
      navigate({ to: ROUTES.SUBADMIN.ROOT, replace: true });
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message || "Failed to save admin.";
      console.error('💥 Error saving admin:', error);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    // Use replace: true to replace current history entry instead of adding new one
    // This prevents the back button from going back to create/edit mode
    navigate({ to: ROUTES.SUBADMIN.ROOT, replace: true });
  };

  if (isEditMode && isLoading) {
    return <div className="p-10 text-center">Loading admin details...</div>;
  }

  return (
    <div className="min-h-screen bg-base-2">
      <div className="max-w-full mx-auto py-2">
        <CreateAdminForm
          title={isEditMode ? 'Edit Admin' : 'Create Admin'}
          submitButtonText={isEditMode ? 'Update Admin' : 'Create Admin'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={isEditMode && adminData ? {
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            email: adminData.email,
            profileImageUrl: adminData.profileImageUrl || '',
            password: '', 
            customRoleIds: adminData.customRoles?.map(role => role.id) || [], // Extract role IDs from customRoles array
            allowSensitiveInfo: true // Default value since API doesn't return this yet
          } : undefined}
        />
      </div>
    </div>
  );
};

export default CreateAdminPage;