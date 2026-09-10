import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/helpers";
import Icon from "@/components/base/Icon";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image";
  url: string;
  uploaded?: boolean;
}

interface BrandDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  documents: Document[];
  onDocumentClick: (document: Document) => void;
}

const BrandDocumentsModal: React.FC<BrandDocumentsModalProps> = ({
  isOpen,
  onClose,
  brandName,
  documents,
  onDocumentClick,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.document.addEventListener("keydown", handleEscape);
      window.document.body.style.overflow = "hidden";
    }

    return () => {
      window.document.removeEventListener("keydown", handleEscape);
      window.document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-nd-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-body-content/20">
            <div>
              <p className="text-base font-semibold text-base-content">
                {brandName} Documents
              </p>
              <p className="text-sm text-body-content mt-0.5">
                {documents.length} {documents.length === 1 ? "document" : "documents"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-nl-100 dark:hover:bg-nd-700 transition-colors"
            >
              <Icon name="X" size={20} className="text-body-content" />
            </button>
          </div>

          {/* Documents Grid */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    onDocumentClick(doc);
                  }}
                  className={cn(
                    "group relative flex items-center gap-3 p-4 rounded-md",
                    "border-2 border-dashed transition-all duration-200",
                    "border-base-content/20 bg-nl-50 dark:bg-nd-800 hover:border-base-content/40 hover:bg-base-2/50"
                  )}
                >
                  <div className="flex-shrink-0">
                    <Icon
                      name="FileInfo"
                      size={20}
                      className="transition-colors text-base-content"
                    />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate text-base-content">
                      {doc.name}
                    </p>
                    <p className="text-xs text-body-content capitalize mt-0.5">
                      {doc.type}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
    </div>,
    document.body
  );
};

export default BrandDocumentsModal;
