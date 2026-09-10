import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { MediaPicker } from '@/components/media-picker/MediaPicker';
import { CategoryFormData } from '../schemas/category.schema';
import { ErrorText } from 'demaze-ui-lib/components';

interface CategoryHierarchySectionProps {
  form: any;
  mode?: 'create' | 'edit' | 'view';
  onAddSubcategory: () => void;
  onRemoveSubcategory: (index: number) => void;
  onAddChildCategory: (subcategoryIndex: number) => void;
  onRemoveChildCategory: (subcategoryIndex: number, childIndex: number) => void;
  disabled?: boolean;
}

const CategoryInputRow: React.FC<{
  label: string;
  nameValue: string;
  imageValue: string;
  onNameChange: (value: string) => void;
  onImageChange: (value: any) => void;
  placeholder: string;
  showRemove?: boolean;
  onRemove?: () => void;
  nameError?: string;
  imageError?: string;
  disabled?: boolean;
}> = ({ 
  label, 
  nameValue, 
  imageValue, 
  onNameChange, 
  onImageChange, 
  placeholder, 
  showRemove, 
  onRemove,
  nameError,
  imageError,
  disabled = false
}) => (
  <div className="grid grid-cols-[auto_1fr] gap-3">
    <div className="space-y-1.5">
      <Label required={true} className='font-light'>{label} Image</Label>
      <MediaPicker
        value={imageValue ? [{ s3Url: imageValue, id: imageValue }] : []}
        ids={[]}
        urls={[]}
        label=''
        onChange={(files) => {
          const url = files?.[0]?.s3Url || '';
          onImageChange(url);
        }}
        maxFiles={1}
        iconType="upload"
        dragDropText="Choose file to upload" 
        sizeConfig={{ height: "h-[36px]" }}
        className="w-full"
        textConfig={{ size: "xl", show: true }}
        variant='inline'
        required={true}
        disabled={disabled}
      />
      {imageError && <ErrorText className='text-error'>{imageError}</ErrorText>}
    </div>
    
    <div className="flex gap-2 items-end">
      <div className="flex-1 space-y-1.5">
        <Label required={true} className='font-light'>{label} Name</Label>
        <Input
          value={nameValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)}
          placeholder={placeholder}
          className="h-[36px] w-full"
          disabled={disabled}
        />
        {nameError && <ErrorText className='text-error'>{nameError}</ErrorText>}
      </div>
      {showRemove && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center justify-center h-[36px] text-base-content hover:text-base-content/80 mb-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

const CategoryHierarchySection: React.FC<CategoryHierarchySectionProps> = ({
  form,
  mode = 'create',
  onAddSubcategory,
  onRemoveSubcategory,
  onAddChildCategory,
  onRemoveChildCategory,
  disabled = false,
}) => {
  const { watch, setValue, formState: { errors } } = form;
  const subcategories = watch('subcategories') || [];
  const categoryName = watch('name');
  const categoryImage = watch('imageUrl');

  const getTitle = () => {
    switch (mode) {
      case 'edit':
        return 'Edit Category';
      case 'view':
        return 'View Category';
      default:
        return 'Add Categories';
    }
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl rounded-xl bg-base-1 p-2">
        <div className="p-4 border-b border-body-content/30">
          <h1 className="text-xl font-semibold text-base-content">{getTitle()}</h1>
        </div>
        
        <div className="p-2 space-y-0">
          <div className="p-3 bg-base-1">
            <CategoryInputRow
              label="Category"
              nameValue={categoryName}
              imageValue={categoryImage}
              onNameChange={(val) => setValue('name', val)}
              onImageChange={(val) => setValue('imageUrl', val)}
              placeholder="Clothing"
              nameError={errors.name?.message}
              imageError={errors.imageUrl?.message}
              disabled={disabled}
            />
          </div>

          <div className="relative pt-0">
            {subcategories.length === 0 ? (
              <div className="flex justify-end pb-2 pt-3">
                <button
                  type="button"
                  onClick={onAddSubcategory}
                  className="flex items-center gap-2 text-base-content hover:text-base-content/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                  </svg>
                  <span>Add Sub-Category</span>
                </button>
              </div>
            ) : (
              <>
                <div 
                  className="absolute border-l-2 border-dashed border-base-content/30" 
                  style={{ left: '12px', top: '-18px', bottom: '40px' }}
                ></div>

                <div className="flex items-center justify-between pb-2 pt-0 pl-16">
                  <h2 className="text-base font-normal text-base-content">Sub-category</h2>
                  <button
                    type="button"
                    onClick={onAddSubcategory}
                    className="flex items-center gap-2 text-base-content hover:text-base-content/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={disabled}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                    </svg>
                    <span>Add Sub-Category</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {subcategories.map((subcategory: any, subIndex: number) => (
                    <div key={subIndex} className="relative pl-16">
                      <div 
                        className="absolute border-t-2 border-dashed border-base-content/30" 
                        style={{ left: '12px', top: '38px', width: '48px' }}
                      ></div>
                      
                      <div 
                        className="absolute w-3 h-3 rounded-full bg-base-content/40 border-2 border-base-1" 
                        style={{ left: '54px', top: '32px' }}
                      ></div>
                      
                      <div className="p-3 bg-base-1 rounded-lg border border-base-3">
                        <CategoryInputRow
                          label="Sub-Category"
                          nameValue={subcategory.name}
                          imageValue={subcategory.imageUrl}
                          onNameChange={(val) => {
                            const updated = [...subcategories];
                            updated[subIndex].name = val;
                            setValue('subcategories', updated);
                          }}
                          onImageChange={(val) => {
                            const updated = [...subcategories];
                            updated[subIndex].imageUrl = val;
                            setValue('subcategories', updated);
                          }}
                          placeholder="Tops"
                          showRemove={true}
                          onRemove={() => onRemoveSubcategory(subIndex)}
                          nameError={errors.subcategories?.[subIndex]?.name?.message}
                          imageError={errors.subcategories?.[subIndex]?.imageUrl?.message}
                          disabled={disabled}
                        />

                        {subcategory.children && subcategory.children.length > 0 && (
                          <div className="mt-3 relative">
                            <div 
                              className="absolute border-l-2 border-dashed border-base-content/30" 
                              style={{ left: '2px', top: '-16px', bottom: '40px' }}
                            ></div>

                            <div className="flex items-center justify-between pb-2 pl-16">
                              <h3 className="text-base font-medium text-base-content">Child-category</h3>
                            </div>

                            <div className="space-y-3">
                              {subcategory.children.map((child: any, childIndex: number) => (
                                <div key={childIndex} className="relative pl-16">
                                  <div 
                                    className="absolute border-t-2 border-dashed border-base-content/30" 
                                    style={{ left: '6px', top: '38px', width: '48px' }}
                                  ></div>
                                  
                                  <div 
                                    className="absolute w-3 h-3 rounded-full bg-base-content/40 border-2 border-base-1" 
                                    style={{ left: '54px', top: '32px' }}
                                  ></div>
                                  
                                  <div className="p-2.5 bg-base-1 rounded-lg border border-base-3">
                                    <CategoryInputRow
                                      label="Child-Category"
                                      nameValue={child.name}
                                      imageValue={child.imageUrl}
                                      onNameChange={(val) => {
                                        const updated = [...subcategories];
                                        updated[subIndex].children[childIndex].name = val;
                                        setValue('subcategories', updated);
                                      }}
                                      onImageChange={(val) => {
                                        const updated = [...subcategories];
                                        updated[subIndex].children[childIndex].imageUrl = val;
                                        setValue('subcategories', updated);
                                      }}
                                      placeholder="Kids Clothing"
                                      showRemove={true}
                                      onRemove={() => onRemoveChildCategory(subIndex, childIndex)}
                                      nameError={errors.subcategories?.[subIndex]?.children?.[childIndex]?.name?.message}
                                      imageError={errors.subcategories?.[subIndex]?.children?.[childIndex]?.imageUrl?.message}
                                      disabled={disabled}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            onClick={() => onAddChildCategory(subIndex)}
                            className="flex items-center gap-2 text-base-content hover:text-base-content/80 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={disabled}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                            </svg>
                            <span>Add Child-Category</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHierarchySection;