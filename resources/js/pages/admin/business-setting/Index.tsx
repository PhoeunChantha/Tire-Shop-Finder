import { useMemo, useCallback, FormEvent } from "react";
import { Head } from "@inertiajs/react";

import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BusinessSettingForm from "@/components/business-setting/BusinessSettingForm";
import useBusinessSettingForm from "@/hooks/business-setting/use-businessSettingForm";
import { getImageUrl } from "@/lib/imageHelper";

import type {
  BusinessSettingIndexProps,
  BusinessSettingFormData
} from "@/types/business-setting";

// Constants for image setting types
const IMAGE_SETTING_TYPES = ['login_bg_image', 'system_logo', 'system_fav_icon'] as const;

/**
 * Business Settings Index Page
 * Handles both creation and editing of business settings in a unified form
 */
export default function Index({ businessSettings }: BusinessSettingIndexProps) {
  const isEdit = businessSettings.length > 0;

  /**
   * Transform business settings array into form data structure
   * Memoized to prevent unnecessary recalculations
   */
  const initialFormData = useMemo((): Partial<BusinessSettingFormData> => {
    const typeData: Record<string, any> = {};
    const imageData: Record<string, string | null> = {};

    businessSettings.forEach(setting => {
      if (IMAGE_SETTING_TYPES.includes(setting.type as any)) {
        typeData[setting.type] = null;
        const imageUrl = setting.value
          ? getImageUrl(setting.value, 'business-settings')
          : null;
        imageData[`current_${setting.type}`] = imageUrl;
      } else {
        typeData[setting.type] = setting.value;
      }
    });

    const result = {
      type: typeData,
      ...imageData
    };
    return result;
  }, [businessSettings]);

  const { data, setData, submit, processing, errors } = useBusinessSettingForm({
    initialData: initialFormData,
    isEdit
  });

  /**
   * Handle form submission
   * Memoized to prevent unnecessary re-renders
   */
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  }, [submit]);

  const pageTitle = isEdit ? "Edit Business Settings" : "Create Business Settings";
  const submitText = isEdit ? "Update Settings" : "Save Settings";

  return (
    <AppLayout>
      <Head title="Business Settings" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <BusinessSettingForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                submitText={submitText}
                isEdit={isEdit}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}