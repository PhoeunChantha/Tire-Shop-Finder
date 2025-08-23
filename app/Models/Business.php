<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'closing_time'
    ];

    protected $casts = [
        'status' => 'boolean',
        'is_vierify' => 'boolean',
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
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
}