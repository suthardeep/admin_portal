import { cn } from "@/utils/helpers";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Label } from "@/components/base/Label";
import Dropdown from "@/components/base/Dropdown";
import { Input } from "@/components/base/Input";
import { DateTimeInput } from "@/components/base/DateTimeInput";
import { useGetAllCategoriesQuery } from "@/features/categories/api/queryHooks";
import { useGetBrandsQuery } from "@/features/brands/api/queryHooks";

interface CustomConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedSourceType: string;
  selectedItem: string;
  selectedItemName?: string;
  existingConditions?: any[];
}

interface ConditionRow {
  id: string;
  field: string;
  condition: string;
  value: string | string[]; // Support both single value and array for multi-select
}

// Field options
const fieldOptions = [
  { value: "discount", label: "Discount" },
  { value: "price", label: "Price" },
  { value: "selling-price", label: "Selling Price" },
  { value: "category", label: "Category" },
  { value: "brand", label: "Brand" },
  { value: "stock", label: "Stock" },
];

// Condition options based on field type
const getConditionOptions = (field: string) => {
  // For numeric fields (price, selling price, discount, stock)
  if (['price', 'selling-price', 'discount', 'stock'].includes(field)) {
    return [
      { value: "equals", label: "Equal to" },
      { value: "not-equals", label: "Not equal to" },
      { value: "greater-than", label: "Greater than" },
      { value: "greater-than-equals", label: "Greater than equal to" },
      { value: "less-than", label: "Less than" },
      { value: "less-than-equals", label: "Less than equal to" },
    ];
  }

  // For category and brand - list based
  if (['category', 'brand'].includes(field)) {
    return [
      { value: "in", label: "In" },
      { value: "not-in", label: "Not in" },
    ];
  }

  return [];
};

