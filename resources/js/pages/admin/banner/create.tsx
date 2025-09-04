import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BannerForm from '@/components/banners/BannerForm';
import useBannerForm from '@/hooks/banners/use-bannerForm';

export default function BannerCreate({ auth }: { auth: any }) {
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');
    const { data, setData, processing, errors, createBanner } = useBannerForm();

    return (
        <AppLayout>
            <Head title="Create Banner" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Banner</h1>
                        <p className="text-gray-600">Add a new banner to the website carousel</p>
                    </div>
                </div>
                
                <BannerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={createBanner}
                    submitText="Create Banner"
                    activeLanguage={activeLanguage}
                    setActiveLanguage={setActiveLanguage}
                />
            </div>
        </AppLayout>
    );
}