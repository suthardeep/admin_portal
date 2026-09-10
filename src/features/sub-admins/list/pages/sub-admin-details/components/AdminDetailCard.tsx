import React from "react";
import { cn } from "@/utils/helpers";
import Icon from "@/components/base/Icon";
import { Button } from "@/components/base/Button";

interface AdminDetailsCardProps {
  // User info
  profileImage?: string;
  name: string;
  email: string;

  // Details
  assignedRole: string;
  dateCreated: string;
  sensitiveInfoAllowed: boolean;

  // Header
  title?: string;
  showViewRoles?: boolean;
  onViewRolesClick?: () => void;

  // Actions
  onBackClick?: () => void;
  showBack?: boolean;
  backText?: string;

  // Styling
  className?: string;
  containerClassName?: string;
}

export const AdminDetailsCard: React.FC<AdminDetailsCardProps> = ({
  profileImage,
  name,
  email,
  assignedRole,
  dateCreated,
  sensitiveInfoAllowed,
  title = "Sub-Admins Details",
  showViewRoles = true,
  onViewRolesClick,
  onBackClick,
  showBack = false,
  backText = "Back",
  className = "",
  containerClassName = "",
}) => {
  return (
    <div className={cn("space-y-6", containerClassName)}>
      {/* Back Button */}
      {showBack && (
        <Button
          variant="ghost"
          onClick={onBackClick}
          className="flex items-center gap-2 text-body-content hover:text-base-content"
        >
          <Icon name="ChevronLeft" size={20} />
          <span className="text-sm font-medium">{backText}</span>
        </Button>
      )}

      {/* Main Card with Header Inside */}
      <div className={cn("bg-base-1 rounded-lg border border-base-2 p-4", className)}>
        {/* Header Section - Inside the card */}
        <div className="flex items-center justify-between px-2 pb-2 gap-x-4">
          <h1 className="text-lg font-semibold text-base-content">{title}</h1>
          <Button
            variant="ghost"
            onClick={onViewRolesClick}
            className="text-primary hover:text-primary/80"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View Roles</span>
              <Icon
                name="CircleArrowDown"
                size={16}
                className="transform rotate-220"
              />
            </div>
          </Button>
        </div>

        {/* Border - Full Width */}
        <div className="-mx-4 border-t border-base-content/20"></div>

        <div className="px-4 py-5">
          <div className="flex items-center gap-4">
            {/* Profile Image */}
            <div className="w-16 h-16 rounded-md overflow-hidden bg-base-2 flex-shrink-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-base-content text-xl font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name and Email */}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-base-content">{name}</h2>
              <p className="text-sm text-body-content">{email}</p>
            </div>
          </div>
        </div>

        {/* Thin Border Separator - Full Width */}
        <div className="-mx-4 border-t border-base-2"></div>

        {/* Details Section */}
        <div className="px-6 py-5 bg-base-2/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assigned Role */}
            <div className="space-y-2 border-r border-r-base-2">
              <p className="text-sm text-body-content">Assigned Role</p>
              <p className="text-base font-semibold text-base-content">{assignedRole}</p>
            </div>

            {/* Date Created */}
            <div className="space-y-2">
              <p className="text-sm text-body-content">Date Created</p>
              <p className="text-base font-semibold text-base-content">{dateCreated}</p>
            </div>


            {/* Sensitive Information Allowed */}
            <div className="space-y-2">
              <p className="text-sm text-body-content">Sensitive Information Allowed?</p>
              <p className="text-base font-semibold text-base-content">
                {sensitiveInfoAllowed ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsCard;