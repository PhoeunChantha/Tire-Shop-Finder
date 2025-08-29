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
     * Get SEO title with fallback to service name
     */
    public function getSeoTitleAttribute($value): string
    {
        return $value ?: $this->name;
    }

    /**
     * Get SEO description with fallback to service description
     */
    public function getSeoDescriptionAttribute($value): string
    {
        return $value ?: $this->descriptions ?: "Quality {$this->name} service with professional installation and competitive pricing.";
    }

    /**
     * Get SEO image with fallback to service image
     */
    public function getSeoImageAttribute($value): ?string
    {
        return $value ?: $this->image;
    }
}