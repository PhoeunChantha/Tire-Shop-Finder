import '../css/app.css';
import './lib/i18n';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import i18n from './lib/i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Make toast available globally
window.toast = toast;

// Flash message handler using Sonner
const showFlashMessages = (page) => {
    const flash = page.props.flash;
    if (flash?.success) {
        toast.success(flash.success);
    }
    if (flash?.error) {
        toast.error(flash.error);
    }
    if (flash?.info) {
        toast.info(flash.info);
    }
    if (flash?.warning) {
        toast.warning(flash.warning);
    }
};

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        // Show flash messages on page render
        showFlashMessages(props.initialPage);

        // Sync i18n language with Laravel locale on initial load
        const initialLocale = props.initialPage.props?.locale;
        if (initialLocale && ['en', 'km'].includes(initialLocale) && initialLocale !== i18n.language) {
            i18n.changeLanguage(initialLocale);
        }

        root.render(
            <>
                <App {...props} />
                <Toaster />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Listen for Inertia page changes to show flash messages and sync language
router.on('success', (event) => {
    showFlashMessages(event.detail.page);
    
    // Sync i18n language with Laravel locale on page navigation
    const laravelLocale = event.detail.page.props?.locale;
    if (laravelLocale && ['en', 'km'].includes(laravelLocale) && laravelLocale !== i18n.language) {
        i18n.changeLanguage(laravelLocale);
    }
});

// This will set light / dark mode on load...
initializeTheme();
