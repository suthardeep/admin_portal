import React from 'react';
import { Button } from '@/components/base/Button';
import { useCategory, type CategoryMode } from '../hooks/useCategory';
import CategoryHierarchySection from './CategoryHierarchySection';
import RequiredDetailsSection from './RequiredDetailsSection';
import PricingSection from './PricingSection';
import ChargesSection from './ChargesSection';
import ReturnPolicySection from './ReturnPolicySection';

interface CategoryFormProps {
  mode: CategoryMode;
  categoryId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  onEdit?: () => void;
  className?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  categoryId,
  onCancel,
  onSuccess,
  onEdit,
  className = '',
}) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    isLoadingDetails,
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
  } = useCategory({ mode, categoryId, onSuccess });

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-content mx-auto mb-4"></div>
          <p className="text-base-content">Loading category details...</p>
        </div>
      </div>
    );
  }

  const isViewMode = mode === 'view';

  return (
    <form onSubmit={handleSubmit} className={`h-full bg-base-200 ${className}`}>
      <div className="mx-auto space-y-6">
        
        {/* Category Hierarchy Section */}
        <div className="rounded-xl bg-base-100 shadow-sm">
          <CategoryHierarchySection
            form={form}
            mode={mode}
            onAddSubcategory={addSubcategory}
            onRemoveSubcategory={removeSubcategory}
            onAddChildCategory={addChildCategory}
            onRemoveChildCategory={removeChildCategory}
            disabled={isViewMode}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl bg-base-100 shadow-sm">
              <RequiredDetailsSection
                form={form}
                onAddRequiredDocument={addRequiredDocument}
                onRemoveRequiredDocument={removeRequiredDocument}
                onAddMandatoryField={addMandatoryField}
                onRemoveMandatoryField={removeMandatoryField}
                onAddRequiredDocumentChild={addRequiredDocumentChild}
                onRemoveRequiredDocumentChild={removeRequiredDocumentChild}
                onAddMandatoryFieldChild={addMandatoryFieldChild}
                onRemoveMandatoryFieldChild={removeMandatoryFieldChild}
                disabled={isViewMode}
              />
            </div>

            <div className="rounded-xl bg-base-100 shadow-sm">
              <ReturnPolicySection form={form} disabled={isViewMode} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl bg-base-100 shadow-sm">
              <PricingSection form={form} disabled={isViewMode} />
            </div>

            <div className="rounded-xl bg-base-100 shadow-sm">
              <ChargesSection form={form} disabled={isViewMode} />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-12 py-2 h-[44px]"
          >
            {isViewMode ? 'Back to List' : 'Cancel'}
          </Button>

          {isViewMode ? (
            onEdit && (
              <Button
                type="button"
                variant="filled"
                onClick={onEdit}
                className="px-12 py-2 h-[44px]"
              >
                Edit Category
              </Button>
            )
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="filled"
              className="px-12 py-2 h-[44px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </div>
              ) : (
                mode === 'create' ? 'Create Category' : 'Update Category'
              )}
            </Button>
          )}
        </div>

      </div>
    </form>
  );
};

export default CategoryForm;