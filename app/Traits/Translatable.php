<?php

namespace App\Traits;

use App\Models\Translation;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Translatable
{
    public function translations(): MorphMany
    {
        return $this->morphMany(Translation::class, 'translatable');
    }

    /**
     * Get translation for a specific field and locale
     */
    public function getTranslation(string $field, string $locale = null): ?string
    {
        $locale = $locale ?: app()->getLocale();
        
        $translation = $this->translations()
            ->where('field_name', $field)
            ->where('locale', $locale)
            ->first();
            
        return $translation?->value;
    }

    /**
     * Set translation for a specific field and locale
     */
    public function setTranslation(string $field, string $locale, string $value): void
    {
        $this->translations()->updateOrCreate(
            [
                'field_name' => $field,
                'locale' => $locale,
            ],
            [
                'value' => $value,
            ]
        );
    }

    /**
     * Get all translations for a specific field
     */
    public function getAllTranslations(string $field): array
    {
        return $this->translations()
            ->where('field_name', $field)
            ->pluck('value', 'locale')
            ->toArray();
    }

    /**
     * Get translated value with fallback to original field
     */
    public function translate(string $field, string $locale = null): string
    {
        $locale = $locale ?: app()->getLocale();
        
        // Try to get translation
        $translation = $this->getTranslation($field, $locale);
        
        if ($translation) {
            return $translation;
        }
        
        // Fallback to English if current locale is not English
        if ($locale !== 'en') {
            $fallback = $this->getTranslation($field, 'en');
            if ($fallback) {
                return $fallback;
            }
        }
        
        // Final fallback to original field value
        return $this->getAttribute($field) ?? '';
    }

    /**
     * Magic method to get translated attributes
     * Usage: $business->name_km or $business->description_en
     */
    public function __get($key)
    {
        // Check if the key matches pattern: field_locale (e.g., name_km, description_en)
        if (preg_match('/^(.+)_([a-z]{2})$/', $key, $matches)) {
            $field = $matches[1];
            $locale = $matches[2];
            
            if (in_array($field, $this->getTranslatableFields())) {
                return $this->getTranslation($field, $locale);
            }
        }
        
        // Check if requesting translated version of current locale
        if (in_array($key, $this->getTranslatableFields())) {
            return $this->translate($key);
        }
        
        return parent::__get($key);
    }

    /**
     * Get list of translatable fields for this model
     */
    abstract public function getTranslatableFields(): array;
}