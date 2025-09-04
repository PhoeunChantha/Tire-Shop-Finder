import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Globe, Link as LinkIcon, Edit, ArrowLeft, ToggleRight, ToggleLeft, ExternalLink } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

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
    updated_at: string;
}

interface BannerShowProps {
    auth: any;
    banner: Banner;
}

export default function BannerShow({ auth, banner }: BannerShowProps) {
    const getBannerImageUrl = (banner: Banner) => {
        if (banner.image) {
            return getImageUrl(banner.image, 'banners');
        }
        return null;
    };

    const getStatusBadge = (banner: Banner) => {
        if (banner.is_active) {
            return <Badge className="bg-green-100 text-green-800"><ToggleRight className="w-3 h-3 mr-1" />Active</Badge>;
        } else {
            return <Badge className="bg-gray-100 text-gray-800"><ToggleLeft className="w-3 h-3 mr-1" />Inactive</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title={`Banner - ${banner.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('banners.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Banners
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{banner.title}</h1>
                            <p className="text-gray-600">Banner details and information</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('banners.edit', banner.id)}>
                            <Button>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Banner
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Banner Image */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Banner Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {getBannerImageUrl(banner) ? (
                                    <div className="space-y-4">
                                        <img 
                                            src={getBannerImageUrl(banner)!} 
                                            alt={banner.title}
                                            className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                        />
                                        <div className="text-sm text-gray-600">
                                            <p>Image path: {banner.image}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-64 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                        <div className="text-center">
                                            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">No image uploaded</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Banner Information */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    Banner Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    {getStatusBadge(banner)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Sort Order:</span>
                                    <Badge variant="outline">{banner.sort_order}</Badge>
                                </div>
                                {banner.url && (
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Link URL:</span>
                                        <a 
                                            href={banner.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm break-all flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            {banner.url}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Meta Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium">Created by:</span>
                                    <p className="text-sm text-gray-600">{banner.creator.name}</p>
                                    <p className="text-sm text-gray-500">{banner.creator.email}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">Created:</span>
                                    <p className="text-sm text-gray-600">
                                        {new Date(banner.created_at).toLocaleDateString()} at {new Date(banner.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium">Last Updated:</span>
                                    <p className="text-sm text-gray-600">
                                        {new Date(banner.updated_at).toLocaleDateString()} at {new Date(banner.updated_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Banner Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            Banner Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{banner.title}</h3>
                                {banner.descriptions && (
                                    <p className="text-gray-600">{banner.descriptions}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}