import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

/**
 * Hook to synchronize Laravel locale with React i18n
 * This ensures that when Laravel changes the locale,
 * the frontend i18n also updates accordingly.
 */
export function useLanguageSync() {
    const { locale } = usePage().props as { locale: string };
    const { i18n } = useTranslation();
    
    useEffect(() => {
        // Only change language if it's different from current
        if (locale && locale !== i18n.language) {
            i18n.changeLanguage(locale);
        }
    }, [locale, i18n]);
    
    return { currentLocale: locale, i18n };
}