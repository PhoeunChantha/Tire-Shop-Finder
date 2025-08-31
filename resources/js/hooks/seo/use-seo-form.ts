import { useForm } from "@inertiajs/react";
import { useMemo } from "react";
import type { 
  SeoFormData, 
  UseSeoFormOptions, 
  UseSeoFormReturn 
} from "@/types/seo";

/**
 * Custom hook for managing SEO form state and submission
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing form data, setters, and submission handlers
 */
export default function useSeoForm({
  initialData = {},
  isEdit = false,
}: UseSeoFormOptions = {}): UseSeoFormReturn {
  
  // Default form structure
  const defaultFormData: SeoFormData = useMemo(() => ({
    type: {
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      google_analytics_id: "",
      facebook_pixel_id: "",
      google_site_verification: "",
      robots_txt: "",
      ...initialData?.type,
    },
  }), [initialData]);

  // Initialize Inertia form with proper defaults
  const {
    data,
    setData,
    post,
    put,
    processing,
    errors,
  } = useForm<SeoFormData>(defaultFormData);

  // Handle form submission
  const submit = () => {
    const url = isEdit ? route('seo.update', { seo: 'settings' }) : route('seo.store');
    const method = isEdit ? put : post;
    
    method(url, {
      preserveScroll: true,
      onSuccess: () => {
        // Optional: Add success handling here
      },
      onError: () => {
        // Optional: Add error handling here
      },
    });
  };

  return {
    data,
    setData,
    processing,
    errors,
    submit,
  };
}