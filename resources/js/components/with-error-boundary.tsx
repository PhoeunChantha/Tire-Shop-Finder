import React, { ComponentType, ReactNode } from 'react';
import ErrorBoundary from './error-boundary';

interface WithErrorBoundaryOptions {
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Higher-Order Component that wraps a component with an Error Boundary
 * 
 * @param WrappedComponent - The component to wrap
 * @param options - Error boundary options
 * @returns Component wrapped with error boundary
 */
function withErrorBoundary<P extends object>(
    WrappedComponent: ComponentType<P>,
    options: WithErrorBoundaryOptions = {}
) {
    const ComponentWithErrorBoundary = (props: P) => {
        return (
            <ErrorBoundary 
                fallback={options.fallback} 
                onError={options.onError}
            >
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };

    // Copy static properties and display name
    ComponentWithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

    return ComponentWithErrorBoundary;
}

export default withErrorBoundary;