import { useMemo, useCallback, FormEvent } from "react";
import { Head } from "@inertiajs/react";

import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SeoForm from "@/components/seo/SeoForm";
import useSeoForm from "@/hooks/seo/use-seo-form";

import type {
  SeoIndexProps,
  SeoFormData
} from "@/types/seo";

/**
 * SEO Settings Index Page
 * Handles both creation and editing of SEO settings in a unified form
 */
export default function Index({ seoSettingsData }: SeoIndexProps) {
  const isEdit = seoSettingsData.length > 0;

  /**
   * Transform SEO settings array into form data structure
   * Memoized to prevent unnecessary recalculations
   */
  const initialFormData = useMemo((): Partial<SeoFormData> => {
    const typeData: Record<string, any> = {};
    let seoImage: string | null = null;

    seoSettingsData.forEach(setting => {
      if (setting.type === 'seo_image') {
        seoImage = setting.value;
      } else {
        typeData[setting.type] = setting.value;
      }
    });

    return {
      type: typeData,
      seo_image: seoImage,
    };
  }, [seoSettingsData]);

  const { data, setData, submit, processing, errors } = useSeoForm({
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

  const pageTitle = isEdit ? "Edit SEO Settings" : "Create SEO Settings";
  const submitText = isEdit ? "Update Settings" : "Save Settings";

  return (
    <AppLayout>
      <Head title="SEO Settings" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optimize your website for search engines and improve visibility.
              </p>
            </CardHeader>
            <CardContent>
              <SeoForm
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