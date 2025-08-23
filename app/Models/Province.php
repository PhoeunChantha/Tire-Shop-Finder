<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code'
    ];

    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }

    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class);
    }
}