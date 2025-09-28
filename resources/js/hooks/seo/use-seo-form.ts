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
    seo_image: initialData?.seo_image || null,
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
    console.log('Form data before submit:', data);
    
    const submitOptions = {
      preserveScroll: true,
      forceFormData: true, // Required for file uploads
      onSuccess: () => {
        console.log('Form submitted successfully');
      },
      onError: (errors: any) => {
        console.error('Form submission errors:', errors);
      },
    };

    // if (isEdit) {
    //   put(route('seo.update', { seo: 'settings' }), submitOptions);
    // } else {
    //   post(route('seo.store'), submitOptions);
    // }
    post(route("seo.store"), submitOptions);
  };

  return {
    data,
    setData,
    processing,
    errors,
    submit,
  };
}