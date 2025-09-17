import { FormEvent } from "react";

// Core SEO setting types
export interface SeoSetting {
  id: number;
  type: string;
  value: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SeoFormData {
  type: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    google_analytics_id?: string;
    facebook_pixel_id?: string;
    google_site_verification?: string;
    robots_txt?: string;
  };
  seo_image?: File | string | null;
}

export interface SeoErrors {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  google_analytics_id?: string;
  facebook_pixel_id?: string;
  google_site_verification?: string;
  robots_txt?: string;
  seo_image?: string;
  [key: string]: string | undefined; // Allow any additional error keys
}

// Component prop types
export interface SeoFormProps {
  data: SeoFormData;
  setData: (field: string, value: any) => void;
  errors: Record<string, string> | SeoErrors;
  processing: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitText?: string;
  isEdit?: boolean;
}

export interface SeoIndexProps {
  seoSettingsData: SeoSetting[];
}

// Hook types
export interface UseSeoFormOptions {
  initialData?: Partial<SeoFormData>;
  isEdit?: boolean;
}

export interface UseSeoFormReturn {
  data: SeoFormData;
  setData: (field: string, value: any) => void;
  processing: boolean;
  errors: Record<string, string>;
  submit: () => void;
}