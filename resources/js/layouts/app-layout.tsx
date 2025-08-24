import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const dynamicBreadcrumbs = useBreadcrumbs();
    
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs || dynamicBreadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};
