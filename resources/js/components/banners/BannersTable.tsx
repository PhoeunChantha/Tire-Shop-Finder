import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DataTableFilter from '@/components/DefaultDataTableFilter';
import PaginationWrapper from '@/components/PaginationWrapper';
import ActionButtons from '@/components/action-button';
import DeleteModal from '@/components/DeleteModal';
import { Plus, ImageIcon, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

interface Banner {
    id: number;
    title: string;
    descriptions: string;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    creator: {
        name: string;
        email: string;
    };
    created_at: string;
}

interface BannersTableProps {
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

export default function BannersTable({ banners, filters }: BannersTableProps) {
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        banner: null as Banner | null,
        processing: false
    });

    const handleDeleteClick = (banner: Banner) => {
        setDeleteModal({
            open: true,
            banner,
            processing: false
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteModal.banner) return;
        
        setDeleteModal(prev => ({ ...prev, processing: true }));
        
        router.delete(route('banners.destroy', deleteModal.banner.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ open: false, banner: null, processing: false });
            },
            onError: () => {
                setDeleteModal(prev => ({ ...prev, processing: false }));
            }
        });
    };

    const getBannerActions = (banner: Banner) => [
        {
            key: 'view',
            label: 'View',
            href: route('banners.show', banner.id)
        },
        {
            key: 'edit',
            label: 'Edit',
            href: route('banners.edit', banner.id)
        },
        {
            key: banner.is_active ? 'deactivate' : 'activate',
            label: banner.is_active ? 'Deactivate' : 'Activate',
            onClick: () => toggleStatus(banner.id, banner.is_active),
            className: banner.is_active ? 'text-orange-600' : 'text-green-600'
        },
        {
            key: 'delete',
            label: 'Delete',
            onClick: () => handleDeleteClick(banner),
            className: 'text-red-600'
        }
    ];

    const filterConfig = {
        search: {
            enabled: true,
            placeholder: "Search banners...",
            debounce: 300
        },
        perPage: {
            enabled: true,
            default: 10
        },
        quickFilters: [
            {
                type: 'select',
                key: 'status',
                placeholder: 'Filter by Status',
                options: [
                    { value: '', label: 'All Banners' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                ]
            }
        ]
    };

    const getStatusBadge = (banner: Banner) => {
        if (banner.is_active) {
            return <Badge className="bg-green-100 text-green-800"><ToggleRight className="w-3 h-3 mr-1" />Active</Badge>;
        } else {
            return <Badge className="bg-gray-100 text-gray-800"><ToggleLeft className="w-3 h-3 mr-1" />Inactive</Badge>;
        }
    };

    const getBannerImageUrl = (banner: Banner) => {
        if (banner.image) {
            return getImageUrl(banner.image, 'banners');
        }
        return null;
    };
    

    const handleSortOrderChange = (bannerId: number, direction: 'up' | 'down') => {
        router.post(route('banners.sort'), {
            banner_id: bannerId,
            direction: direction
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleStatus = (bannerId: number, currentStatus: boolean) => {
        router.patch(route('banners.toggle-status', bannerId), {
            is_active: !currentStatus
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
                    <p className="text-muted-foreground">
                        Manage website banners and promotional content
                    </p>
                </div>
                <Button asChild>
                    <Link href={route('banners.create')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Banner
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Banners</CardTitle>
                    <DataTableFilter
                        filters={filters}
                        config={filterConfig}
                        routeName="banners.index"
                    />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {banners.data.map((banner) => (
                            <div
                                key={banner.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-40 h-40 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                        {getBannerImageUrl(banner) ? (
                                            <img
                                                src={getBannerImageUrl(banner)!}
                                                alt={banner.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.log('Failed to load banner image:', getBannerImageUrl(banner));
                                                    console.log('Original image path:', banner.image);
                                                    e.currentTarget.style.display = 'none';
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                                    }
                                                }}
                                                onLoad={() => {
                                                    console.log('Successfully loaded banner image:', getBannerImageUrl(banner));
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                <span className="sr-only">No image</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-foreground truncate">
                                            {banner.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {banner.descriptions}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getStatusBadge(banner)}
                                            <Badge variant="outline" className="text-xs">
                                                Order: {banner.sort_order}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Created by {banner.creator.name} • {new Date(banner.created_at).toLocaleDateString()}
                                        </p>
                                       
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSortOrderChange(banner.id, 'up')}
                                            title="Move Up"
                                        >
                                            <ArrowUp className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSortOrderChange(banner.id, 'down')}
                                            title="Move Down"
                                        >
                                            <ArrowDown className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    <ActionButtons
                                        actions={getBannerActions(banner)}
                                        item={banner}
                                        layout="dropdown"
                                        maxInline={3}
                                    />
                                </div>
                            </div>
                        ))}

                        {banners.data.length === 0 && (
                            <div className="text-center py-8">
                                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-semibold text-foreground">No banners</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Get started by creating a new banner.
                                </p>
                                <div className="mt-6">
                                    <Button asChild>
                                        <Link href={route('banners.create')}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Banner
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {banners.data.length > 0 && (
                        <div className="mt-6">
                            <PaginationWrapper
                                data={banners}
                                filters={filters}
                                routeName="banners.index"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <DeleteModal
                open={deleteModal.open}
                setOpen={(open) => setDeleteModal(prev => ({ ...prev, open }))}
                onConfirm={handleDeleteConfirm}
                title="Delete Banner"
                description="Are you sure you want to delete this banner? This action cannot be undone and will remove the banner from your website."
                itemName={deleteModal.banner?.title || ""}
                confirmText="Delete Banner"
                processing={deleteModal.processing}
            />
        </>
    );
}