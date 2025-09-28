import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { router } from "@inertiajs/react";

interface BannerData {
    title_translations: {
        en: string;
        km: string;
    };
    descriptions_translations: {
        en: string;
        km: string;
    };
    image: File | string | null;
    is_active: boolean;
    sort_order: number;
}

export default function useBannerForm(initialData: Partial<BannerData> = {}) {
    const { data, setData, post, put, processing, errors, reset } = useForm<BannerData>({
        title_translations: {
            en: "",
            km: "",
        },
        descriptions_translations: {
            en: "",
            km: "",
        },
        image: null,
        is_active: true,
        sort_order: 0,
        ...initialData,
    });

    const createBanner: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('banners.store'));
    };

    const updateBanner = (bannerId: number) => (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { ...data };
        // Remove image field completely when it's not a File object
        if (!data.image || typeof data.image === 'string') {
            delete formData.image;
        }
        formData._method = 'PUT';
        router.post(route("banners.update", bannerId), formData);
    };

    return {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        createBanner,
        updateBanner,
    };
}