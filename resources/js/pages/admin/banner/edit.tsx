import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import BannerForm from '@/components/banners/BannerForm';
import useBannerForm from '@/hooks/banners/use-bannerForm';
import { getImageUrl } from '@/lib/imageHelper';

interface Banner {
    id: number;
    title: string;
    descriptions: string;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    title_translations: {
        en: string;
        km: string;
    };
    descriptions_translations: {
        en: string;
        km: string;
    };
}

interface BannerEditProps {
    auth: any;
    banner: Banner;
}

export default function BannerEdit({ auth, banner }: BannerEditProps) {
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');
    
    const initialData = {
        title_translations: banner.title_translations || {
            en: banner.title || '',
            km: ''
        },
        descriptions_translations: banner.descriptions_translations || {
            en: banner.descriptions || '',
            km: ''
        },
        image: banner.image ? getImageUrl(banner.image, 'banners') : null,
        is_active: banner.is_active ?? true,
        sort_order: banner.sort_order ?? 0,
    };
    
    const { data, setData, processing, errors, updateBanner } = useBannerForm(initialData);

    return (
        <AppLayout>
            <Head title={`Edit Banner - ${banner.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Banner</h1>
                        <p className="text-gray-600">Update banner information</p>
                    </div>
                </div>
                
                <BannerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={updateBanner(banner.id)}
                    submitText="Update Banner"
                    activeLanguage={activeLanguage}
                    setActiveLanguage={setActiveLanguage}
                />
            </div>
        </AppLayout>
    );
}