import { cn } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Label } from "@/components/base/Label";
import Dropdown from "@/components/base/Dropdown";
import { Input } from "@/components/base/Input";
import { useGetAllCategoriesQuery } from "@/features/categories/api/queryHooks";
import { useGetBrandsQuery } from "@/features/brands/api/queryHooks";
import { useGetProductsQuery } from "@/features/products/api/queryHooks";
import { ENHANCED_ACTION_TYPE_OPTIONS, SCREEN_TYPE_OPTIONS } from "@/constants/cmsOptions";

interface ConfigureActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { actionType: string; selectedValue: string; selectedLabel: string }) => void;
  existingConfig?: {
    actionType?: string;
    targets?: Array<{ id: string; name: string }>;
  };
}

const ConfigureActionsModal: React.FC<ConfigureActionsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingConfig,
}) => {
  // Fetch data from APIs
  const { data: categoriesData } = useGetAllCategoriesQuery({ page: 1, pageSize: 100 });
  const { data: brandsData } = useGetBrandsQuery();
  const { data: productsData } = useGetProductsQuery();

  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | string[]>("");

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      if (document) {
        document.body.style.overflow = "hidden";
      }

      // Prefill with existing configuration
      if (existingConfig) {
        setActionType(existingConfig.actionType || "");

        // Set selected values based on action type and targets
        if (existingConfig.targets && existingConfig.targets.length > 0) {
          const actionType = existingConfig.actionType;

          // For multi-select types (CATEGORY, BRAND), set array of IDs
          if (actionType === "CATEGORY" || actionType === "BRAND") {
            setSelectedValue(existingConfig.targets.map(target => target.id));
          }
          // For text input types (SEARCH - keywords), join names with comma
          else if (actionType === "SEARCH") {
            const keywords = existingConfig.targets.map(target => target.name).join(", ");
            setSelectedValue(keywords);
          }
          // For single-select types, set first target ID
          else {
            setSelectedValue(existingConfig.targets[0].id);
          }
        }
      }
    } else {
      if (document) {
        document.body.style.overflow = "";
      }
      const timeout = setTimeout(() => {
        setShouldRenderContent(false);
        // Reset form when modal closes
        setActionType("");
        setSelectedValue("");
      }, 200);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (document) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, existingConfig]);

  const handleBackdropClick = () => {
    onClose();
  };

  // Build options from API data
  const brandOptions = brandsData?.map((brand: any) => ({
    value: brand.id,
    label: brand.brandName,
  })) || [];

  const categoryOptions = categoriesData?.data?.map((category: any) => ({
    value: category.id,
    label: category.name,
  })) || [];

  const productOptions = productsData?.map((product: any) => ({
    value: product.id,
    label: product.name,
  })) || [];

  // In-app page options from constants
  const inAppPageOptions = SCREEN_TYPE_OPTIONS.map(option => ({
    value: option.value,
    label: option.label,
  }));

  const handleSave = () => {
    if (actionType && (selectedValue || getSecondaryOptions()?.type === "placeholder")) {
      // Find the selected label based on action type
      let selectedLabel = "";
      let finalSelectedValue = "";

      const secondaryOptions = getSecondaryOptions();

      // Handle multi-select for categories and brands
      if ((actionType === "CATEGORY" || actionType === "BRAND") && Array.isArray(selectedValue)) {
        const selectedItems = selectedValue.map(val =>
          secondaryOptions?.options.find((opt: any) => opt.value === val)
        ).filter(Boolean);

        selectedLabel = selectedItems.map((item: any) => item.label).join(", ");
        finalSelectedValue = selectedValue.join(","); // Store as comma-separated string
      }
      // Handle text input (search/keywords) - convert comma-separated values to targets
      else if (secondaryOptions?.type === "text" && typeof selectedValue === "string") {
        // Split by comma and trim each keyword
        const keywords = selectedValue.split(',').map(k => k.trim()).filter(k => k.length > 0);
        selectedLabel = keywords.join(", ");
        finalSelectedValue = keywords.join(",");
      }
      // Handle single select for other types
      else if (secondaryOptions && secondaryOptions.options.length > 0) {
        const selectedOption = secondaryOptions.options.find(
          (opt: any) => opt.value === selectedValue
        );
        if (selectedOption) {
          selectedLabel = selectedOption.label;
          finalSelectedValue = selectedValue as string;
        }
      }
      // Handle other text input cases
      else if (typeof selectedValue === "string") {
        selectedLabel = selectedValue;
        finalSelectedValue = selectedValue;
      }

      // For placeholder types, use the action type as label
      if (secondaryOptions?.type === "placeholder") {
        selectedLabel = actionType;
        finalSelectedValue = actionType;
      }

      onSave({
        actionType,
        selectedValue: finalSelectedValue,
        selectedLabel
      });
      onClose();
    }
  };

  const getSecondaryOptions = () => {
    switch (actionType) {
      case "CATEGORY":
        return { 
          label: "Select category", 
          options: categoryOptions,
          type: "dropdown"
        };
      case "BRAND":
        return { 
          label: "Select brand", 
          options: brandOptions,
          type: "dropdown"
        };
      case "PRODUCT":
        return { 
          label: "Select product", 
          options: productOptions,
          type: "dropdown"
        };
      case "SEARCH":
        return { 
          label: "Enter search term", 
          options: [],
          type: "text",
          placeholder: "e.g. smartphones, laptops"
        };
      case "IN_APP_PAGE":
        return { 
          label: "Select page", 
          options: inAppPageOptions,
          type: "dropdown"
        };
      case "UGC_USER":
        return { 
          label: "UGC User (Coming Soon)", 
          options: [],
          type: "placeholder"
        };
      case "UGC_REEL":
        return { 
          label: "UGC Reel (Coming Soon)", 
          options: [],
          type: "placeholder"
        };
      default:
        return null;
    }
  };

  const secondaryDropdown = getSecondaryOptions();

  const modalContent = (
    <div
      aria-label="configure-actions-modal"
      className={cn(
        `fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-[1.5px] transition-all duration-200 p-4`,
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
                Configure actions
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
            <div className="px-6 py-6 min-h-72">
              <div className="space-y-5">
                {/* Action Type Dropdown */}
                <div className="space-y-2">
                  <Label className="text-base font-light" required={true}>Action Type</Label>
                  <Dropdown
                    value={actionType}
                    onChange={(value) => {
                      setActionType(value);
                      setSelectedValue("");
                    }}
                    options={ENHANCED_ACTION_TYPE_OPTIONS}
                    placeholder="Select Action Type"
                    inputSize="md"
                    containerClassName="w-full"
                  />
                </div>

                {/* Secondary Input/Dropdown */}
                {actionType && secondaryDropdown && (
                  <div className="animate-fadeIn space-y-2">
                    <Label className="text-base font-light" required={true}>{secondaryDropdown.label}</Label>
                    
                    {/* Text Input for SEARCH */}
                    {secondaryDropdown.type === "text" && (
                      <Input
                        type="text"
                        value={selectedValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectedValue(e.target.value)
                        }
                        placeholder={secondaryDropdown.placeholder || "Enter value"}
                        inputSize="md"
                        label=""
                        required={false}
                      />
                    )}

                    {/* Dropdown for API options */}
                    {secondaryDropdown.type === "dropdown" && secondaryDropdown.options.length > 0 && (
                      <Dropdown
                        value={selectedValue}
                        onChange={(value) => setSelectedValue(value)}
                        options={secondaryDropdown.options}
                        placeholder={secondaryDropdown.label}
                        inputSize="md"
                        containerClassName="w-full"
                        multiple={actionType === "CATEGORY" || actionType === "BRAND"}
                        searchable={true}
                        searchPlaceholder={`Search ${secondaryDropdown.label.toLowerCase()}...`}
                      />
                    )}

                    {/* Loading state for dropdowns */}
                    {secondaryDropdown.type === "dropdown" && secondaryDropdown.options.length === 0 && (
                      <div className="flex items-center justify-center py-8 text-base-content/60">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm">Loading options...</span>
                        </div>
                      </div>
                    )}

                    {/* Placeholder for UGC options */}
                    {secondaryDropdown.type === "placeholder" && (
                      <div className="flex items-center justify-center py-8 text-base-content/40 bg-base-2 rounded-lg border-2 border-dashed border-base-content/20">
                        <div className="text-center">
                          <Icon name="Clock" className="w-6 h-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">Coming Soon</p>
                          <p className="text-xs">This feature will be available in a future update</p>
                        </div>
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
                disabled={!actionType || (
                  !selectedValue && 
                  secondaryDropdown?.type !== "placeholder" &&
                  !(Array.isArray(selectedValue) && selectedValue.length > 0)
                )}
                className="px-8"
              >
                Save
              </Button>
            </div>
          </>
        )}
      </div>
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

export default ConfigureActionsModal;