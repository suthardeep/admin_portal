import React from 'react';
import { cn } from '@/utils/helpers';
import Icon from '@/components/base/Icon';
import { Button } from '@/components/base/Button';
import { TablePagination } from '@/components/table/TablePagination';
import { PaginationMeta } from '@/types/baseApi';

export interface Permission {
  key: string;
  label: string;
}

export interface RolePermission {
  module: string;
  permissions: Record<string, boolean>;
}

interface RolePermissionMatrixProps {
  title: string;
  mode: 'view' | 'edit';
  permissions: Permission[];
  data: RolePermission[];
  onPermissionChange?: (module: string, permission: string, value: boolean) => void;
  onSelectAll?: (permission: string, value: boolean) => void;
  showSelectAllRow?: boolean;
  showPagination?: boolean;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
  isCreateMode?: boolean;
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({
  title,
  mode,
  permissions,
  data,
  onPermissionChange,
  onSelectAll,
  showSelectAllRow = true,
  showPagination = false,
  meta,
  onPageChange,
  onSaveClick,
  onCancelClick,
  isCreateMode = false,
}) => {
  const isViewMode = mode === 'view';

  const handlePermissionToggle = (module: string, permission: string, currentValue: boolean) => {
    if (isViewMode) return;
    onPermissionChange?.(module, permission, !currentValue);
  };

  const handleSelectAllToggle = (permission: string, currentValue: boolean) => {
    if (isViewMode) return;
    onSelectAll?.(permission, !currentValue);
  };

  const isAllSelected = (permissionKey: string) => {
    return data.every(row => row.permissions[permissionKey]);
  };

  const renderCheckbox = (isChecked: boolean, onClick?: () => void) => {
    if (isViewMode) {
      return (
        <div
          className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center",
            isChecked ? "bg-primary-500" : "bg-error"
          )}
        >
          <Icon 
            name={isChecked ? "Check" : "Minus"} 
            size={14} 
            className="text-white" 
          />
        </div>
      );
    }

    return (
      <button
        onClick={onClick}
        className={cn(
          "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
          isChecked 
            ? "bg-primary-500 border-primary-500" 
            : "bg-white border-base-content/30 hover:border-primary-400"
        )}
      >
        {isChecked && (
          <Icon name="Check" size={14} className="text-white" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-body-content/20 h-full flex flex-col">
      {/* Sticky Title */}
      <div className="py-4 px-4 border-b border-body-content/20 bg-white flex-shrink-0">
        <h2 className="text-base font-semibold text-base-content">
          {title}
        </h2>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          {/* Sticky Header */}
          <thead className='sticky top-0 z-30 bg-base-2'>
            <tr className="bg-base-2 border-b border-body-content/20">
              <th className="px-4 py-3 text-left text-sm font-semibold text-base-content align-middle bg-base-2">
              </th>
              {permissions.map(permission => (
                <th 
                  key={permission.key}
                  className="px-4 py-3 text-sm font-semibold text-base-content uppercase tracking-wide align-middle bg-base-2"
                >
                  <div className="flex justify-center items-center">
                    {permission.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {/* Sticky Select All Row - exactly below header with no gap */}
            {!isViewMode && showSelectAllRow && (
              <tr className="sticky border-b border-body-content/20 z-20 bg-white border-t border-body-content/20"  style={{ top: '41px' }}>
                <td className="px-4 py-3 align-middle bg-base-2/50">
                  <div className="flex items-center gap-2">
                    <Icon name="CheckSquare" size={18} className="text-base-content/60" />
                    <span className="text-sm font-medium text-base-content">ALL</span>
                  </div>
                </td>
                {permissions.map(permission => {
                  const allSelected = isAllSelected(permission.key);
                  return (
                    <td key={permission.key} className="px-4 py-3 align-middle bg-base-2/50">
                      <div className="flex justify-center items-center">
                        {renderCheckbox(
                          allSelected,
                          () => handleSelectAllToggle(permission.key, allSelected)
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* Scrollable Rows */}
            {data.map((row, index) => (
              <tr 
                key={row.module}
                className={cn(
                  "border-b border-body-content/20",
                  index % 2 === 0 ? "bg-white" : "bg-base-2/30"
                )}
              >
                <td className="px-4 py-3 align-middle">
                  <span className="text-sm font-medium text-base-content">
                    {row.module}
                  </span>
                </td>
                {permissions.map(permission => {
                  const isChecked = row.permissions[permission.key];
                  return (
                    <td key={permission.key} className="px-4 py-3 align-middle">
                      <div className="flex justify-center items-center">
                        {renderCheckbox(
                          isChecked,
                          () => handlePermissionToggle(row.module, permission.key, isChecked)
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sticky Buttons Footer */}
      {!isViewMode && onSaveClick && onCancelClick && (
        <div className="py-4 px-4 border-t border-body-content/20 bg-white flex justify-end gap-3 flex-shrink-0">
          <Button
            onClick={onCancelClick}
            variant="outline"
            color="primary"
            size="md"
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveClick}
            variant="filled"
            color="primary"
            size="md"
          >
            {isCreateMode ? 'Create' : 'Save'}
          </Button>
        </div>
      )}

      {showPagination && meta && onPageChange && (
        <div className="flex-shrink-0">
          <TablePagination
            meta={meta}
            onPageChange={onPageChange}
            showTotal={true}
          />
        </div>
      )}
    </div>
  );
};