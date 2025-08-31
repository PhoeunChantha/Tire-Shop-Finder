import { toast as sonnerToast } from 'sonner';

// Re-export Sonner toast functions for consistency
export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message),
  message: (message: string) => sonnerToast.message(message),
  loading: (message: string) => sonnerToast.loading(message),
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
};

// Make it available globally for backwards compatibility
if (typeof window !== 'undefined') {
  window.toast = toast;
}

export default toast;