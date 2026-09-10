import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Icon } from '@/components/base/Icon';
import { CategoryFormData } from '../schemas/category.schema';

interface ChargesSectionProps {
  form: any;
  disabled?: boolean;
}

const ChargesSection: React.FC<ChargesSectionProps> = ({ form, disabled = false }) => {
  const { watch, setValue, formState: { errors } } = form;
  const charges = watch('charges');

  const handleChargeChange = (field: keyof CategoryFormData['charges'], value: string) => {
    setValue(`charges.${field}`, parseFloat(value) || 0);
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl rounded-xl bg-base-1 relative p-2">
        <div className="flex items-center justify-between p-4 border-b border-body-content/50">
          <h1 className="text-lg font-semibold text-base-content">
            Charges
          </h1>
          <div className="relative group">
            <div className="flex items-center justify-center w-8 h-8 hover:bg-base-2 rounded-full transition-colors">
              <Icon name="Info" className="text-base-content text-base" />
            </div>
            
            <div className="absolute right-0 top-10 w-64 bg-white rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <p className="text-sm text-gray-700">
                Enter the shipping charges for different delivery zones. Local for same city, Regional for nearby areas, and National for countrywide delivery.
              </p>
            </div>
          </div>
        </div>
        
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-base font-light" required={true}>Local</Label>
                <div className="relative group">
                  <div className="flex items-center justify-center w-5 h-5 hover:bg-base-2 rounded-full transition-colors">
                    <Icon name="Info" className="text-base-content text-xs" />
                  </div>
                  
                  <div className="absolute left-0 top-6 w-64 bg-white rounded-lg shadow-lg p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <p className="text-sm text-gray-700">
                      To be charged from vendor on product sell
                    </p>
                  </div>
                </div>
              </div>
              <Input
                type="number"
                value={charges?.local || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChargeChange('local', e.target.value)
                }
                placeholder="20"
                className="h-[36px] w-full"
                disabled={disabled}
              />
              {errors.charges?.local && (
                <p className="text-sm text-red-500">{errors.charges.local.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-base font-light" required={true}>Regional</Label>
                <div className="relative group">
                  <div className="flex items-center justify-center w-5 h-5 hover:bg-base-2 rounded-full transition-colors">
                    <Icon name="Info" className="text-base-content text-xs" />
                  </div>
                  
                  <div className="absolute left-0 top-6 w-64 bg-white rounded-lg shadow-lg p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <p className="text-sm text-gray-700">
                      To be charged from vendor on product sell
                    </p>
                  </div>
                </div>
              </div>
              <Input
                type="number"
                value={charges?.regional || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChargeChange('regional', e.target.value)
                }
                placeholder="30"
                className="h-[36px] w-full"
                disabled={disabled}
              />
              {errors.charges?.regional && (
                <p className="text-sm text-red-500">{errors.charges.regional.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-base font-light" required={true}>National</Label>
                <div className="relative group">
                  <div className="flex items-center justify-center w-5 h-5 hover:bg-base-2 rounded-full transition-colors">
                    <Icon name="Info" className="text-base-content text-xs" />
                  </div>
                  
                  <div className="absolute left-0 top-6 w-64 bg-white rounded-lg shadow-lg p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <p className="text-sm text-gray-700">
                      To be charged from vendor on product sell
                    </p>
                  </div>
                </div>
              </div>
              <Input
                type="number"
                value={charges?.national || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChargeChange('national', e.target.value)
                }
                placeholder="50"
                className="h-[36px] w-full"
                disabled={disabled}
              />
              {errors.charges?.national && (
                <p className="text-sm text-red-500">{errors.charges.national.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ChargesSection;