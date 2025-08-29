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
     * Get SEO title with fallback to business name
     */
    public function getSeoTitleAttribute($value): string
    {
        return $value ?: $this->name;
    }

    /**
     * Get SEO description with fallback to business description
     */
    public function getSeoDescriptionAttribute($value): string
    {
        return $value ?: $this->descriptions ?: "Professional tire services at {$this->name}. Find tire installation, repair, and replacement services.";
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

}
