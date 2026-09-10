import React from "react";
import { cn } from "@/utils/helpers";
import Icon from "@/components/base/Icon";
import { Button } from "@/components/base/Button";
import { getInitials } from "@/utils/stringHelpers";
import { Warehouse, Address, WarehouseCategory } from "../types/warehouse";

export interface WarehouseStats {
  totalZones?: number;
  totalAisles?: number;
  totalBays?: number;
  totalLevels?: number;
  totalLocations?: number;
}

export interface WarehouseInfo extends Partial<Warehouse> {
  profileImageUrl?: string;
  stats?: WarehouseStats;
}

export interface WarehouseHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  warehouseInfo?: WarehouseInfo;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  showBorder?: boolean;
  sticky?: boolean;
}

const WarehouseHeader: React.FC<WarehouseHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  actions,
  warehouseInfo,
  sticky = false,
  titleClassName,
  subtitleClassName,
}) => {
  // Format the full address
  const getFullAddress = (address?: Address) => {
    if (!address) return "";
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  // Format date to "MMM DD, YYYY"
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={cn("w-full bg-white", sticky && "sticky top-0 z-10")}>
      {/* Title Section - Reduced padding */}
      <div className="px-5 py-4  border-b-1 border-body-content/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex flex-col gap-0.5 min-w-0">
              <div
                className={cn(
                  "text-base font-semibold text-base-content",
                  titleClassName
                )}
              >
                {title}
              </div>
              {subtitle && (
                <p
                  className={cn(
                    "text-sm text-body-content",
                    subtitleClassName
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>

      {warehouseInfo && (
        <div className="px-4 py-4">
          <div className="flex items-stretch">
            {/* LEFT SIDE: Two Rows (Profile + Gray Bar) */}
            <div className="flex-[4] flex flex-col gap-2">
              {/* Row 1: Profile & Address - Reduced min-height */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14  rounded-md overflow-hidden flex-shrink-0 bg-neutral/10 flex items-center justify-center">
                    {warehouseInfo.profileImageUrl ? (
                      <img
                        src={warehouseInfo.profileImageUrl}
                        alt={warehouseInfo.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium">
                        {getInitials(warehouseInfo?.managerName || warehouseInfo.name || '')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="text-lg font-medium text-base-content">
                      {warehouseInfo.managerName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-body-content">
                      <div>{warehouseInfo.managerMobile}</div>
                    </div>
                  </div>
                </div>

                {warehouseInfo.address && (
                  <div className="flex items-start gap-2 max-w-md">
                    <Icon
                      name="SoftIcon"
                      className="text-pl-600 dark:text-pd-300 flex-shrink-0 mt-1"
                      size={30}
                    />
                    <div className="text-base font-normal text-body-content text-right leading-relaxed">
                      {getFullAddress(warehouseInfo.address)}
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2: Info Bar */}
              <div className="flex items-stretch bg-white rounded-md h-[80px]">
                <div className="flex flex-col gap-1 p-1 flex-1 justify-center relative">
                  <div className="text-base font-normal text-base-content">
                    {warehouseInfo.managerEmail}
                  </div>
                  <div className="text-sm text-body-content font-light">Email ID</div>
                  <div className="absolute right-0 top-3 bottom-3 w-px bg-body-content/10" />
                </div>
                <div className="flex flex-col gap-1 p-4 flex-1 justify-center relative">
                  <div className="text-base font-normal text-base-content break-words">
                    {formatDate(warehouseInfo.createdAt)}
                  </div>
                  <div className="text-sm text-body-content font-light">Joined Since</div>
                  <div className="absolute right-0 top-3 bottom-3 w-px bg-body-content/10" />
                </div>
                <div className="flex flex-col gap-1 p-4 flex-1 justify-center relative">
                  <div className="flex items-center gap-2">
                    <div className="text-base font-normal text-base-content break-words">
                      {warehouseInfo.numberOfDeliveryStaff || 0}
                    </div>
                    {warehouseInfo.numberOfDeliveryStaff !== undefined &&
                      warehouseInfo.numberOfDeliveryStaff > 0 && (
                        <Icon
                          name="Users"
                          className="text-warning-500"
                          size={20}
                        />
                      )}
                  </div>
                  <div className="text-sm text-body-content font-light">
                    Number of Delivery Staff
                  </div>
                  <div className="absolute right-0 top-3 bottom-3 w-px bg-body-content/10" />
                </div>
                <div className="flex flex-col gap-1 p-4 flex-1 justify-center">
                  <div className="text-base font-normal text-base-content break-words">
                    {warehouseInfo.totalSqFt} Sq. ft.
                  </div>
                  <div className="text-sm text-body-content font-light">Size</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseHeader;