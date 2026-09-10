import React, { useState } from 'react';
import { Input } from '@/components/base/Input';
import { Label } from '@/components/base/Label';
import { Button } from '@/components/base/Button';
import { Icon } from '@/components/base/Icon';
import Dropdown from '@/components/base/Dropdown';
import Switch from '@/components/base/Switch';
import ErrorText from '@/components/base/ErrorText';
import { MediaPicker } from '@/components/media-picker/MediaPicker';
import { cn } from '@/utils/helpers';
import { useBanner } from '../../hooks/useBanner';
import { BannerMode } from '../../schemas/banners.schema';
import AddConfigurationModal from '@/components/modals/ConfigureActionsModal';
import { PLATFORM_OPTIONS, STATE_OPTIONS } from '@/constants/cmsOptions';

interface BannerFormProps {
  mode: BannerMode;
  bannerId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  className?: string;
}

// Ratio options
const RATIO_OPTIONS = [
  { label: '16:9', value: '16:9' },
  { label: '4:3', value: '4:3' },
  { label: '3:2', value: '3:2' },
  { label: '2:1', value: '2:1' },
  { label: '1:1', value: '1:1' },
];

const BannerForm: React.FC<BannerFormProps> = ({
  mode,
  bannerId,
  onCancel,
  onSuccess,
  className,
}) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    isLoadingDetails,
  } = useBanner({ mode, bannerId, onSuccess });

  const { watch, setValue, formState: { errors } } = form;
  const formData = watch();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configure to dropdown options (initially show only first 3-4 pages)
  const initialPageOptions = [
    { label: 'Home Page', value: 'HOME' },
    { label: 'Cart Page', value: 'CART' },
    { label: 'Orders Page', value: 'ORDERS' },
    { label: 'Profile Page', value: 'PROFILE' },
    { label: '+ Add New', value: 'add-new' },
  ];

  // Create dynamic options that include the selected category/brand
  const dynamicConfigureToOptions = React.useMemo(() => {
    // Always use initial limited options
    const baseOptions = [...initialPageOptions];

    // If we have targets, add them to options if not already present
    if (formData.ctaConfig?.targets && formData.ctaConfig.targets.length > 0) {
      formData.ctaConfig.targets.forEach(target => {
        const alreadyExists = baseOptions.some(opt => opt.value === target.id);
        if (!alreadyExists) {
          // Insert the selected item at the beginning (before "+ Add New")
          baseOptions.splice(baseOptions.length - 1, 0, {
            label: target.name,
            value: target.id,
          });
        }
      });
    }

    return baseOptions;
  }, [formData.ctaConfig?.targets]);

  const handlePageChange = (value: string) => {
    if (value === 'add-new') {
      setIsModalOpen(true);
    } else {
      // For page options, update targets array with the selected page
      const pageOption = initialPageOptions.find(opt => opt.value === value);
      if (pageOption && pageOption.value !== 'add-new') {
        setValue('ctaConfig.targets', [{ id: value, name: pageOption.label }]);
      }
    }
  };

  const handleModalSave = (data: { actionType: string; selectedValue: string; selectedLabel: string }) => {
    // Save to ctaConfig with new targets structure
    setValue('ctaConfig.actionType', data.actionType as any);
    setValue('ctaConfig.targets', [{ id: data.selectedValue, name: data.selectedLabel }]);
    console.log('Configured action:', data);
  };

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-content mx-auto mb-4"></div>
          <p className="text-base-content">Loading banner details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={`min-h-screen bg-base-200 ${className}`}>
        <div className="mx-auto space-y-4">
          
          <div className="rounded-lg bg-[#FFFFFF] shadow-sm">
            <div className="p-4 border-b border-body-content/20">
              <p className="text-base font-semibold text-base-content">
                {mode === 'create' ? 'Create Banner' : 'Edit Banner'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Title with Status Switch - Grid Layout */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-10 space-y-1">
                  <Label className="text-base font-light" required={true}>Title</Label>
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

                <div className="col-span-2 space-y-1">
                  <Label className="text-base font-light" required={true}>Status</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-base font-light" required={true}>Platform</Label>
                  <Dropdown
                    value={formData.platform}
                    onChange={(value) => setValue('platform', value)}
                    options={PLATFORM_OPTIONS}
                    placeholder="Select platform"
                    inputSize="md"
                    containerClassName="w-full"
                  />
                  {errors.platform && (
                    <ErrorText className="mt-1 !text-error">{errors.platform.message}</ErrorText>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-base font-light" required={true}>Targeted States</Label>
                  <Dropdown
                    value={formData.stateIds || []}
                    onChange={(value) => setValue('stateIds', value)}
                    options={STATE_OPTIONS}
                    placeholder="Select states"
                    inputSize="md"
                    containerClassName="w-full"
                    multiple={true}
                  />
                  {errors.stateIds && (
                    <ErrorText className="mt-1 !text-error">{errors.stateIds.message}</ErrorText>
                  )}
                </div>
              </div>

              {/* Start Time and End Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-base font-light" required={true}>Start Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setValue('startTime', e.target.value)
                    }
                    placeholder="dd/mm/yyyy - hh:mm"
                    inputSize="md"
                    error={errors.startTime?.message}
                    label=""
                    required={false}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-base font-light" required={true}>End Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setValue('endTime', e.target.value)
                    }
                    placeholder="dd/mm/yyyy - hh:mm"
                    inputSize="md"
                    error={errors.endTime?.message}
                    label=""
                    required={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Photo Section */}
            <div className="rounded-lg bg-[#FFFFFF] shadow-sm">
              <div className="p-4 border-b border-body-content/20">
                <h2 className="text-base font-semibold text-base-content">Photo</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-base font-light" required={true}>Ratio</Label>
                    <Dropdown
                      value={formData.ratio || ''}
                      onChange={(value) => setValue('ratio', value)}
                      options={RATIO_OPTIONS}
                      placeholder="Select ratio"
                      inputSize="md"
                      containerClassName="w-full"
                    />
                    {errors.ratio && (
                      <ErrorText className="mt-1 !text-error">{errors.ratio.message}</ErrorText>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-base font-light" required={true}>Roundness</Label>
                    <Input
                      type="number"
                      value={formData.roundness !== undefined ? formData.roundness.toString() : ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        if (value === '') {
                          setValue('roundness', undefined as any);
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue)) {
                            setValue('roundness', numValue);
                          }
                        }
                      }}
                      placeholder="Enter roundness"
                      rightElement={
                        <Icon name="SquareRoundCorner" className="w-4 h-4 text-base-content/50" />
                      }
                      className="w-full"
                      inputSize="md"
                      error={errors.roundness?.message}
                      label=""
                      required={false}
                    />
                  </div>
                </div>

                {/* Upload Area with MediaPicker */}
                <div className="space-y-1">
                  <Label className="text-base font-light" required={true}>Upload Videos/Images</Label>
                  <MediaPicker
                    value={formData.mediaUrl ? [{ s3Url: formData.mediaUrl, id: 'media-0' }] : []}
                    ids={[]}
                    urls={[]}
                    label=""
                    onChange={(files) => {
                      const url = files?.[0]?.s3Url || '';
                      setValue('mediaUrl', url);
                    }}
                    maxFiles={1}
                    iconType="upload"
                    dragDropText="Drag & Drop or Choose file to upload"
                    sizeConfig={{ height: "h-36", width: "w-full" }}
                    itemSizeConfig={{ height: "h-36", aspectRatio: "auto" }}
                    className="w-full"
                    textConfig={{ size: "sm", show: true }}
                    iconConfig={{ size: "lg" }}
                    variant="default"
                    required={true}
                  />
                  {errors.mediaUrl && (
                    <ErrorText className="mt-1 !text-error">{errors.mediaUrl.message}</ErrorText>
                  )}
                
                </div>
              </div>
            </div>

            {/* Right Column with Link and Note */}
            <div className="space-y-6">
              {/* Link Section */}
              <div className="rounded-lg bg-[#FFFFFF] shadow-sm">
                <div className="p-4 border-b border-body-content/20">
                  <h2 className="text-base font-semibold text-base-content">Link</h2>
                </div>

                <div className="p-6">
                  {/* Configure to Dropdown */}
                  <div className="space-y-1">
                    <Label className="text-base font-light" required={true}>Configure to</Label>
                    <div>
                      <Dropdown
                        value={formData.ctaConfig?.targets?.[0]?.id || ''}
                        onChange={handlePageChange}
                        options={dynamicConfigureToOptions}
                        placeholder="Select option"
                        inputSize="md"
                        containerClassName="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="rounded-lg bg-[#FFFFFF] shadow-sm">
                <div className="p-4 border-b border-body-content/50">
                  <h2 className="text-lg font-semibold text-base-content">Note</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-1">
                    <Label className="text-base font-light">Message</Label>
                    <textarea
                      value={formData.note || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setValue('note', e.target.value)
                      }
                      placeholder="Type here"
                      rows={4}
                      className={cn(
                        "w-full rounded-lg border border-input-border bg-base-1 px-3 py-2 text-sm text-base-content",
                        "placeholder:text-disabled-content resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        "transition-all duration-200"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </div>
              ) : (
                mode === 'create' ? 'Create' : 'Update'
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Configure Actions Modal */}
      <AddConfigurationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
      />

      {/* Add animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `
      }} />
    </>
  );
};

export default BannerForm;