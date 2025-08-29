import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { FlagIcon } from './flag-icon';
import { Languages, Globe } from 'lucide-react';

const languages = [
    { code: 'en' as const, name: 'English' },
    { code: 'km' as const, name: 'ខ្មែរ' },
];

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-auto px-2 flex items-center gap-1">
                    <FlagIcon 
                        country={currentLanguage.code} 
                        alt={currentLanguage.name}
                        className="w-5 h-3"
                    />
                    <span className="sr-only">{t('language')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px]">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <FlagIcon 
                            country={language.code} 
                            alt={language.name}
                            className="w-6 h-4"
                        />
                        <span className="flex-1">{language.name}</span>
                        {currentLanguage.code === language.code && (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function LanguageSwitcherExtended() {
    const { i18n, t } = useTranslation();

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <FlagIcon 
                        country={currentLanguage.code} 
                        alt={currentLanguage.name}
                        className="w-5 h-3"
                    />
                    <span className="hidden sm:inline">{currentLanguage.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
                <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                    {t('language')}
                </div>
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className="flex items-center gap-3 cursor-pointer py-2"
                    >
                        <FlagIcon 
                            country={language.code} 
                            alt={language.name}
                            className="w-6 h-4"
                        />
                        <span className="flex-1">{language.name}</span>
                        {currentLanguage.code === language.code && (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function LanguageSwitcherCompact() {
    const { i18n, t } = useTranslation();

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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-12 px-1 hover:bg-accent/50 border border-transparent hover:border-border"
                >
                    <FlagIcon 
                        country={currentLanguage.code} 
                        alt={currentLanguage.name}
                        className="w-6 h-4"
                    />
                    <span className="sr-only">{t('language')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                    {t('language')}
                </div>
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className="flex items-center gap-3 cursor-pointer py-3 px-3"
                    >
                        <FlagIcon 
                            country={language.code} 
                            alt={language.name}
                            className="w-8 h-5 shadow-sm"
                        />
                        <div className="flex flex-col">
                            <span className="font-medium">{language.name}</span>
                            <span className="text-xs text-muted-foreground uppercase">{language.code}</span>
                        </div>
                        {currentLanguage.code === language.code && (
                            <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}