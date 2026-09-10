// components/SectionForm.tsx
// FINAL VERSION - READY TO USE

import React from 'react';
import { useSection } from '../../hooks/useSection';
import { SectionMode } from '../../schemas/section.schema';
import BasicInfoSection from './BasicInfoSection';
import DisplaySettingsSection from './DisplaySettingsSection';
import SectionStylingSection from './SectionStylingSection';
import FormActionsSection from './FormActionsSection';

interface SectionFormProps {
  mode: SectionMode;
  sectionId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  className?: string;
}

const SectionForm: React.FC<SectionFormProps> = ({
  mode,
  sectionId,
  onCancel,
  onSuccess,
  className = '',
}) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    isLoadingDetails,
  } = useSection({ mode, sectionId, onSuccess });

  const { watch, setValue, formState: { errors } } = form;
  const formData = watch();

  // Fix roundness if it's a string (one-time migration)
  React.useEffect(() => {
    if (typeof formData.sectionStyling?.roundness === 'string') {
      setValue('sectionStyling.roundness', parseInt(formData.sectionStyling.roundness) || 12);
    }
  }, [formData.sectionStyling?.roundness, setValue]);

  const [showTitleColorPicker, setShowTitleColorPicker] = React.useState(false);
  const [showSubtitleColorPicker, setShowSubtitleColorPicker] = React.useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = React.useState(false);

  const [showTitleAlignmentMenu, setShowTitleAlignmentMenu] = React.useState(false);
  const [showTitleFontSizeMenu, setShowTitleFontSizeMenu] = React.useState(false);
  const [showTitleWeightMenu, setShowTitleWeightMenu] = React.useState(false);
  const [showSubtitleAlignmentMenu, setShowSubtitleAlignmentMenu] = React.useState(false);
  const [showSubtitleFontSizeMenu, setShowSubtitleFontSizeMenu] = React.useState(false);
  const [showSubtitleStyleMenu, setShowSubtitleStyleMenu] = React.useState(false);

  const titleAlignmentRef = React.useRef<HTMLDivElement>(null);
  const titleFontSizeRef = React.useRef<HTMLDivElement>(null);
  const titleWeightRef = React.useRef<HTMLDivElement>(null);
  const subtitleAlignmentRef = React.useRef<HTMLDivElement>(null);
  const subtitleFontSizeRef = React.useRef<HTMLDivElement>(null);
  const subtitleStyleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (titleAlignmentRef.current && !titleAlignmentRef.current.contains(event.target as Node)) {
        setShowTitleAlignmentMenu(false);
      }
      if (titleFontSizeRef.current && !titleFontSizeRef.current.contains(event.target as Node)) {
        setShowTitleFontSizeMenu(false);
      }
      if (titleWeightRef.current && !titleWeightRef.current.contains(event.target as Node)) {
        setShowTitleWeightMenu(false);
      }
      if (subtitleAlignmentRef.current && !subtitleAlignmentRef.current.contains(event.target as Node)) {
        setShowSubtitleAlignmentMenu(false);
      }
      if (subtitleFontSizeRef.current && !subtitleFontSizeRef.current.contains(event.target as Node)) {
        setShowSubtitleFontSizeMenu(false);
      }
      if (subtitleStyleRef.current && !subtitleStyleRef.current.contains(event.target as Node)) {
        setShowSubtitleStyleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-content mx-auto mb-4"></div>
          <p className="text-base-content">Loading section details...</p>
        </div>
      </div>
    );
  }

  console.log('📋 Form errors:', errors);
  console.log('📝 Form data:', formData);

  return (
    <form
      onSubmit={(e) => {
        console.log('🔥 Form submit event triggered');
        handleSubmit(e);
      }}
      className={`min-h-screen bg-base-200 ${className}`}
    >
      <div className="mx-auto space-y-6">
        
        <BasicInfoSection
          form={form}
          showTitleColorPicker={showTitleColorPicker}
          setShowTitleColorPicker={setShowTitleColorPicker}
          showSubtitleColorPicker={showSubtitleColorPicker}
          setShowSubtitleColorPicker={setShowSubtitleColorPicker}
          showTitleAlignmentMenu={showTitleAlignmentMenu}
          setShowTitleAlignmentMenu={setShowTitleAlignmentMenu}
          showTitleFontSizeMenu={showTitleFontSizeMenu}
          setShowTitleFontSizeMenu={setShowTitleFontSizeMenu}
          showTitleWeightMenu={showTitleWeightMenu}
          setShowTitleWeightMenu={setShowTitleWeightMenu}
          showSubtitleAlignmentMenu={showSubtitleAlignmentMenu}
          setShowSubtitleAlignmentMenu={setShowSubtitleAlignmentMenu}
          showSubtitleFontSizeMenu={showSubtitleFontSizeMenu}
          setShowSubtitleFontSizeMenu={setShowSubtitleFontSizeMenu}
          showSubtitleStyleMenu={showSubtitleStyleMenu}
          setShowSubtitleStyleMenu={setShowSubtitleStyleMenu}
          titleAlignmentRef={titleAlignmentRef}
          titleFontSizeRef={titleFontSizeRef}
          titleWeightRef={titleWeightRef}
          subtitleAlignmentRef={subtitleAlignmentRef}
          subtitleFontSizeRef={subtitleFontSizeRef}
          subtitleStyleRef={subtitleStyleRef}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <DisplaySettingsSection
              form={form}
            />
          </div>

          <SectionStylingSection
            form={form}
            showBackgroundColorPicker={showBackgroundColorPicker}
            setShowBackgroundColorPicker={setShowBackgroundColorPicker}
          />
        </div>

        <FormActionsSection
          isSubmitting={isSubmitting}
          mode={mode}
          onCancel={onCancel}
          formData={formData}
          setValue={setValue as any}
          showTitleColorPicker={showTitleColorPicker}
          setShowTitleColorPicker={setShowTitleColorPicker}
          showSubtitleColorPicker={showSubtitleColorPicker}
          setShowSubtitleColorPicker={setShowSubtitleColorPicker}
          showBackgroundColorPicker={showBackgroundColorPicker}
          setShowBackgroundColorPicker={setShowBackgroundColorPicker}
        />
      </div>
    </form>
  );
};

export default SectionForm;