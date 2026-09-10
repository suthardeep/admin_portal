import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Button } from '@/components/base/Button';
import { Icon } from '@/components/base/Icon';
import ErrorText from '@/components/base/ErrorText';
import { tierSchema, type TierFormData } from '../../schemas/tier.schema';
import { useCreateTierMutation, useUpdateTierMutation, useGetTierByIdQuery } from '../../api/queryHooks';
import { ROUTES } from '@/constants/routes';

interface TierFormProps {
  mode: 'create' | 'edit';
}

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

const TierForm: React.FC<TierFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const params = mode === 'edit' ? useParams({ from: '/_app/tiers/$tierId/edit' }) : null;
  const tierId = params?.tierId;

  // Fetch tier details in edit mode
  const { data: tierDetails, isLoading: loadingTier } = useGetTierByIdQuery(tierId || '');

  const createTierMutation = useCreateTierMutation();
  const updateTierMutation = useUpdateTierMutation();

  const form = useForm<TierFormData>({
    resolver: zodResolver(tierSchema),
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

  // Pre-fill form when editing
  useEffect(() => {
    if (mode === 'edit' && tierDetails) {
      reset({
        name: tierDetails.name,
        platformCharges: tierDetails.platformCharges,
        platformChargesType: tierDetails.platformChargesType,
        closingFee: tierDetails.closingFee,
        closingFeeType: tierDetails.closingFeeType,
        referralFee: tierDetails.referralFee,
        referralFeeType: tierDetails.referralFeeType,
        aavakCoins: tierDetails.aavakCoins,
      });
    }
  }, [tierDetails, mode, reset]);

  const onSubmit = (data: TierFormData) => {
    if (mode === 'create') {
      createTierMutation.mutate(data, {
        onSuccess: () => {
          navigate({ to: ROUTES.TIER.LIST });
        },
      });
    } else if (mode === 'edit' && tierId) {
      updateTierMutation.mutate(
        { tierId, data },
        {
          onSuccess: () => {
            navigate({ to: ROUTES.TIER.LIST });
          },
        }
      );
    }
  };

  const handleCancel = () => {
    navigate({ to: ROUTES.TIER.LIST });
  };

  if (mode === 'edit' && loadingTier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="shimmer h-10 w-32 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="bg-base-1 rounded-t-xl flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-body-content/20">
            <h1 className="text-lg font-semibold text-base-content">
              {mode === 'create' ? 'Create New Tier' : 'Edit Tier'}
            </h1>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Tier Name */}
              <div className="space-y-2 max-w-lg">
                <Label className="text-base font-light" required={true}>
                  Tier Name
                </Label>
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

              {/* Grid for charges - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Platform Charges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-light" required={true}>
                      Platform Charges
                    </Label>
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
                        value={tierData.platformCharges === 0 ? '' : tierData.platformCharges}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setValue('platformCharges', e.target.value === '' ? 0 : parseFloat(e.target.value))
                        }
                        placeholder="Type here"
                        className={`h-[36px] w-full ${errors.platformCharges ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <ChargeTypeToggle
                      value={tierData.platformChargesType || 'PERCENTAGE'}
                      onChange={(value) => setValue('platformChargesType', value)}
                    />
                  </div>
                  {errors.platformCharges && (
                    <ErrorText className="mt-1 !text-error">{errors.platformCharges.message}</ErrorText>
                  )}
                </div>

                {/* Closing Fee */}
                <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-light" required={true}>
                    Closing Fee
                  </Label>
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
                      value={tierData.closingFee === 0 ? '' : tierData.closingFee}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue('closingFee', e.target.value === '' ? 0 : parseFloat(e.target.value))
                      }
                      placeholder="Type here"
                      className={`h-[36px] w-full ${errors.closingFee ? 'border-red-500' : ''}`}
                    />
                  </div>
                  <ChargeTypeToggle
                    value={tierData.closingFeeType || 'PERCENTAGE'}
                    onChange={(value) => setValue('closingFeeType', value)}
                  />
                </div>
                {errors.closingFee && (
                  <ErrorText className="mt-1 !text-error">{errors.closingFee.message}</ErrorText>
                )}
              </div>

                {/* Referral Fee */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-light" required={true}>
                      Referral Fee
                    </Label>
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
                        value={tierData.referralFee === 0 ? '' : tierData.referralFee}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setValue('referralFee', e.target.value === '' ? 0 : parseFloat(e.target.value))
                        }
                        placeholder="Type here"
                        className={`h-[36px] w-full ${errors.referralFee ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <ChargeTypeToggle
                      value={tierData.referralFeeType || 'PERCENTAGE'}
                      onChange={(value) => setValue('referralFeeType', value)}
                    />
                  </div>
                  {errors.referralFee && (
                    <ErrorText className="mt-1 !text-error">{errors.referralFee.message}</ErrorText>
                  )}
                </div>

                {/* Aavak Coins */}
                <div className="space-y-2">
                  <Label className="text-base font-light" required={true}>
                    Aavak Coins
                  </Label>
                  <Input
                    type="number"
                    value={tierData.aavakCoins === 0 ? '' : tierData.aavakCoins}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValue('aavakCoins', e.target.value === '' ? 0 : parseFloat(e.target.value))
                    }
                    placeholder="How many aavak coins user gets"
                    className={`h-[36px] w-full ${errors.aavakCoins ? 'border-red-500' : ''}`}
                  />
                  {errors.aavakCoins && (
                    <ErrorText className="mt-1 !text-error">{errors.aavakCoins.message}</ErrorText>
                  )}
                </div>
              </div>
            </div>
        </div>

        {/* Form Footer */}
        <div className="bg-base-1 border-t border-body-content/20 p-6 flex items-center justify-end gap-4 rounded-b-xl">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="filled"
                color="primary"
                disabled={createTierMutation.isPending || updateTierMutation.isPending}
              >
                {createTierMutation.isPending || updateTierMutation.isPending
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                  ? 'Create Tier'
                  : 'Update Tier'}
              </Button>
        </div>
      </form>
    </div>
  );
};

export default TierForm;
