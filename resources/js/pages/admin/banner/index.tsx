import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BannersTable from '@/components/banners/BannersTable';

interface Banner {
    id: number;
    title: string;
    descriptions: string;
    image: string | null;
    url: string | null;
    is_active: boolean;
    sort_order: number;
    creator: {
        name: string;
        email: string;
    };
    created_at: string;
}

interface BannerIndexProps {
    auth: any;
    banners: {
        data: Banner[];
        total: number;
        current_page: number;
        last_page: number;
        per_page: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        status: string;
        per_page: number;
        page: number;
    };
}

export default function BannerIndex({ auth, banners, filters }: BannerIndexProps) {
    return (
        <AppLayout>
            <Head title="Banner Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <BannersTable banners={banners} filters={filters} />
            </div>
        </AppLayout>
    );
}