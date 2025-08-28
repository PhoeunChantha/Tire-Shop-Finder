import type { route as routeFn } from 'ziggy-js';
import type Notiflix from 'notiflix';

declare global {
    const route: typeof routeFn;
    
    interface Window {
        Notiflix: typeof Notiflix;
    }
    
    const Notiflix: typeof import('notiflix').default;
}
