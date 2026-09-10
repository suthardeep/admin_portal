import React from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Icon } from '@/components/base/Icon';
import Dropdown from '@/components/base/Dropdown';
import Switch from '@/components/base/Switch';
import { MediaPicker } from '@/components/media-picker/MediaPicker';
import ConfigureActionsModal from '@/components/modals/ConfigureActionsModal';
import ErrorText from '@/components/base/ErrorText';
import { formatDropdownLabel, getFullTooltipText } from '@/utils/dropdownHelpers';

interface BasicInfoSectionProps {
  form: any;
  showTitleColorPicker: boolean;
  setShowTitleColorPicker: (show: boolean) => void;
  showSubtitleColorPicker: boolean;
  setShowSubtitleColorPicker: (show: boolean) => void;
  showTitleAlignmentMenu: boolean;
  setShowTitleAlignmentMenu: (show: boolean) => void;
  showTitleFontSizeMenu: boolean;
  setShowTitleFontSizeMenu: (show: boolean) => void;
  showTitleWeightMenu: boolean;
  setShowTitleWeightMenu: (show: boolean) => void;
  showSubtitleAlignmentMenu: boolean;
  setShowSubtitleAlignmentMenu: (show: boolean) => void;
  showSubtitleFontSizeMenu: boolean;
  setShowSubtitleFontSizeMenu: (show: boolean) => void;
  showSubtitleStyleMenu: boolean;
  setShowSubtitleStyleMenu: (show: boolean) => void;
  titleAlignmentRef: React.RefObject<HTMLDivElement | null>;
  titleFontSizeRef: React.RefObject<HTMLDivElement | null>;
  titleWeightRef: React.RefObject<HTMLDivElement | null>;
  subtitleAlignmentRef: React.RefObject<HTMLDivElement | null>;
  subtitleFontSizeRef: React.RefObject<HTMLDivElement | null>;
  subtitleStyleRef: React.RefObject<HTMLDivElement | null>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  showTitleColorPicker,
  setShowTitleColorPicker,
  showSubtitleColorPicker,
  setShowSubtitleColorPicker,
  showTitleAlignmentMenu,
  setShowTitleAlignmentMenu,
  showTitleFontSizeMenu,
  setShowTitleFontSizeMenu,
  showTitleWeightMenu,
  setShowTitleWeightMenu,
  showSubtitleAlignmentMenu,
  setShowSubtitleAlignmentMenu,
  showSubtitleFontSizeMenu,
  setShowSubtitleFontSizeMenu,
  showSubtitleStyleMenu,
  setShowSubtitleStyleMenu,
  titleAlignmentRef,
  titleFontSizeRef,
  titleWeightRef,
  subtitleAlignmentRef,
  subtitleFontSizeRef,
  subtitleStyleRef,
}) => {
  const { watch, setValue, formState: { errors } } = form;
  const formData = watch();

  const sectionTypeOptions = [
    { label: 'Category', value: 'CATEGORY' },
    { label: 'Product', value: 'PRODUCT' },
    { label: 'Brand', value: 'BRAND' },
  ];

  const ctaTypeOptions = [
    { label: 'Text Button', value: 'TEXT_BUTTON' },
    { label: 'Icon Button', value: 'ICON_BUTTON' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left', icon: 'AlignLeft' },
    { label: 'Center', value: 'center', icon: 'AlignCenter' },
    { label: 'Right', value: 'right', icon: 'AlignRight' },
  ];

  const fontSizeOptions = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

  const fontStyleOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Medium', value: 'medium' },
    { label: 'Semi Bold', value: 'semibold' },
    { label: 'Bold', value: 'bold' },
  ];

  const [isConfigureCTAModalOpen, setIsConfigureCTAModalOpen] = React.useState(false);
  const [selectedCTALabel, setSelectedCTALabel] = React.useState<string>('');

  // Update selectedCTALabel when form data changes (for edit mode)
  React.useEffect(() => {
    if (formData.cta?.targets && formData.cta.targets.length > 0) {
      const formattedLabel = formatDropdownLabel(formData.cta.targets, 25); // 25 char limit
      setSelectedCTALabel(formattedLabel);
    }
  }, [formData.cta?.targets]);

  // Helper to get alignment icon
  const getAlignmentIcon = (alignment: string): 'AlignLeft' | 'AlignCenter' | 'AlignRight' => {
    const option = alignmentOptions.find(opt => opt.value === alignment);
    return (option?.icon as 'AlignLeft' | 'AlignCenter' | 'AlignRight') || 'AlignLeft';
  };

  const handleCTAConfigureToChange = (value: string) => {
    if (value === 'add-new') {
      setIsConfigureCTAModalOpen(true);
    } else {
      // For basic page selections, set both configureTo and targets
      const baseOptions = [
        { label: 'Home Page', value: 'HOME' },
        { label: 'Cart Page', value: 'CART' },
        { label: 'Orders Page', value: 'ORDERS' },
        { label: 'Profile Page', value: 'PROFILE' },
      ];
      
      const pageOption = baseOptions.find(opt => opt.value === value);
      if (pageOption) {
        setValue('cta.configureTo', value);
        setValue('cta.targets', [{ id: value, name: pageOption.label }]); // Set targets for basic pages too
        setValue('cta.actionType', 'IN_APP_PAGE'); // Set action type for basic pages
      }
      setSelectedCTALabel('');
    }
  };

  const handleCTAConfigSave = (data: { actionType: string; selectedValue: string; selectedLabel: string }) => {
    setValue('cta.actionType', data.actionType);

    // Parse the selectedValue and selectedLabel for multiple items
    if (data.selectedValue.includes(',')) {
      // Multiple items - parse comma-separated values
      const ids = data.selectedValue.split(',').map(id => id.trim());
      const names = data.selectedLabel.split(', ').map(name => name.trim());

      const targets = ids.map((id, index) => ({
        id: id,
        name: names[index] || id // Use ID as fallback if name not found
      }));

      setValue('cta.targets', targets);

      // Use formatted label for display (single line, no wrapping)
      const formattedLabel = formatDropdownLabel(targets, 25);
      setSelectedCTALabel(formattedLabel);
      setValue('cta.configureTo', ids[0]); // Use first ID for dropdown value
    } else {
      // Single item
      setValue('cta.targets', [{ id: data.selectedValue, name: data.selectedLabel }]);
      const formattedLabel = formatDropdownLabel([{ id: data.selectedValue, name: data.selectedLabel }], 25);
      setSelectedCTALabel(formattedLabel);
      setValue('cta.configureTo', data.selectedValue);
    }

    setIsConfigureCTAModalOpen(false);
  };

  // Build dynamic options - include selected item if exists
  const dynamicConfigureToOptions = React.useMemo(() => {
    const baseOptions = [
      { label: 'Home Page', value: 'HOME' },
      { label: 'Cart Page', value: 'CART' },
      { label: 'Orders Page', value: 'ORDERS' },
      { label: 'Profile Page', value: 'PROFILE' },
    ];

    // If user has existing CTA configuration (from edit mode or modal selection)
    if (formData.cta?.targets && formData.cta.targets.length > 0) {
      const targets = formData.cta.targets;
      const firstTarget = targets[0];
      const targetId = firstTarget.id;
      
      // Check if it's not a basic page option
      const isBasicPage = baseOptions.some(opt => opt.value === targetId);
      
      if (!isBasicPage && targetId) {
        // Format the label to fit in single line (no wrapping)
        const formattedLabel = formatDropdownLabel(targets, 25); // 25 char limit
        
        // Add the existing selection to options
        baseOptions.unshift({
          label: formattedLabel,
          value: targetId,
        });
      }
    }

    // If selectedCTALabel exists and is different from targets (fallback)
    if (selectedCTALabel && formData.cta?.configureTo) {
      const alreadyExists = baseOptions.some(opt => opt.value === formData.cta.configureTo);
      if (!alreadyExists) {
        baseOptions.unshift({
          label: selectedCTALabel,
          value: formData.cta.configureTo,
        });
      }
    }

    baseOptions.push({ label: '+ Add New', value: 'add-new' });
    return baseOptions;
  }, [selectedCTALabel, formData.cta?.targets, formData.cta?.configureTo]);

  return (
    <div className="rounded-md bg-white shadow-sm">
      <div className="p-4 border-b border-body-content/20">
        <h1 className="text-base font-semibold text-base-content">Add section</h1>
      </div>

      <div className="p-6 space-y-4">
        {/* Row 1: Title, Subtitle, and Status in one line */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-5 space-y-1.5">
            <Label className="text-sm font-light" required={true}>Title</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue('title', e.target.value)
              }
              placeholder="Enter title"
              inputSize="md"
              error={errors.title?.message}
              label=""
              required={false}
            />
          </div>

          <div className="col-span-5 space-y-1.5">
            <Label className="text-sm font-light" required={true}>Subtitle</Label>
            <Input
              type="text"
              value={formData.subtitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue('subtitle', e.target.value)
              }
              placeholder="Enter subtitle"
              inputSize="md"
              error={errors.subtitle?.message}
              label=""
              required={false}
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label className="text-sm font-light" required={true}>Status</Label>
            <div className="flex items-center gap-2 h-10">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setValue('active', checked)}
                size="md"
              />
              <span className={`text-sm font-medium ${
                formData.active ? 'text-primary' : 'text-base-content/60'
              }`}>
                {formData.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Upload Title image/logo */}
          <div className="space-y-1.5 flex-shrink-0" style={{ width: 'fit-=', minWidth: '200px' }}>
            <Label className="text-sm text-gray-700 font-light" required={true}>Upload Title image/logo</Label>
            <div className="">
              {!formData.logoUrl ? (
                <MediaPicker
                  value={[]}
                  ids={[]}
                  urls={[]}
                  label=""
                  onChange={(files) => {
                    console.log('🖼️ LogoUrl MediaPicker onChange called:', files);
                    console.log('🖼️ First file:', files?.[0]);
                    console.log('🖼️ s3Url:', files?.[0]?.s3Url);
                    const url = files?.[0]?.s3Url || '';
                    console.log('🖼️ Final URL to set:', url);
                    setValue('logoUrl', url);
                  }}
                  maxFiles={1}
                  variant="inline"
                  iconType="upload"
                  dragDropText="Choose file to upload"
                  sizeConfig={{ height: "h-140px" }}
                  className=""
                  textConfig={{ size: "sm", show: true }}
                />
              ) : (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 h-[42px] flex items-center justify-center">
                  <img
                    src={formData.logoUrl}
                    alt="Title"
                    className="max-h-[34px] object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('logoUrl', '')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {errors?.logoUrl && (
              <ErrorText className="text-error text-xs mt-1">{errors.logoUrl.message}</ErrorText>
            )}
          </div>

          {/* Title decorations */}
          <div className="space-y-1.5" style={{ width: 'fit-content' }}>
            <label className="text-sm text-gray-700 font-light">Title decorations</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 h-[42px] flex items-center w-fit">
              <div className="flex items-center gap-1.5">
                {/* Color Picker + Hex Input grouped together */}
                <div className="flex items-center rounded overflow-hidden p-0.5" style={{ backgroundColor: '#F9F9F9' }}>
                  <button
                    type="button"
                    onClick={() => setShowTitleColorPicker(true)}
                    className="w-5 h-5 rounded hover:opacity-90 transition-opacity ml-0.5"
                    style={{
                      background: formData.titleDecorations.color && formData.titleDecorations.color !== '' && formData.titleDecorations.color !== '#'
                        ? formData.titleDecorations.color
                        : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
                    }}
                    aria-label="Choose color"
                  />
                  <div className="flex items-center gap-0.5 px-1.5 w-20 border-l border-gray-300">
                    <span className="text-xs text-gray-700">#</span>
                    <input
                      type="text"
                      value={formData.titleDecorations.color ? formData.titleDecorations.color.replace('#', '') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                        setValue('titleDecorations.color', val ? '#' + val : '');
                      }}
                      className="w-full text-xs bg-transparent outline-none text-gray-700 uppercase"
                      maxLength={6}
                      placeholder="000000"
                    />
                  </div>
                </div>

                {/* Alignment dropdown */}
                <div className="relative" ref={titleAlignmentRef}>
                  <button
                    type="button"
                    onClick={() => setShowTitleAlignmentMenu(!showTitleAlignmentMenu)}
                    className="h-8 px-2 flex items-center gap-1 rounded cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: '#F9F9F9' }}
                  >
                    <Icon name={getAlignmentIcon(formData.titleDecorations.alignment)} className="w-4 h-4 text-gray-700" />
                    <Icon name="ChevronDown" className="w-3 h-3 text-gray-500" />
                  </button>

                  {showTitleAlignmentMenu && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      {alignmentOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValue('titleDecorations.alignment', option.value);
                            setShowTitleAlignmentMenu(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                            formData.titleDecorations.alignment === option.value ? 'bg-gray-50 text-primary' : 'text-gray-700'
                          }`}
                        >
                          <Icon 
                            name={option.icon as any} 
                            className={`w-4 h-4 ${
                              formData.titleDecorations.alignment === option.value ? 'text-primary' : 'text-gray-700'
                            }`} 
                          />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Font size dropdown */}
                <div className="relative" ref={titleFontSizeRef}>
                  <button
                    type="button"
                    onClick={() => setShowTitleFontSizeMenu(!showTitleFontSizeMenu)}
                    className="h-8 px-2 flex items-center gap-1 rounded cursor-pointer hover:opacity-90 min-w-[45px]"
                    style={{ backgroundColor: '#F9F9F9' }}
                  >
                    <span className="text-xs text-gray-700">{formData.titleDecorations.fontSize}</span>
                    <Icon name="ChevronDown" className="w-3 h-3 text-gray-500" />
                  </button>

                  {showTitleFontSizeMenu && (
                    <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {fontSizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setValue('titleDecorations.fontSize', size);
                            setShowTitleFontSizeMenu(false);
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                            formData.titleDecorations.fontSize === size ? 'bg-gray-50 text-primary' : 'text-gray-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Font style dropdown for title */}
                <div className="relative" ref={titleWeightRef}>
                  <button
                    type="button"
                    onClick={() => setShowTitleWeightMenu(!showTitleWeightMenu)}
                    className="h-8 px-2 flex items-center gap-1 rounded cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: '#F9F9F9' }}
                  >
                    <span className="text-xs text-gray-700">
                      {fontStyleOptions.find(opt => opt.value === formData.titleDecorations.fontStyle)?.label || 'Normal'}
                    </span>
                    <Icon name="ChevronDown" className="w-3 h-3 text-gray-500" />
                  </button>

                  {showTitleWeightMenu && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      {fontStyleOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValue('titleDecorations.fontStyle', option.value);
                            setShowTitleWeightMenu(false);
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                            formData.titleDecorations.fontStyle === option.value ? 'bg-gray-50 text-primary' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {errors?.titleDecorations?.color && (
              <ErrorText className="text-error text-xs mt-1">{errors.titleDecorations.color.message}</ErrorText>
            )}
            {errors?.titleDecorations?.fontSize && (
              <ErrorText className="text-error text-xs mt-1">{errors.titleDecorations.fontSize.message}</ErrorText>
            )}
          </div>

          {/* Subtitle decorations */}
          <div className="space-y-1.5" style={{ width: 'fit-content' }}>
            <label className="text-sm text-gray-700 font-light">Subtitle decorations</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 h-[42px] flex items-center w-fit">
              <div className="flex items-center gap-1.5">
                {/* Color Picker + Hex Input grouped together */}
                <div className="flex items-center rounded overflow-hidden p-0.5" style={{ backgroundColor: '#F9F9F9' }}>
                  <button
                    type="button"
                    onClick={() => setShowSubtitleColorPicker(true)}
                    className="w-5 h-5 rounded hover:opacity-90 transition-opacity ml-0.5"
                    style={{
                      background: formData.subtitleDecorations.color && formData.subtitleDecorations.color !== '' && formData.subtitleDecorations.color !== '#'
                        ? formData.subtitleDecorations.color
                        : 'conic-gradient(from 180deg at 50% 50%, #FF0004 0deg, #FFEE00 62.31deg, #00FF1A 107.31deg, #00C4FF 143.65deg, #008CFF 199.04deg, #3C00FF 252.69deg, #FF00EE 306.35deg, #FF0095 339.23deg, #FF0004 360deg)'
                    }}
                    aria-label="Choose color"
                  />
                  <div className="flex items-center gap-0.5 px-1.5 w-20 border-l border-gray-300">
                    <span className="text-xs text-gray-700">#</span>
                    <input
                      type="text"
                      value={formData.subtitleDecorations.color ? formData.subtitleDecorations.color.replace('#', '') : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                        setValue('subtitleDecorations.color', val ? '#' + val : '');
                      }}
                      className="w-full text-xs bg-transparent outline-none text-gray-700 uppercase"
                      maxLength={6}
                      placeholder="000000"
                    />
                  </div>
                </div>

                {/* Alignment dropdown */}
                <div className="relative" ref={subtitleAlignmentRef}>
                  <button
                    type="button"
                    onClick={() => setShowSubtitleAlignmentMenu(!showSubtitleAlignmentMenu)}
                    className="h-8 px-2 flex items-center gap-1 rounded cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: '#F9F9F9' }}
                  >
                    <Icon name={getAlignmentIcon(formData.subtitleDecorations.alignment)} className="w-4 h-4 text-gray-700" />
                    <Icon name="ChevronDown" className="w-3 h-3 text-gray-500" />
                  </button>

                  {showSubtitleAlignmentMenu && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      {alignmentOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValue('subtitleDecorations.alignment', option.value);
                            setShowSubtitleAlignmentMenu(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                            formData.subtitleDecorations.alignment === option.value ? 'bg-gray-50 text-primary' : 'text-gray-700'
                          }`}
                        >
                          <Icon 
                            name={option.icon as any} 
                            className={`w-4 h-4 ${
                              formData.subtitleDecorations.alignment === option.value ? 'text-primary' : 'text-gray-700'
                            }`} 
                          />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Font size dropdown */}
                <div className="relative" ref={subtitleFontSizeRef}>
                  <button
                    type="button"
                    onClick={() => setShowSubtitleFontSizeMenu(!showSubtitleFontSizeMenu)}
                    className="h-8 px-2 flex items-center gap-1 rounded cursor-pointer hover:opacity-90 min-w-[45px]"
                    style={{ backgroundColor: '#F9F9F9' }}
                  >
                    <span className="text-xs text-gray-700">{formData.subtitleDecorations.fontSize}</span>
                    <Icon name="ChevronDown" className="w-3 h-3 text-gray-500" />
                  </button>

                  {showSubtitleFontSizeMenu && (
                    <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {fontSizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setValue('subtitleDecorations.fontSize', size);
                            setShowSubtitleFontSizeMenu(false);
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                            formData.subtitleDecorations.fontSize === size ? 'bg-gray-50 text-primary' : 'text-gray-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Font style dropdown */}
                <div className="relative" ref={subtitleStyleRef}>
                  <button
                    type="button"
                    onClick={() => setShowSubtitleStyleMenu(!showSubtitleStyleMenu)}
                    className="h-8 px-2 flex items-center gap-1 rounded cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: '#F9F9F9' }}
                  >
                    <span className="text-xs text-gray-700">
                      {fontStyleOptions.find(opt => opt.value === formData.subtitleDecorations.fontStyle)?.label || 'Normal'}
                    </span>
                    <Icon name="ChevronDown" className="w-3 h-3 text-gray-500" />
                  </button>

                  {showSubtitleStyleMenu && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      {fontStyleOptions.map((option) => (
                        <button
                          key={String(option.value)}
                          type="button"
                          onClick={() => {
                            setValue('subtitleDecorations.fontStyle', option.value);
                            setShowSubtitleStyleMenu(false);
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                            formData.subtitleDecorations.fontStyle === option.value ? 'bg-gray-50 text-primary' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {errors?.subtitleDecorations?.color && (
              <ErrorText className="text-error text-xs mt-1">{errors.subtitleDecorations.color.message}</ErrorText>
            )}
            {errors?.subtitleDecorations?.fontSize && (
              <ErrorText className="text-error text-xs mt-1">{errors.subtitleDecorations.fontSize.message}</ErrorText>
            )}
          </div>
        </div>

        {/* Section Type */}
        <div className="space-y-1">
          <Label className="text-base font-light" required={true}>Section type</Label>
          <div className="max-w-xs">
            <Dropdown
              value={formData.sectionType}
              onChange={(value) => setValue('sectionType', value)}
              options={sectionTypeOptions}
              placeholder="Category"
              inputSize="md"
              containerClassName="w-full"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.hasCTA}
              onCheckedChange={(checked) => setValue('hasCTA', checked)}
              size="sm"
            />
            <p className={`text-[1rem] font-light ${
              formData.hasCTA ? 'text-primary' : 'text-base-content'
            }`}>
              Has CTA
            </p>
          </div>

          {formData.hasCTA && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-base font-light" required={true}>CTA type</Label>
                  <Dropdown
                    value={formData.cta?.ctaType || ''}
                    onChange={(value) => setValue('cta.ctaType', value)}
                    options={ctaTypeOptions}
                    placeholder="Select CTA type"
                    inputSize="md"
                    containerClassName="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-base font-light" required={true}>CTA Text/Label</Label>
                  <Input
                    type="text"
                    value={formData.cta?.label || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setValue('cta.label', e.target.value)
                    }
                    placeholder="Enter text/label"
                    inputSize="md"
                    error={errors?.cta?.label?.message}
                    label=""
                    required={false}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-base font-light" required={true}>CTA Configure to</Label>
                  <div title={formData.cta?.targets && formData.cta.targets.length > 0 ? getFullTooltipText(formData.cta.targets) : ''}>
                    <Dropdown
                      value={formData.cta?.configureTo || ''}
                      onChange={handleCTAConfigureToChange}
                      options={dynamicConfigureToOptions}
                      placeholder="About us page"
                      inputSize="md"
                      containerClassName="w-full"
                    />
                  </div>
                </div>
              </div>

          
            </div>
          )}
        </div>
      </div>

      {/* Configure CTA Modal */}
      <ConfigureActionsModal
        isOpen={isConfigureCTAModalOpen}
        onClose={() => setIsConfigureCTAModalOpen(false)}
        onSave={handleCTAConfigSave}
        existingConfig={{
          actionType: formData.cta?.actionType,
          targets: formData.cta?.targets || [],
        }}
      />
    </div>
  );
};

export default BasicInfoSection;