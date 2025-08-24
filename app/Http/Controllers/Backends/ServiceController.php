<?php

namespace App\Http\Controllers\Backends;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ServiceController extends Controller
{
    public function create(Business $business): Response
    {
        $business->load(['owner', 'province', 'district', 'commune', 'village']);
        
        return Inertia::render('admin/service/create', [
            'business' => $business,
        ]);
    }

    public function store(Request $request, Business $business): RedirectResponse
    {
        $validated = $request->validate([
            'services' => 'required|array|min:1',
            'services.*.name' => 'required|string|max:255',
            'services.*.price' => 'required|numeric|min:0',
            'services.*.descriptions' => 'nullable|string',
            'services.*.status' => 'required|boolean',
        ]);

        // Create services for the business
        foreach ($validated['services'] as $serviceData) {
            Service::create([
                'bussiness_id' => $business->id, // Note: matches existing typo in model
                'name' => $serviceData['name'],
                'price' => $serviceData['price'],
                'descriptions' => $serviceData['descriptions'] ?? '',
                'status' => $serviceData['status'],
            ]);
        }

        return redirect()->route('businesses.index')
            ->with('success', 'Services added successfully to ' . $business->name . '!');
    }
}