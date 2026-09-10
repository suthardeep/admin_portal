import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/helpers";
import Icon from "@/components/base/Icon";
import { Button } from "@/components/base/Button";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    type: "pdf" | "image";
    url: string;
  } | null;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && document) {
      setLoading(true);
    }
  }, [isOpen, document]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      window.document.body.style.overflow = "hidden";
    }

    return () => {
      window.document.removeEventListener("keydown", handleEscape);
      window.document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !document) return null;

  const handleContentLoad = () => {
    setLoading(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-body-content/10">
            <h2 className="text-xl font-semibold text-base-content">
              {document.name}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-base-2 transition-colors"
            >
              <Icon name="X" size={20} className="text-body-content" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6 bg-base-2/30">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-body-content/20 border-t-base-content rounded-full animate-spin" />
                  <p className="text-sm text-body-content">Loading document...</p>
                </div>
              </div>
            )}

            {document.type === "image" ? (
              <div className="flex items-center justify-center">
                <img
                  src={document.url}
                  alt={document.name}
                  className={cn(
                    "max-w-full max-h-[calc(90vh-200px)] object-contain rounded-lg shadow-lg",
                    loading && "hidden"
                  )}
                  onLoad={handleContentLoad}
                />
              </div>
            ) : (
              <iframe
                src={document.url}
                className={cn(
                  "w-full h-[calc(90vh-200px)] rounded-lg border-0 shadow-lg",
                  loading && "hidden"
                )}
                title={document.name}
                onLoad={handleContentLoad}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-5 border-t border-body-content/10">
            <Button
              variant="filled"
              size="lg"
              onClick={onClose}
              className="min-w-[120px]"
            >
              Close
            </Button>
          </div>
        </div>
      </div>,
    window.document.body
  );
};

export default DocumentModal;