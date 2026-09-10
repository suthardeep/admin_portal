import React, { useState } from 'react';
import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { MPicker } from '@/components/media-picker/MPicker';
import CategoryInputRow from './CategoryInputRow';
import SubcategorySection from './SubCategorySection';




export interface ChildCategory {
  id: number;
  name: string;
  image: any[];
}

export interface Subcategory {
  id: number;
  name: string;
  image: any[];
  children: ChildCategory[];
}

export interface Category {
  name: string;
  image: any[];
  subcategories: Subcategory[];
}

const AddCategories: React.FC = () => {
  const [category, setCategory] = useState<Category>({
    name: 'Clothing',
    image: [],
    subcategories: []
  });

  const addSubcategory = (): void => {
    setCategory(prev => ({
      ...prev,
      subcategories: [
        ...prev.subcategories,
        { id: Date.now(), name: '', image: [], children: [] }
      ]
    }));
  };

  const removeSubcategory = (subId: number): void => {
    setCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(sub => sub.id !== subId)
    }));
  };

  const updateSubcategory = (subId: number, field: keyof Subcategory, value: any): void => {
    setCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories.map(sub =>
        sub.id === subId ? { ...sub, [field]: value } : sub
      )
    }));
  };

  const addChildCategory = (subId: number): void => {
    setCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories.map(sub =>
        sub.id === subId
          ? { ...sub, children: [...sub.children, { id: Date.now(), name: '', image: [] }] }
          : sub
      )
    }));
  };

  const removeChildCategory = (subId: number, childId: number): void => {
    setCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories.map(sub =>
        sub.id === subId
          ? { ...sub, children: sub.children.filter(child => child.id !== childId) }
          : sub
      )
    }));
  };

  const updateChildCategory = (subId: number, childId: number, field: keyof ChildCategory, value: any): void => {
    setCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories.map(sub =>
        sub.id === subId
          ? {
              ...sub,
              children: sub.children.map(child =>
                child.id === childId ? { ...child, [field]: value } : child
              )
            }
          : sub
      )
    }));
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl rounded-xl bg-base-1 p-2">
        <div className="p-4 border-b border-body-content/30">
          <h1 className="text-xl font-semibold text-base-content">Add Categories</h1>
        </div>
        
        <div className="p-2 space-y-0">
          <div className="p-3 bg-base-1">
            <CategoryInputRow
              label="Category"
              value={category.name}
              image={category.image}
              onNameChange={(val) => setCategory(prev => ({ ...prev, name: val }))}
              onImageChange={(val) => setCategory(prev => ({ ...prev, image: val }))}
              placeholder="Clothing"
            />
          </div>

          <div className="relative pt-0">
            {category.subcategories.length === 0 ? (
              <div className="flex justify-end pb-2 pt-3">
                <button
                  onClick={addSubcategory}
                  className="flex items-center gap-2 text-base-content hover:text-base-content/80"
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
                    onClick={addSubcategory}
                    className="flex items-center gap-2 text-base-content hover:text-base-content/80"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                    </svg>
                    <span>Add Sub-Category</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {category.subcategories.map((subcategory: Subcategory) => (
                    <SubcategorySection
                      key={subcategory.id}
                      subcategory={subcategory}
                      onUpdateSubcategory={updateSubcategory}
                      onRemoveSubcategory={removeSubcategory}
                      onAddChild={addChildCategory}
                      onUpdateChild={updateChildCategory}
                      onRemoveChild={removeChildCategory}
                    />
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

export default AddCategories;

