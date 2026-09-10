import React, { useState } from 'react';
import { Controller, UseFormSetValue, FieldErrors, Control } from 'react-hook-form';
import { Label } from '@/components/base/Label';
import { ErrorText } from '@/components/base/ErrorText';
import Dropdown from '@/components/base/Dropdown';
import ColorPickerDialog from '@/components/base/ColorPickerDialog';
import { HomeScreenFormData } from '../schemas/home.schema';

// Common Color Input Component
interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onColorPickerClick: () => void;
  placeholder?: string;
  fullWidth?: boolean;
  error?: string;
}

export const ColorInput: React.FC<ColorInputProps> = ({
  label,
  value,
  onChange,
  onColorPickerClick,
  placeholder = "Enter/Select colour hex code",
  fullWidth = false,
  error
}) => {
  return (
    <div className={`space-y-2 ${fullWidth ? 'col-span-2' : ''}`}>
      <Label className="text-xs font-light text-gray-700" required={true}>{label}</Label>
      <div className="relative flex items-center gap-2 border border-gray-300 rounded-lg px-2 h-9 bg-white">
        <span className="text-xs text-gray-500">#</span>
        <input
          type="text"
          value={value ? value.replace('#', '') : ''}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
            if (val.length <= 6) onChange(val ? '#' + val : '');
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-xs text-gray-700 placeholder:text-gray-400 min-w-0"
          maxLength={6}
        />
        <button
          type="button"
          onClick={onColorPickerClick}
          className="w-6 h-6 rounded cursor-pointer border-0 hover:opacity-90 transition-opacity flex-shrink-0"
          style={{
            background: value && value !== '#'
              ? value
              : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
          }}
          aria-label="Choose color"
        />
      </div>
      {error && (
        <ErrorText className="text-error text-xs">
          {error}
        </ErrorText>
      )}
    </div>
  );
};

interface AppStylingProps {
  formData: HomeScreenFormData;
  setValue: UseFormSetValue<HomeScreenFormData>;
  errors: FieldErrors<HomeScreenFormData>;
  control: Control<HomeScreenFormData>;
}

