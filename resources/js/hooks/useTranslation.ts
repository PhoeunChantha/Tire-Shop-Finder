import { usePage } from '@inertiajs/react';

interface PageProps {
    locale?: string;
    translations?: Record<string, Record<string, string>>;
}

export function useTranslation() {
    const { props } = usePage<PageProps>();
    const locale = props.locale || 'en';
    const translations = props.translations || {};

    const t = (key: string, fallback?: string): string => {
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) break;
        }

        return value || fallback || key;
    };

    return { t, locale };
}