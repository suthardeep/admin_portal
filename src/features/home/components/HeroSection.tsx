import React, { useState } from 'react';
import { Controller, UseFormSetValue, FieldErrors, Control } from 'react-hook-form';
import { Label } from '@/components/base/Label';
import { ErrorText } from '@/components/base/ErrorText';
import { MediaPicker } from '@/components/media-picker/MediaPicker';
import ColorPickerDialog from '@/components/base/ColorPickerDialog';
import Switch from '@/components/base/Switch';
import { HomeScreenFormData } from '../schemas/home.schema';

interface HeroSectionProps {
  formData: HomeScreenFormData;
  setValue: UseFormSetValue<HomeScreenFormData>;
  errors: FieldErrors<HomeScreenFormData>;
  control: Control<HomeScreenFormData>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ formData, setValue, errors, control }) => {
  const [showColorPickers, setShowColorPickers] = useState<{[key: string]: boolean}>({});
  const [showGradientColorPickers, setShowGradientColorPickers] = useState<{[key: number]: boolean}>({});

  return (
    <div className="bg-base-100 shadow-sm bg-white rounded-md">
      <div className="p-4 border-b border-body-content/20">
        <h2 className="text-base font-semibold text-base-content">Hero Section</h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Upload Hero Background Image */}
        <div className="space-y-2">
          <Label className="text-base font-light" required={true}>Upload Hero Background Image</Label>
          <div className="w-full">
            <Controller
              name="heroStyling.heroImage"
              control={control}
              render={({ field }) => (
                <MediaPicker
                  value={field.value ? [{ s3Url: field.value, id: 'hero-bg' }] : []}
                  ids={[]}
                  urls={[]}
                  label=""
                  onChange={(files) => {
                    const url = files?.[0]?.s3Url || '';
                    field.onChange(url);
                    // Also set backgroundImageUrl to the same value
                    setValue('heroStyling.backgroundImageUrl', url);
                  }}
                  maxFiles={1}
                  iconType="upload"
                  dragDropText="Drag & Drop or Choose file to upload"
                  sizeConfig={{ height: "h-32", width: "w-full" }}
                  itemSizeConfig={{ height: "h-32", aspectRatio: "auto" }}
                  scroll="none"
                  className="w-full"
                  textConfig={{ size: "md", show: true }}
                  variant="default"
                />
              )}
            />
          </div>
          {errors.heroStyling?.heroImage && (
            <ErrorText className="text-red-500 text-xs">
              {errors.heroStyling.heroImage.message}
            </ErrorText>
          )}
        </div>

        {/* Primary and Secondary Colour */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-base font-light" required={true}>Primary Colour</Label>
            <div className="relative flex items-center gap-2 border border-input-border rounded-lg px-2 h-10 bg-white">
              <span className="text-sm text-disabled-content">#</span>
              <input
                type="text"
                value={formData.heroStyling?.primaryColor?.replace('#', '') || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                  if (val.length <= 6) setValue('heroStyling.primaryColor', val ? '#' + val : '');
                }}
                placeholder="Enter/Select colour hex code"
                className="flex-1 bg-transparent outline-none text-sm text-body-content placeholder:text-disabled-content"
                maxLength={6}
              />
              <button
                type="button"
                onClick={() => setShowColorPickers({...showColorPickers, primary: true})}
                className="w-7 h-7 rounded cursor-pointer border-0 hover:opacity-90 transition-opacity flex-shrink-0"
                style={{
                  background: formData.heroStyling?.primaryColor && formData.heroStyling.primaryColor !== '#' && formData.heroStyling.primaryColor !== '#FFFFFF'
                    ? formData.heroStyling.primaryColor
                    : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
                }}
                aria-label="Choose color"
              />
            </div>
            {errors.heroStyling?.primaryColor && (
              <ErrorText className="text-red-500 text-xs">
                {errors.heroStyling.primaryColor.message}
              </ErrorText>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-light" required={true}>Secondary Colour</Label>
            <div className="relative flex items-center gap-2 border border-input-border rounded-lg px-2 h-10 bg-white">
              <span className="text-sm text-disabled-content">#</span>
              <input
                type="text"
                value={formData.heroStyling?.secondaryColor?.replace('#', '') || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                  if (val.length <= 6) setValue('heroStyling.secondaryColor', val ? '#' + val : '');
                }}
                placeholder="Enter/Select colour hex code"
                className="flex-1 bg-transparent outline-none text-sm text-body-content placeholder:text-disabled-content"
                maxLength={6}
              />
              <button
                type="button"
                onClick={() => setShowColorPickers({...showColorPickers, secondary: true})}
                className="w-7 h-7 rounded cursor-pointer border-0 hover:opacity-90 transition-opacity flex-shrink-0"
                style={{
                  background: formData.heroStyling?.secondaryColor && formData.heroStyling.secondaryColor !== '#' && formData.heroStyling.secondaryColor !== '#FFFFFF'
                    ? formData.heroStyling.secondaryColor
                    : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
                }}
                aria-label="Choose color"
              />
            </div>
            {errors.heroStyling?.secondaryColor && (
              <ErrorText className="text-red-500 text-xs">
                {errors.heroStyling.secondaryColor.message}
              </ErrorText>
            )}
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label className="text-base font-light" required={true}>Background Colour</Label>
          <div className="relative flex items-center gap-2 border border-input-border rounded-lg px-2 h-10 bg-white">
            <span className="text-sm text-disabled-content">#</span>
            <input
              type="text"
              value={formData.heroStyling?.backgroundColor?.replace('#', '') || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                if (val.length <= 6) setValue('heroStyling.backgroundColor', val ? '#' + val : '');
              }}
              placeholder="Enter/Select colour hex code"
              className="flex-1 bg-transparent outline-none text-sm text-body-content placeholder:text-disabled-content"
              maxLength={6}
            />
            <button
              type="button"
              onClick={() => setShowColorPickers({...showColorPickers, background: true})}
              className="w-7 h-7 rounded cursor-pointer border-0 hover:opacity-90 transition-opacity flex-shrink-0"
              style={{
                background: formData.heroStyling?.backgroundColor && formData.heroStyling.backgroundColor !== '#' && formData.heroStyling.backgroundColor !== '#FFFFFF'
                  ? formData.heroStyling.backgroundColor
                  : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
              }}
              aria-label="Choose color"
            />
          </div>
          {errors.heroStyling?.backgroundColor && (
            <ErrorText className="text-red-500 text-xs">
              {errors.heroStyling.backgroundColor.message}
            </ErrorText>
          )}
        </div>

        {/* If Background has Gradient colour - Switch */}
        <div className="flex items-center gap-2">
          <Controller
            name="heroStyling.hasGradient"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked && !(formData.heroStyling?.gradientColors?.length)) {
                    setValue('heroStyling.gradientColors', [
                      { color: '', opacity: 90 }
                    ]);
                  }
                  if (!checked) {
                    setValue('heroStyling.gradientColors', []);
                  }
                }}
                size="sm"
              />
            )}
          />
          <p className="text-base font-light text-base-content">
            If background has gradient colour
          </p>
        </div>

        {formData.heroStyling?.hasGradient && (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {/* First gradient input - parent with Plus button */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 relative flex items-center gap-2 border border-input-border rounded-lg px-2 h-10 bg-white">
                {/* Color Picker Button at START */}
                <button
                  type="button"
                  onClick={() => setShowGradientColorPickers({...showGradientColorPickers, 0: true})}
                  className="w-7 h-7 rounded cursor-pointer border-0 hover:opacity-90 transition-opacity shrink-0"
                  style={{
                    background: formData.heroStyling?.gradientColors?.[0]?.color && formData.heroStyling.gradientColors[0].color !== '#' && formData.heroStyling.gradientColors[0].color !== '#FFFFFF'
                      ? formData.heroStyling.gradientColors[0].color
                      : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
                  }}
                  aria-label="Choose color"
                />

                {/* Hex Input in MIDDLE */}
                <span className="text-sm text-disabled-content">#</span>
                <input
                  type="text"
                  value={formData.heroStyling?.gradientColors?.[0]?.color?.replace('#', '') || ''}
                  onChange={(e) => {
                    const updated = [...(formData.heroStyling?.gradientColors || [{ color: '#FFFFFF', opacity: 90 }])];
                    const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                    if (val.length <= 6) updated[0].color = '#' + val;
                    setValue('heroStyling.gradientColors', updated);
                  }}
                  placeholder="HEX Code"
                  className="flex-1 bg-transparent outline-none text-sm text-body-content placeholder:text-disabled-content"
                  maxLength={6}
                />

                {/* Opacity at END */}
                <input
                  type="number"
                  value={formData.heroStyling?.gradientColors?.[0]?.opacity || ''}
                  onChange={(e) => {
                    const updated = [...(formData.heroStyling?.gradientColors || [{ color: '#FFFFFF', opacity: 90 }])];
                    const value = e.target.value === '' ? 90 : Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                    updated[0].opacity = value;
                    setValue('heroStyling.gradientColors', updated);
                  }}
                  min="0"
                  max="100"
                  placeholder="Opacity"
                  className="w-20 bg-transparent outline-none text-right text-sm text-body-content placeholder:text-disabled-content"
                />
              </div>

              {/* Plus Button - to add child gradient */}
              <button
                type="button"
                onClick={() => {
                  const updated = [...(formData.heroStyling?.gradientColors || [{ color: '', opacity: 90 }]), { color: '', opacity: 90 }];
                  setValue('heroStyling.gradientColors', updated);
                }}
                className="flex items-center justify-center text-base-content hover:text-base-content/80 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                </svg>
              </button>
            </div>

            {/* Child gradient inputs - with minus button on left side */}
            {(formData.heroStyling?.gradientColors?.length || 0) > 1 && (
              <div className="space-y-3">
                {(formData.heroStyling?.gradientColors || []).slice(1).map((gradient: any, index: number) => {
                  const actualIndex = index + 1;
                  return (
                    <div key={actualIndex} className="flex items-center gap-3 w-full">
                      {/* Minus Button on LEFT */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (formData.heroStyling?.gradientColors || []).filter((_: any, i: number) => i !== actualIndex);
                          setValue('heroStyling.gradientColors', updated);
                        }}
                        className="flex items-center justify-center text-base-content hover:text-base-content/80 flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                        </svg>
                      </button>

                      <div className="flex-1 relative flex items-center gap-2 border border-input-border rounded-lg px-2 h-10 bg-white">
                        {/* Color Picker Button at START */}
                        <button
                          type="button"
                          onClick={() => setShowGradientColorPickers({...showGradientColorPickers, [actualIndex]: true})}
                          className="w-7 h-7 rounded cursor-pointer border-0 hover:opacity-90 transition-opacity shrink-0"
                          style={{
                            background: gradient.color && gradient.color !== '#' && gradient.color !== '#FFFFFF'
                              ? gradient.color
                              : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
                          }}
                          aria-label="Choose color"
                        />

                        {/* Hex Input in MIDDLE */}
                        <span className="text-sm text-disabled-content">#</span>
                        <input
                          type="text"
                          value={gradient.color.replace('#', '')}
                          onChange={(e) => {
                            const updated = [...(formData.heroStyling?.gradientColors || [])];
                            const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                            if (val.length <= 6) updated[actualIndex].color = '#' + val;
                            setValue('heroStyling.gradientColors', updated);
                          }}
                          placeholder="HEX Code"
                          className="flex-1 bg-transparent outline-none text-sm text-body-content placeholder:text-disabled-content"
                          maxLength={6}
                        />

                        {/* Opacity at END */}
                        <input
                          type="number"
                          value={gradient.opacity || ''}
                          onChange={(e) => {
                            const updated = [...(formData.heroStyling?.gradientColors || [])];
                            const value = e.target.value === '' ? 90 : Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                            updated[actualIndex].opacity = value;
                            setValue('heroStyling.gradientColors', updated);
                          }}
                          min="0"
                          max="100"
                          placeholder="Opacity"
                          className="w-20 bg-transparent outline-none text-right text-sm text-body-content placeholder:text-disabled-content"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Gradient Colors Error */}
        {formData.heroStyling?.hasGradient && errors.heroStyling?.gradientColors && (
          <ErrorText className="text-red-500 text-xs">
            {typeof errors.heroStyling.gradientColors === 'object' && 'message' in errors.heroStyling.gradientColors
              ? (errors.heroStyling.gradientColors as any).message
              : 'Gradient colors are required'}
          </ErrorText>
        )}
      </div>

      {/* Color Picker Dialogs */}
      {showColorPickers.primary && (
        <ColorPickerDialog
          isOpen={showColorPickers.primary}
          onClose={() => setShowColorPickers({...showColorPickers, primary: false})}
          onSave={(colorData) => {
            setValue('heroStyling.primaryColor', colorData.color);
            setShowColorPickers({...showColorPickers, primary: false});
          }}
          initialColor={formData.heroStyling?.primaryColor || '#FFFFFF'}
          title="Select Primary Color"
        />
      )}

      {showColorPickers.secondary && (
        <ColorPickerDialog
          isOpen={showColorPickers.secondary}
          onClose={() => setShowColorPickers({...showColorPickers, secondary: false})}
          onSave={(colorData) => {
            setValue('heroStyling.secondaryColor', colorData.color);
            setShowColorPickers({...showColorPickers, secondary: false});
          }}
          initialColor={formData.heroStyling?.secondaryColor || '#FFFFFF'}
          title="Select Secondary Color"
        />
      )}

      {showColorPickers.background && (
        <ColorPickerDialog
          isOpen={showColorPickers.background}
          onClose={() => setShowColorPickers({...showColorPickers, background: false})}
          onSave={(colorData) => {
            setValue('heroStyling.backgroundColor', colorData.color);
            setShowColorPickers({...showColorPickers, background: false});
          }}
          initialColor={formData.heroStyling?.backgroundColor || '#FFFFFF'}
          title="Select Background Color"
        />
      )}

      {/* Gradient Color Pickers */}
      {Object.entries(showGradientColorPickers).map(([index, isOpen]) =>
        isOpen ? (
          <ColorPickerDialog
            key={index}
            isOpen={isOpen}
            onClose={() => setShowGradientColorPickers({...showGradientColorPickers, [index]: false})}
            onSave={(colorData) => {
              const updated = [...(formData.heroStyling?.gradientColors || [])];
              const idx = parseInt(index);
              if (updated[idx]) {
                updated[idx].color = colorData.color;
                setValue('heroStyling.gradientColors', updated);
              }
              setShowGradientColorPickers({...showGradientColorPickers, [index]: false});
            }}
            initialColor={formData.heroStyling?.gradientColors?.[parseInt(index)]?.color || '#FFFFFF'}
            title="Select Gradient Color"
          />
        ) : null
      )}
    </div>
  );
};

export default HeroSection;