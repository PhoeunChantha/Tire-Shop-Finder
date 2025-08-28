import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import Notiflix from 'notiflix';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Make Notiflix available globally
window.Notiflix = Notiflix;

// Flash message handler using Notiflix
const showFlashMessages = (page) => {
    const flash = page.props.flash;
    if (flash?.success) {
        Notiflix.Notify.success(flash.success);
    }
    if (flash?.error) {
        Notiflix.Notify.failure(flash.error);
    }
};

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        // Show flash messages on page render
        showFlashMessages(props.initialPage);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// Listen for Inertia page changes to show flash messages
router.on('success', (event) => {
    showFlashMessages(event.detail.page);
});

// This will set light / dark mode on load...
initializeTheme();
