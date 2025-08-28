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
    business_name?: string;
    description?: string;
    login_bg_image?: File | null;
    system_logo?: File | null;
    system_fav_icon?: File | null;
  };
  current_login_bg_image?: string | null;
  current_system_logo?: string | null;
  current_system_fav_icon?: string | null;
}

export interface BusinessSettingErrors {
  business_name?: string;
  description?: string;
  login_bg_image?: string;
  system_logo?: string;
  system_fav_icon?: string;
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
  businessSettings: BusinessSetting[];
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