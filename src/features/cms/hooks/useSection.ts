// hooks/useSection.ts
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { SectionFormSchema, type SectionFormData, type SectionMode } from "../schemas/section.schema";
import {
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useGetSectionDetailsQuery
} from "../api/queryHooks";
import { showErrorToasts } from "@/utils/helpers";
import { toast } from "@/components/compound/Sonner";
import type { CreateSectionPayload, UpdateSectionPayload } from "../types/section";
import { ROUTES } from "@/constants/routes";

interface UseSectionProps {
  mode: SectionMode;
  sectionId?: string;
  onSuccess?: () => void;
}

export const useSection = ({ mode, sectionId, onSuccess }: UseSectionProps) => {
  const navigate = useNavigate();

  // Get section details for edit mode
  const { data: sectionDetails, isLoading: isLoadingDetails } = useGetSectionDetailsQuery(
    sectionId || ''
  );

  // Mutations
  const createMutation = useCreateSectionMutation();
  const updateMutation = useUpdateSectionMutation();

  // Initialize form with default values
  const defaultValues: SectionFormData = {
    title: '',
    subtitle: '',
    sectionType: 'PRODUCT',
    logoUrl: '',
    titleDecorations: {
      color: '',
      alignment: 'left',
      fontSize: 10,
      fontStyle: 'normal',
    },
    subtitleDecorations: {
      color: '',
      alignment: 'left',
      fontSize: 10,
      fontStyle: 'normal',
    },
    contentConfig: {
      sourceType: 'PRODUCT',
      selectionType: 'MANUAL',
      selectedItems: [],
      conditions: [],
      limit: 10,
      sort: 'rating:desc',
    },
    hasCTA: false,
    cta: {
      ctaType: 'TEXT_BUTTON',
      label: '',
      actionType: 'CATEGORY',
      targets: [],
    },
    displaySettings: {
      displayType: 'SLIDER',
      interval: 3000,
      autoPlay: true,
      showDots: true,
      showArrows: false,
    } as any,
    sectionStyling: {
      useTransparentBackground: false,
      backgroundColor: '',
      hasGradient: false,
      gradientConfig: {
        stops: [
          { color: '#', percentage: 0 },
          { color: '#', percentage: 100 },
        ],
        direction: 'TO_BOTTOM',
      },
      gradientColors: [
        { color: '#', opacity: 100 },
        { color: '', opacity: 100 },
      ],
      roundness: 0,
      backgroundImageUrl: '',
    },
    active: true,
  };

  const form = useForm({
    resolver: zodResolver(SectionFormSchema),
    defaultValues,
    mode: 'onSubmit' as const,
    reValidateMode: 'onSubmit',
  });

  // Update form when section details are loaded (edit mode)
  React.useEffect(() => {
    console.log("useSection - mode:", mode);
    console.log("useSection - sectionDetails:", sectionDetails);
    if (mode === 'edit' && sectionDetails) {
      console.log("Resetting form with data:", sectionDetails);

      const section = sectionDetails as any;

      // Transform gradientConfig.stops to gradientColors for UI
      let gradientColors: { color: string; opacity: number }[] = [];
      if (section.sectionStyling?.gradientConfig?.stops && section.sectionStyling.gradientConfig.stops.length > 0) {
        gradientColors = section.sectionStyling.gradientConfig.stops.map((stop: { color: string; percentage: number }) => ({
          color: stop.color,
          opacity: 100, // Default opacity since API doesn't provide it
        }));
      }

      // Handle CTA targets - parse comma-separated IDs if needed
      let ctaTargets = section.ctaConfig?.targets || [];
      let configureTo = '';
      
      if (section.ctaConfig?.targets && section.ctaConfig.targets.length > 0) {
        const firstTarget = section.ctaConfig.targets[0];
        
        // Check if target ID contains comma-separated values
        if (firstTarget.id && firstTarget.id.includes(',')) {
          // Parse comma-separated IDs into separate target objects
          const ids = firstTarget.id.split(',');
          const names = firstTarget.name ? firstTarget.name.split(' , ') : [];
          
          ctaTargets = ids.map((id: string, index: number) => ({
            id: id.trim(),
            name: names[index] ? names[index].trim() : `Item ${index + 1}`
          }));
          
          // For dropdown, use the first target's ID
          configureTo = ids[0].trim();
        } else {
          // Single target, use as is
          ctaTargets = section.ctaConfig.targets;
          configureTo = firstTarget.id;
        }
      }

      form.reset({
        title: section.title,
        subtitle: section.subtitle,
        sectionType: section.sectionType,
        logoUrl: section.logoUrl,
        titleDecorations: {
          color: section.titleDecoration.color,
          alignment: section.titleDecoration.align.toLowerCase() as 'left' | 'center' | 'right',
          fontSize: section.titleDecoration.size,
          fontStyle: section.titleDecoration.fontStyle.toLowerCase() as any,
        },
        subtitleDecorations: {
          color: section.subtitleDecoration.color,
          alignment: section.subtitleDecoration.align.toLowerCase() as 'left' | 'center' | 'right',
          fontSize: section.subtitleDecoration.size,
          fontStyle: section.subtitleDecoration.fontStyle.toLowerCase() as any,
        },
        contentConfig: {
          sourceType: section.contentConfig.sourceType,
          selectionType: section.contentConfig.selectionType,
          selectedItems: section.contentConfig.selectedItems,
          conditions: section.contentConfig.conditions || [],
          limit: section.contentConfig.limit,
          sort: section.contentConfig.sort,
        },
        hasCTA: section.hasCta,
        cta: section.ctaConfig ? {
          ctaType: section.ctaConfig?.ctaType,
          label: section.ctaConfig?.label,
          actionType: section.ctaConfig?.actionType,
          targets: ctaTargets,
          configureTo: configureTo, // Set configureTo for dropdown
        } as any : undefined,
        displaySettings: section.displaySettings,
        sectionStyling: {
          ...section.sectionStyling,
          gradientColors: gradientColors.length > 0 ? gradientColors : undefined,
          useTransparentBackground: section.sectionStyling?.hasTransparentBackground || false,
        } as any,
        active: section.active,
      });
    }
  }, [sectionDetails, form, mode]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Transform form data to API payload
  const transformToApiPayload = (data: SectionFormData): CreateSectionPayload | UpdateSectionPayload => {
    // Transform gradientColors to gradientConfig.stops for backend
    let transformedSectionStyling = { ...data.sectionStyling };

    // If gradientColors exist in form data, transform them to stops
    if (data.sectionStyling.gradientColors && data.sectionStyling.gradientColors.length > 0) {
      const stops = data.sectionStyling.gradientColors.map((gradientColor: { color: string; opacity: number }, index: number) => {
        // Calculate percentage based on position in array
        const percentage = data.sectionStyling.gradientColors!.length > 1
          ? (index / (data.sectionStyling.gradientColors!.length - 1)) * 100
          : 0;

        return {
          color: gradientColor.color,
          percentage: Math.round(percentage),
        };
      });

      transformedSectionStyling.gradientConfig = {
        stops,
        direction: data.sectionStyling.gradientConfig?.direction || 'TO_BOTTOM',
      };
    }

    // Remove gradientColors before sending to backend (it's UI-only state)
    const { gradientColors: _gradientColors, useTransparentBackground, ...restSectionStyling } = transformedSectionStyling;

    return {
      title: data.title,
      subtitle: data.subtitle,
      sectionType: data.sectionType,
      logoUrl: data.logoUrl,
      titleDecoration: {
        color: data.titleDecorations.color,
        align: data.titleDecorations.alignment.toUpperCase() as 'LEFT' | 'CENTER' | 'RIGHT',
        size: data.titleDecorations.fontSize,
        fontStyle: data.titleDecorations.fontStyle.toUpperCase() as 'NORMAL' | 'MEDIUM' | 'SEMIBOLD' | 'BOLD',
      },
      subtitleDecoration: {
        color: data.subtitleDecorations.color,
        align: data.subtitleDecorations.alignment.toUpperCase() as 'LEFT' | 'CENTER' | 'RIGHT',
        size: data.subtitleDecorations.fontSize,
        fontStyle: data.subtitleDecorations.fontStyle.toUpperCase() as 'NORMAL' | 'MEDIUM' | 'SEMIBOLD' | 'BOLD',
      },
      contentConfig: {
        ...data.contentConfig,
        conditions: data.contentConfig.conditions || [],
      },
      hasCta: data.hasCTA,
      ctaConfig: data.cta ? {
        ctaType: data.cta.ctaType,
        label: data.cta.label,
        actionType: data.cta.actionType,
        targets: data.cta.targets || [],
        // Note: configureTo is UI-only and not sent to API
      } : undefined,
      displaySettings: data.displaySettings,
      sectionStyling: {
        ...restSectionStyling,
        hasTransparentBackground: useTransparentBackground || false, // Map useTransparentBackground to hasTransparentBackground
      },
      active: data.active,
    };
  };

  // Submit handler
  const onSubmit = async (data: SectionFormData) => {
    console.log('🚀 Form submitted!', data);
    console.log('📋 Current form state:', form.getValues());
    console.log('❌ Form errors:', form.formState.errors);
    try {
      const apiPayload = transformToApiPayload(data);
      console.log('📦 API Payload:', apiPayload);

      if (mode === 'create') {
        console.log('✨ Creating section...');
        await createMutation.mutateAsync(apiPayload as CreateSectionPayload);
      } else if (mode === 'edit' && sectionId) {
        console.log('✏️ Updating section...');
        await updateMutation.mutateAsync({
          sectionId: sectionId,
          data: apiPayload as UpdateSectionPayload
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: ROUTES.CMS.SECTIONS.LIST });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      // Error handling is done in the mutation hooks
    }
  };

  // Helper functions for content items (if needed for UI)
  const addContentItem = (item: { id: string; name: string }) => {
    const currentItems = form.getValues('contentConfig.selectedItems') || [];
    form.setValue('contentConfig.selectedItems', [...currentItems, item]);
  };

  const removeContentItem = (index: number) => {
    const currentItems = form.getValues('contentConfig.selectedItems') || [];
    form.setValue('contentConfig.selectedItems', currentItems.filter((_, i) => i !== index));
  };

  // Error handler
  const onError = (errors: any) => {
    console.log('❌ Form validation failed!');
    console.log('🐛 All errors:', errors);
    console.log('🐛 Error keys:', Object.keys(errors));

    // Log each error field
    Object.keys(errors).forEach(key => {
      console.log(`🔴 ${key}:`, errors[key]);
    });
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit as any, onError),
    isSubmitting,
    isLoadingDetails,
    mode,
    addContentItem,
    removeContentItem,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
  };
};
