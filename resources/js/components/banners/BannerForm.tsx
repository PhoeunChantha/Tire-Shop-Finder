import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import InputError from "@/components/InputError";
import { ImageIcon, Globe, ToggleRight } from 'lucide-react';
import { FormEventHandler } from "react";

interface BannerFormData {
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

interface BannerFormProps {
  data: BannerFormData;
  setData: (field: string, value: unknown) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: FormEventHandler;
  submitText?: string;
  activeLanguage: 'en' | 'km';
  setActiveLanguage: (lang: 'en' | 'km') => void;
}

export default function BannerForm({ 
  data, 
  setData, 
  errors, 
  processing, 
  onSubmit, 
  submitText = "Create Banner",
  activeLanguage,
  setActiveLanguage 
}: BannerFormProps) {
  const handleLanguageSpecificChange = (field: string, language: string, value: string) => {
    setData(field, {
      ...data[field],
      [language]: value
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Banner Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'km')}>
            <TabsList>
              <TabsTrigger value="en" className="flex items-center gap-2">
                🇺🇸 English
              </TabsTrigger>
              <TabsTrigger value="km" className="flex items-center gap-2">
                🇰🇭 ខ្មែរ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_en">Title (English)</Label>
                <Input
                  id="title_en"
                  type="text"
                  value={data.title_translations?.en || ''}
                  onChange={(e) => handleLanguageSpecificChange('title_translations', 'en', e.target.value)}
                  placeholder="Enter banner title in English"
                />
                <InputError message={errors['title_translations.en']} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descriptions_en">Description (English)</Label>
                <Textarea
                  id="descriptions_en"
                  value={data.descriptions_translations?.en || ''}
                  onChange={(e) => handleLanguageSpecificChange('descriptions_translations', 'en', e.target.value)}
                  placeholder="Enter banner description in English"
                  rows={3}
                />
                <InputError message={errors['descriptions_translations.en']} />
              </div>
            </TabsContent>
            
            <TabsContent value="km" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_km">ចំណងជើង (ខ្មែរ)</Label>
                <Input
                  id="title_km"
                  type="text"
                  value={data.title_translations?.km || ''}
                  onChange={(e) => handleLanguageSpecificChange('title_translations', 'km', e.target.value)}
                  placeholder="បញ្ចូលចំណងជើងប៊ាណេរជាភាសាខ្មែរ"
                />
                <InputError message={errors['title_translations.km']} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descriptions_km">ការពិពណ៌នា (ខ្មែរ)</Label>
                <Textarea
                  id="descriptions_km"
                  value={data.descriptions_translations?.km || ''}
                  onChange={(e) => handleLanguageSpecificChange('descriptions_translations', 'km', e.target.value)}
                  placeholder="បញ្ចូលការពិពណ៌នាប៊ាណេរជាភាសាខ្មែរ"
                  rows={3}
                />
                <InputError message={errors['descriptions_translations.km']} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Banner Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <ImageUpload
                label="Banner Image"
                value={data.image}
                onChange={(file) => setData('image', file)}
                accept="image/*"
                maxSize={5 * 1024 * 1024}
              />
              <InputError message={errors.image} />
              <p className="text-sm text-muted-foreground">
                Upload a banner image. Recommended size: 1200x400 pixels. Max file size: 5MB.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Banner Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                min="0"
                value={data.sort_order || 0}
                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <InputError message={errors.sort_order} />
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={data.is_active}
                onCheckedChange={(checked) => setData('is_active', checked)}
              />
              <Label htmlFor="is_active" className="flex items-center gap-2">
                <ToggleRight className="w-4 h-4" />
                Active Banner
              </Label>
            </div>
            <InputError message={errors.is_active} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={processing}>
          {processing ? "Processing..." : submitText}
        </Button>
      </div>
    </form>
  );
}