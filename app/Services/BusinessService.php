<?php

namespace App\Services;

use App\Models\Business;

class BusinessService
{
    public function createBusiness(array $validated): Business
    {
        $validated['status'] = $validated['status'] ?? true;
        $validated['is_vierify'] = $validated['is_vierify'] ?? true;

        return Business::create($validated);
    }

    public function updateBusiness(Business $business, array $validated): Business
    {
        $business->update($validated);
        
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
}