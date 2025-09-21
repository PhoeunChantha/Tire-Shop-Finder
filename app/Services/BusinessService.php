<?php

namespace App\Services;

use App\Models\Business;
use App\Helpers\ImageManager;
use Illuminate\Http\UploadedFile;

class BusinessService
{
    public function createBusiness(array $validated): Business
    {
        $validated['status'] = $validated['status'] ?? true;
        $validated['is_vierify'] = $validated['is_vierify'] ?? true;

        if (isset($validated['image']) && $validated['image'] instanceof UploadedFile) {
            $validated['image'] = ImageManager::uploadImage($validated['image'], 'businesses');
        } elseif (isset($validated['image']) && is_string($validated['image']) && empty($validated['image'])) {
            unset($validated['image']);
        }

        $business = Business::create($validated);

        $this->saveTranslations($business, $validated);

        return $business;
    }

    public function updateBusiness(Business $business, array $validated): Business
    {
        if (isset($validated['image']) && $validated['image'] instanceof UploadedFile) {
            $validated['image'] = ImageManager::updateImage($validated['image'], $business->image, 'businesses');
        } elseif (isset($validated['image']) && is_string($validated['image']) && empty($validated['image'])) {
            unset($validated['image']);
        }
        
        $regularData = [];
        $translationData = [];
        
        foreach ($validated as $key => $value) {
            if (str_ends_with($key, '_translations')) {
                $translationData[$key] = $value;
            } elseif (!in_array($key, ['name', 'descriptions', 'seo_title', 'seo_description'])) {
                $regularData[$key] = $value;
            }
        }
        
        if (isset($validated['name_translations'])) {
            $regularData['name'] = $validated['name_translations'];
        } elseif (isset($validated['name'])) {
            $regularData['name'] = $validated['name'];
        }
        
        if (isset($validated['descriptions_translations'])) {
            $regularData['descriptions'] = $validated['descriptions_translations'];
        } elseif (isset($validated['descriptions'])) {
            $regularData['descriptions'] = $validated['descriptions'];
        }
        
        if (isset($validated['seo_title_translations'])) {
            $regularData['seo_title'] = $validated['seo_title_translations'];
        } elseif (isset($validated['seo_title'])) {
            $regularData['seo_title'] = $validated['seo_title'];
        }
        
        if (isset($validated['seo_description_translations'])) {
            $regularData['seo_description'] = $validated['seo_description_translations'];
        } elseif (isset($validated['seo_description'])) {
            $regularData['seo_description'] = $validated['seo_description'];
        }
        
        $business->update($regularData);
        
        return $business;
    }

    public function verifyBusiness(Business $business): Business
    {
        $business->update([
            'is_vierify' => true,
            'status' => true
        ]);

        return $business;
    }

    public function rejectBusiness(Business $business): Business
    {
        $business->update([
            'is_vierify' => false,
            'status' => false
        ]);

        return $business;
    }

    /**
     * Save translations for a business
     */
    private function saveTranslations(Business $business, array $validated): void
    {
        $translationFields = [
            'name_translations' => 'name',
            'descriptions_translations' => 'descriptions',
            'seo_title_translations' => 'seo_title',
            'seo_description_translations' => 'seo_description'
        ];

        foreach ($translationFields as $translationField => $baseField) {
            if (!empty($validated[$translationField])) {
                $business->setTranslations($baseField, $validated[$translationField]);
            }
        }
        
        $business->save();
    }
}