<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'descriptions',
        'status',
        'image',
        'icon',
        'bussiness_id',
        'seo_title',
        'seo_description',
        'seo_image',
        'seo_keywords',
    ];

    protected $casts = [
        'status' => 'boolean',
        'price' => 'decimal:2',
        'seo_keywords' => 'array',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'bussiness_id');
    }


    /**
     * Get SEO image with fallback to service image
     */
    public function getSeoImageAttribute($value): ?string
    {
        return $value ?: $this->image;
    }

    /**
     * Define translatable attributes for Spatie Laravel Translatable
     */
    public $translatable = [
        'name',
        'descriptions', 
        'seo_title',
        'seo_description'
    ];

    /**
     * Accessor for name - handles JSON translations until Spatie is fully installed
     */
    public function getNameAttribute($value)
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
     * Accessor for seo_title - handles JSON translations 
     */
    public function getSeoTitleAttribute($value)
    {
        if (is_string($value) && $this->isJson($value)) {
            $translations = json_decode($value, true);
            $locale = app()->getLocale();
            $translated = $translations[$locale] ?? $translations['en'] ?? '';
            return $translated ?: $this->name;
        }
        return $value ?: $this->name;
    }

    /**
     * Accessor for seo_description - handles JSON translations 
     */
    public function getSeoDescriptionAttribute($value)
    {
        if (is_string($value) && $this->isJson($value)) {
            $translations = json_decode($value, true);
            $locale = app()->getLocale();
            $translated = $translations[$locale] ?? $translations['en'] ?? '';
            return $translated ?: ($this->descriptions ?: "Quality {$this->name} service with professional installation and competitive pricing.");
        }
        return $value ?: ($this->descriptions ?: "Quality {$this->name} service with professional installation and competitive pricing.");
    }

    /**
     * Check if a string is valid JSON
     */
    private function isJson($string)
    {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }
}