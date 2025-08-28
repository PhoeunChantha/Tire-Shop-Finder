import { useCallback } from "react";
import { useForm, router } from "@inertiajs/react";

import type { 
  UseBusinessSettingFormOptions, 
  UseBusinessSettingFormReturn,
  BusinessSettingFormData,
  BusinessSettingErrors
} from "@/types/business-setting";

/**
 * Custom hook for managing business setting form state and submission
 * Handles both creation and updating of business settings
 */
export default function useBusinessSettingForm({
  initialData = {},
  isEdit = false
}: UseBusinessSettingFormOptions = {}): UseBusinessSettingFormReturn {
  
  const { data, setData, post, put, processing, errors, reset } = useForm<BusinessSettingFormData>({
    type: {},
    current_login_bg_image: null,
    current_system_logo: null,
    current_system_fav_icon: null,
    ...initialData,
  });

  /**
   * Handle successful form submission
   * Resets form and refreshes page data
   */
  const handleSuccess = useCallback(() => {
    reset();
    // Force Inertia to reload fresh data
    router.visit(route("business-settings.index"), {
      method: 'get',
      preserveState: false,
      preserveScroll: false
    });
  }, [reset]);

  /**
   * Handle form submission errors
   * Could be extended to show toast notifications
   */
  const handleError = useCallback((errors: Record<string, string>) => {
    console.error('Form submission failed:', errors);
    // TODO: Add toast notification for errors
  }, []);

  /**
   * Submit form data
   * Always uses store route since business settings update/create logic is handled in the same method
   */
  const submit = useCallback(() => {
    const submitOptions = {
      onSuccess: handleSuccess,
      onError: handleError,
      forceFormData: true, // Required for file uploads
    };

    post(route("business-settings.store"), submitOptions);
  }, [handleSuccess, handleError, post]);

  return {
    data,
    setData,
    processing,
    errors,
    submit,
  };
}
