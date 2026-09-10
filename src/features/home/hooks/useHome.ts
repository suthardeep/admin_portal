import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { HomeScreenFormSchema, type HomeScreenFormData, type HomeScreenMode } from "../schemas/home.schema";
import {
  useCreateHomeScreenMutation,
  useUpdateHomeScreenMutation,
  useGetHomeScreenDetailsQuery
} from "../api/queryHooks";
import type { CreateHomeScreenPayload, UpdateHomeScreenPayload } from "../types/home";
import { ROUTES } from "@/constants/routes";

interface UseHomeProps {
  mode: HomeScreenMode;
  homeId?: string;
  onSuccess?: () => void;
}

export const useHome = ({ mode, homeId, onSuccess }: UseHomeProps) => {
  const navigate = useNavigate();

  // Get home screen details for edit mode
  const { data: homeDetails, isLoading: isLoadingDetails } = useGetHomeScreenDetailsQuery(
    homeId || ''
  );

  // Mutations
  const createMutation = useCreateHomeScreenMutation();
  const updateMutation = useUpdateHomeScreenMutation();

  // Initialize form with default values matching new schema
  const defaultValues: HomeScreenFormData = {
    platform: 'CUSTOMER',
    version: '',
    sections: [],
    isActive: true,
    published: true,
    versionName: '',
    appStyling: 'modern',
    heroStyling: {
      primaryColor: '',
      secondaryColor: '',
      backgroundColor: '',
      hasGradient: false,
      gradientColors: [],
      backgroundImageUrl: '',
      heroImage: '',
    },
    coinType: 'FINTECH',
    coinBadgeColor: '',
    coinBackgroundColor: '',
    searchTextColor: '',
    searchBackgroundColor: '',
    searchForegroundColor: '',
    searchIconColor: '',
    notificationIconColor: '',
    notificationIconDotColor: '',
    notificationBackgroundColor: '',
    locationIconColor: '',
    locationTypeColor: '',
    locationAddressColor: '',
  };

  const form = useForm({
    resolver: zodResolver(HomeScreenFormSchema),
    defaultValues,
    mode: 'onBlur', // Changed from 'onChange' to 'onBlur' for better UX
  });

  // Update form when home details are loaded (edit mode)
  React.useEffect(() => {
    if (mode === 'edit' && homeDetails) {
      form.reset({
        platform: homeDetails.platform as any, // Type cast to handle enum mismatch
        version: homeDetails.version,
        sections: homeDetails.sections.map(section => section.id),
        isActive: homeDetails.isActive,
        published: homeDetails.published,
        versionName: homeDetails.versionName,
        appStyling: homeDetails.appStyling,
        heroStyling: homeDetails.heroStyling,
        coinType: homeDetails.coinType,
        coinBadgeColor: homeDetails.coinBadgeColor,
        coinBackgroundColor: homeDetails.coinBackgroundColor,
        searchTextColor: homeDetails.searchTextColor,
        searchBackgroundColor: homeDetails.searchBackgroundColor,
        searchForegroundColor: homeDetails.searchForegroundColor,
        searchIconColor: homeDetails.searchIconColor,
        notificationIconColor: homeDetails.notificationIconColor,
        notificationIconDotColor: homeDetails.notificationIconDotColor,
        notificationBackgroundColor: homeDetails.notificationBackgroundColor,
        locationIconColor: homeDetails.locationIconColor,
        locationTypeColor: homeDetails.locationTypeColor,
        locationAddressColor: homeDetails.locationAddressColor,
      });
    }
  }, [homeDetails, form, mode]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Submit handler
  const onSubmit = async (data: HomeScreenFormData) => {
    try {
      console.log('Form data being submitted:', data); // Debug log
      
      const payload: CreateHomeScreenPayload = {
        platform: data.platform as any, // Type cast to handle enum mismatch
        version: data.version,
        sections: data.sections,
        isActive: data.isActive,
        published: data.published,
        versionName: data.versionName,
        appStyling: data.appStyling,
        heroStyling: data.heroStyling,
        coinType: data.coinType,
        coinBadgeColor: data.coinBadgeColor,
        coinBackgroundColor: data.coinBackgroundColor,
        searchTextColor: data.searchTextColor,
        searchBackgroundColor: data.searchBackgroundColor,
        searchForegroundColor: data.searchForegroundColor,
        searchIconColor: data.searchIconColor,
        notificationIconColor: data.notificationIconColor,
        notificationIconDotColor: data.notificationIconDotColor,
        notificationBackgroundColor: data.notificationBackgroundColor,
        locationIconColor: data.locationIconColor,
        locationTypeColor: data.locationTypeColor,
        locationAddressColor: data.locationAddressColor,
      };

      if (mode === 'create') {
        await createMutation.mutateAsync(payload);
      } else if (mode === 'edit' && homeId) {
        await updateMutation.mutateAsync({
          homeId: homeId,
          data: payload as UpdateHomeScreenPayload
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: ROUTES.CMS.HOME.LIST } );
      }
    } catch (error) {
      console.error('Form submission error:', error); // Debug log
      // Error handling is done in the mutation hooks
    }
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors); // Debug log
    // toast.error('Please fix the form errors before submitting');
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit, onError),
    isSubmitting,
    isLoadingDetails,
    mode,
    // Ensure watch returns data with required fields
    watch: () => {
      const data = form.watch();
      return {
        ...data,
        isActive: data.isActive ?? true,
        published: data.published ?? true,
        appStyling: data.appStyling ?? 'modern',
      };
    },
    // Ensure setValue works with the expected types
    setValue: form.setValue as any,
  };
};
