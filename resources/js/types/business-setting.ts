import { FormEvent } from "react";

// Core business setting types
export interface BusinessSetting {
  id: number;
  type: string;
  value: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessSettingFormData {
  type: {
    name?: string;
    descriptions?: string;
    name_translations?: {
      en: string;
      km: string;
    };
    descriptions_translations?: {
      en: string;
      km: string;
    };
    website_description?: string;
    website_description_translations?: {
      en: string;
      km: string;
    };
    // Contact Information
    contact_address?: string;
    contact_phone?: string;
    contact_email?: string;
    // Social Media
    social_facebook?: string;
    social_telegram?: string;
    social_messenger?: string;
    login_bg_image?: File | null;
    system_logo?: File | null;
    system_fav_icon?: File | null;
    // Page Banners
    about_banner_image?: File | null;
    contact_banner_image?: File | null;
    google_login_status?: string;
    google_client_id?: string;
    google_client_secret?: string;
    google_redirect_uri?: string;
    facebook_login_status?: string;
    facebook_client_id?: string;
    facebook_client_secret?: string;
    facebook_redirect_uri?: string;
    // Index signature to allow dynamic property access
    [key: string]: any;
  };
  current_login_bg_image?: string | null;
  current_system_logo?: string | null;
  current_system_fav_icon?: string | null;
  current_about_banner_image?: string | null;
  current_contact_banner_image?: string | null;
}

export interface BusinessSettingErrors {
  name?: string;
  descriptions?: string;
  'name_translations.en'?: string;
  'name_translations.km'?: string;
  'descriptions_translations.en'?: string;
  'descriptions_translations.km'?: string;
  website_description?: string;
  'website_description_translations.en'?: string;
  'website_description_translations.km'?: string;
  contact_address?: string;
  contact_phone?: string;
  contact_email?: string;
  social_facebook?: string;
  social_telegram?: string;
  social_messenger?: string;
  login_bg_image?: string;
  system_logo?: string;
  system_fav_icon?: string;
  about_banner_image?: string;
  contact_banner_image?: string;
  google_client_id?: string;
  google_client_secret?: string;
  google_redirect_uri?: string;
  facebook_client_id?: string;
  facebook_client_secret?: string;
  facebook_redirect_uri?: string;
  [key: string]: string | undefined; // Allow any additional error keys
}

// Component prop types
export interface BusinessSettingFormProps {
  data: BusinessSettingFormData;
  setData: (field: string, value: any) => void;
  errors: Record<string, string> | BusinessSettingErrors;
  processing: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitText?: string;
  isEdit?: boolean;
}

export interface BusinessSettingIndexProps {
  businessSettingsData: BusinessSetting[];
}

// Hook types
export interface UseBusinessSettingFormOptions {
  initialData?: Partial<BusinessSettingFormData>;
  isEdit?: boolean;
}

export interface UseBusinessSettingFormReturn {
  data: BusinessSettingFormData;
  setData: (field: string, value: any) => void;
  processing: boolean;
  errors: Record<string, string>;
  submit: () => void;
}