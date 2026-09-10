import React from "react";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";

interface RoleDetailsHeaderProps {
  mode: string

  roleTitle?: string;
  assignedUsers?: number;
  dateCreated?: string;

  editableRoleTitle: string;
  isEditMode:boolean

  onEditClick?: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onRoleTitleChange: (value: string) => void;
}

export const RoleDetailsHeader: React.FC<RoleDetailsHeaderProps> = ({
  mode,
  roleTitle,
  assignedUsers,
  dateCreated,
  editableRoleTitle,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onRoleTitleChange,
  isEditMode
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };


  console.log("mode" , mode)

  if (mode === "create" || mode === "edit") {
    return (
      <div className="bg-white shadow-sm rounded-lg">
        {/* Header */}
        <div className="py-5 px-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-base-content">
            {mode === "create" ? "Create Role" : "Edit Role"}
          </h1>

          {/* <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancelClick}>
              Cancel
            </Button>
            <Button color="primary" onClick={onSaveClick}>
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </div> */}
        </div>

        <div className="border-t border-body-content/20" />

        {/* Input */}
        <div className="py-6 px-4">
          <div className="max-w-2xl">
            <Input
              label="Role Title"
              placeholder="Enter role title"
              value={editableRoleTitle}
              className="outline-base-3"
              onChange={(e) => onRoleTitleChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  /* ================= VIEW ================= */
  return (
    <div className="bg-white shadow-sm rounded-lg">
      {/* Header */}
      <div className="py-5 px-4 border-b border-body-content/20">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-base-content">
            Roles & Permissions Details
          </h1>

          <Button
            onClick={onEditClick}
            variant="outline"
            color="primary"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="py-6 px-4 border-b border-base-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content mb-1">
              {roleTitle}
            </h3>
            <p className="text-sm text-body-content">Role Title</p>
          </div>

          <div className="border-l border-body-content/20 pl-6">
            <h3 className="text-lg font-semibold text-base-content mb-1">
              {assignedUsers}
            </h3>
            <p className="text-sm text-body-content">Assigned Users</p>
          </div>

          <div className="border-l border-body-content/20 pl-6">
            <h3 className="text-lg font-semibold text-base-content mb-1">
              {formatDate(dateCreated)}
            </h3>
            <p className="text-sm text-body-content">Date Created</p>
          </div>
        </div>
      </div>
    </div>
  );
};
