import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

// Types
export interface BusinessSettings {
    [key: string]: string | null;
}

export interface BusinessData {
    businessName: string;
    nameTranslations: { en?: string; km?: string } | null;
    descriptionTranslations: { en?: string; km?: string } | null;
    websiteDescriptionTranslations: { en?: string; km?: string } | null;
    systemLogo: string | null;
    // Contact Information
    contactAddress: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    // Social Media
    socialFacebook: string | null;
    socialTelegram: string | null;
    socialMessenger: string | null;
    customSocialMedia: { [key: string]: { name: string; url: string } };
    // Website Statistics
    statsTireShops: string | null;
    statsHappyCustomers: string | null;
    statsProvincesCovered: string | null;
    statsAverageRating: string | null;
    [key: string]: string | null | { en?: string; km?: string } | { [key: string]: { name: string; url: string } };
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
        // Helper function to parse JSON translations
        const parseTranslations = (fieldName: string) => {
            if (mergedSettings?.[fieldName]) {
                try {
                    return typeof mergedSettings[fieldName] === 'string' 
                        ? JSON.parse(mergedSettings[fieldName] as string) 
                        : mergedSettings[fieldName];
                } catch (e) {
                    return null;
                }
            }
            return null;
        };

        // Parse translations
        const nameTranslations = parseTranslations('name_translations');
        const descriptionTranslations = parseTranslations('descriptions_translations');
        const websiteDescriptionTranslations = parseTranslations('website_description_translations');

        // Parse custom social media fields
        const customSocialMedia: { [key: string]: { name: string; url: string } } = {};
        if (mergedSettings) {
            Object.keys(mergedSettings).forEach(key => {
                if (key.startsWith('social_custom_') && !key.endsWith('_name') && mergedSettings[key]) {
                    const customId = key.replace('social_custom_', '');
                    const nameKey = `social_custom_${customId}_name`;
                    
                    customSocialMedia[customId] = {
                        name: mergedSettings[nameKey] || customId,
                        url: mergedSettings[key] || ''
                    };
                }
            });
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
            descriptionTranslations,
            websiteDescriptionTranslations,
            systemLogo: mergedSettings?.system_logo || null,
            // Contact Information
            contactAddress: mergedSettings?.contact_address || null,
            contactPhone: mergedSettings?.contact_phone || null,
            contactEmail: mergedSettings?.contact_email || null,
            // Social Media
            socialFacebook: mergedSettings?.social_facebook || null,
            socialTelegram: mergedSettings?.social_telegram || null,
            socialMessenger: mergedSettings?.social_messenger || null,
            customSocialMedia,
            // Website Statistics
            statsTireShops: mergedSettings?.stats_tire_shops || null,
            statsHappyCustomers: mergedSettings?.stats_happy_customers || null,
            statsProvincesCovered: mergedSettings?.stats_provinces_covered || null,
            statsAverageRating: mergedSettings?.stats_average_rating || null,
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

    // Helper function to get website description by locale
    const getWebsiteDescription = (locale?: string): string | null => {
        if (!businessData.websiteDescriptionTranslations) {
            return null;
        }
        
        if (!locale) {
            return businessData.websiteDescriptionTranslations.en || businessData.websiteDescriptionTranslations.km || null;
        }
        
        return businessData.websiteDescriptionTranslations[locale as 'en' | 'km'] || null;
    };

    // Helper function to check if social media link exists
    const hasSocialMedia = (platform: 'facebook' | 'telegram' | 'messenger'): boolean => {
        const platformMap = {
            facebook: businessData.socialFacebook,
            telegram: businessData.socialTelegram,
            messenger: businessData.socialMessenger
        };
        return !!(platformMap[platform] && platformMap[platform]?.trim());
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
        getWebsiteDescription,
        hasSocialMedia,
        
        // Commonly used individual values
        businessName: businessData.businessName,
        systemLogo: businessData.systemLogo,
    };
}

// Export default hook
export default useBusinessSettings;