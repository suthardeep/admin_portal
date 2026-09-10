// hooks/useBanner.ts
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { BannerFormSchema, type BannerFormData, type BannerMode } from "../schemas/banners.schema";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useGetBannerDetailsQuery
} from "../api/queryHooks";
import type { CreateBannerPayload, UpdateBannerPayload } from "../types/banner";
import { ROUTES } from "@/constants/routes";

interface UseBannerProps {
  mode: BannerMode;
  bannerId?: string;
  onSuccess?: () => void;
}

export const useBanner = ({ mode, bannerId, onSuccess }: UseBannerProps) => {
  const navigate = useNavigate();

  console.log('useBanner called with:', { mode, bannerId });

  // Get banner details for edit mode
  const { data: bannerDetails, isLoading: isLoadingDetails } = useGetBannerDetailsQuery(
    bannerId || ''
  );

  console.log('Banner query result:', { bannerDetails, isLoadingDetails });

  // Mutations
  const createMutation = useCreateBannerMutation();
  const updateMutation = useUpdateBannerMutation();

  // Initialize form with default values
  const defaultValues: BannerFormData = {
    title: '',
    platform: 'CUSTOMER',
    bannerType: 'ORGANIC',
    screenType: 'HOME',
    displayIndex: 0,
    stateIds: [],
    startTime: '',
    endTime: '',
    ratio: '16:9',
    roundness: undefined as any, // Start empty, user must fill
    mediaUrl: '',
    mediaType: 'IMAGE',
    ctaConfig: {
      ctaType: 'TEXT_BUTTON',
      label: 'View Details',
      actionType: 'CATEGORY',
      targets: [],
    },
    note: '',
    active: true,
  };

  const form = useForm({
    resolver: zodResolver(BannerFormSchema),
    defaultValues,
    mode: 'onSubmit' as const,
  });

  // Helper function to convert ISO date to datetime-local format
  const toDatetimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Update form when banner details are loaded (edit mode)
  React.useEffect(() => {
    console.log("useBanner - mode:", mode);
    console.log("useBanner - bannerDetails:", bannerDetails);
    if (mode === 'edit' && bannerDetails) {
      console.log("Resetting form with data:", bannerDetails);
      form.reset({
        title: bannerDetails.title,
        platform: bannerDetails.platform,
        bannerType: bannerDetails.bannerType,
        screenType: bannerDetails.screenType,
        displayIndex: bannerDetails.displayIndex,
        stateIds: bannerDetails.stateIds,
        startTime: toDatetimeLocal(bannerDetails.startTime),
        endTime: toDatetimeLocal(bannerDetails.endTime),
        ratio: bannerDetails.ratio,
        roundness: bannerDetails.roundness,
        mediaUrl: bannerDetails.mediaUrl,
        mediaType: bannerDetails.mediaType,
        ctaConfig: bannerDetails.ctaConfig,
        note: bannerDetails.note || '',
        active: bannerDetails.active,
      });
    }
  }, [bannerDetails, form, mode]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Transform form data to API payload
  const transformToApiPayload = (data: BannerFormData): CreateBannerPayload | UpdateBannerPayload => {
    // Convert datetime-local format back to ISO string for API
    const toISOString = (datetimeLocal: string): string => {
      if (!datetimeLocal) return '';
      const date = new Date(datetimeLocal);
      return date.toISOString();
    };

    return {
      title: data.title,
      platform: data.platform as any, // Type cast to handle enum mismatch
      bannerType: data.bannerType || 'ORGANIC',
      screenType: data.screenType || 'HOME',
      displayIndex: data.displayIndex || 0,
      stateIds: data.stateIds,
      startTime: toISOString(data.startTime),
      endTime: toISOString(data.endTime),
      ratio: data.ratio,
      roundness: data.roundness,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType || 'IMAGE',
      ctaConfig: data.ctaConfig ? {
        ctaType: data.ctaConfig.ctaType || 'TEXT_BUTTON',
        label: data.ctaConfig.label || 'View Details',
        actionType: (data.ctaConfig.actionType && ['CATEGORY', 'BRAND', 'PRODUCT', 'VENDOR', 'PAGE', 'EXTERNAL_URL'].includes(data.ctaConfig.actionType)) 
          ? data.ctaConfig.actionType as 'CATEGORY' | 'BRAND' | 'PRODUCT' | 'VENDOR' | 'PAGE' | 'EXTERNAL_URL'
          : 'CATEGORY',
        targets: data.ctaConfig.targets || [],
      } : {
        ctaType: 'TEXT_BUTTON' as const,
        label: 'View Details',
        actionType: 'CATEGORY' as const,
        targets: [],
      },
      note: data.note,
      active: data.active,
    };
  };

  // Submit handler
  const onSubmit = async (data: BannerFormData) => {
    console.log('🚀 Form submitted!', data);
    try {
      const apiPayload = transformToApiPayload(data);
      console.log('📦 API Payload:', apiPayload);

      if (mode === 'create') {
        console.log('✨ Creating banner...');
        await createMutation.mutateAsync(apiPayload as CreateBannerPayload);
      } else if (mode === 'edit' && bannerId) {
        console.log('✏️ Updating banner...');
        await updateMutation.mutateAsync({
          bannerId: bannerId,
          data: apiPayload as UpdateBannerPayload
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: ROUTES.CMS.BANNERS.LIST });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      // Error handling is done in the mutation hooks
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit as any),
    isSubmitting,
    isLoadingDetails,
    mode,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
  };
};
