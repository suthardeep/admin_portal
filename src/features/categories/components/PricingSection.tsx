import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Icon } from '@/components/base/Icon';
import Dropdown from '@/components/base/Dropdown';
import { CategoryFormData } from '../schemas/category.schema';
import ErrorText from '@/components/base/ErrorText';
import { useGetAllTiersQuery } from '../api/queryHooks';
import { toast } from '@/components/compound/Sonner';

interface PricingSectionProps {
  form: any;
  disabled?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ form, disabled = false }) => {
  const { watch, setValue, formState: { errors } } = form;
  const pricing = watch('pricing');
  const [showTooltip, setShowTooltip] = useState<string | false>(false);

  // Fetch tiers from API
  const { data: tiersData, isLoading: loadingTiers } = useGetAllTiersQuery({
    page: 1,
    pageSize: 100,
  });

  const tiers = tiersData?.data || [];

  // Build tier options dynamically (removed Add New Tier option)
  const tierOptions = tiers.map(tier => ({
    label: tier.name,
    value: tier.id,
  }));

  const handlePricingChange = (field: keyof CategoryFormData['pricing'], value: any) => {
    setValue(`pricing.${field}`, value);
  };

  const handleTierChange = (value: string) => {
    // Find the selected tier and prefill its values
    const selectedTier = tiers.find(tier => tier.id === value);
    if (selectedTier) {
      handlePricingChange('tierId', value);
      handlePricingChange('platformCharges', selectedTier.platformCharges);
      handlePricingChange('platformChargesType', selectedTier.platformChargesType);
      handlePricingChange('closingFee', selectedTier.closingFee);
      handlePricingChange('closingFeeType', selectedTier.closingFeeType);
      handlePricingChange('referralFee', selectedTier.referralFee);
      handlePricingChange('referralFeeType', selectedTier.referralFeeType);
      handlePricingChange('aavakCoins', selectedTier.aavakCoins);
    } else {
      handlePricingChange('tierId', value);
    }
  };

  // Get selected tier for display
  const selectedTier = tiers.find(tier => tier.id === pricing?.tierId);

  const ChargeTypeToggle: React.FC<{
    value: 'PERCENTAGE' | 'FIXED';
  }> = ({ value }) => (
    <div className="flex items-center border border-base-content/20 rounded-lg overflow-hidden bg-base-200 h-[36px] w-20 flex-shrink-0">
      <div
        className={`w-1/2 h-full flex items-center justify-center text-sm font-medium ${
          value === 'PERCENTAGE'
            ? 'bg-base-content text-base-1'
            : 'bg-transparent text-base-content/50'
        }`}
      >
        %
      </div>
      <div className="w-px h-6 bg-base-content/20 self-center"></div>
      <div
        className={`w-1/2 h-full flex items-center justify-center text-sm font-medium ${
          value === 'FIXED'
            ? 'bg-base-content text-base-1'
            : 'bg-transparent text-base-content/50'
        }`}
      >
        ₹
      </div>
    </div>
  );

  return (
    <>
      {showTooltip && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setShowTooltip(false)}
        />
      )}
      
      <div className="">
        <div className="mx-auto max-w-7xl rounded-xl bg-base-1 relative p-2">
          <div className="p-4 border-b border-body-content/50">
            <h1 className="text-lg font-semibold text-base-content">Pricing Calculation</h1>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Price Range */}
            <div className="space-y-2">
              <Label className="text-base font-light " required={true}>Price Range</Label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={pricing?.min || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handlePricingChange('min', parseFloat(e.target.value) || 0)
                    }
                    placeholder="Min."
                    className={`h-[36px] w-full ${errors.pricing?.min ? 'border-red-500' : ''}`}
                    disabled={disabled}
                  />
                  {errors.pricing?.min && (
                    <ErrorText className="mt-1 !text-error">{errors.pricing.min.message}</ErrorText>
                  )}
                </div>
                <span className="text-base-content mt-2">—</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={pricing?.max || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handlePricingChange('max', parseFloat(e.target.value) || 0)
                    }
                    placeholder="Max."
                    className={`h-[36px] w-full ${errors.pricing?.max ? 'border-red-500' : ''}`}
                    disabled={disabled}
                  />
                  {errors.pricing?.max && (
                    <ErrorText className="mt-1 !text-error">{errors.pricing.max.message}</ErrorText>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-body-content/50"></div>

            {/* Price by Tiers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-base-content">Price by Tiers</h2>
                <div className="w-48">
                  <Dropdown
                    value={pricing?.tierId || ''}
                    onChange={handleTierChange}
                    options={tierOptions}
                    placeholder="Select Tier"
                    inputSize="md"
                    containerClassName="w-full"
                    isLoading={loadingTiers}
                    disabled={disabled}
                  />
                  {errors.pricing?.tierId && (
                    <ErrorText className=" !text-error mt-1">{errors.pricing.tierId.message}</ErrorText>
                  )}
                </div>
              </div>
            </div>

            {/* Tier Details - Read Only */}
            {selectedTier && (
              <>
                {/* Platform Charges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label 
                      className="text-base font-light"
                      required={true}
                    >
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
                        value={pricing?.platformCharges || 0}
                        placeholder="From selected tier"
                        className="h-[36px] w-full bg-base-200"
                        disabled
                        readOnly
                      />
                    </div>
                    <ChargeTypeToggle value={pricing?.platformChargesType || 'PERCENTAGE'} />
                  </div>
                </div>

                {/* Closing Fee */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label 
                      className="text-base font-light"
                      required={true}
                    >
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
                        value={pricing?.closingFee || 0}
                        placeholder="From selected tier"
                        className="h-[36px] w-full bg-base-200"
                        disabled
                        readOnly
                      />
                    </div>
                    <ChargeTypeToggle value={pricing?.closingFeeType || 'PERCENTAGE'} />
                  </div>
                </div>

                {/* Referral Fee */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label 
                      className="text-base font-light"
                      required={true}
                    >
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
                        value={pricing?.referralFee || 0}
                        placeholder="From selected tier"
                        className="h-[36px] w-full bg-base-200"
                        disabled
                        readOnly
                      />
                    </div>
                    <ChargeTypeToggle value={pricing?.referralFeeType || 'PERCENTAGE'} />
                  </div>
                </div>

                {/* User Gets (Aavak coins) */}
                <div className="space-y-2">
                  <Label 
                    className="text-base font-light"
                    required={true}
                  >
                    User Gets (Aavak coins)
                  </Label>
                  <Input
                    type="number"
                    value={pricing?.aavakCoins || 0}
                    placeholder="From selected tier"
                    className="h-[36px] w-full bg-base-200"
                    disabled
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingSection;