import React, { useCallback, useState } from 'react';
import AppLogoIcon from './app-logo-icon';
import { getImageUrl } from '@/lib/imageHelper';
import withErrorBoundary from './with-error-boundary';
import useBusinessSettings, { BusinessSettings } from '@/hooks/use-business-settings';
import { useTranslation } from '@/hooks/useTranslation';

// Types
interface AppLogoProps {
    businessSettings?: BusinessSettings;
    className?: string;
    showName?: boolean;
}

// Constants
const DEFAULT_BUSINESS_NAME = 'Tire Shop Finder Cambodia';
const LOGO_SIZE_CLASS = 'size-12';
const CONTAINER_SIZE_CLASS = 'size-12';

/**
 * AppLogo Component
 * 
 * Displays the application logo with fallback handling and proper error boundaries.
 * Supports both custom business logos and default icon fallback.
 */
const AppLogo: React.FC<AppLogoProps> = ({ 
    businessSettings, 
    className = '',
    showName = true 
}) => {
    const [imageError, setImageError] = useState(false);
    
    // Use custom hook for business settings and language
    const { businessData, getBusinessName } = useBusinessSettings(businessSettings);
    const { locale } = useTranslation();
    
    // Get business name in current language
    const displayName = getBusinessName(locale);
    
    // Get system logo URL with error handling
    const systemLogoUrl = businessData.systemLogo && !imageError 
        ? getImageUrl(businessData.systemLogo, 'business-settings')
        : null;

    // Handle image load errors
    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    // Handle image load success (reset error state)
    const handleImageLoad = useCallback(() => {
        setImageError(false);
    }, []);

    // Render logo image or fallback icon
    const renderLogo = () => {
        if (systemLogoUrl) {
            return (
                <img 
                    src={systemLogoUrl}
                    alt={`${displayName} Logo`}
                    className={`${LOGO_SIZE_CLASS} rounded object-cover bg-white dark:bg-black`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    loading="lazy"
                />
            );
        }

        return (
            <AppLogoIcon 
                className={`${LOGO_SIZE_CLASS} fill-current text-white dark:text-black`}
                aria-label="Default Logo"
            />
        );
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div 
                className={`flex ${CONTAINER_SIZE_CLASS} items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground`}
                role="img"
                aria-label="Application Logo"
            >
                {renderLogo()}
            </div>
            
            {showName && (
                <div className="grid flex-1 text-left text-sm">
                    <span 
                        className="mb-0.5 truncate leading-tight font-semibold"
                        title={displayName} 
                    >
                        {displayName}
                    </span>
                </div>
            )}
        </div>
    );
};

// Add display name for debugging
AppLogo.displayName = 'AppLogo';

// Fallback component for error boundary
const AppLogoFallback = () => (
    <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-gray-200">
            <AppLogoIcon className="size-5 fill-current text-gray-600" />
        </div>
        <div className="grid flex-1 text-left text-sm">
            <span className="mb-0.5 truncate leading-tight font-semibold text-gray-600">
                {DEFAULT_BUSINESS_NAME}
            </span>
        </div>
    </div>
);

// Wrap with error boundary and memoization
export default withErrorBoundary(React.memo(AppLogo), {
    fallback: <AppLogoFallback />,
    onError: (error, errorInfo) => {
        console.error('AppLogo error:', error, errorInfo);
        // You can add error reporting service here (e.g., Sentry)
    }
});
