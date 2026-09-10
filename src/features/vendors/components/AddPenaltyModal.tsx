import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Icon from "@/components/base/Icon";
import { getInitials } from "@/utils/stringHelpers";

interface VendorInfo {
  profileImageUrl?: string;
  name: string;
  phone: string;
}

interface AddPenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; reason: string }) => void;
  vendorInfo: VendorInfo;
  isSubmitting?: boolean;
}

const AddPenaltyModal: React.FC<AddPenaltyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vendorInfo,
  isSubmitting = false,
}) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !reason.trim()) return;
    onSubmit({ amount: numAmount, reason });
  };

  const handleClose = () => {
    setAmount("");
    setReason("");
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
      <div className="relative bg-white dark:bg-nd-800 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <p className="text-base font-normal text-base-content">
            Add Penalty
          </p>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-nl-100 dark:hover:bg-nd-700 transition-colors"
          >
            <Icon name="X" size={20} className="text-body-content" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-6">
          {/* Vendor Info */}
          <div className="flex items-center gap-4 p-4 bg-base-2 rounded-lg">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-base-2 flex items-center justify-center border border-input-border">
              {vendorInfo.profileImageUrl ? (
                <img
                  src={vendorInfo.profileImageUrl}
                  alt={vendorInfo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-pl-600 dark:text-pd-300">
                  {getInitials(vendorInfo.name)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-base-content truncate">
                {vendorInfo.name}
              </h3>
              <p className="text-sm text-body-content">{vendorInfo.phone}</p>
            </div>
          </div>

          {/* Penalty Amount Input */}
          <Input
            label="Penalty Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            leftElement={<span className="text-base-content font-medium">₹</span>}
            required={false}
          />

          {/* Reason Textarea */}
          <div className="space-y-1">
            <label className="text-sm text-base-content">
              Reason for Penalty
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for penalty"
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
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              !reason.trim() ||
              isSubmitting
            }
          >
            {isSubmitting ? "Adding..." : "Add Penalty"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddPenaltyModal;
