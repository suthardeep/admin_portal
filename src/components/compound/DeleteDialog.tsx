import type { ReactNode } from "react";
import Dialog from "./Dialog";

interface DeleteDialogProps {
  title?: string;
  name?: string;
  isOpen: boolean;
  close: () => void;
  onDelete: () => void;
  content?: ReactNode;
  isDeleting: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
  const {
    close,
    isOpen,
    title = "Delete",
    name,
    onDelete,
    content,
    isDeleting,
  } = props;

  return (
    <Dialog
      title={title}
      isOpen={isOpen}
      close={close}
      actions={{
        primary: {
          children: "Delete",
          onClick: onDelete,
          isLoading: isDeleting,
          color: "primary",
          variant: "filled",
        },
        secondary: {
          children: "Cancel",
          onClick: close,
          variant: "outline",
          color: "neutral",
        },
      }}
    >
      <div className="text-gray-600 dark:text-gray-300">
        Are you sure you want to delete {name}
        ?
      </div>
      {content && content}
    </Dialog>
  );
};

export default DeleteDialog;
