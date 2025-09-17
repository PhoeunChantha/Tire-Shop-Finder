import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import InputError from "@/components/input-error";

import type { SeoFormProps } from "@/types/seo";

/**
 * SEO Form Component
 * Handles both creation and editing of SEO settings
 */
export default function SeoForm({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitText = "Submit",
  isEdit = false,
}: SeoFormProps): React.ReactElement {
  
  /**
   * Handle input change for nested form fields
   */
  const handleInputChange = (field: string, value: string) => {
    setData(`type[${field}]`, value);
  };

  /**
   * Handle image upload for SEO image
   */
  const handleImageChange = (file: File | null, url?: string) => {
    if (file) {
      setData('seo_image', file);
    } else if (url) {
      setData('seo_image', url);
    } else {
      setData('seo_image', null);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Meta Tags Section */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">Meta Tags</h3>
          <p className="mt-1 text-sm text-gray-600">
            Basic meta tags for search engine optimization.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">
              Meta Title
            </Label>
            <Input
              id="meta_title"
              type="text"
              value={data.type?.meta_title || ""}
              onChange={(e) => handleInputChange("meta_title", e.target.value)}
              placeholder="Enter page title (recommended: under 60 characters)"
              className="max-w-2xl"
            />
            <p className="text-xs text-gray-500">
              Recommended length: 50-60 characters
            </p>
            <InputError message={errors?.meta_title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">
              Meta Description
            </Label>
            <Textarea
              id="meta_description"
              value={data.type?.meta_description || ""}
              onChange={(e) => handleInputChange("meta_description", e.target.value)}
              placeholder="Enter page description (recommended: under 160 characters)"
              rows={3}
              className="max-w-2xl"
            />
            <p className="text-xs text-gray-500">
              Recommended length: 120-160 characters
            </p>
            <InputError message={errors?.meta_description} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_keywords">
              Meta Keywords
            </Label>
            <Input
              id="meta_keywords"
              type="text"
              value={data.type?.meta_keywords || ""}
              onChange={(e) => handleInputChange("meta_keywords", e.target.value)}
              placeholder="tire shop, automotive, car repair, cambodia"
              className="max-w-2xl"
            />
            <p className="text-xs text-gray-500">
              Separate keywords with commas
            </p>
            <InputError message={errors?.meta_keywords} />
          </div>
        </div>
      </div>

      {/* SEO Image Section */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">SEO Image</h3>
          <p className="mt-1 text-sm text-gray-600">
            Upload an image for social media sharing and search results.
          </p>
        </div>

        <div className="grid gap-4">
          <ImageUpload
            label="SEO Social Media Image"
            value={data.seo_image || null}
            onChange={handleImageChange}
            error={errors?.seo_image}
            maxSize={5}
            accept="image/*"
            allowUrl={false}
            placeholder="Upload an image for social media sharing (1200x630 recommended)"
          />
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">Analytics & Tracking</h3>
          <p className="mt-1 text-sm text-gray-600">
            Configure tracking codes for analytics and marketing.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="google_analytics_id">
              Google Analytics ID
            </Label>
            <Input
              id="google_analytics_id"
              type="text"
              value={data.type?.google_analytics_id || ""}
              onChange={(e) => handleInputChange("google_analytics_id", e.target.value)}
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
              className="max-w-md"
            />
            <p className="text-xs text-gray-500">
              Your Google Analytics tracking ID
            </p>
            <InputError message={errors?.google_analytics_id} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook_pixel_id">
              Facebook Pixel ID
            </Label>
            <Input
              id="facebook_pixel_id"
              type="text"
              value={data.type?.facebook_pixel_id || ""}
              onChange={(e) => handleInputChange("facebook_pixel_id", e.target.value)}
              placeholder="123456789012345"
              className="max-w-md"
            />
            <p className="text-xs text-gray-500">
              Your Facebook Pixel ID for tracking conversions
            </p>
            <InputError message={errors?.facebook_pixel_id} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_site_verification">
              Google Site Verification
            </Label>
            <Input
              id="google_site_verification"
              type="text"
              value={data.type?.google_site_verification || ""}
              onChange={(e) => handleInputChange("google_site_verification", e.target.value)}
              placeholder="abcdefghijklmnopqrstuvwxyz123456789"
              className="max-w-xl"
            />
            <p className="text-xs text-gray-500">
              Google Search Console verification code
            </p>
            <InputError message={errors?.google_site_verification} />
          </div>
        </div>
      </div>

      {/* Technical SEO Section */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">Technical SEO</h3>
          <p className="mt-1 text-sm text-gray-600">
            Advanced SEO configuration settings.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="robots_txt">
              Custom Robots.txt Rules
            </Label>
            <Textarea
              id="robots_txt"
              value={data.type?.robots_txt || ""}
              onChange={(e) => handleInputChange("robots_txt", e.target.value)}
              placeholder={`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${window.location.origin}/sitemap.xml`}
              rows={6}
              className="max-w-2xl font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Custom rules for search engine crawlers (optional)
            </p>
            <InputError message={errors?.robots_txt} />
          </div>
        </div>
      </div>

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