import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import CategoryForm from '../../components/CategoryForm';

const CategoryManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate({ to: '/categories' }); // Navigate back to categories list
  };

  const handleSuccess = () => {
    navigate({ to: '/categories' }); // Navigate back to categories list after success
  };

  return (
    <CategoryForm
      mode="create"
      onCancel={handleCancel}
      onSuccess={handleSuccess}
    />
  );
};

export default CategoryManagementPage;
