import React from 'react';
import { Button } from '@/components/base/Button';
import ColorPickerDialog from '@/components/base/ColorPickerDialog';
import { SectionMode } from '../../schemas/section.schema';

interface FormActionsSectionProps {
  isSubmitting: boolean;
  mode: SectionMode;
  onCancel?: () => void;
  formData: any;
  setValue: (name: string, value: any) => void;
  showTitleColorPicker: boolean;
  setShowTitleColorPicker: (show: boolean) => void;
  showSubtitleColorPicker: boolean;
  setShowSubtitleColorPicker: (show: boolean) => void;
  showBackgroundColorPicker: boolean;
  setShowBackgroundColorPicker: (show: boolean) => void;
}

const FormActionsSection: React.FC<FormActionsSectionProps> = ({
  isSubmitting,
  mode,
  onCancel,
  formData,
  setValue,
  showTitleColorPicker,
  setShowTitleColorPicker,
  showSubtitleColorPicker,
  setShowSubtitleColorPicker,
  showBackgroundColorPicker,
  setShowBackgroundColorPicker,
}) => {
  return (
    <>
      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4 pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-12 py-2 h-[44px]"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="filled"
          className="px-12 py-2 h-[44px]"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </div>
          ) : (
            mode === 'create' ? 'Create' : 'Update'
          )}
        </Button>
      </div>

      {/* Color Picker Dialogs */}
      {showTitleColorPicker && (
        <ColorPickerDialog
          isOpen={showTitleColorPicker}
          onClose={() => setShowTitleColorPicker(false)}
          onSave={(colorData) => {
            setValue('titleDecorations.color', colorData.color);
            setShowTitleColorPicker(false);
          }}
          initialColor={formData.titleDecorations.color}
          title="Select Title Color"
        />
      )}

      {showSubtitleColorPicker && (
        <ColorPickerDialog
          isOpen={showSubtitleColorPicker}
          onClose={() => setShowSubtitleColorPicker(false)}
          onSave={(colorData) => {
            setValue('subtitleDecorations.color', colorData.color);
            setShowSubtitleColorPicker(false);
          }}
          initialColor={formData.subtitleDecorations.color}
          title="Select Subtitle Color"
        />
      )}

      {showBackgroundColorPicker && (
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
      )}
    </>
  );
};

export default FormActionsSection;