import { cn } from "@/utils/helpers";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Label } from "@/components/base/Label";
import Dropdown from "@/components/base/Dropdown";
import CustomConditionModal from "./CustomConditionModal";
import { useGetAllCategoriesQuery } from "@/features/categories/api/queryHooks";
import { useGetProductsQuery } from "@/features/products/api/queryHooks";
import { useGetBannersQuery } from "@/features/banners/api/queryHooks";

interface AddContentItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    sourceType: string;
    selectedItems: Array<{ id: string; name: string }>;
    conditions?: any[]
  }) => void;
  currentSourceType?: string;
  currentSelectedItems?: Array<{ id: string; name: string }>;
  currentConditions?: any[];
}

const sourceTypeOptions = [
  { value: "CATEGORY", label: "Category" },
  { value: "PRODUCT", label: "Products" },
  { value: "BANNER", label: "Banners" },
];

const AddContentItemModal: React.FC<AddContentItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSourceType,
  currentSelectedItems = [],
  currentConditions = [],
}) => {
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const [sourceType, setSourceType] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);

  // Fetch data from APIs
  const { data: categoryData } = useGetAllCategoriesQuery({
    page: 1,
    pageSize: 100,
  });
  const { data: productData } = useGetProductsQuery();
  const { data: bannerData } = useGetBannersQuery({
    page: 1,
    pageSize: 100,
    search: "",
  });

  // Convert API data to dropdown options
  const categoryOptions = useMemo(() => {
    const categories = categoryData?.data || [];
    return categories.map((cat: any) => ({ value: cat.id, label: cat.name }));
  }, [categoryData]);

  const productOptions = useMemo(() => {
    const products = productData || [];
    return products.map((prod: any) => ({ value: prod.id, label: prod.name }));
  }, [productData]);

  const bannerOptions = useMemo(() => {
    const banners = bannerData?.data || [];
    return banners.map((banner: any) => ({ value: banner.id, label: banner.title }));
  }, [bannerData]);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      if (document) {
        document.body.style.overflow = "hidden";
      }
      // Pre-populate form with current data
      if (currentSourceType) {
        setSourceType(currentSourceType);
      }
      if (currentSelectedItems && currentSelectedItems.length > 0) {
        setSelectedItems(currentSelectedItems.map(item => item.id));
      }
      if (currentConditions && currentConditions.length > 0) {
        // Store conditions as-is (in schema format: [{ field, operator, value }])
        setConditions(currentConditions);
      }
    } else {
      if (document) {
        document.body.style.overflow = "";
      }
      const timeout = setTimeout(() => {
        setShouldRenderContent(false);
        // Reset form when modal closes
        setSourceType("");
        setSelectedItems([]);
        setConditions([]);
      }, 200);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (document) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, currentSourceType, currentSelectedItems, currentConditions]);

  const handleBackdropClick = () => {
    onClose();
  };

  const handleSave = () => {
    if (sourceType && selectedItems.length > 0) {
      // Map selected items to include their names
      const itemOptions = getItemOptions();
      const selectedItemsWithNames = selectedItems.map((itemId) => {
        const itemData = itemOptions?.options.find((opt: any) => opt.value === itemId);
        return {
          id: itemId,
          name: itemData?.label || itemId,
        };
      });

      onSave({
        sourceType,
        selectedItems: selectedItemsWithNames,
        conditions: conditions.length > 0 ? conditions : undefined
      });
      onClose();
    }
  };

  const getItemOptions = () => {
    switch (sourceType) {
      case "CATEGORY":
        return { label: "Select category", options: categoryOptions };
      case "BANNER":
        return { label: "Select banner", options: bannerOptions };
      case "PRODUCT":
        return { label: "Select product", options: productOptions };
      default:
        return null;
    }
  };

  const handleConditionSave = (conditionData: any) => {
    // Extract just the conditions array from the nested structure
    // conditionData has: { startDate, endDate, conditions: [...] }
    // We need to save: [{ field, operator, value }, ...]
    // Also transform 'condition' key to 'operator' to match schema
    if (conditionData.conditions && Array.isArray(conditionData.conditions)) {
      const transformedConditions = conditionData.conditions.map((row: any) => ({
        field: row.field,
        operator: row.condition, // Map 'condition' to 'operator'
        value: row.value,
      }));
      setConditions(transformedConditions);
    }
    setIsConditionModalOpen(false);
  };

  const itemDropdown = getItemOptions();

  const modalContent = (
    <div
      aria-label="add-content-item-modal"
      className={cn(
        `fixed inset-0 z-[100] bg-black/80 backdrop-blur-[1.5px] transition-all duration-200 flex items-center justify-center p-4`,
        isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          `flex max-h-[90dvh] w-full flex-col rounded-xl border border-body-content/20 bg-base-1 shadow-lg`,
          "w-[95%] max-w-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {shouldRenderContent && (
          <>
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-body-content/20">
              <h3 className="text-lg font-semibold text-base-content">
                Add Content Item
              </h3>
              <button
                onClick={onClose}
                className="group rounded-lg p-1.5 hover:bg-base-2 transition-colors"
                aria-label="Close modal"
              >
                <Icon
                  name="X"
                  className="w-5 h-5 text-base-content/60 group-hover:text-base-content transition-colors"
                />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="space-y-5">
                {/* Source Type Dropdown */}
                <div className="space-y-2">
                  <Label className="text-base font-light" required={true}>Source Type</Label>
                  <Dropdown
                    value={sourceType}
                    onChange={(value) => {
                      setSourceType(value);
                      setSelectedItems([]);
                      setConditions([]);
                    }}
                    options={sourceTypeOptions}
                    placeholder="Category/Products/Brands"
                    inputSize="md"
                    containerClassName="w-full"
                  />
                </div>

                {/* Item Selection Dropdown */}
                {sourceType && itemDropdown && (
                  <div className="animate-fadeIn space-y-2">
                    <Label className="text-base font-light" required={true}>{itemDropdown.label}</Label>

                    {/* For Category - Just show multi-select dropdown without Condition button */}
                    {sourceType === 'CATEGORY' ? (
                      <Dropdown
                        value={selectedItems}
                        onChange={(value) => setSelectedItems(Array.isArray(value) ? value : [value])}
                        options={itemDropdown.options}
                        placeholder={itemDropdown.label}
                        inputSize="md"
                        containerClassName="w-full"
                        searchable={true}
                        multiple={true}
                      />
                    ) : (
                      /* For Product and Banner - Show multi-select dropdown with Condition button */
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Dropdown
                            value={selectedItems}
                            onChange={(value) => setSelectedItems(Array.isArray(value) ? value : [value])}
                            options={itemDropdown.options}
                            placeholder={itemDropdown.label}
                            inputSize="md"
                            containerClassName="w-full"
                            searchable={true}
                            multiple={true}
                          />
                        </div>
                        {selectedItems.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsConditionModalOpen(true)}
                            className="shrink-0"
                          >
                            <Icon name="Plus" className="w-4 h-4 mr-2" />
                            Condition
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="flex shrink-0 items-center justify-end gap-3 px-6 py-4 border-t border-body-content/20">
              <Button
                variant="ghost"
                onClick={onClose}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                onClick={handleSave}
                disabled={!sourceType || selectedItems.length === 0}
                className="px-8"
              >
                Save
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Custom Condition Modal - Nested */}
      <CustomConditionModal
        isOpen={isConditionModalOpen}
        onClose={() => setIsConditionModalOpen(false)}
        onSave={handleConditionSave}
        selectedSourceType={sourceType}
        selectedItem={selectedItems[0] || ''}
        selectedItemName={
          selectedItems[0]
            ? getItemOptions()?.options.find(opt => opt.value === selectedItems[0])?.label
            : undefined
        }
        existingConditions={conditions.length > 0 ? [{
          startDate: '',
          endDate: '',
          conditions: conditions.map((cond: any) => ({
            id: cond.id || Math.random().toString(),
            field: cond.field,
            condition: cond.operator, // Map 'operator' back to 'condition' for the modal
            value: cond.value,
          }))
        }] : []}
      />
    </div>
  );

  if (typeof document !== "undefined") {
    const modalRoot =
      document.getElementById("modal-root") ||
      (() => {
        const el = document.createElement("div");
        el.id = "modal-root";
        document.body.appendChild(el);
        return el;
      })();

    return createPortal(modalContent, modalRoot);
  }

  return null;
};

export default AddContentItemModal;
