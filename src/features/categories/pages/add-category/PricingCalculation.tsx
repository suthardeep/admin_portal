import React, { useState } from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import  Dropdown  from '@/components/base/Dropdown';

interface PricingState {
  minPrice: string;
  maxPrice: string;
  selectedTier: string;
  platformCharges: string;
  platformChargesType: string;
  closingFee: string;
  closingFeeType: string;
  referralFee: string;
  referralFeeType: string;
  aavakCoins: string;
}

const tierOptions = [
  { label: 'Tier 1', value: 'tier1' },
  { label: 'Tier 2', value: 'tier2' },
  { label: 'Tier 3', value: 'tier3' },
  { label: 'Tier 4', value: 'tier4' },
];

const chargeTypeOptions = [
  { label: '%', value: 'percentage' },
  { label: '₹', value: 'fixed' },
];

const PricingCalculation: React.FC = () => {
  const [pricing, setPricing] = useState<PricingState>({
    minPrice: '',
    maxPrice: '',
    selectedTier: 'tier1',
    platformCharges: '',
    platformChargesType: 'percentage',
    closingFee: '',
    closingFeeType: 'percentage',
    referralFee: '',
    referralFeeType: 'percentage',
    aavakCoins: ''
  });

  const handleChange = (field: keyof PricingState, value: string) => {
    setPricing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl rounded-xl bg-base-1 p-2">
        <div className="p-4 border-b border-body-content/50">
          <h1 className="text-lg font-semibold text-base-content">Pricing Calculation</h1>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-base font-light" required={true}>Price Range</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={pricing.minPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange('minPrice', e.target.value)
                }
                placeholder="Min."
                className="h-[36px] flex-1"
              />
              <span className="text-base-content">—</span>
              <Input
                type="number"
                value={pricing.maxPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange('maxPrice', e.target.value)
                }
                placeholder="Max."
                className="h-[36px] flex-1"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-body-content/50"></div>

          {/* Price by Tiers */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-base-content">Price by Tiers</h2>
            <Dropdown
              value={pricing.selectedTier}
              onChange={(value) => handleChange('selectedTier', value as string)}
              options={tierOptions}
              placeholder="Select Tier"
              inputSize="md"
              containerClassName="w-48"
            />
          </div>

          {/* Platform Charges */}
          <div className="space-y-2">
            <Label 
              className="text-base font-light"
              required={true}
              tooltip="Platform charges are fees charged by the platform for using their services"
            >
              Platform Charges
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={pricing.platformCharges}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange('platformCharges', e.target.value)
                }
                placeholder="Type here"
                className="h-[36px] w-full pr-32"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => handleChange('platformChargesType', 'percentage')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pricing.platformChargesType === 'percentage'
                      ? 'bg-base-content text-base-1'
                      : 'bg-base-2 text-base-content hover:bg-base-content/80'
                  }`}
                >
                  %
                </button>
                <button
                  onClick={() => handleChange('platformChargesType', 'fixed')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pricing.platformChargesType === 'fixed'
                      ? 'bg-base-content text-base-1'
                      : 'bg-base-2 text-base-content hover:bg-base-content/80'
                  }`}
                >
                  ₹
                </button>
              </div>
            </div>
          </div>

          {/* Closing Fee */}
          <div className="space-y-2">
            <Label 
              className="text-base font-light"
              required={true}
              tooltip="Closing fee is charged at the end of a transaction"
            >
              Closing Fee
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={pricing.closingFee}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange('closingFee', e.target.value)
                }
                placeholder="Type here"
                className="h-[36px] w-full pr-32"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => handleChange('closingFeeType', 'percentage')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pricing.closingFeeType === 'percentage'
                      ? 'bg-base-content text-base-1'
                      : 'bg-base-2 text-base-content hover:bg-base-content/80'
                  }`}
                >
                  %
                </button>
                <button
                  onClick={() => handleChange('closingFeeType', 'fixed')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pricing.closingFeeType === 'fixed'
                      ? 'bg-base-content text-base-1'
                      : 'bg-base-2 text-base-content hover:bg-base-content/80'
                  }`}
                >
                  ₹
                </button>
              </div>
            </div>
          </div>

          {/* Referral Fee */}
          <div className="space-y-2">
            <Label 
              className="text-base font-light"
              required={true}
              tooltip="Referral fee is given to users who refer others to the platform"
            >
              Referral Fee
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={pricing.referralFee}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange('referralFee', e.target.value)
                }
                placeholder="Type here"
                className="h-[36px] w-full pr-32"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => handleChange('referralFeeType', 'percentage')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pricing.referralFeeType === 'percentage'
                      ? 'bg-base-content text-base-1'
                      : 'bg-base-2 text-base-content hover:bg-base-content/80'
                  }`}
                >
                  %
                </button>
                <button
                  onClick={() => handleChange('referralFeeType', 'fixed')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pricing.referralFeeType === 'fixed'
                      ? 'bg-base-content text-base-1'
                      : 'bg-base-2 text-base-content hover:bg-base-content/80'
                  }`}
                >
                  ₹
                </button>
              </div>
            </div>
          </div>

          {/* User Gets (Aavak coins) */}
          <div className="space-y-2">
            <Label className="text-base font-light" required={true}>User Gets (Aavak coins)</Label>
            <Input
              type="number"
              value={pricing.aavakCoins}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleChange('aavakCoins', e.target.value)
              }
              placeholder="How many aavak coin user get"
              className="h-[36px] w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculation;