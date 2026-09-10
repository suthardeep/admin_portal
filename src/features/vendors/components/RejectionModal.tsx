import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Icon from "@/components/base/Icon";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
  isSubmitting?: boolean;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title, description });
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-nd-800 rounded-lg shadow-2xl w-full max-w-lg ">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-content/20">
          <p className="text-base font-normal text-base-content">
            Rejection Remark
          </p>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-nl-100 dark:hover:bg-nd-700 transition-colors"
          >
            <Icon name="X" size={20} className="text-body-content" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pb-6 space-y-4">
          {/* Title Input */}
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter rejection title"
            required={true}
          />

          {/* Description Textarea */}
          <div className="space-y-1">
            <label className="text-sm text-base-content">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter rejection description"
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-input-border bg-base-1 text-body-content placeholder:text-disabled-content focus:outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <Button
            variant="outline"
            color="neutral"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            color="primary"
            size="md"
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RejectionModal;
