import React, { useState } from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import Checkbox from '@/components/base/Checkbox';

type ReturnOptionType = 'noReturnReplace' | 'onlyReturnAvailable' | 'onlyReplacementAvailable' | 'returnAndReplacementAvailable' | 'serviceCenter' | null;

interface ReturnReplacementState {
  selectedOption: ReturnOptionType;
  period: string;
}

const ReturnReplacementOption: React.FC = () => {
  const [state, setState] = useState<ReturnReplacementState>({
    selectedOption: null,
    period: ''
  });

  const handleOptionChange = (option: ReturnOptionType, checked: boolean) => {
    setState(prev => ({
      ...prev,
      selectedOption: checked ? option : null
    }));
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
              label="No Return/Replace"
              checked={state.selectedOption === 'noReturnReplace'}
              onChange={(checked) => handleOptionChange('noReturnReplace', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName="border-2 border-base-content/30"
            />

            <Checkbox
              label="Only Return Available"
              checked={state.selectedOption === 'onlyReturnAvailable'}
              onChange={(checked) => handleOptionChange('onlyReturnAvailable', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName="border-2 border-base-content/30"
            />

            <Checkbox
              label="Only Replacement Available"
              checked={state.selectedOption === 'onlyReplacementAvailable'}
              onChange={(checked) => handleOptionChange('onlyReplacementAvailable', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName="border-2 border-base-content/30"
            />

            <Checkbox
              label="Return & Replacement Available"
              checked={state.selectedOption === 'returnAndReplacementAvailable'}
              onChange={(checked) => handleOptionChange('returnAndReplacementAvailable', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName="border-2 border-base-content/30"
            />

            <Checkbox
              label="Service Center"
              checked={state.selectedOption === 'serviceCenter'}
              onChange={(checked) => handleOptionChange('serviceCenter', checked)}
              size="md"
              labelClassName="text-base font-light text-base-content"
              inputClassName="border-2 border-base-content/30"
            />
          </div>

          <div className="pt-4 space-y-2">
            <Label className="text-base font-light" required={true}>Return / Replace Period</Label>
            <div className="relative">
              <Input
                value={state.period}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setState(prev => ({ ...prev, period: e.target.value }))
                }
                placeholder="Type here"
                className="h-[36px] w-full pr-24"
                required={true}
                disabled={state.selectedOption === null || state.selectedOption === 'noReturnReplace'}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-base-content text-base-1 px-3 py-1 rounded-md text-sm font-medium pointer-events-none">
                Days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnReplacementOption;