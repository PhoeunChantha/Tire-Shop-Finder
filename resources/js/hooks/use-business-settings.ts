import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

// Types
export interface BusinessSettings {
    [key: string]: string | null;
}

export interface BusinessData {
    businessName: string;
    nameTranslations: { en?: string; km?: string } | null;
    systemLogo: string | null;
    [key: string]: string | null | { en?: string; km?: string };
}

interface PageProps {
    businessSettings?: BusinessSettings;
}

// Default values
const DEFAULT_BUSINESS_NAME = 'Tire Shop Finder Cambodia';

/**
 * Custom hook for managing business settings
 * 
 * Provides a centralized way to access business settings with proper defaults
 * and type safety across the application.
 * 
 * @param fallbackSettings - Optional fallback settings to merge with global settings
 * @returns Object containing business settings and helper functions
 */
export function useBusinessSettings(fallbackSettings?: BusinessSettings) {
    const { props } = usePage<PageProps>();

    // Merge global settings with fallback settings
    const mergedSettings = useMemo(() => {
        return {
            ...props.businessSettings,
            ...fallbackSettings,
        };
    }, [props.businessSettings, fallbackSettings]);

    // Extract commonly used business data
    const businessData: BusinessData = useMemo(() => {
        // Parse name translations
        let nameTranslations: { en?: string; km?: string } | null = null;
        if (mergedSettings?.name_translations) {
            try {
                nameTranslations = typeof mergedSettings.name_translations === 'string' 
                    ? JSON.parse(mergedSettings.name_translations) 
                    : mergedSettings.name_translations;
            } catch (e) {
                nameTranslations = null;
            }
        }

        // Handle business name with fallback from different field names
        let businessName = DEFAULT_BUSINESS_NAME;
        if (mergedSettings?.business_name) {
            businessName = mergedSettings.business_name;
        } else if (mergedSettings?.name) {
            businessName = mergedSettings.name;
        } else if (nameTranslations) {
            businessName = nameTranslations.en || nameTranslations.km || DEFAULT_BUSINESS_NAME;
        }

        return {
            businessName,
            nameTranslations,
            systemLogo: mergedSettings?.system_logo || null,
            // Add other commonly used settings here
            businessEmail: mergedSettings?.business_email || null,
            businessPhone: mergedSettings?.business_phone || null,
            businessAddress: mergedSettings?.business_address || null,
            businessDescription: mergedSettings?.business_description || null,
        };
    }, [mergedSettings]);

    // Helper function to get a specific setting with fallback
    const getSetting = (key: string, defaultValue?: string): string | null => {
        return mergedSettings?.[key] || defaultValue || null;
    };

    // Helper function to check if a setting exists and has a value
    const hasSetting = (key: string): boolean => {
        return !!(mergedSettings?.[key] && mergedSettings[key]?.trim());
    };

    // Helper function to get all settings as a flat object
    const getAllSettings = (): BusinessSettings => {
        return mergedSettings || {};
    };

    // Helper function to get business name by locale
    const getBusinessName = (locale?: string) => {
        if (!locale || !businessData.nameTranslations) {
            return businessData.businessName;
        }
        
        return businessData.nameTranslations[locale as 'en' | 'km'] || businessData.businessName;
    };

    return {
        // Data
        businessData,
        settings: mergedSettings,
        
        // Helper functions
        getSetting,
        hasSetting,
        getAllSettings,
        getBusinessName,
        
        // Commonly used individual values
        businessName: businessData.businessName,
        systemLogo: businessData.systemLogo,
    };
}

// Export default hook
export default useBusinessSettings;