const AppStyling: React.FC<AppStylingProps> = ({ formData, setValue, errors, control }) => {
  const [showColorPickers, setShowColorPickers] = useState<{[key: string]: boolean}>({});

  const coinOptions = [
    { label: 'Fintech', value: 'FINTECH' },
    { label: 'Protect', value: 'PROTECT' },
    { label: 'UGC', value: 'UGC' },
  ];

  return (
    <>
      <div className="bg-white shadow-sm rounded-md overflow-hidden h-fit">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">App styling</h2>
        </div>

        <div className="p-6 space-y-5 overflow-x-hidden max-w-full">
          {/* Searchbar Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Searchbar</h3>

            <div className="grid grid-cols-2 gap-3">
              <ColorInput
                label="Icon Colour"
                value={formData.searchIconColor || ''}
                onChange={(value) => setValue('searchIconColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, searchbarIcon: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.searchIconColor?.message}
              />

              <ColorInput
                label="Text Colour"
                value={formData.searchTextColor || ''}
                onChange={(value) => setValue('searchTextColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, searchbarText: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.searchTextColor?.message}
              />

              <ColorInput
                label="Background Colour"
                value={formData.searchBackgroundColor || ''}
                onChange={(value) => setValue('searchBackgroundColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, searchbarBackground: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.searchBackgroundColor?.message}
              />

              <ColorInput
                label="Foreground Colour"
                value={formData.searchForegroundColor || ''}
                onChange={(value) => setValue('searchForegroundColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, searchbarForeground: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.searchForegroundColor?.message}
              />
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Notification Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Notification</h3>

            <div className="grid grid-cols-2 gap-3">
              <ColorInput
                label="Icon Colour"
                value={formData.notificationIconColor || ''}
                onChange={(value) => setValue('notificationIconColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, notificationIcon: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.notificationIconColor?.message}
              />

              <ColorInput
                label="Icon dot Colour"
                value={formData.notificationIconDotColor || ''}
                onChange={(value) => setValue('notificationIconDotColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, notificationIconDot: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.notificationIconDotColor?.message}
              />
            </div>

            <ColorInput
              label="Background Colour"
              value={formData.notificationBackgroundColor || ''}
              onChange={(value) => setValue('notificationBackgroundColor', value)}
              onColorPickerClick={() => setShowColorPickers({...showColorPickers, notificationBackground: true})}
              placeholder="Enter/Select colour hex code"
              error={errors.notificationBackgroundColor?.message}
            />
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Coins Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Coins</h3>

            <div className="space-y-2">
              <Label className="text-xs font-light text-gray-700" required={true}>Change coin</Label>
              <Controller
                name="coinType"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={field.value}
                    onChange={field.onChange}
                    options={coinOptions}
                    placeholder="ie. Fintech/Protect/UGC"
                    inputSize="md"
                    containerClassName="w-full"
                  />
                )}
              />
              {errors.coinType && (
                <ErrorText className="text-red-500 text-xs">
                  {errors.coinType.message}
                </ErrorText>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ColorInput
                label="Coin Badge Colour"
                value={formData.coinBadgeColor || ''}
                onChange={(value) => setValue('coinBadgeColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, coinsBadge: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.coinBadgeColor?.message}
              />

              <ColorInput
                label="Background Colour"
                value={formData.coinBackgroundColor || ''}
                onChange={(value) => setValue('coinBackgroundColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, coinsBackground: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.coinBackgroundColor?.message}
              />
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Location Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Location</h3>

            <ColorInput
              label="Icon Colour"
              value={formData.locationIconColor || ''}
              onChange={(value) => setValue('locationIconColor', value)}
              onColorPickerClick={() => setShowColorPickers({...showColorPickers, locationIcon: true})}
              placeholder="Enter/Select colour hex code"
              error={errors.locationIconColor?.message}
            />

            <div className="grid grid-cols-2 gap-3">
              <ColorInput
                label="Location type Colour"
                value={formData.locationTypeColor || ''}
                onChange={(value) => setValue('locationTypeColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, locationType: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.locationTypeColor?.message}
              />

              <ColorInput
                label="Address Colour"
                value={formData.locationAddressColor || ''}
                onChange={(value) => setValue('locationAddressColor', value)}
                onColorPickerClick={() => setShowColorPickers({...showColorPickers, locationAddress: true})}
                placeholder="Enter/Select colour hex code"
                error={errors.locationAddressColor?.message}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Dialogs */}
      {showColorPickers.searchbarIcon && (
        <ColorPickerDialog
          isOpen={showColorPickers.searchbarIcon}
          onClose={() => setShowColorPickers({...showColorPickers, searchbarIcon: false})}
          onSave={(colorData) => {
            setValue('searchIconColor', colorData.color);
            setShowColorPickers({...showColorPickers, searchbarIcon: false});
          }}
          initialColor={formData.searchIconColor || '#FFFFFF'}
          title="Select Searchbar Icon Color"
        />
      )}

      {showColorPickers.searchbarText && (
        <ColorPickerDialog
          isOpen={showColorPickers.searchbarText}
          onClose={() => setShowColorPickers({...showColorPickers, searchbarText: false})}
          onSave={(colorData) => {
            setValue('searchTextColor', colorData.color);
            setShowColorPickers({...showColorPickers, searchbarText: false});
          }}
          initialColor={formData.searchTextColor || '#FFFFFF'}
          title="Select Searchbar Text Color"
        />
      )}

      {showColorPickers.searchbarBackground && (
        <ColorPickerDialog
          isOpen={showColorPickers.searchbarBackground}
          onClose={() => setShowColorPickers({...showColorPickers, searchbarBackground: false})}
          onSave={(colorData) => {
            setValue('searchBackgroundColor', colorData.color);
            setShowColorPickers({...showColorPickers, searchbarBackground: false});
          }}
          initialColor={formData.searchBackgroundColor || '#FFFFFF'}
          title="Select Searchbar Background Color"
        />
      )}

      {showColorPickers.searchbarForeground && (
        <ColorPickerDialog
          isOpen={showColorPickers.searchbarForeground}
          onClose={() => setShowColorPickers({...showColorPickers, searchbarForeground: false})}
          onSave={(colorData) => {
            setValue('searchForegroundColor', colorData.color);
            setShowColorPickers({...showColorPickers, searchbarForeground: false});
          }}
          initialColor={formData.searchForegroundColor || '#FFFFFF'}
          title="Select Searchbar Foreground Color"
        />
      )}

      {showColorPickers.notificationIcon && (
        <ColorPickerDialog
          isOpen={showColorPickers.notificationIcon}
          onClose={() => setShowColorPickers({...showColorPickers, notificationIcon: false})}
          onSave={(colorData) => {
            setValue('notificationIconColor', colorData.color);
            setShowColorPickers({...showColorPickers, notificationIcon: false});
          }}
          initialColor={formData.notificationIconColor || '#FFFFFF'}
          title="Select Notification Icon Color"
        />
      )}

      {showColorPickers.notificationIconDot && (
        <ColorPickerDialog
          isOpen={showColorPickers.notificationIconDot}
          onClose={() => setShowColorPickers({...showColorPickers, notificationIconDot: false})}
          onSave={(colorData) => {
            setValue('notificationIconDotColor', colorData.color);
            setShowColorPickers({...showColorPickers, notificationIconDot: false});
          }}
          initialColor={formData.notificationIconDotColor || '#FFFFFF'}
          title="Select Notification Icon Dot Color"
        />
      )}

      {showColorPickers.notificationBackground && (
        <ColorPickerDialog
          isOpen={showColorPickers.notificationBackground}
          onClose={() => setShowColorPickers({...showColorPickers, notificationBackground: false})}
          onSave={(colorData) => {
            setValue('notificationBackgroundColor', colorData.color);
            setShowColorPickers({...showColorPickers, notificationBackground: false});
          }}
          initialColor={formData.notificationBackgroundColor || '#FFFFFF'}
          title="Select Notification Background Color"
        />
      )}

      {showColorPickers.coinsBadge && (
        <ColorPickerDialog
          isOpen={showColorPickers.coinsBadge}
          onClose={() => setShowColorPickers({...showColorPickers, coinsBadge: false})}
          onSave={(colorData) => {
            setValue('coinBadgeColor', colorData.color);
            setShowColorPickers({...showColorPickers, coinsBadge: false});
          }}
          initialColor={formData.coinBadgeColor || '#FFFFFF'}
          title="Select Coins Badge Color"
        />
      )}

      {showColorPickers.coinsBackground && (
        <ColorPickerDialog
          isOpen={showColorPickers.coinsBackground}
          onClose={() => setShowColorPickers({...showColorPickers, coinsBackground: false})}
          onSave={(colorData) => {
            setValue('coinBackgroundColor', colorData.color);
            setShowColorPickers({...showColorPickers, coinsBackground: false});
          }}
          initialColor={formData.coinBackgroundColor || '#FFFFFF'}
          title="Select Coins Background Color"
        />
      )}

      {showColorPickers.locationIcon && (
        <ColorPickerDialog
          isOpen={showColorPickers.locationIcon}
          onClose={() => setShowColorPickers({...showColorPickers, locationIcon: false})}
          onSave={(colorData) => {
            setValue('locationIconColor', colorData.color);
            setShowColorPickers({...showColorPickers, locationIcon: false});
          }}
          initialColor={formData.locationIconColor || '#FFFFFF'}
          title="Select Location Icon Color"
        />
      )}

      {showColorPickers.locationType && (
        <ColorPickerDialog
          isOpen={showColorPickers.locationType}
          onClose={() => setShowColorPickers({...showColorPickers, locationType: false})}
          onSave={(colorData) => {
            setValue('locationTypeColor', colorData.color);
            setShowColorPickers({...showColorPickers, locationType: false});
          }}
          initialColor={formData.locationTypeColor || '#FFFFFF'}
          title="Select Location Type Color"
        />
      )}

      {showColorPickers.locationAddress && (
        <ColorPickerDialog
          isOpen={showColorPickers.locationAddress}
          onClose={() => setShowColorPickers({...showColorPickers, locationAddress: false})}
          onSave={(colorData) => {
            setValue('locationAddressColor', colorData.color);
            setShowColorPickers({...showColorPickers, locationAddress: false});
          }}
          initialColor={formData.locationAddressColor || '#FFFFFF'}
          title="Select Location Address Color"
        />
      )}
    </>
  );
};

export default AppStyling;
