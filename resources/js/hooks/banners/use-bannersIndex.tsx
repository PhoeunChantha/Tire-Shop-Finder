import { router } from "@inertiajs/react";

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

interface BannersData {
    data: Banner[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
}

interface Filters {
    search: string;
    status: string;
    per_page: number;
    page: number;
}

export default function useBannersIndex() {
    const handleSortOrderChange = (bannerId: number, direction: 'up' | 'down') => {
        // TODO: Implement sort order change route in Laravel
        console.log('Sort order change not implemented:', { bannerId, direction });
    };

    const toggleStatus = (bannerId: number, currentStatus: boolean) => {
        router.patch(route('banners.toggle-status', bannerId), {
            is_active: !currentStatus
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Show success message
            },
            onError: (errors) => {
                // Optional: Show error message
                console.error('Failed to toggle status:', errors);
            }
        });
    };

    const deleteBanner = (bannerId: number) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            router.delete(route('banners.destroy', bannerId), {
                preserveState: true,
                onSuccess: () => {
                    // Optional: Show success message
                },
                onError: (errors) => {
                    // Optional: Show error message
                    console.error('Failed to delete banner:', errors);
                }
            });
        }
    };

    const duplicateBanner = (bannerId: number) => {
        // TODO: Implement duplicate banner route in Laravel
        console.log('Duplicate banner not implemented:', bannerId);
    };

    const bulkToggleStatus = (bannerIds: number[], status: boolean) => {
        // TODO: Implement bulk toggle status route in Laravel
        console.log('Bulk toggle status not implemented:', { bannerIds, status });
    };

    const bulkDelete = (bannerIds: number[]) => {
        // TODO: Implement bulk delete route in Laravel
        console.log('Bulk delete not implemented:', bannerIds);
    };

    return {
        handleSortOrderChange,
        toggleStatus,
        deleteBanner,
        duplicateBanner,
        bulkToggleStatus,
        bulkDelete,
    };
}