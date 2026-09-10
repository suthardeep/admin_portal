import React from "react";
import { cn } from "@/utils/helpers";
import Icon from "@/components/base/Icon";
import { Button } from "@/components/base/Button";
import { getInitials, toProperCase } from "@/utils/stringHelpers";

export interface VendorInfo {

profileImageUrl?: string;

name: string;

phone?: string;

email?: string;

website?: string;

instagram?: string;

businessName?: string;

category?: string[];

type?: string;

brandName?: string;

aavakCoinSpend?: number;

totalOrders?: number;

totalIncome?: number;

documents?: {

name: string;

icon?: string;

}[];

kycStatus?: "successful" | "pending" | "failed";

verificationStatus?: "pending" | "under_review" | "verified" | "rejected";

}



export interface HeaderProps {

title: string;

subtitle?: string;

showBackButton?: boolean;

onBackClick?: () => void;

actions?: React.ReactNode;

children?: React.ReactNode;

vendorInfo?: VendorInfo;

className?: string;

titleClassName?: string;

subtitleClassName?: string;

showBorder?: boolean;

sticky?: boolean;

}


const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  actions,
  vendorInfo,
  sticky = false,
  titleClassName,
  subtitleClassName,
}) => {
  return (
    <header className={cn("w-full bg-white", sticky && "sticky top-0 z-10")}>
      {/* Title Section */}
      <div className="px-6 py-5 border-b-1 border-body-content/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showBackButton && (
              <Button
                variant="ghost"
                size="md"
                onClick={onBackClick}
                startIcon="ChevronLeft"
              />
            )}
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className={cn("text-base font-semibold text-base-content", titleClassName)}>
                {title}
              </h1>
              {subtitle && (
                <p className={cn("text-sm text-body-content", subtitleClassName)}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      </div>

      {vendorInfo && (
        <div className="px-6 py-6">
          <div className="flex items-stretch gap-6">
            
            {/* LEFT SIDE: Two Rows (Profile + Gray Bar) */}
            <div className="flex-[4] flex flex-col gap-4">
              {/* Row 1: Profile & Links */}
              <div className="flex items-start justify-between h-[80px]">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-base-2 flex items-center justify-center">
                    {vendorInfo.profileImageUrl ? (
                      <img
                        src={vendorInfo.profileImageUrl}
                        alt={vendorInfo.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-pl-600 dark:text-pd-300">
                        {getInitials(vendorInfo.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-base font-normal text-base-content">{vendorInfo.name}</h2>
                    <div className="flex items-center gap-2 text-md text-body-content">
                      <p>{vendorInfo.phone}</p>
                      <p className="text-xs">•</p>
                      <p>{vendorInfo.email}</p>
                    </div>
                  </div>
                </div>

                {vendorInfo.website && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text- text-body-content">
                      <Icon name="Globe" className="text-base-content" size={16} />
                      <a href={vendorInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{vendorInfo.website}</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2: Gray Business Info Bar */}
              <div className="flex items-stretch  bg-base-2 rounded-md  h-[80px]">
                <div className="flex flex-col gap-1 p-6 flex-1 justify-center relative">
                  <div className="text-base font-normal text-base-content ">{vendorInfo.businessName}</div>
                  <div className="text-sm text-body-content ">Business Name</div>
                  <div className="absolute right-0 top-3 bottom-3 w-px bg-body-content/10" />
                </div>
                <div className="flex flex-col gap-1 p-4 flex-1 justify-center  relative">
                  <div className="text-base font-normal text-base-content  break-words">{vendorInfo.category}</div>
                  <div className="text-sm text-body-content ">Category</div>
                  <div className="absolute right-0 top-3 bottom-3 w-px bg-body-content/10" />
                </div>
                <div className="flex flex-col gap-1 p-4 flex-1 justify-center ">
                  <div className="text-base font-normal text-base-content  break-words">{vendorInfo.brandName}</div>
                  <div className="text-sm text-body-content ">Brand name</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Single Unified Stats Card - Only show when NOT under_review */}
            {vendorInfo.verificationStatus !== 'under_review' && (
              <div className="flex-1 bg-base-2  rounded-md p-6 flex flex-col justify-between min-w-[260px]">
                {/* Top: Aavak Spend */}
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-normal old text-base-content">
                    {vendorInfo.aavakCoinSpend?.toLocaleString()}
                  </div>
                  <div className="text-sm text-body-content">Aavak coin spend</div>
                </div>

                {/* Divider */}
                <div className="border-t border-body-content/10 my-2" />

                {/* Bottom: Stair Structure for Totals */}
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <div className="text-lg font-normal text-base-content">
                      {vendorInfo.totalOrders?.toLocaleString()}
                    </div>
                    <div className="text-xs text-body-content ">Total Order</div>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <div className="text-lg font-normal text-base-content">
                      ₹{vendorInfo.totalIncome?.toLocaleString()}
                    </div>
                    <div className="text-xs text-body-content ">Total Income</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;