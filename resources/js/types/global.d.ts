import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
    
    interface Window {
        toast: {
            success: (message: string) => void;
            error: (message: string) => void;
            info: (message: string) => void;
            warning: (message: string) => void;
            message: (message: string) => void;
            loading: (message: string) => void;
        };
    }
    
    const toast: {
        success: (message: string) => void;
        error: (message: string) => void;
        info: (message: string) => void;
        warning: (message: string) => void;
        message: (message: string) => void;
        loading: (message: string) => void;
    };
}
