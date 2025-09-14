import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import InputError from "@/components/input-error";
import UploadImage from "@/components/ui/upload-image";
import { Globe, MessageCircle, Send, Phone, Mail, MapPin, Plus, X } from "lucide-react";

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
  const [customSocialMedia, setCustomSocialMedia] = useState<{ [key: string]: { name: string, url: string } }>({});
  const [nextCustomId, setNextCustomId] = useState(1);

  // Initialize custom social media from existing data
  React.useEffect(() => {
    if (data.type) {
      const customFields: { [key: string]: { name: string, url: string } } = {};
      let maxId = 0;

      // Look for custom social media fields (pattern: social_custom_*)
      Object.keys(data.type).forEach(key => {
        if (key.startsWith('social_custom_') && !key.endsWith('_name') && data.type![key]) {
          const customKey = key.replace('social_custom_', '');
          const nameKey = `social_custom_${customKey}_name`;

          // Try to extract numeric ID to maintain proper counter
          const numericId = parseInt(customKey, 10);
          if (!isNaN(numericId) && numericId > maxId) {
            maxId = numericId;
          }

          customFields[customKey] = {
            name: data.type![nameKey] || '',
            url: data.type![key] || ''
          };
        }
      });

      setCustomSocialMedia(customFields);
      setNextCustomId(maxId + 1);
    }
  }, []);

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

  /**
   * Add new custom social media field
   */
  const addCustomSocialMedia = () => {
    const newId = nextCustomId.toString();
    const newCustom = {
      ...customSocialMedia,
      [newId]: { name: '', url: '' }
    };

    setCustomSocialMedia(newCustom);
    setNextCustomId(nextCustomId + 1);

    // Initialize empty form data for the new field
    setData(`type[social_custom_${newId}]`, '');
    setData(`type[social_custom_${newId}_name]`, '');
  };

  /**
   * Remove custom social media field
   */
  const removeCustomSocialMedia = (id: string) => {
    // Remove from local state
    const updated = { ...customSocialMedia };
    delete updated[id];
    setCustomSocialMedia(updated);

    // Remove from form data by creating a new object without these keys
    const currentType = { ...(data.type || {}) };
    delete currentType[`social_custom_${id}`];
    delete currentType[`social_custom_${id}_name`];

    setData('type', currentType);
  };

  /**
   * Update custom social media field
   */
  const updateCustomSocialMedia = (id: string, field: 'name' | 'url', value: string) => {
    // Update local state
    const updated = {
      ...customSocialMedia,
      [id]: {
        ...customSocialMedia[id],
        [field]: value
      }
    };

    setCustomSocialMedia(updated);

    // Update form data
    if (field === 'name') {
      setData(`type[social_custom_${id}_name]`, value);
    } else {
      setData(`type[social_custom_${id}]`, value);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Tabs defaultValue="business-info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business-info">Business Information</TabsTrigger>
          <TabsTrigger value="contact-social">Contact & Social</TabsTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="website_description_en">Website Description (English)</Label>
                  <Textarea
                    id="website_description_en"
                    value={data.type?.website_description_translations?.en || data.type?.website_description || ""}
                    onChange={(e) => handleTranslationChange("website_description", "en", e.target.value)}
                    placeholder="Description that appears in the website footer (English)"
                    rows={3}
                    className="max-w-md"
                  />
                  <InputError message={errors?.website_description || errors?.['website_description_translations.en']} />
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

                <div className="space-y-2">
                  <Label htmlFor="website_description_km">ការពិពណ៌នាគេហទំព័រ (ខ្មែរ)</Label>
                  <Textarea
                    id="website_description_km"
                    value={data.type?.website_description_translations?.km || ""}
                    onChange={(e) => handleTranslationChange("website_description", "km", e.target.value)}
                    placeholder="ការពិពណ៌នាដែលបង្ហាញនៅក្នុង footer របស់គេហទំព័រ (ស្រេចចិត្ត)"
                    rows={3}
                    className="max-w-md"
                  />
                  <InputError message={errors?.['website_description_translations.km']} />
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

        <TabsContent value="contact-social" className="space-y-6">
          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Business contact details displayed in the website footer.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="contact_address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Business Address
                </Label>
                <Textarea
                  id="contact_address"
                  value={data.type?.contact_address || ""}
                  onChange={(e) => handleInputChange("contact_address", e.target.value)}
                  placeholder="Street 123, District, City, Province, Cambodia"
                  rows={2}
                  className="max-w-md"
                />
                <InputError message={errors?.contact_address} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={data.type?.contact_phone || ""}
                  onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                  placeholder="+855 12 345 678"
                  className="max-w-md"
                />
                <InputError message={errors?.contact_phone} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={data.type?.contact_email || ""}
                  onChange={(e) => handleInputChange("contact_email", e.target.value)}
                  placeholder="info@yourbusiness.com"
                  className="max-w-md"
                />
                <InputError message={errors?.contact_email} />
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Social Media Links
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Social media profiles that will appear in the website footer.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="social_facebook" className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook Page URL
                </Label>
                <Input
                  id="social_facebook"
                  type="url"
                  value={data.type?.social_facebook || ""}
                  onChange={(e) => handleInputChange("social_facebook", e.target.value)}
                  placeholder="https://facebook.com/yourbusiness"
                  className="max-w-md"
                />
                <InputError message={errors?.social_facebook} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_telegram" className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-500" />
                  Telegram Channel/Group
                </Label>
                <Input
                  id="social_telegram"
                  type="url"
                  value={data.type?.social_telegram || ""}
                  onChange={(e) => handleInputChange("social_telegram", e.target.value)}
                  placeholder="https://t.me/yourbusiness"
                  className="max-w-md"
                />
                <InputError message={errors?.social_telegram} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_messenger" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  Facebook Messenger Link
                </Label>
                <Input
                  id="social_messenger"
                  type="url"
                  value={data.type?.social_messenger || ""}
                  onChange={(e) => handleInputChange("social_messenger", e.target.value)}
                  placeholder="https://m.me/yourbusiness"
                  className="max-w-md"
                />
                <InputError message={errors?.social_messenger} />
              </div>

              {/* Custom Social Media Fields */}
              {Object.entries(customSocialMedia).map(([id, social]) => (
                <div key={id} className="space-y-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">Custom Social Media</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomSocialMedia(id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`custom_name_${id}`}>Platform Name</Label>
                      <Input
                        id={`custom_name_${id}`}
                        type="text"
                        value={social.name}
                        onChange={(e) => updateCustomSocialMedia(id, 'name', e.target.value)}
                        placeholder="e.g., YouTube, LinkedIn, TikTok"
                        className="max-w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`custom_url_${id}`}>URL</Label>
                      <Input
                        id={`custom_url_${id}`}
                        type="url"
                        value={social.url}
                        onChange={(e) => updateCustomSocialMedia(id, 'url', e.target.value)}
                        placeholder="https://platform.com/youraccount"
                        className="max-w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Social Media Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomSocialMedia}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Social Media
                </Button>
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