import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CategoryFormSchema, type CategoryFormData } from "../schemas/category.schema";
import { 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation,
  useGetCategoryDetailsQuery 
} from "../api/queryHooks";
import { showErrorToasts } from "@/utils/helpers";
import { toast } from "@/components/compound/Sonner";
import { QueryClient } from "@tanstack/react-query";
export type CategoryMode = 'create' | 'edit' | 'view';

interface UseCategoryProps {
  mode: CategoryMode;
  categoryId?: string;
  onSuccess?: () => void;
}

export const useCategory = ({ mode, categoryId, onSuccess }: UseCategoryProps) => {
  const navigate = useNavigate();
  
  // Get category details for edit or view mode
  const { data: categoryDetails, isLoading: isLoadingDetails } = useGetCategoryDetailsQuery(
    categoryId || ''
  );

  // Initialize form with default values
  const defaultValues: CategoryFormData = {
    name: '',
    imageUrl: '',
    subcategories: [],
    requiredDocuments: [{ name: '', children: [{ name: '' }] }],
    mandatoryFields: [{ name: '', children: [{ name: '' }] }],
    pricing: {
      min: 0.01,
      max: 1000,
      tierId: '',
      platformCharges: 0,
      platformChargesType: 'PERCENTAGE',
      closingFee: 0,
      closingFeeType: 'PERCENTAGE',
      referralFee: 0,
      referralFeeType: 'PERCENTAGE',
      aavakCoins: 0,
    },
    charges: {
      local: 10,
      regional: 20,
      national: 30,
    },
    returnPolicy: {
      returnPolicy: 'NO_RETURN',
      returnReplacePeriodDays: 0,
    },
  };

  const form = useForm({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues,
    mode: 'onSubmit' as const,
  });

  // Update form when category details are loaded (edit or view mode)
  React.useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && categoryDetails) {
      form.reset({
        name: categoryDetails.name,
        imageUrl: categoryDetails.imageUrl,
        subcategories: categoryDetails.subcategories,
        requiredDocuments: categoryDetails.requiredDocuments,
        mandatoryFields: categoryDetails.mandatoryFields,
        pricing: categoryDetails.pricing,
        charges: categoryDetails.charges,
        returnPolicy: categoryDetails.returnPolicy,
      });
    }
  }, [categoryDetails, form, mode]);



  // Mutations
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Transform form data to API payload
  const transformToApiPayload = (data: CategoryFormData) => {
    const basePayload = {
      category: {
        name: data.name,
        image: data.imageUrl,
      },
      subCategories: data.subcategories.map(sub => ({
        name: sub.name,
        image: sub.imageUrl,
        children: sub.children.map(child => ({
          name: child.name,
          image: child.imageUrl,
        })),
      })),
      config: {
        requiredVendorDocuments: data.requiredDocuments.map(doc => ({
          groupName: doc.name,
          documents: doc.children.map(child => child.name),
        })),
        mandatoryProductFields: data.mandatoryFields.map(field => ({
          groupName: field.name,
          fieldNames: field.children.map(child => child.name),
        })),
        returnPolicy: data.returnPolicy.returnPolicy,
        returnReplacePeriodDays: data.returnPolicy.returnReplacePeriodDays,
        pricing: {
          min: data.pricing.min,
          max: data.pricing.max,
          tier: {
            id: data.pricing.tierId,
            name: '', // Will be populated from selected tier
            platformCharges: data.pricing.platformCharges || 0,
            platformChargesType: data.pricing.platformChargesType || 'PERCENTAGE',
            closingFee: data.pricing.closingFee || 0,
            closingFeeType: data.pricing.closingFeeType || 'PERCENTAGE',
            referralFee: data.pricing.referralFee || 0,
            referralFeeType: data.pricing.referralFeeType || 'PERCENTAGE',
            aavakCoins: data.pricing.aavakCoins || 0,
          },
          tierId: data.pricing.tierId,
        },
        charges: data.charges,
      },
    };

    // For edit mode, add IDs to subcategories if they exist
    if (mode === 'edit') {
      basePayload.subCategories = data.subcategories.map(sub => ({
        ...(sub.id && { id: sub.id }), // Include ID only if it exists
        name: sub.name,
        image: sub.imageUrl,
        children: sub.children.map(child => ({
          ...(child.id && { id: child.id }), // Include ID only if it exists
          name: child.name,
          image: child.imageUrl,
        })),
      }));
    }

    return basePayload;
  };

  // Submit handler
  const onSubmit = async (data: CategoryFormData) => {


    const queryClient  = new  QueryClient()
    try {
      const apiPayload = transformToApiPayload(data);
      
      if (mode === 'create') {
        await createMutation.mutateAsync(apiPayload);
        toast
        .success('Category created successfully!');
      } else if (mode === 'edit' && categoryId) {
        await updateMutation.mutateAsync({ categoryId, data: apiPayload });
        toast.success('Category updated successfully!');
      }



queryClient.invalidateQueries({
  queryKey: ['categories'],
});

      // Call success callback or navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: '/categories' });
      }
    } catch (error) {
      console.error('Category operation failed:', error);
      showErrorToasts(error);
    }
  };

  // Helper functions for dynamic form management
  const addSubcategory = () => {
    const currentSubcategories = form.getValues('subcategories') || [];
    form.setValue('subcategories', [
      ...currentSubcategories,
      { name: '', imageUrl: '', children: [] }
    ]);
  };

  const removeSubcategory = (index: number) => {
    const currentSubcategories = form.getValues('subcategories') || [];
    form.setValue('subcategories', currentSubcategories.filter((_, i) => i !== index));
  };

  const addChildCategory = (subcategoryIndex: number) => {
    const currentSubcategories = form.getValues('subcategories') || [];
    const updatedSubcategories = [...currentSubcategories];
    if (updatedSubcategories[subcategoryIndex]?.children) {
      updatedSubcategories[subcategoryIndex].children.push({ name: '', imageUrl: '' });
    } else {
      updatedSubcategories[subcategoryIndex].children = [{ name: '', imageUrl: '' }];
    }
    form.setValue('subcategories', updatedSubcategories);
  };

  const removeChildCategory = (subcategoryIndex: number, childIndex: number) => {
    const currentSubcategories = form.getValues('subcategories') || [];
    const updatedSubcategories = [...currentSubcategories];
    if (updatedSubcategories[subcategoryIndex]?.children) {
      updatedSubcategories[subcategoryIndex].children = 
        updatedSubcategories[subcategoryIndex].children.filter((_, i) => i !== childIndex);
    }
    form.setValue('subcategories', updatedSubcategories);
  };

  const addRequiredDocument = () => {
    const currentDocs = form.getValues('requiredDocuments') || [];
    form.setValue('requiredDocuments', [...currentDocs, { name: '', children: [{ name: '' }] }]);
  };

  const addMandatoryField = () => {
    const currentFields = form.getValues('mandatoryFields') || [];
    form.setValue('mandatoryFields', [...currentFields, { name: '', children: [{ name: '' }] }]);
  };

  const addRequiredDocumentChild = (parentIndex: number) => {
    const currentDocs = form.getValues('requiredDocuments') || [];
    const updatedDocs = [...currentDocs];
    // Only add if less than 2 children
    if (updatedDocs[parentIndex].children.length < 2) {
      updatedDocs[parentIndex].children.push({ name: '' });
      form.setValue('requiredDocuments', updatedDocs);
    }
  };

  const removeRequiredDocumentChild = (parentIndex: number, childIndex: number) => {
    const currentDocs = form.getValues('requiredDocuments') || [];
    const updatedDocs = [...currentDocs];
    // Don't allow removing if it's the last child
    if (updatedDocs[parentIndex].children.length > 1) {
      updatedDocs[parentIndex].children = updatedDocs[parentIndex].children.filter((_, i) => i !== childIndex);
      form.setValue('requiredDocuments', updatedDocs);
    }
  };

  const addMandatoryFieldChild = (parentIndex: number) => {
    const currentFields = form.getValues('mandatoryFields') || [];
    const updatedFields = [...currentFields];
    // Only add if less than 2 children
    if (updatedFields[parentIndex].children.length < 2) {
      updatedFields[parentIndex].children.push({ name: '' });
      form.setValue('mandatoryFields', updatedFields);
    }
  };

  const removeMandatoryFieldChild = (parentIndex: number, childIndex: number) => {
    const currentFields = form.getValues('mandatoryFields') || [];
    const updatedFields = [...currentFields];
    // Don't allow removing if it's the last child
    if (updatedFields[parentIndex].children.length > 1) {
      updatedFields[parentIndex].children = updatedFields[parentIndex].children.filter((_, i) => i !== childIndex);
      form.setValue('mandatoryFields', updatedFields);
    }
  };

  const removeRequiredDocument = (index: number) => {
    const currentDocs = form.getValues('requiredDocuments') || [];
    // Don't allow removing if it's the last group
    if (currentDocs.length > 1) {
      form.setValue('requiredDocuments', currentDocs.filter((_, i) => i !== index));
    }
  };

  const removeMandatoryField = (index: number) => {
    const currentFields = form.getValues('mandatoryFields') || [];
    // Don't allow removing if it's the last group
    if (currentFields.length > 1) {
      form.setValue('mandatoryFields', currentFields.filter((_, i) => i !== index));
    }
  };

  return {
    // Form
    form,
    handleSubmit: form.handleSubmit(onSubmit as any),
    
    // State
    isSubmitting,
    isLoadingDetails,
    mode,
    
    // Data
    categoryDetails,
    
    // Helper functions
    addSubcategory,
    removeSubcategory,
    addChildCategory,
    removeChildCategory,
    addRequiredDocument,
    removeRequiredDocument,
    addMandatoryField,
    removeMandatoryField,
    addRequiredDocumentChild,
    removeRequiredDocumentChild,
    addMandatoryFieldChild,
    removeMandatoryFieldChild,
    
    // Form state
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
  };
};