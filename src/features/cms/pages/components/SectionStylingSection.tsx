import React from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Icon } from '@/components/base/Icon';
import Switch from '@/components/base/Switch';
import { MediaPicker } from '@/components/media-picker/MediaPicker';
import ColorPickerDialog from '@/components/base/ColorPickerDialog';
import ErrorText from '@/components/base/ErrorText';

interface SectionStylingSectionProps {
  form: any;
  showBackgroundColorPicker: boolean;
  setShowBackgroundColorPicker: (show: boolean) => void;
}

const SectionStylingSection: React.FC<SectionStylingSectionProps> = ({
  form,
  showBackgroundColorPicker,
  setShowBackgroundColorPicker,
}) => {
  const { watch, setValue, formState: { errors } } = form;
  const formData = watch();
  // State for gradient color pickers
  const [showGradientColorPickers, setShowGradientColorPickers] = React.useState<{[key: number]: boolean}>({});

  // Initialize gradientColors if it doesn't exist
  React.useEffect(() => {
    if (formData.sectionStyling.hasGradient && (!formData.sectionStyling.gradientColors || formData.sectionStyling.gradientColors.length === 0)) {
      setValue('sectionStyling.gradientColors', [
        { color: '#FF5722', opacity: 100 },
        { color: '#FFC107', opacity: 100 },
      ]);
    }
  }, [formData.sectionStyling.hasGradient, formData.sectionStyling.gradientColors, setValue]);

  return (
    <div className="bg-base-100 shadow-sm bg-white rounded-md">
      <div className="p-4 border-b border-body-content/20">
        <h2 className="text-base font-semibold text-base-content">Section styling</h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Use Transparent Background - Switch */}
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.sectionStyling.useTransparentBackground}
            onCheckedChange={(checked) => setValue('sectionStyling.useTransparentBackground', checked)}
            size="sm"
          />
          <span className={`text-[1rem] font-light ${
            formData.sectionStyling.useTransparentBackground ? 'text-primary' : 'text-base-content'
          }`}>
            Use Transparent Background
          </span>
        </div>

        {/* All fields below - Show only when transparent background is OFF */}
        {!formData.sectionStyling.useTransparentBackground && (
          <>
            {/* Background Colour */}
            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>Background Colour</Label>
              <div className="relative flex items-center gap-2 border border-input-border rounded-lg px-2 h-10 bg-white">
               
                <span className="text-sm text-disabled-content">#</span>
                <input
                  type="text"
                  value={formData.sectionStyling.backgroundColor.replace('#', '')}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                    if (val.length <= 6) setValue('sectionStyling.backgroundColor', '#' + val);
                  }}
                  placeholder="Enter/Select colour hex code"
                  className="flex-1 bg-transparent outline-none text-sm text-body-content placeholder:text-disabled-content "
                  maxLength={6}
                />

                 <button
                  type="button"
                  onClick={() => setShowBackgroundColorPicker(true)}
                  className="w-7 h-7 rounded cursor-pointer border-0 hover:opacity-90 transition-opacity flex-shrink-0"
                  style={{
                    background: formData.sectionStyling.backgroundColor && formData.sectionStyling.backgroundColor !== '#' && formData.sectionStyling.backgroundColor !== '#FFFFFF'
                      ? formData.sectionStyling.backgroundColor
                      : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
                  }}
                  aria-label="Choose color"
                />
              </div>
            </div>
            {errors?.sectionStyling?.backgroundColor && (
              <ErrorText className="text-error text-xs mt-1">{errors.sectionStyling.backgroundColor.message}</ErrorText>
            )}

            {/* If Background has Gradient colour - Switch */}
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.sectionStyling.hasGradient}
                onCheckedChange={(checked) => setValue('sectionStyling.hasGradient', checked)}
                size="sm"
              />
              <p className={`text-base font-light ${
                formData.sectionStyling.hasGradient ? 'text-primary' : 'text-base-content'
              }`}>
                If background has gradient colour
              </p>
            </div>

            {/* Gradient Colors - Show only if hasGradient is true */}
            {formData.sectionStyling.hasGradient && formData.sectionStyling.gradientColors?.length > 0 && (
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
                        background: formData.sectionStyling.gradientColors[0].color && formData.sectionStyling.gradientColors[0].color !== '#' && formData.sectionStyling.gradientColors[0].color !== '#FFFFFF'
                          ? formData.sectionStyling.gradientColors[0].color
                          : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
                      }}
                      aria-label="Choose color"
                    />

                    {/* Hex Input in MIDDLE */}
                    <span className="text-sm text-disabled-content">#</span>
                    <input
                      type="text"
                      value={formData.sectionStyling.gradientColors[0].color.replace('#', '')}
                      onChange={(e) => {
                        const updated = [...formData.sectionStyling.gradientColors];
                        const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                        if (val.length <= 6) updated[0].color = '#' + val;
                        setValue('sectionStyling.gradientColors', updated);
                      }}
                      placeholder="HEX Code"
                      className="flex-1 bg-transparent outline-none text-sm text-body-content placeholder:text-disabled-content"
                      maxLength={6}
                    />

                    {/* Opacity at END - with proper placeholder handling */}
