import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/helpers";
import Icon from "@/components/base/Icon";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image";
  url: string;
  uploaded?: boolean;
}

interface DocumentListPopoverProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  triggerLabel: string;
}

const DocumentListPopover: React.FC<DocumentListPopoverProps> = ({
  documents,
  onDocumentClick,
  triggerLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDocumentClick = (doc: Document) => {
    onDocumentClick(doc);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "border-2 border-dashed transition-all duration-200",
          "border-body-content/20 bg-nl-100 dark:bg-nd-700",
          "hover:border-body-content/40 hover:bg-nl-200 dark:hover:bg-nd-600"
        )}
      >
        <span className="text-xs font-medium text-body-content">
          {triggerLabel}
        </span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-64 rounded-xl shadow-lg",
            "bg-white dark:bg-nd-800 border border-nl-200 dark:border-nd-600",
            "py-2 max-h-80 overflow-y-auto"
          )}
          style={{ left: 0, top: "100%" }}
        >
          <div className="px-3 py-2 border-b border-nl-200 dark:border-nd-600">
            <h4 className="text-xs font-medium text-nl-600 dark:text-nd-300 uppercase">
              All Documents ({documents.length})
            </h4>
          </div>

          <div className="py-1">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5",
                  "hover:bg-nl-50 dark:hover:bg-nd-700 transition-colors",
                  "text-left"
                )}
              >
                <Icon
                  name={doc.type === "pdf" ? "FileText" : "Image"}
                  size={16}
                  className={cn(
                    "flex-shrink-0",
                    doc.uploaded
                      ? "text-nl-600 dark:text-nd-300"
                      : "text-nl-400 dark:text-nd-500"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-normal truncate",
                      doc.uploaded
                        ? "text-nl-800 dark:text-nd-100"
                        : "text-nl-500 dark:text-nd-400"
                    )}
                  >
                    {doc.name}
                  </p>
                  <p className="text-xs text-nl-500 dark:text-nd-400 capitalize">
                    {doc.type}
                  </p>
                </div>
                {doc.uploaded && (
                  <Icon
                    name="CheckCircle"
                    size={14}
                    className="text-success flex-shrink-0"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPopover;
