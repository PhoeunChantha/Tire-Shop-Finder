<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'descriptions',
        'image',
        'url',
        'is_active',
        'sort_order',
        'created_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Define translatable attributes following the same pattern as Business model
     */
    public $translatable = [
        'title',
        'descriptions'
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('created_at', 'desc');
    }

    /**
     * Accessor for title - handles JSON translations
     */
    public function getTitleAttribute($value)
    {
        if (is_string($value) && $this->isJson($value)) {
            $translations = json_decode($value, true);
            $locale = app()->getLocale();
            return $translations[$locale] ?? $translations['en'] ?? '';
        }
        return $value;
    }

    /**
     * Accessor for descriptions - handles JSON translations 
     */
    public function getDescriptionsAttribute($value)
    {
        if (is_string($value) && $this->isJson($value)) {
            $translations = json_decode($value, true);
            $locale = app()->getLocale();
            return $translations[$locale] ?? $translations['en'] ?? '';
        }
        return $value;
    }

    /**
     * Check if a string is valid JSON
     */
    private function isJson($string)
    {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

    /**
     * Get translations for form editing
     * Returns array with individual translations for each locale
     */
    public function getTranslationsForForm(): array
    {
        $translations = [];
        $translatableFields = ['title', 'descriptions'];
        
        foreach ($translatableFields as $field) {
            $rawValue = $this->getAttributes()[$field] ?? null;
            
            if ($rawValue && $this->isJson($rawValue)) {
                $fieldTranslations = json_decode($rawValue, true);
                $translations[$field . '_translations'] = $fieldTranslations;
            } else {
                // Fallback for non-JSON data
                $translations[$field . '_translations'] = [
                    'en' => $rawValue ?? '',
                    'km' => ''
                ];
            }
        }
        
        return $translations;
    }
}