<input
  type="number"
  value={formData.sectionStyling.gradientColors[0].opacity || ''}
  onChange={(e) => {
    const updated = [...formData.sectionStyling.gradientColors];
    const value = e.target.value === '' ? '' : Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    updated[0].opacity = value;
    setValue('sectionStyling.gradientColors', updated);
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
                      const updated = [...formData.sectionStyling.gradientColors, { color: '#FFFFFF', opacity: 90 }];
                      setValue('sectionStyling.gradientColors', updated);
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
                {formData.sectionStyling.gradientColors.length > 1 && (
                  <div className="space-y-3">
                    {formData.sectionStyling.gradientColors.slice(1).map((gradient: any, index: number) => {
                      const actualIndex = index + 1;
                      return (
                        <div key={actualIndex} className="flex items-center gap-3 w-full">
                          {/* Minus Button on LEFT - same position as Plus button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.sectionStyling.gradientColors.filter((_: any, i: number) => i !== actualIndex);
                              setValue('sectionStyling.gradientColors', updated);
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
                                const updated = [...formData.sectionStyling.gradientColors];
                                const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                                if (val.length <= 6) updated[actualIndex].color = '#' + val;
                                setValue('sectionStyling.gradientColors', updated);
                              }}
                              placeholder="HEX Code"
                              className="flex-1 bg-transparent outline-none text-sm text-body-content placeholder:text-disabled-content"
                              maxLength={6}
                            />

                            {/* Opacity at END - with proper placeholder handling */}
<input
  type="number"
  value={gradient.opacity || ''}
  onChange={(e) => {
    const updated = [...formData.sectionStyling.gradientColors];
    const value = e.target.value === '' ? '' : Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    updated[actualIndex].opacity = value;
    setValue('sectionStyling.gradientColors', updated);
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
            {errors?.sectionStyling?.gradientColors && (
              <ErrorText className="text-error text-xs mt-1">{errors.sectionStyling.gradientColors.message}</ErrorText>
            )}

            {/* Roundness */}
            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>Roundness</Label>
              <Input
                type="number"
                value={formData.sectionStyling.roundness}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue('sectionStyling.roundness', parseInt(e.target.value) || 0)
                }
                placeholder="Enter roundness"
                rightElement={
                  <Icon name="SquareRoundCorner" className="w-4 h-4 text-base-content/50" />
                }
                inputSize="md"
                label=""
                required={false}
              />
              {errors?.sectionStyling?.roundness && (
                <ErrorText className="text-error text-xs mt-1">{errors.sectionStyling.roundness.message}</ErrorText>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-light" required={true}>Upload Background Image</Label>
              <div className="w-full">
                <MediaPicker
                  value={formData.sectionStyling.backgroundImageUrl ? [{ s3Url: formData.sectionStyling.backgroundImageUrl, id: 'bg-img' }] : []}
                  ids={[]}
                  urls={[]}
                  label=""
                  onChange={(files) => {
                    console.log('📸 MediaPicker onChange called:', files);
                    console.log('📸 First file:', files?.[0]);
                    console.log('📸 s3Url:', files?.[0]?.s3Url);
                    const url = files?.[0]?.s3Url || '';
                    console.log('📸 Final URL to set:', url);
                    setValue('sectionStyling.backgroundImageUrl', url);
                    console.log('📸 After setValue - form value:', formData.sectionStyling.backgroundImageUrl);
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
              </div>
              {errors?.sectionStyling?.backgroundImageUrl && (
                <ErrorText className="text-error text-xs mt-1">{errors.sectionStyling.backgroundImageUrl.message}</ErrorText>
              )}
            </div>
          </>
        )}
      </div>

      {/* Background Color Picker Dialog */}
      <ColorPickerDialog
        isOpen={showBackgroundColorPicker}
        onClose={() => setShowBackgroundColorPicker(false)}
        onSave={(colorData) => {
          setValue('sectionStyling.backgroundColor', colorData.color);
          setShowBackgroundColorPicker(false);
        }}
        initialColor={formData.sectionStyling.backgroundColor}
        title="Select Background Color"
      />

      {/* Gradient Color Picker Dialogs */}
      {Object.entries(showGradientColorPickers).map(([index, isOpen]) => {
        if (!isOpen) return null;
        const gradientIndex = parseInt(index);
        const gradient = formData.sectionStyling.gradientColors[gradientIndex];
        
        return (
          <ColorPickerDialog
            key={gradientIndex}
            isOpen={isOpen}
            onClose={() => setShowGradientColorPickers({...showGradientColorPickers, [gradientIndex]: false})}
            onSave={(colorData) => {
              const updated = [...formData.sectionStyling.gradientColors];
              updated[gradientIndex].color = colorData.color;
              setValue('sectionStyling.gradientColors', updated);
              setShowGradientColorPickers({...showGradientColorPickers, [gradientIndex]: false});
            }}
            initialColor={gradient?.color || '#FFFFFF'}
            title="Select Gradient Color"
          />
        );
      })}
    </div>
  );
};

export default SectionStylingSection;