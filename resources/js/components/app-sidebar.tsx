import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Users, Shield, Key, Building, Settings, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { t } = useTranslation();
    
    const mainNavItems: NavItem[] = [
        {
            title: t('dashboard'),
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('businesses'),
            href: '/admin/businesses',
            icon: Building,
        },
        {
            title: t('users'),
            href: '/admin/users',
            icon: Users,
        },
        {
            title: t('roles'),
            href: '/admin/roles',
            icon: Shield,
        },
        {
            title: t('permissions'),
            href: '/admin/permissions',
            icon: Key,
        },
        {
            title: t('banners'),
            href: '/admin/banners',
            icon: Image,
        },
        {
            title: t('settings'),
            icon: Settings,
            items: [
                {
                    title: t('business_settings'),
                    href: '/admin/business-settings',
                },
                {
                    title: t('seo'),
                    href: '/admin/seo',
                },
            ],
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            {/* <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter> */}
        </Sidebar>
    );
}
