import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import Checkbox from '@/components/base/Checkbox';
import { CategoryFormData } from '../schemas/category.schema';
import { cn } from '@/utils/helpers';

interface ReturnPolicySectionProps {
  form: any;
  disabled?: boolean;
}

type ReturnOptionType = 'NO_RETURN' | 'RETURN_ONLY' | 'REPLACE_ONLY' | 'RETURN_REPLACE' | 'SERVICE_CENTER';

const ReturnPolicySection: React.FC<ReturnPolicySectionProps> = ({ form, disabled = false }) => {
  const { watch, setValue, formState: { errors } } = form;
  const returnPolicy = watch('returnPolicy');

  const handleOptionChange = (option: ReturnOptionType, checked: boolean) => {
    if (checked) {
      setValue('returnPolicy.returnPolicy', option);
      // Reset period when selecting "No Return"
      if (option === 'NO_RETURN') {
        setValue('returnPolicy.returnReplacePeriodDays', 0);
      }
    }
  };

  const handlePeriodChange = (value: string) => {
    setValue('returnPolicy.returnReplacePeriodDays', parseInt(value) || 0);
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl rounded-xl bg-base-1 p-2">
        <div className="p-4 border-b border-body-content/50">
          <h1 className="text-lg font-semibold text-base-content">Return / Replacement Option</h1>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Checkbox
              label="No Return"
              checked={returnPolicy?.returnPolicy === 'NO_RETURN'}
              onChange={(checked) => handleOptionChange('NO_RETURN', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName={cn(
                "border-2 border-base-content/30",
                disabled && returnPolicy?.returnPolicy === 'NO_RETURN' && "!opacity-100 bg-primary border-primary"
              )}
              disabled={disabled}
            />

            <Checkbox
              label="Return Only"
              checked={returnPolicy?.returnPolicy === 'RETURN_ONLY'}
              onChange={(checked) => handleOptionChange('RETURN_ONLY', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName={cn(
                "border-2 border-base-content/30",
                disabled && returnPolicy?.returnPolicy === 'RETURN_ONLY' && "!opacity-100 bg-primary border-primary"
              )}
              disabled={disabled}
            />

            <Checkbox
              label="Replace Only"
              checked={returnPolicy?.returnPolicy === 'REPLACE_ONLY'}
              onChange={(checked) => handleOptionChange('REPLACE_ONLY', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName={cn(
                "border-2 border-base-content/30",
                disabled && returnPolicy?.returnPolicy === 'REPLACE_ONLY' && "!opacity-100 bg-primary border-primary"
              )}
              disabled={disabled}
            />

            <Checkbox
              label="Return & Replace"
              checked={returnPolicy?.returnPolicy === 'RETURN_REPLACE'}
              onChange={(checked) => handleOptionChange('RETURN_REPLACE', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName={cn(
                "border-2 border-base-content/30",
                disabled && returnPolicy?.returnPolicy === 'RETURN_REPLACE' && "!opacity-100 bg-primary border-primary"
              )}
              disabled={disabled}
            />

            <Checkbox
              label="Service Center"
              checked={returnPolicy?.returnPolicy === 'SERVICE_CENTER'}
              onChange={(checked) => handleOptionChange('SERVICE_CENTER', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName={cn(
                "border-2 border-base-content/30",
                disabled && returnPolicy?.returnPolicy === 'SERVICE_CENTER' && "!opacity-100 bg-primary border-primary"
              )}
              disabled={disabled}
            />
          </div>

          {errors.returnPolicy?.returnPolicy && (
            <p className="text-sm text-red-500">{errors.returnPolicy.returnPolicy.message}</p>
          )}

          <div className="pt-4 space-y-2">
            <Label className="text-base font-light" required={true}>Return / Replace Period</Label>
            <div className="relative">
              <Input
                type="number"
                value={returnPolicy?.returnReplacePeriodDays || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handlePeriodChange(e.target.value)
                }
                placeholder="Type here"
                className="h-[36px] w-full pr-24"
                required={true}
                disabled={disabled || !returnPolicy?.returnPolicy || returnPolicy.returnPolicy === 'NO_RETURN'}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-base-content text-base-1 px-3 py-1 rounded-md text-sm font-medium pointer-events-none">
                Days
              </div>
            </div>
            {errors.returnPolicy?.returnReplacePeriodDays && (
              <p className="text-sm text-red-500">{errors.returnPolicy.returnReplacePeriodDays.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicySection;