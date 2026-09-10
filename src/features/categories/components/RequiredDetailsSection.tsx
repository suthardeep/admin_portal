import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { CategoryFormData } from '../schemas/category.schema';

interface RequiredDetailsSectionProps {
  form: any;
  onAddRequiredDocument: () => void;
  onRemoveRequiredDocument: (index: number) => void;
  onAddMandatoryField: () => void;
  onRemoveMandatoryField: (index: number) => void;
  onAddRequiredDocumentChild: (parentIndex: number) => void;
  onRemoveRequiredDocumentChild: (parentIndex: number, childIndex: number) => void;
  onAddMandatoryFieldChild: (parentIndex: number) => void;
  onRemoveMandatoryFieldChild: (parentIndex: number, childIndex: number) => void;
  disabled?: boolean;
}

const ParentSection: React.FC<{
  items: Array<{ name: string; children?: Array<{ name: string }> }>;
  sectionType: 'requiredDocuments' | 'mandatoryFields';
  sectionTitle: string;
  form: any;
  onAddMore: () => void;
  onRemoveParent: (index: number) => void;
  onAddChild: (parentIndex: number) => void;
  onRemoveChild: (parentIndex: number, childIndex: number) => void;
  disabled?: boolean;
}> = ({ items, sectionType, sectionTitle, form, onAddMore, onRemoveParent, onAddChild, onRemoveChild, disabled = false }) => {
  const { setValue, formState: { errors } } = form;
  
  const placeholder = sectionTitle.includes('Document')
    ? 'Enter name of required document'
    : 'Type here';

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index].name = value;
    setValue(sectionType, updated as any);
  };



  const updateChild = (parentIndex: number, childIndex: number, value: string) => {
    const updated = [...items];
    if (updated[parentIndex].children) {
      updated[parentIndex].children[childIndex].name = value;
      setValue(sectionType, updated as any);
    }
  };

  return (
    <div className="space-y-6">
      {items.map((item, parentIndex) => (
        <div key={parentIndex} className="space-y-4">
          {/* Parent input */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1">
              <Input
                value={item.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateItem(parentIndex, e.target.value)
                }
                placeholder={placeholder}
                className="h-[36px] w-full"
                disabled={disabled}
              />
              {errors[sectionType]?.[parentIndex]?.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors[sectionType]?.[parentIndex]?.name?.message}
                </p>
              )}
            </div>
            
            {/* Add Child Button - only show if less than 2 children */}
            {(!item.children || item.children.length < 2) && !disabled && (
              <button
                type="button"
                onClick={() => onAddChild(parentIndex)}
                className="flex items-center justify-center text-base-content hover:text-base-content/80 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                </svg>
              </button>
            )}

            {/* Remove Parent Button - only show if more than 1 parent */}
            {items.length > 1 && !disabled && (
              <button
                type="button"
                onClick={() => onRemoveParent(parentIndex)}
                className="flex items-center justify-center text-base-content hover:text-base-content/80 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                </svg>
              </button>
            )}
          </div>

          {/* Children inputs */}
          {item.children && item.children.length > 0 && (
            <div className="space-y-3">
              {item.children.map((child, childIndex) => (
                <div key={childIndex} className="flex items-center gap-3 pl-8 w-full">
                  <div className="flex-1">
                    <Input
                      value={child.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateChild(parentIndex, childIndex, e.target.value)
                      }
                      placeholder={placeholder}
                      className="h-[36px] w-full"
                      disabled={disabled}
                    />
                    {errors[sectionType]?.[parentIndex]?.children?.[childIndex]?.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[sectionType]?.[parentIndex]?.children?.[childIndex]?.name?.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Remove Child Button - only show if more than 1 child */}
                  {item.children && item.children.length > 1 && !disabled && (
                    <button
                      type="button"
                      onClick={() => onRemoveChild(parentIndex, childIndex)}
                      className="flex items-center justify-center text-base-content hover:text-base-content/80 flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add More Button */}
      {!disabled && (
        <div className="flex justify-start pt-2">
          <button
            type="button"
            onClick={onAddMore}
            className="flex items-center gap-2 text-base-content hover:text-base-content/80"
          >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
          </svg>
          <span>Add More</span>
        </button>
      </div>
      )}
    </div>
  );
};

const RequiredDetailsSection: React.FC<RequiredDetailsSectionProps> = ({
  form,
  onAddRequiredDocument,
  onRemoveRequiredDocument,
  onAddMandatoryField,
  onRemoveMandatoryField,
  onAddRequiredDocumentChild,
  onRemoveRequiredDocumentChild,
  onAddMandatoryFieldChild,
  onRemoveMandatoryFieldChild,
  disabled = false,
}) => {
  const { watch } = form;
  const requiredDocuments = watch('requiredDocuments') || [];
  const mandatoryFields = watch('mandatoryFields') || [];

  return (
    <div className="">
      <div className="mx-auto max-w-7xl rounded-xl bg-base-1 p-2">
        <div className="p-4 border-b border-body-content/50">
          <h1 className="text-lg font-semibold text-base-content">Required Details</h1>
        </div>

        <div className="p-6 space-y-8">
          {/* Required Documents Section */}
          <div className="space-y-2">
            <Label className="text-base font-light" required={true}>
              Required Documents for Vendor
            </Label>
            <ParentSection
              items={requiredDocuments}
              sectionType="requiredDocuments"
              sectionTitle="Required Documents for Vendor"
              form={form}
              onAddMore={onAddRequiredDocument}
              onRemoveParent={onRemoveRequiredDocument}
              onAddChild={onAddRequiredDocumentChild}
              onRemoveChild={onRemoveRequiredDocumentChild}
              disabled={disabled}
            />
          </div>

          <div className="pt-4 border-t border-body-content/50"></div>

          {/* Mandatory Fields Section */}
          <div className="space-y-2">
            <Label className="text-base font-light" required={true}>
              Mandatory Fields to create a Product
            </Label>
            <ParentSection
              items={mandatoryFields}
              sectionType="mandatoryFields"
              sectionTitle="Mandatory Fields to create a Product"
              form={form}
              onAddMore={onAddMandatoryField}
              onRemoveParent={onRemoveMandatoryField}
              onAddChild={onAddMandatoryFieldChild}
              onRemoveChild={onRemoveMandatoryFieldChild}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequiredDetailsSection;