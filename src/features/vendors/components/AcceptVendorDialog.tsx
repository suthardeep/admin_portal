import React from "react";
import Dialog from "@/components/compound/Dialog";

interface AcceptVendorDialogProps {
  isOpen: boolean;
  close: () => void;
  onAccept: () => void;
  isAccepting?: boolean;
  vendorName: string;
}

const AcceptVendorDialog: React.FC<AcceptVendorDialogProps> = ({
  isOpen,
  close,
  onAccept,
  isAccepting = false,
  vendorName,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title="Accept Vendor"
      size="sm"
      actions={{
        primary: {
          children: isAccepting ? "Accepting..." : "Accept",
          onClick: onAccept,
          disabled: isAccepting,
        },
        secondary: {
          children: "Cancel",
          onClick: close,
          variant: "ghost",
          disabled: isAccepting,
        },
      }}
    >
      <h6 className="text-base-content">
        Are you sure you want to accept {vendorName}?
      </h6>
    </Dialog>
  );
};

export default AcceptVendorDialog;
