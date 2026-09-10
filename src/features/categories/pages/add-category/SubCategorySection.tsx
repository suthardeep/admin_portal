import { ChildCategory, Subcategory } from "./AddCategory";
import CategoryInputRow from "./CategoryInputRow";

const SubcategorySection: React.FC<{
  subcategory: Subcategory;
  onUpdateSubcategory: (subId: number, field: keyof Subcategory, value: any) => void;
  onRemoveSubcategory: (subId: number) => void;
  onAddChild: (subId: number) => void;
  onUpdateChild: (subId: number, childId: number, field: keyof ChildCategory, value: any) => void;
  onRemoveChild: (subId: number, childId: number) => void;
}> = ({ subcategory, onUpdateSubcategory, onRemoveSubcategory, onAddChild, onUpdateChild, onRemoveChild }) => (
  <div className="relative pl-16">
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
        value={subcategory.name}
        image={subcategory.image}
        onNameChange={(val) => onUpdateSubcategory(subcategory.id, 'name', val)}
        onImageChange={(val) => onUpdateSubcategory(subcategory.id, 'image', val)}
        placeholder="Tops"
        showRemove={true}
        onRemove={() => onRemoveSubcategory(subcategory.id)}
      />

      {subcategory.children.length > 0 && (
        <div className="mt-3 relative">
          <div 
            className="absolute border-l-2 border-dashed border-base-content/30" 
            style={{ left: '2px', top: '-16px', bottom: '40px' }}
          ></div>

          <div className="flex items-center justify-between pb-2 pl-16">
            <h3 className="text-base font-medium text-base-content">Child-category</h3>
          </div>

          <div className="space-y-3">
            {subcategory.children.map((child: ChildCategory) => (
              <div key={child.id} className="relative pl-16">
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
                    value={child.name}
                    image={child.image}
                    onNameChange={(val) => onUpdateChild(subcategory.id, child.id, 'name', val)}
                    onImageChange={(val) => onUpdateChild(subcategory.id, child.id, 'image', val)}
                    placeholder="Kids Clothing"
                    showRemove={true}
                    onRemove={() => onRemoveChild(subcategory.id, child.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-2">
        <button
          onClick={() => onAddChild(subcategory.id)}
          className="flex items-center gap-2 text-base-content hover:text-base-content/80"
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
);



export default SubcategorySection