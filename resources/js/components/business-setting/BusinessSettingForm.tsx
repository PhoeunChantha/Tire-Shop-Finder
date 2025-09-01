import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import InputError from "@/components/input-error";
import UploadImage from "@/components/ui/upload-image";
import { Globe } from "lucide-react";

import type { BusinessSettingFormProps } from "@/types/business-setting";

/**
 * Business Setting Form Component
 * Handles both creation and editing of business settings
 */
export default function BusinessSettingForm({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitText = "Submit",
  isEdit = false,
}: BusinessSettingFormProps): React.ReactElement {
  
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');
  
  /**
   * Handle input change for nested form fields
   */
  const handleInputChange = (field: string, value: string | File | null) => {
    setData(`type[${field}]`, value);
  };

  /**
   * Handle translation input changes
   */
  const handleTranslationChange = (field: string, locale: 'en' | 'km', value: string) => {
    const translationsField = `${field}_translations`;
    const currentTranslations = data.type?.[translationsField] || { en: '', km: '' };
    
    setData(`type[${translationsField}]`, {
      ...currentTranslations,
      [locale]: value
    });

    // Also update the main field with English value for backwards compatibility
    if (locale === 'en') {
      setData(`type[${field}]`, value);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Tabs defaultValue="business-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business-info">Business Information</TabsTrigger>
          <TabsTrigger value="socialite">Social Login</TabsTrigger>
        </TabsList>

        <TabsContent value="business-info" className="space-y-6">
          {/* Business Information Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Business Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Basic information about your business in multiple languages.
              </p>
            </div>

            {/* Language Tabs for Business Information */}
            <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'km')}>
              <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
                <TabsTrigger value="en" className="flex items-center gap-2">
                  <span>🇺🇸</span>
                  <span>English</span>
                </TabsTrigger>
                <TabsTrigger value="km" className="flex items-center gap-2">
                  <span>🇰🇭</span>
                  <span>ខ្មែរ</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_en" className="required">
                    Business Name (English)
                  </Label>
                  <Input
                    id="name_en"
                    type="text"
                    value={data.type?.name_translations?.en || data.type?.name || ""}
                    onChange={(e) => handleTranslationChange("name", "en", e.target.value)}
                    placeholder="Enter your business name in English"
                    required
                    className="max-w-md"
                  />
                  <InputError message={errors?.name || errors?.['name_translations.en']} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptions_en">Description (English)</Label>
                  <Textarea
                    id="descriptions_en"
                    value={data.type?.descriptions_translations?.en || data.type?.descriptions || ""}
                    onChange={(e) => handleTranslationChange("descriptions", "en", e.target.value)}
                    placeholder="Brief description of your business in English (optional)"
                    rows={3}
                    className="max-w-md"
                  />
                  <InputError message={errors?.descriptions || errors?.['descriptions_translations.en']} />
                </div>
              </TabsContent>

              <TabsContent value="km" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_km">ឈ្មោះអាជីវកម្ម (ខ្មែរ)</Label>
                  <Input
                    id="name_km"
                    type="text"
                    value={data.type?.name_translations?.km || ""}
                    onChange={(e) => handleTranslationChange("name", "km", e.target.value)}
                    placeholder="បញ្ចូលឈ្មោះអាជីវកម្មរបស់អ្នកជាភាសាខ្មែរ"
                    className="max-w-md"
                  />
                  <InputError message={errors?.['name_translations.km']} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptions_km">ការពិពណ៌នា (ខ្មែរ)</Label>
                  <Textarea
                    id="descriptions_km"
                    value={data.type?.descriptions_translations?.km || ""}
                    onChange={(e) => handleTranslationChange("descriptions", "km", e.target.value)}
                    placeholder="ការពិពណ៌នាអាជីវកម្មរបស់អ្នកជាភាសាខ្មែរ (ស្រេចចិត្ត)"
                    rows={3}
                    className="max-w-md"
                  />
                  <InputError message={errors?.['descriptions_translations.km']} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

      {/* Branding Section */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">Branding Assets</h3>
          <p className="mt-1 text-sm text-gray-600">
            Upload images for your business branding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <UploadImage
              id="login-bg-image"
              label="Login Background"
              value={data.type?.login_bg_image}
              currentImage={data.current_login_bg_image}
              onChange={(file) => handleInputChange("login_bg_image", file)}
              error={errors?.login_bg_image}
              previewClassName="w-full h-32 object-cover rounded-md border"
              accept="image/*"
            />
            <p className="text-xs text-gray-500">
              Recommended: 1920x1080px
            </p>
          </div>

          <div className="space-y-2">
            <UploadImage
              id="system-logo"
              label="System Logo"
              value={data.type?.system_logo}
              currentImage={data.current_system_logo}
              onChange={(file) => handleInputChange("system_logo", file)}
              error={errors?.system_logo}
              previewClassName="w-full h-32 object-contain rounded-md border p-4"
              accept="image/*"
            />
            <p className="text-xs text-gray-500">
              Recommended: Square format
            </p>
          </div>

          <div className="space-y-2">
            <UploadImage
              id="system-fav-icon"
              label="Favicon"
              value={data.type?.system_fav_icon}
              currentImage={data.current_system_fav_icon}
              onChange={(file) => handleInputChange("system_fav_icon", file)}
              error={errors?.system_fav_icon}
              previewClassName="w-full h-32 object-contain rounded-md border p-4"
              accept="image/x-icon,image/png"
            />
            <p className="text-xs text-gray-500">
              Recommended: 32x32px ICO or PNG
            </p>
          </div>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="socialite" className="space-y-6">
          {/* Social Login Configuration Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">Social Login Configuration</h3>
              <p className="mt-1 text-sm text-gray-600">
                Configure social login providers for user authentication.
              </p>
            </div>

            {/* Google Login Settings */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Google Login</h4>
                  <p className="text-sm text-gray-600">Enable users to login with their Google account</p>
                </div>
                <Switch
                  checked={data.type?.google_login_status === 'enabled' || data.type?.google_login_status === '1'}
                  onCheckedChange={(checked) => 
                    handleInputChange("google_login_status", checked ? 'enabled' : 'disabled')
                  }
                />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="google_client_id">
                    Google Client ID
                  </Label>
                  <Input
                    id="google_client_id"
                    type="text"
                    value={data.type?.google_client_id || ""}
                    onChange={(e) => handleInputChange("google_client_id", e.target.value)}
                    placeholder="Your Google Client ID"
                    className="font-mono text-sm"
                  />
                  <InputError message={errors?.google_client_id} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_client_secret">
                    Google Client Secret
                  </Label>
                  <Input
                    id="google_client_secret"
                    type="password"
                    value={data.type?.google_client_secret || ""}
                    onChange={(e) => handleInputChange("google_client_secret", e.target.value)}
                    placeholder="Your Google Client Secret"
                    className="font-mono text-sm"
                  />
                  <InputError message={errors?.google_client_secret} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_redirect_uri">
                    Google Redirect URI
                  </Label>
                  <Input
                    id="google_redirect_uri"
                    type="url"
                    value={data.type?.google_redirect_uri || `${window.location.origin}/auth/google/callback`}
                    onChange={(e) => handleInputChange("google_redirect_uri", e.target.value)}
                    placeholder={`${window.location.origin}/auth/google/callback`}
                    className="font-mono text-sm"
                  />
                  <InputError message={errors?.google_redirect_uri} />
                </div>
              </div>
            </div>

            {/* Facebook Login Settings */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Facebook Login</h4>
                  <p className="text-sm text-gray-600">Enable users to login with their Facebook account</p>
                </div>
                <Switch
                  checked={data.type?.facebook_login_status === 'enabled' || data.type?.facebook_login_status === '1'}
                  onCheckedChange={(checked) => 
                    handleInputChange("facebook_login_status", checked ? 'enabled' : 'disabled')
                  }
                />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook_client_id">
                    Facebook Client ID
                  </Label>
                  <Input
                    id="facebook_client_id"
                    type="text"
                    value={data.type?.facebook_client_id || ""}
                    onChange={(e) => handleInputChange("facebook_client_id", e.target.value)}
                    placeholder="123456789012345"
                    className="font-mono text-sm"
                  />
                  <InputError message={errors?.facebook_client_id} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook_client_secret">
                    Facebook Client Secret
                  </Label>
                  <Input
                    id="facebook_client_secret"
                    type="password"
                    value={data.type?.facebook_client_secret || ""}
                    onChange={(e) => handleInputChange("facebook_client_secret", e.target.value)}
                    placeholder="your-facebook-client-secret"
                    className="font-mono text-sm"
                  />
                  <InputError message={errors?.facebook_client_secret} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook_redirect_uri">
                    Facebook Redirect URI
                  </Label>
                  <Input
                    id="facebook_redirect_uri"
                    type="url"
                    value={data.type?.facebook_redirect_uri || `${window.location.origin}/auth/facebook/callback`}
                    onChange={(e) => handleInputChange("facebook_redirect_uri", e.target.value)}
                    placeholder={`${window.location.origin}/auth/facebook/callback`}
                    className="font-mono text-sm"
                  />
                  <InputError message={errors?.facebook_redirect_uri} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Submit Section */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button 
          type="submit" 
          disabled={processing}
          className="min-w-[120px]"
        >
          {processing ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {isEdit ? "Updating..." : "Saving..."}
            </>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
}