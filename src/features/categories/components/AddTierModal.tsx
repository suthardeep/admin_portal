import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Button } from '@/components/base/Button';
import { Icon } from '@/components/base/Icon';
import ErrorText from '@/components/base/ErrorText';
import { TierSchema, type TierFormData } from '../schemas/category.schema';


interface AddTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tierData: TierFormData) => void;
}

export type TierData = TierFormData;

const ChargeTypeToggle: React.FC<{
  value: 'PERCENTAGE' | 'FIXED';
  onChange: (value: 'PERCENTAGE' | 'FIXED') => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center border border-base-content/20 rounded-lg overflow-hidden bg-base-2 h-[36px] w-20 flex-shrink-0">
    <button
      type="button"
      onClick={() => onChange('PERCENTAGE')}
      className={`w-1/2 h-full flex items-center justify-center text-sm font-medium transition-all ${
        value === 'PERCENTAGE'
          ? 'bg-base-content text-base-1'
          : 'bg-transparent text-base-content hover:bg-base-content/10'
      }`}
    >
      %
    </button>
    <div className="w-px h-6 bg-base-content/20 self-center"></div>
    <button
      type="button"
      onClick={() => onChange('FIXED')}
      className={`w-1/2 h-full flex items-center justify-center text-sm font-medium transition-all ${
        value === 'FIXED'
          ? 'bg-base-content text-base-1'
          : 'bg-transparent text-base-content hover:bg-base-content/10'
      }`}
    >
      ₹
    </button>
  </div>
);

const AddTierModal: React.FC<AddTierModalProps> = ({ isOpen, onClose, onSave }) => {
  
  const form = useForm<TierFormData>({
    resolver: zodResolver(TierSchema),
    defaultValues: {
      name: '',
      platformCharges: 0,
      platformChargesType: 'PERCENTAGE',
      closingFee: 0,
      closingFeeType: 'PERCENTAGE',
      referralFee: 0,
      referralFeeType: 'PERCENTAGE',
      aavakCoins: 0,
    },
    mode: 'onSubmit',
  });

  const { watch, setValue, formState: { errors }, handleSubmit, reset } = form;
  const tierData = watch();

  const onSubmit = (data: TierFormData) => {
    onSave(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-base-1 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-body-content/40">
          <h2 className="text-xl font-semibold text-base-content">Add New Tier</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-light" required={true}>Tier Name</Label>
            <Input
              type="text"
              value={tierData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setValue('name', e.target.value)
              }
              placeholder="Enter tier name"
              className={`h-[36px] w-full ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <ErrorText className="mt-1 !text-error">{errors.name.message}</ErrorText>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-light" required={true}>Platform Charges</Label>
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
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <Input
                  type="number"
                  value={tierData.platformCharges ?? 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setValue('platformCharges', parseFloat(e.target.value) || 0)
                  }
                  placeholder="Type here"
                  className={`h-[36px] w-full ${errors.platformCharges ? 'border-red-500' : ''}`}
                />
              </div>
              <ChargeTypeToggle
                value={tierData.platformChargesType || 'PERCENTAGE'}
                onChange={(value) => 
                  setValue('platformChargesType', value)
                }
              />
            </div>
            {errors.platformCharges && (
              <ErrorText className="mt-1 !text-error">{errors.platformCharges.message}</ErrorText>
            )}
          </div>

          {/* Closing Fee */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-light" required={true}>Closing Fee</Label>
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
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <Input
                  type="number"
                  value={tierData.closingFee ?? 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setValue('closingFee', parseFloat(e.target.value) || 0)
                  }
                  placeholder="Type here"
                  className={`h-[36px] w-full ${errors.closingFee ? 'border-red-500' : ''}`}
                />
              </div>
              <ChargeTypeToggle
                value={tierData.closingFeeType || 'PERCENTAGE'}
                onChange={(value) => 
                  setValue('closingFeeType', value)
                }
              />
            </div>
            {errors.closingFee && (
              <ErrorText className="mt-1 !text-error">{errors.closingFee.message}</ErrorText>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-light" required={true}>Referral Fee</Label>
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
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <Input
                  type="number"
                  value={tierData.referralFee ?? 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setValue('referralFee', parseFloat(e.target.value) || 0)
                  }
                  placeholder="Type here"
                  className={`h-[36px] w-full ${errors.referralFee ? 'border-red-500' : ''}`}
                />
              </div>
              <ChargeTypeToggle
                value={tierData.referralFeeType || 'PERCENTAGE'}
                onChange={(value) => 
                  setValue('referralFeeType', value)
                }
              />
            </div>
            {errors.referralFee && (
              <ErrorText className="mt-1 !text-error">{errors.referralFee.message}</ErrorText>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-light" required={true}>Aavak Coins</Label>
            <Input
              type="number"
              value={tierData.aavakCoins ?? 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setValue('aavakCoins', parseFloat(e.target.value) || 0)
              }
              placeholder="How many aavak coins user gets"
              className={`h-[36px] w-full ${errors.aavakCoins ? 'border-red-500' : ''}`}
            />
            {errors.aavakCoins && (
              <ErrorText className="mt-1 !text-error">{errors.aavakCoins.message}</ErrorText>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-body-content/50 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Save Tier
          </Button>
        </div>
        </div>
      </div>
  );
};

export default AddTierModal;