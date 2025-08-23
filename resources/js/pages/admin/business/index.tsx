import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DataTableFilter from '@/components/DefaultDataTableFilter';
import PaginationWrapper from '@/components/PaginationWrapper';
import { BusinessIndexProps } from '@/types';
import { Building, Eye, Edit, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';

export default function BusinessIndex({ auth, businesses, filters, provinces }: BusinessIndexProps) {
    const filterConfig = {
        search: {
            enabled: true,
            placeholder: "Search businesses...",
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
                    { value: '', label: 'All Businesses' },
                    { value: 'verified', label: 'Verified' },
                    { value: 'pending', label: 'Pending Review' }
                ]
            },
            {
                type: 'select',
                key: 'province_id',
                placeholder: 'Filter by Province',
                options: [
                    { value: '', label: 'All Provinces' },
                    ...provinces.map(province => ({
                        value: province.id.toString(),
                        label: province.name
                    }))
                ]
            }
        ]
    };

    const getStatusBadge = (business: any) => {
        if (business.is_vierify) {
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
        } else {
            return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Business Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
                        <p className="text-gray-600">Review and manage tire shop businesses</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            All Businesses ({businesses.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTableFilter
                            filters={filters}
                            config={filterConfig}
                        />

                        <div className="space-y-4 mt-6">
                            {businesses.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
                                    <p className="text-gray-600">No businesses match your current filters.</p>
                                </div>
                            ) : (
                                businesses.data.map((business) => (
                                    <div key={business.id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {business.name}
                                                    </h3>
                                                    {getStatusBadge(business)}
                                                </div>
                                                
                                                <p className="text-gray-600 mb-3 line-clamp-2">
                                                    {business.descriptions || 'No description provided'}
                                                </p>

                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {business.province?.name}, {business.district?.name}
                                                    </span>
                                                    <span>By: {business.owner?.name}</span>
                                                    <span>Created: {new Date(business.created_at).toLocaleDateString()}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/businesses/${business.id}`}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                    
                                                    <Link href={`/admin/businesses/${business.id}/edit`}>
                                                        <Button size="sm" variant="outline">
                                                            <Edit className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </Button>
                                                    </Link>

                                                    {!business.is_vierify ? (
                                                        <Link href={`/admin/businesses/${business.id}/verify`} method="patch" as="button">
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Verify
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        <Link href={`/admin/businesses/${business.id}/reject`} method="patch" as="button">
                                                            <Button size="sm" variant="destructive">
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                Revoke
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>

                                            {business.image && (
                                                <div className="ml-6">
                                                    <img 
                                                        src={business.image} 
                                                        alt={business.name}
                                                        className="w-24 h-24 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <PaginationWrapper paginatedData={businesses} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}