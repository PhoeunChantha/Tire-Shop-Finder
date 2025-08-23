import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Business } from '@/types';
import { Building, Plus, Trash2, Wrench } from 'lucide-react';

interface ServiceCreateProps {
    business: Business;
}

interface ServiceFormData {
    name: string;
    price: string;
    descriptions: string;
    status: boolean;
}

export default function ServiceCreate({ business }: ServiceCreateProps) {
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
        
        // Filter out services with empty names before submission
        const validServices = services.filter(service => service.name.trim() !== '');
        
        // Make sure we have at least one valid service
        if (validServices.length === 0) {
            return;
        }
        
        // Submit with filtered services using transform
        post(`/businesses/${business.id}/services`, {
            transform: (data) => ({
                services: validServices
            })
        });
    };

    const skipServices = () => {
        window.location.href = '/user-dashboard';
    };

    return (
        <WebsiteLayout>
            <Head title={`Add Services - ${business.name}`} />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Add Your Services
                        </h1>
                        <p className="text-lg text-gray-600">
                            Great! Your business "{business.name}" is registered. Now let's add the services you offer.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="w-5 h-5" />
                                Services & Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {services.map((service, index) => (
                                    <div key={index} className="border rounded-lg p-6 space-y-4 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Service #{index + 1}
                                            </h3>
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
                                                <Label htmlFor={`service-name-${index}`}>Service Name *</Label>
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
                                                <Label htmlFor={`service-price-${index}`}>Price (USD) *</Label>
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
                                            <Label htmlFor={`service-descriptions-${index}`}>Service Description</Label>
                                            <Textarea
                                                id={`service-descriptions-${index}`}
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

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`service-status-${index}`}
                                                checked={service.status}
                                                onCheckedChange={(checked) => handleServiceChange(index, 'status', checked as boolean)}
                                            />
                                            <Label htmlFor={`service-status-${index}`}>
                                                Service is active and available
                                            </Label>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addService}
                                        className="w-full max-w-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Another Service
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center space-x-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={skipServices}
                                        size="lg"
                                    >
                                        Skip for Now
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing || services.every(s => !s.name.trim())} 
                                        size="lg"
                                    >
                                        {processing ? 'Creating Services...' : `Create ${services.filter(s => s.name.trim()).length} Service${services.filter(s => s.name.trim()).length !== 1 ? 's' : ''}`}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </WebsiteLayout>
    );
}