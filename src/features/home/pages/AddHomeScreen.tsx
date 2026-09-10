import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import HomeScreenSection from '../components/HomeSection';
import AppStyling from '../components/AppStyling';
import HeroSection from '../components/HeroSection';
import ContentSection from '../components/ContentSection';
import { Button } from '@/components/base/Button';
import { useHome } from '../hooks/useHome';
import type { HomeScreenMode } from '../schemas/home.schema';
import { ROUTES } from '@/constants/routes';

interface AddHomeScreenProps {
  mode: HomeScreenMode;
  homeId?: string;
}

const AddHomeScreen: React.FC<AddHomeScreenProps> = ({ mode, homeId }) => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    isSubmitting,
    isLoadingDetails,
    watch,
    setValue,
    formState: { errors },
    control,
  } = useHome({
    mode,
    homeId,
    onSuccess: () => navigate({ to: ROUTES.CMS.HOME.LIST }),
  });

  const formData = watch();

  const handleCancel = () => {
    navigate({ to: ROUTES.CMS.HOME.LIST });
  };

  if (isLoadingDetails) {
    return (
      <div className="space-y-4">
        <div className="shimmer h-40 w-full rounded-xl" />
        <div className="shimmer h-60 w-full rounded-xl" />
        <div className="shimmer h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4">
      {/* Row 1: Full width HomeScreenSection */}
      <HomeScreenSection
        formData={formData}
        setValue={setValue}
        errors={errors}
        control={control as any}
      />

      {/* Row 2: Two columns - Left 60% (HeroSection + ContentSection) and Right 40% (AppStyling) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4">
        {/* Left Column - 60% */}
        <div className="space-y-4 min-w-0">
          <HeroSection
            formData={formData}
            setValue={setValue}
            errors={errors}
            control={control as any}
          />

          <ContentSection
            formData={formData}
            setValue={setValue}
            errors={errors}
            control={control as any}
          />
        </div>

        {/* Right Column - 40% */}
        <div className="min-w-0 xl:w-[400px]">
          <AppStyling
            formData={formData}
            setValue={setValue}
            errors={errors}
            control={control as any}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="px-8"
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="primary"
          type="submit"
          disabled={isSubmitting}
          className="px-8"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default AddHomeScreen;
