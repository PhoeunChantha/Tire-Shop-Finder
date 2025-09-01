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
            'services.*.name_translations' => 'nullable|array',
            'services.*.name_translations.en' => 'required|string|max:255',
            'services.*.name_translations.km' => 'nullable|string|max:255',
            'services.*.descriptions_translations' => 'nullable|array',
            'services.*.descriptions_translations.en' => 'nullable|string',
            'services.*.descriptions_translations.km' => 'nullable|string',
            'services.*.status' => 'required|boolean',
        ]);

        // Create services for the business
        foreach ($validated['services'] as $serviceData) {
            $createData = [
                'bussiness_id' => $business->id, // Note: matches existing typo in model
                'price' => $serviceData['price'],
                'status' => $serviceData['status'],
            ];

            // Handle translations for name
            if (isset($serviceData['name_translations'])) {
                $createData['name'] = $serviceData['name_translations'];
            } else {
                $createData['name'] = $serviceData['name'];
            }

            // Handle translations for descriptions
            if (isset($serviceData['descriptions_translations'])) {
                $createData['descriptions'] = $serviceData['descriptions_translations'];
            } else {
                $createData['descriptions'] = $serviceData['descriptions'] ?? '';
            }

            Service::create($createData);
        }

        return redirect()->route('businesses.index')
            ->with('success', 'Services added successfully to ' . $business->name . '!');
    }

    public function edit(Service $service): Response
    {
        $service->load(['business.owner', 'business.province', 'business.district', 'business.commune', 'business.village']);
        
        // Get raw attributes from database (before accessors process them)
        $rawAttributes = $service->getRawOriginal();
        $serviceArray = $service->toArray();
        
        // Parse JSON translations if they exist, otherwise create from current values
        if (isset($rawAttributes['name']) && $this->isJson($rawAttributes['name'])) {
            $serviceArray['name_translations'] = json_decode($rawAttributes['name'], true);
            $serviceArray['name'] = $serviceArray['name_translations']['en'] ?? '';
        } else {
            $serviceArray['name_translations'] = [
                'en' => $rawAttributes['name'] ?? '',
                'km' => ''
            ];
        }
        
        if (isset($rawAttributes['descriptions']) && $this->isJson($rawAttributes['descriptions'])) {
            $serviceArray['descriptions_translations'] = json_decode($rawAttributes['descriptions'], true);
            $serviceArray['descriptions'] = $serviceArray['descriptions_translations']['en'] ?? '';
        } else {
            $serviceArray['descriptions_translations'] = [
                'en' => $rawAttributes['descriptions'] ?? '',
                'km' => ''
            ];
        }
        
        return Inertia::render('admin/service/edit', [
            'service' => $serviceArray,
            'business' => $service->business,
        ]);
    }

    /**
     * Check if a string is valid JSON
     */
    private function isJson($string): bool
    {
        if (!is_string($string)) return false;
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'descriptions' => 'nullable|string',
            'name_translations' => 'nullable|array',
            'name_translations.en' => 'required|string|max:255',
            'name_translations.km' => 'nullable|string|max:255',
            'descriptions_translations' => 'nullable|array',
            'descriptions_translations.en' => 'nullable|string',
            'descriptions_translations.km' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        // Update the service with both translation and main fields
        $updateData = [
            'price' => $validated['price'],
            'status' => $validated['status'],
        ];

        // Handle translations for name
        if (isset($validated['name_translations'])) {
            $updateData['name'] = $validated['name_translations'];
        } else {
            $updateData['name'] = $validated['name'];
        }

        // Handle translations for descriptions
        if (isset($validated['descriptions_translations'])) {
            $updateData['descriptions'] = $validated['descriptions_translations'];
        } else {
            $updateData['descriptions'] = $validated['descriptions'];
        }

        $service->update($updateData);

        return redirect()->route('businesses.show', $service->business->id)
            ->with('success', 'Service updated successfully!');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $businessName = $service->business->name;
        $serviceName = $service->name;
        
        $service->delete();

        return redirect()->back()
            ->with('success', "Service '{$serviceName}' deleted from {$businessName} successfully!");
    }
}