const CustomConditionModal: React.FC<CustomConditionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedSourceType,
  selectedItem,
  selectedItemName,
  existingConditions = [],
}) => {
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [conditionRows, setConditionRows] = useState<ConditionRow[]>([
    { id: "1", field: "", condition: "", value: "" },
  ]);

  // Fetch categories and brands from APIs
  const { data: categoryData } = useGetAllCategoriesQuery({
    page: 1,
    pageSize: 100,
  });
  const { data: brandData } = useGetBrandsQuery();

  // Convert API data to dropdown options
  const categoryOptions = useMemo(() => {
    const categories = categoryData?.data || [];
    return categories.map((cat: any) => ({ value: cat.id, label: cat.name }));
  }, [categoryData]);

  const brandOptions = useMemo(() => {
    const brands = brandData || [];
    return brands.map((brand: any) => ({ value: brand.id, label: brand.brandName }));
  }, [brandData]);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      if (document) {
        document.body.style.overflow = "hidden";
      }

      // Load existing conditions if available
      if (existingConditions.length > 0) {
        const firstCondition = existingConditions[0];
        if (firstCondition.startDate) setStartDate(firstCondition.startDate);
        if (firstCondition.endDate) setEndDate(firstCondition.endDate);
        if (firstCondition.conditions && firstCondition.conditions.length > 0) {
          setConditionRows(firstCondition.conditions);
        }
      }
    } else {
      if (document) {
        document.body.style.overflow = "";
      }
      const timeout = setTimeout(() => {
        setShouldRenderContent(false);
        // Reset form when modal closes
        setStartDate("");
        setEndDate("");
        setConditionRows([{ id: "1", field: "", condition: "", value: "" }]);
      }, 200);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (document) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, existingConditions]);

  const handleBackdropClick = () => {
    onClose();
  };

  const handleApply = () => {
    const data = {
      startDate,
      endDate,
      conditions: conditionRows,
    };
    onSave(data);
  };

  const addConditionRow = () => {
    // Check if all fields are already used
    const usedFields = conditionRows.map(row => row.field).filter(Boolean);
    const availableFields = fieldOptions.filter(opt => !usedFields.includes(opt.value));
    
    // Don't allow adding more rows if all fields are used
    if (availableFields.length === 0) {
      return;
    }
    
    const newRow: ConditionRow = {
      id: Date.now().toString(),
      field: "",
      condition: "",
      value: "",
    };
    setConditionRows([...conditionRows, newRow]);
  };

  const removeConditionRow = (id: string) => {
    if (conditionRows.length > 1) {
      setConditionRows(conditionRows.filter((row) => row.id !== id));
    }
  };

  const updateConditionRow = (id: string, key: keyof ConditionRow, value: string) => {
    setConditionRows(
      conditionRows.map((row) => {
        if (row.id === id) {
          // Reset condition and value when field changes
          if (key === "field") {
            return { ...row, [key]: value, condition: "", value: "" };
          }
          return { ...row, [key]: value };
        }
        return row;
      })
    );
  };

  const getValueInput = (row: ConditionRow) => {
    // For category field, show category dropdown with multi-select and search
    if (row.field === "category") {
      return (
        <Dropdown
          value={row.value}
          onChange={(value) => updateConditionRow(row.id, "value", value)}
          options={categoryOptions}
          placeholder="Select categories"
          inputSize="md"
          containerClassName="w-full"
          searchable={true}
          multiple={true}
        />
      );
    }

    // For brand field, show brand dropdown with multi-select and search
    if (row.field === "brand") {
      return (
        <Dropdown
          value={row.value}
          onChange={(value) => updateConditionRow(row.id, "value", value)}
          options={brandOptions}
          placeholder="Select brands"
          inputSize="md"
          containerClassName="w-full"
          searchable={true}
          multiple={true}
        />
      );
    }

    // For price and selling-price, show rupee icon
    if (row.field === "price" || row.field === "selling-price") {
      return (
        <Input
          type="number"
          value={row.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateConditionRow(row.id, "value", e.target.value)
          }
          placeholder="Enter value"
          leftElement={<span className="text-base-content/60">₹</span>}
          inputSize="md"
          label=""
          required={false}
        />
      );
    }

    // For discount, show percentage icon
    if (row.field === "discount") {
      return (
        <Input
          type="number"
          value={row.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateConditionRow(row.id, "value", e.target.value)
          }
          placeholder="Enter value"
          rightElement={<span className="text-base-content/60">%</span>}
          inputSize="md"
          label=""
          required={false}
        />
      );
    }

    // For stock and other fields, show plain number input
    return (
      <Input
        type="number"
        value={row.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateConditionRow(row.id, "value", e.target.value)
        }
        placeholder="Enter value"
        inputSize="md"
        label=""
        required={false}
      />
    );
  };

  const modalContent = (
    <div
      aria-label="custom-condition-modal"
      className={cn(
        `fixed inset-0 z-[110] backdrop-blur-sm transition-all duration-200 flex items-center justify-center p-4`,
        isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          `flex w-full flex-col rounded-xl border border-body-content/20 bg-base-1 shadow-lg`,
          "w-[95%] max-w-4xl",
          "max-h-[95vh]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {shouldRenderContent && (
          <>
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-body-content/20">
              <h3 className="text-lg font-semibold text-base-content">
                Custom Condition
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

            {/* Content - CRITICAL: No overflow here, let dropdowns breathe */}
<div className="px-6 py-6 flex-1 min-h-0">
              <div className="h-full overflow-y-auto overflow-x-visible pr-2 pb-64">
                <div className="space-y-6">
                  {/* Selected Item - Disabled Input */}
                  <div className="space-y-2">
                    <Label className="text-base font-light" required={true}>
                      Selected {selectedSourceType === 'PRODUCT' ? 'Products' : selectedSourceType === 'BANNER' ? 'Banners' : selectedSourceType}
                    </Label>
                    <Input
                      type="text"
                      value={selectedItemName || selectedItem}
                      disabled
                      inputSize="md"
                      label=""
                      required={false}
                      className="opacity-60"
                    />
                  </div>

                  {/* Date Range - Only for Category and Banner */}
                  {(selectedSourceType === 'CATEGORY' || selectedSourceType === 'category' || selectedSourceType === 'BANNER' || selectedSourceType === 'banner') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-base font-light" required={true}>Start Date</Label>
                        <DateTimeInput
                          value={startDate}
                          onValueChange={setStartDate}
                          placeholder="Select start date"
                          type="date"
                          size="md"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-light" required={true}>End Date</Label>
                        <DateTimeInput
                          value={endDate}
                          onValueChange={setEndDate}
                          placeholder="Select end date"
                          type="date"
                          size="md"
                        />
                      </div>
                    </div>
                  )}

                  {/* Condition Rows - Only show for Products */}
                  {(selectedSourceType === 'PRODUCT' || selectedSourceType === 'product') && (
                    <div className="space-y-3">
                      <Label className="text-base font-semibold" required={true}>Conditions</Label>
                      <div className="space-y-4">
                        {conditionRows.map((row, index) => (
                          <div key={row.id} className="animate-fadeIn">
                            <div className="grid grid-cols-12 gap-3 items-start">
                              {/* Field Dropdown */}
                              <div className="col-span-12 sm:col-span-4 space-y-1.5">
                                {index === 0 && (
                                  <Label className="text-sm font-light" required={true}>Field</Label>
                                )}
                                <Dropdown
                                  value={row.field}
                                  onChange={(value) => updateConditionRow(row.id, "field", value)}
                                  options={fieldOptions.filter(opt => {
                                    // Show all options if this row hasn't selected a field yet
                                    if (!row.field) {
                                      // But hide fields that are already selected in other rows
                                      const otherSelectedFields = conditionRows
                                        .filter(r => r.id !== row.id)
                                        .map(r => r.field);
                                      return !otherSelectedFields.includes(opt.value);
                                    }
                                    // If this row has a field selected, show it plus unused fields
                                    const otherSelectedFields = conditionRows
                                      .filter(r => r.id !== row.id)
                                      .map(r => r.field);
                                    return opt.value === row.field || !otherSelectedFields.includes(opt.value);
                                  })}
                                  placeholder="Select field"
                                  inputSize="md"
                                  containerClassName="w-full"
                                />
                              </div>

                              {/* Condition Dropdown */}
                              <div className="col-span-12 sm:col-span-4 space-y-1.5">
                                {index === 0 && (
                                  <Label className="text-sm font-light" required={true}>Condition</Label>
                                )}
                                <Dropdown
                                  value={row.condition}
                                  onChange={(value) => updateConditionRow(row.id, "condition", value)}
                                  options={getConditionOptions(row.field)}
                                  placeholder={row.field ? "Select condition" : "Select field first"}
                                  inputSize="md"
                                  containerClassName="w-full"
                                  disabled={!row.field}
                                />
                              </div>

                              {/* Value Input/Dropdown */}
                              <div className="col-span-10 sm:col-span-3 space-y-1.5">
                                {index === 0 && (
                                  <Label className="text-sm font-light" required={true}>Value</Label>
                                )}
                                {getValueInput(row)}
                              </div>

                              {/* Delete Button */}
                              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                                {index === 0 && (
                                  <Label className="text-sm font-light opacity-0 pointer-events-none">Del</Label>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeConditionRow(row.id)}
                                  disabled={conditionRows.length === 1}
                                  className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                                    conditionRows.length === 1
                                      ? "opacity-30 cursor-not-allowed"
                                      : "hover:bg-primary/10 text-base-content"
                                  )}
                                  aria-label="Delete condition"
                                >
                                  <Icon name="Trash2" className="w-4 h-4 text-base-content" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Condition Button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addConditionRow}
                        className="w-full sm:w-auto"
                        disabled={conditionRows.length >= fieldOptions.length || conditionRows.some(row => !row.field)}
                      >
                        <Icon name="Plus" className="w-4 h-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                  )}
                </div>
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
                onClick={handleApply}
                className="px-8"
              >
                Apply
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

export default CustomConditionModal;