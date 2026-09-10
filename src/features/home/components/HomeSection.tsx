import React from 'react';
import { Controller, UseFormSetValue, FieldErrors, Control } from 'react-hook-form';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { ErrorText } from '@/components/base/ErrorText';
import Dropdown from '@/components/base/Dropdown';
import Switch from '@/components/base/Switch';
import { HomeScreenFormData } from '../schemas/home.schema';

interface HomeScreenSectionProps {
  formData: HomeScreenFormData;
  setValue: UseFormSetValue<HomeScreenFormData>;
  errors: FieldErrors<HomeScreenFormData>;
  control: Control<HomeScreenFormData>;
}

const HomeScreenSection: React.FC<HomeScreenSectionProps> = ({
  formData,
  setValue,
  errors,
  control,
}) => {
  const appTypeOptions = [
    { label: 'Customer', value: 'CUSTOMER' },
    { label: 'Vendor', value: 'VENDOR' },
    { label: 'Admin', value: 'ADMIN' },
  ];

  return (
    <div className="rounded-md bg-white shadow-sm">
      <div className="p-4 border-b border-body-content/20">
        <h1 className="text-base font-semibold text-base-content">Home screen</h1>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-3">
          {/* Version */}
          <div className="col-span-2 space-y-1.5">
            <Label className="text-sm font-light" required={true}>Version</Label>
            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="ie. v2.30"
                  inputSize="md"
                  label=""
                  required={false}
                />
              )}
            />
            {errors.version && (
              <ErrorText className="text-red-500 text-xs">
                {errors.version.message}
              </ErrorText>
            )}
          </div>

          {/* Version Name */}
          <div className="col-span-3 space-y-1.5">
            <Label className="text-sm font-light" required={true}>Version Name</Label>
            <Controller
              name="versionName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="ie. ui fix"
                  inputSize="md"
                  label=""
                  required={false}
                />
              )}
            />
            {errors.versionName && (
              <ErrorText className="text-red-500 text-xs">
                {errors.versionName.message}
              </ErrorText>
            )}
          </div>

          {/* App type */}
          <div className="col-span-4 space-y-1.5">
            <Label className="text-sm font-light" required={true}>App type</Label>
            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={field.onChange}
                  options={appTypeOptions}
                  placeholder="ie. Fintech/Customer/Vendor/Rider"
                  inputSize="md"
                  containerClassName="w-full"
                />
              )}
            />
            {errors.platform && (
              <ErrorText className="text-red-500 text-xs">
                {errors.platform.message}
              </ErrorText>
            )}
          </div>

          {/* Status */}
          <div className="col-span-3 space-y-1.5">
            <Label className="text-sm font-light" required={true}>Status</Label>
            <div className="flex items-center gap-2 h-10">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    size="md"
                  />
                )}
              />
              <span className={`text-sm font-medium ${
                formData.isActive ? 'text-primary' : 'text-base-content/60'
              }`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {errors.isActive && (
              <ErrorText className="text-red-500 text-xs">
                {errors.isActive.message}
              </ErrorText>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreenSection;