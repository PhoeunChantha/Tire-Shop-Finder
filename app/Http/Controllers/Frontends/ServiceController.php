<?php

namespace App\Http\Controllers\Frontends;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function create(Business $business): Response
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('frontend/service/create', [
            'business' => $business
        ]);
    }

    public function store(Request $request, Business $business): RedirectResponse
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Debug: Log the incoming request data
        \Log::info('Service creation request data:', $request->all());

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
            'services.*.status' => 'boolean'
        ]);

        foreach ($validated['services'] as $serviceData) {
            // Handle translations by storing as JSON
            $nameTranslations = $serviceData['name_translations'] ?? ['en' => $serviceData['name'], 'km' => ''];
            $descriptionsTranslations = $serviceData['descriptions_translations'] ?? ['en' => $serviceData['descriptions'] ?? '', 'km' => ''];
            
            Service::create([
                'name' => json_encode($nameTranslations),
                'price' => $serviceData['price'],
                'descriptions' => json_encode($descriptionsTranslations),
                'status' => $serviceData['status'] ?? true,
                'bussiness_id' => $business->id
            ]);
        }

        return redirect()->route('user.dashboard')
            ->with('success', 'Services created successfully!');
    }

    public function edit(Business $business, Service $service): Response
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id() || $service->bussiness_id !== $business->id) {
            abort(403, 'Unauthorized');
        }

        // Load service with translation data
        $serviceWithTranslations = $service->toArray();
        
        // Parse JSON translations for the frontend
        if (isset($serviceWithTranslations['name']) && $this->isJson($serviceWithTranslations['name'])) {
            $serviceWithTranslations['name_translations'] = json_decode($serviceWithTranslations['name'], true);
        } else {
            $serviceWithTranslations['name_translations'] = ['en' => $serviceWithTranslations['name'], 'km' => ''];
        }
        
        if (isset($serviceWithTranslations['descriptions']) && $this->isJson($serviceWithTranslations['descriptions'])) {
            $serviceWithTranslations['descriptions_translations'] = json_decode($serviceWithTranslations['descriptions'], true);
        } else {
            $serviceWithTranslations['descriptions_translations'] = ['en' => $serviceWithTranslations['descriptions'] ?? '', 'km' => ''];
        }

        return Inertia::render('frontend/service/edit', [
            'business' => $business,
            'service' => $serviceWithTranslations
        ]);
    }

    public function update(Request $request, Business $business, Service $service): RedirectResponse
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id() || $service->bussiness_id !== $business->id) {
            abort(403, 'Unauthorized');
        }

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
            'status' => 'boolean'
        ]);

        // Handle translations by storing as JSON
        $nameTranslations = $validated['name_translations'] ?? ['en' => $validated['name'], 'km' => ''];
        $descriptionsTranslations = $validated['descriptions_translations'] ?? ['en' => $validated['descriptions'] ?? '', 'km' => ''];
        
        $service->update([
            'name' => json_encode($nameTranslations),
            'price' => $validated['price'],
            'descriptions' => json_encode($descriptionsTranslations),
            'status' => $validated['status'] ?? true,
        ]);

        return redirect()->route('user.dashboard')
            ->with('success', 'Service updated successfully!');
    }

    public function destroy(Business $business, Service $service): RedirectResponse
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id() || $service->bussiness_id !== $business->id) {
            abort(403, 'Unauthorized');
        }

        $service->delete();

        return back()->with('success', 'Service deleted successfully!');
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