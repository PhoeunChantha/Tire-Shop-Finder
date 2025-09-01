<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Business extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'descriptions',
        'image',
        'created_by',
        'latitude',
        'longitude',
        'province_id',
        'district_id',
        'commune_id',
        'village_id',
        'status',
        'is_vierify',
        'opening_time',
        'closing_time',
        'slug',
        'seo_title',
        'seo_description',
        'seo_image',
        'seo_keywords',
    ];

    protected $casts = [
        'status' => 'boolean',
        'is_vierify' => 'boolean',
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
        'seo_keywords' => 'array',
    ];

    /**
     * Get formatted business hours for display
     */
    public function getFormattedHoursAttribute(): ?string
    {
        if (!$this->opening_time || !$this->closing_time) {
            return null;
        }

        $openingTime = $this->opening_time->format('g:i A');
        $closingTime = $this->closing_time->format('g:i A');

        return "{$openingTime} - {$closingTime}";
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }

    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'bussiness_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getAverageRatingAttribute(): float
    {
        return $this->reviews()->avg('rate') ?? 0;
    }

    public function getReviewCountAttribute(): int
    {
        return $this->reviews()->count();
    }


    /**
     * Get SEO image with fallback to business image
     */
    public function getSeoImageAttribute($value): ?string
    {
        return $value ?: $this->image;
    }

    public static function boot(): void
    {
        parent::boot();

        static::creating(function (Business $business) {
            if (empty($business->slug)) {
                $business->slug = Str::slug($business->name) . '-' . Str::random(4);
            }
        });
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
            return $translated ?: ($this->descriptions ?: "Professional tire services at {$this->name}. Find tire installation, repair, and replacement services.");
        }
        return $value ?: ($this->descriptions ?: "Professional tire services at {$this->name}. Find tire installation, repair, and replacement services.");
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
        $translatableFields = ['name', 'descriptions', 'seo_title', 'seo_description'];
        
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
