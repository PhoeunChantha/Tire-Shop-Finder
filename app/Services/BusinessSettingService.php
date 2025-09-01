<?php

namespace App\Services;

use App\Models\BusinessSetting;
use App\Helpers\ImageManager;

class BusinessSettingService
{
    protected array $imageTypes = ['login_bg_image', 'system_logo', 'system_fav_icon'];

    public function updateSettings(array $validated): void
    {
        foreach ($validated['type'] as $key => $value) {
            // Skip null values except for required fields
            if (is_null($value) && !in_array($key, ['name', 'name_translations', 'descriptions_translations'])) {
                continue;
            }

            // Handle translation data by converting to JSON
            if (str_ends_with($key, '_translations') && is_array($value)) {
                $value = json_encode($value);
            }

            $existingSetting = BusinessSetting::where('type', $key)->first();

            if ($existingSetting) {
                $this->updateExistingSetting($existingSetting, $key, $value);
            } else {
                $this->createNewSetting($key, $value);
            }
        }
    }

    private function updateExistingSetting(BusinessSetting $setting, string $key, $value): void
    {
        if (in_array($key, $this->imageTypes)) {
            if ($value) {
                $imagePath = ImageManager::updateImage($value, $setting->value, 'business-settings');
                $setting->update(['value' => $imagePath]);
            }
        } else {
            $setting->update(['value' => $value]);
        }
    }

    private function createNewSetting(string $key, $value): void
    {
        $finalValue = $value;
        
        if (in_array($key, $this->imageTypes) && $value) {
            $finalValue = ImageManager::uploadImage($value, 'business-settings');
        }
        
        if ($finalValue) {
            BusinessSetting::create([
                'type' => $key,
                'value' => $finalValue,
            ]);
        }
    }
}