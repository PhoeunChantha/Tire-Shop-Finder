import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import InputError from "@/components/input-error";
import UploadImage from "@/components/ui/upload-image";

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
  
  /**
   * Handle input change for nested form fields
   */
  const handleInputChange = (field: string, value: string | File | null) => {
    setData(`type[${field}]`, value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Business Information Section */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
          <p className="mt-1 text-sm text-gray-600">
            Basic information about your business.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="business_name" className="required">
              Business Name
            </Label>
            <Input
              id="business_name"
              type="text"
              value={data.type?.business_name || ""}
              onChange={(e) => handleInputChange("business_name", e.target.value)}
              placeholder="Enter your business name"
              required
              className="max-w-md"
            />
            <InputError message={errors?.business_name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.type?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of your business (optional)"
              rows={3}
              className="max-w-md"
            />
            <InputError message={errors?.description} />
          </div>
        </div>
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