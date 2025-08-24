import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Business } from '@/types';
import { Building, Plus, Trash2, Wrench } from 'lucide-react';

interface AdminServiceCreateProps {
    business: Business;
}

interface ServiceFormData {
    name: string;
    price: string;
    descriptions: string;
    status: boolean;
}

export default function AdminServiceCreate({ business }: AdminServiceCreateProps) {
    const [services, setServices] = useState<ServiceFormData[]>([
        { name: '', price: '', descriptions: '', status: true }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        services: [{ name: '', price: '', descriptions: '', status: true }]
    });

    // Sync services state with form data on initial load
    useEffect(() => {
        setData('services', services);
    }, []);

    const handleServiceChange = (index: number, field: keyof ServiceFormData, value: string | boolean) => {
        const newServices = [...services];
        newServices[index] = { ...newServices[index], [field]: value };
        setServices(newServices);
        
        // Update the Inertia form data
        setData('services', newServices);
    };

    const addService = () => {
        const newServices = [...services, { name: '', price: '', descriptions: '', status: true }];
        setServices(newServices);
        setData('services', newServices);
    };

    const removeService = (index: number) => {
        if (services.length > 1) {
            const newServices = services.filter((_, i) => i !== index);
            setServices(newServices);
            setData('services', newServices);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Filter out empty services
        const validServices = services.filter(service => 
            service.name.trim() !== '' && service.price.trim() !== ''
        );

        if (validServices.length === 0) {
            return;
        }
        
        // Submit with filtered services
        post(route('admin.services.store', business.id), {
            data: { services: validServices }
        });
    };

    return (
        <AppLayout>
            <Head title={`Add Services - ${business.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Business: {business.name}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            Add services and pricing for this tire shop business.
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Services Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Wrench className="w-5 h-5" />
                                    <h3 className="text-lg font-medium">Services & Pricing</h3>
                                </div>
                                
                                <div className="space-y-6">
                                    {services.map((service, index) => (
                                        <div key={index} className="border rounded-lg p-6 space-y-4 bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-lg font-medium text-gray-900">
                                                    Service #{index + 1}
                                                </h4>
                                                {services.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeService(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`service-name-${index}`}>
                                                        Service Name <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`service-name-${index}`}
                                                        type="text"
                                                        value={service.name}
                                                        onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                                        placeholder="e.g., Tire Installation, Wheel Balancing"
                                                        className={errors[`services.${index}.name`] ? 'border-red-500' : ''}
                                                    />
                                                    {errors[`services.${index}.name`] && (
                                                        <p className="text-sm text-red-500">{errors[`services.${index}.name`]}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`service-price-${index}`}>
                                                        Price (USD) <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`service-price-${index}`}
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={service.price}
                                                        onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                                        placeholder="0.00"
                                                        className={errors[`services.${index}.price`] ? 'border-red-500' : ''}
                                                    />
                                                    {errors[`services.${index}.price`] && (
                                                        <p className="text-sm text-red-500">{errors[`services.${index}.price`]}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`service-desc-${index}`}>Service Description</Label>
                                                <Textarea
                                                    id={`service-desc-${index}`}
                                                    value={service.descriptions}
                                                    onChange={(e) => handleServiceChange(index, 'descriptions', e.target.value)}
                                                    placeholder="Describe what this service includes..."
                                                    rows={3}
                                                    className={errors[`services.${index}.descriptions`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`services.${index}.descriptions`] && (
                                                    <p className="text-sm text-red-500">{errors[`services.${index}.descriptions`]}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Active Status</Label>
                                                    <div className="text-sm text-muted-foreground">
                                                        Enable or disable this service
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={service.status}
                                                    onCheckedChange={(checked) => handleServiceChange(index, 'status', checked)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addService}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Another Service
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <a href={route('businesses.index')}>
                                    <Button type="button" variant="outline">
                                        Skip for Now
                                    </Button>
                                </a>
                                <Button type="submit" disabled={processing} size="lg">
                                    {processing ? 'Adding Services...' : 'Add Services'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}