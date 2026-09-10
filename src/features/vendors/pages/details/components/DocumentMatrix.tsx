import React from "react";
import { cn } from "@/utils/helpers";
import Icon from "@/components/base/Icon";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "image";
  url: string;
  uploaded?: boolean;
}

interface DocumentsGridProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
  className?: string;
}

const DocumentsGrid: React.FC<DocumentsGridProps> = ({
  documents,
  onDocumentClick,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-light text-base-content">Documents</h3>
        {documents.some((doc) => doc.uploaded) && (
          <div className="flex items-center gap-2 text-sm">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-success font-medium">KYC Successful</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onDocumentClick(doc)}
            className={cn(
              "group relative flex items-center gap-3 p-4 rounded-lg",
              "border-2 border-dashed transition-all duration-200",
              doc.uploaded
                ? "border-body-content/20 bg-nl-50 dark:bg-nd-800 hover:border-body-content/40 hover:bg-base-2/50"
                : "border-body-content/20 bg-nl-50 dark:bg-nd-800 hover:border-body-content/40"
            )}
          >
            <div className="flex-shrink-0">
              <Icon
                name="FileInfo"
                size={20}
                className={cn(
                  "transition-colors",
                  doc.uploaded ? "text-base-content" : "text-body-content"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm font-normal text-left",
                doc.uploaded ? "text-base-content" : "text-body-content"
              )}
            >
              {doc.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocumentsGrid;