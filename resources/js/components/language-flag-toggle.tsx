import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Button } from './ui/button';
import { FlagIcon } from './flag-icon';

const languages = [
    { code: 'en' as const, name: 'English' },
    { code: 'km' as const, name: 'ខ្មែរ' },
];

export function LanguageFlagToggle() {
    const { i18n } = useTranslation();

    const changeLanguage = (languageCode: string) => {
        // Change frontend language
        i18n.changeLanguage(languageCode);
        
        // Sync with backend via Laravel route
        router.get(`/language/${languageCode}`, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
    const otherLanguage = languages.find(lang => lang.code !== i18n.language) || languages[1];

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLanguage(otherLanguage.code)}
            className="h-8 w-12 px-1 hover:bg-accent/50 transition-all duration-200 hover:scale-105"
            title={`Switch to ${otherLanguage.name}`}
        >
            <FlagIcon 
                country={currentLanguage.code} 
                alt={currentLanguage.name}
                className="w-6 h-4 shadow-sm"
            />
        </Button>
    );
}