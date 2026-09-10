import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/base/Button";
import { Icon } from "@/components/base/Icon";
import { Label } from "@/components/base/Label";
import Dropdown from "@/components/base/Dropdown";
import { useGetSectionsQuery } from "@/features/cms/api/queryHooks";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { selectedSections: string[]; sectionNames: string[] }) => void;
  excludedSectionIds?: string[]; // Already added section IDs to exclude
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  excludedSectionIds = [],
}) => {
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // Fetch CMS sections
  const { data: sectionsResponse, isLoading } = useGetSectionsQuery({});

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      // Pre-select already added sections when modal opens
      setSelectedSections(excludedSectionIds);
      if (document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      if (document) {
        document.body.style.overflow = "";
      }
      const timeout = setTimeout(() => {
        setShouldRenderContent(false);
        setSelectedSections([]);
      }, 200);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (document) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, excludedSectionIds]);

  const handleBackdropClick = () => {
    onClose();
  };

  // Build section options from API data - show ALL sections, not filtering any
  const sectionOptions = React.useMemo(() => {
    const sections = (sectionsResponse as any)?.data || [];
    
    return sections.map((section: any) => ({
      value: section.id,
      label: section.title,
    }));
  }, [sectionsResponse]);

  const handleSave = () => {
    if (selectedSections.length > 0) {
      // Only save the newly selected sections (not already added ones)
      const newlySelectedSections = selectedSections.filter(id => !excludedSectionIds.includes(id));
      if (newlySelectedSections.length > 0) {
        const sectionNames = newlySelectedSections.map(sectionId => 
          sectionOptions.find((opt: any) => opt.value === sectionId)?.label || sectionId
        );
        onSave({ selectedSections: newlySelectedSections, sectionNames });
      }
      onClose();
    }
  };

  const modalContent = (
    <div
      aria-label="add-section-modal"
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
                Add Section
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
                {/* Section Selection Dropdown */}
                <div className="space-y-2">
                  <Label className="text-base font-light" required={true}>Select Sections</Label>
                  <Dropdown
                    value={selectedSections}
                    onChange={(value) => setSelectedSections(value)}
                    options={sectionOptions}
                    placeholder="Choose sections"
                    inputSize="md"
                    containerClassName="w-full"
                    multiple={true}
                    searchable={true}
                    searchPlaceholder="Search sections..."
                  />
                </div>

                {/* Available sections count with icon */}
                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <Icon name="Info" className="w-4 h-4" />
                  {isLoading ? (
                    <span>Loading sections...</span>
                  ) : (
                    <span>{sectionOptions.length} sections available • {selectedSections.length} selected</span>
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
                onClick={handleSave}
                disabled={selectedSections.filter(id => !excludedSectionIds.includes(id)).length === 0}
                className="px-8"
              >
                {(() => {
                  const newlySelected = selectedSections.filter(id => !excludedSectionIds.includes(id)).length;
                  return newlySelected > 0 
                    ? `Add ${newlySelected} Section${newlySelected > 1 ? 's' : ''}` 
                    : 'Add Sections';
                })()}
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

export default AddSectionModal;
