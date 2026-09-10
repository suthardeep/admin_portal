import React, { useState } from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Icon } from '@/components/base/Icon';

interface ChargesState {
  local: string;
  regional: string;
  national: string;
}

const Charges: React.FC = () => {
  const [charges, setCharges] = useState<ChargesState>({
    local: '',
    regional: '',
    national: ''
  });

  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (field: keyof ChargesState, value: string) => {
    setCharges(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          <div className="flex items-center justify-between p-4 border-b border-body-content/50">
            <h1 className="text-lg font-semibold text-base-content">
              Charges
            </h1>
            <div className="relative">
              <button 
                className="flex items-center justify-center w-8 h-8 hover:bg-base-2 rounded-full transition-colors"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <Icon name="Info" className="text-base-content text-base" />
              </button>
              
              {showTooltip && (
                <div className="absolute right-0 top-10 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                  <p className="text-sm text-gray-700">
                    Enter the shipping charges for different delivery zones. Local for same city, Regional for nearby areas, and National for countrywide delivery.
                  </p>
                </div>
              )}
            </div>
          </div>
        
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>Local</Label>
              <Input
                type="number"
                value={charges.local}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange('local', e.target.value)
                }
                placeholder="20"
                className="h-[36px] w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>Regional</Label>
              <Input
                type="number"
                value={charges.regional}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange('regional', e.target.value)
                }
                placeholder="30"
                className="h-[36px] w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>National</Label>
              <Input
                type="number"
                value={charges.national}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleChange('national', e.target.value)
                }
                placeholder="50"
                className="h-[36px] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Charges;