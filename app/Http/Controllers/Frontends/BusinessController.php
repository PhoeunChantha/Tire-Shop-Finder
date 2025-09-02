<?php

namespace App\Http\Controllers\Frontends;

use App\Models\Business;
use App\Models\Province;
use App\Models\District;
use App\Models\Commune;
use App\Models\Village;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class BusinessController extends Controller
{
    public function create(): Response
    {
        $provinces = Province::all();
        
        return Inertia::render('frontend/business/create', [
            'provinces' => $provinces
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Debug: Log the incoming request data
        \Log::info('Business creation request data:', $request->all());
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'descriptions' => 'nullable|string',
            'name_translations' => 'nullable|array',
            'name_translations.en' => 'required|string|max:255',
            'name_translations.km' => 'nullable|string|max:255',
            'descriptions_translations' => 'nullable|array',
            'descriptions_translations.en' => 'nullable|string',
            'descriptions_translations.km' => 'nullable|string',
            'province_id' => 'required|exists:provinces,id',
            'district_id' => 'required|exists:districts,id',
            'commune_id' => 'nullable|exists:communes,id',
            'village_id' => 'nullable|exists:villages,id',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_title_translations' => 'nullable|array',
            'seo_title_translations.en' => 'nullable|string|max:255',
            'seo_title_translations.km' => 'nullable|string|max:255',
            'seo_description_translations' => 'nullable|array',
            'seo_description_translations.en' => 'nullable|string|max:500',
            'seo_description_translations.km' => 'nullable|string|max:500',
            'seo_image' => 'nullable|string|max:2048',
            'seo_keywords' => 'nullable|array',
            'seo_keywords.*' => 'string|max:100',
        ]);

        // Handle translations by storing as JSON
        $nameTranslations = $validated['name_translations'] ?? ['en' => $validated['name'], 'km' => ''];
        $descriptionsTranslations = $validated['descriptions_translations'] ?? ['en' => $validated['descriptions'] ?? '', 'km' => ''];
        $seoTitleTranslations = $validated['seo_title_translations'] ?? ['en' => $validated['seo_title'] ?? '', 'km' => ''];
        $seoDescriptionTranslations = $validated['seo_description_translations'] ?? ['en' => $validated['seo_description'] ?? '', 'km' => ''];

        // Create the business with JSON translations
        $business = Business::create([
            'name' => json_encode($nameTranslations),
            'descriptions' => json_encode($descriptionsTranslations),
            'seo_title' => json_encode($seoTitleTranslations),
            'seo_description' => json_encode($seoDescriptionTranslations),
            'province_id' => $validated['province_id'],
            'district_id' => $validated['district_id'],
            'commune_id' => $validated['commune_id'],
            'village_id' => $validated['village_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'opening_time' => $validated['opening_time'],
            'closing_time' => $validated['closing_time'],
            'seo_image' => $validated['seo_image'] ?? null,
            'seo_keywords' => $validated['seo_keywords'] ?? null,
            'created_by' => Auth::id(),
            'status' => true,
            'is_vierify' => false, // Requires admin verification
        ]);

        // Assign business role to the user when they create their first business
        $user = Auth::user();
        if (!$user->hasRole('business')) {
            $user->assignRole('business');
        }

        return redirect()->route('services.create', $business->id)
            ->with('success', 'Business created successfully! Now add your services.');
    }

    public function edit(Business $business): Response
    {
        // Ensure user can only edit their own business
        if ($business->created_by !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $business->load(['province', 'district', 'commune', 'village']);
        
        // Add translations for form editing
        $businessData = $business->toArray();
        $businessData = array_merge($businessData, $business->getTranslationsForForm());
        
        return Inertia::render('frontend/business/edit', [
            'business' => $businessData,
            'provinces' => Province::all(),
        ]);
    }

    public function update(Request $request, Business $business): RedirectResponse
    {
        // Ensure user can only update their own business
        if ($business->created_by !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'descriptions' => 'nullable|string',
            'name_translations' => 'nullable|array',
            'name_translations.en' => 'required|string|max:255',
            'name_translations.km' => 'nullable|string|max:255',
            'descriptions_translations' => 'nullable|array',
            'descriptions_translations.en' => 'nullable|string',
            'descriptions_translations.km' => 'nullable|string',
            'province_id' => 'required|exists:provinces,id',
            'district_id' => 'required|exists:districts,id',
            'commune_id' => 'nullable|exists:communes,id',
            'village_id' => 'nullable|exists:villages,id',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_title_translations' => 'nullable|array',
            'seo_title_translations.en' => 'nullable|string|max:255',
            'seo_title_translations.km' => 'nullable|string|max:255',
            'seo_description_translations' => 'nullable|array',
            'seo_description_translations.en' => 'nullable|string|max:500',
            'seo_description_translations.km' => 'nullable|string|max:500',
            'seo_image' => 'nullable|string|max:2048',
            'seo_keywords' => 'nullable|array',
            'seo_keywords.*' => 'string|max:100',
        ]);

        // Handle translations by storing as JSON
        $nameTranslations = $validated['name_translations'] ?? ['en' => $validated['name'], 'km' => ''];
        $descriptionsTranslations = $validated['descriptions_translations'] ?? ['en' => $validated['descriptions'] ?? '', 'km' => ''];
        $seoTitleTranslations = $validated['seo_title_translations'] ?? ['en' => $validated['seo_title'] ?? '', 'km' => ''];
        $seoDescriptionTranslations = $validated['seo_description_translations'] ?? ['en' => $validated['seo_description'] ?? '', 'km' => ''];

        // Update business with JSON translations
        $business->update([
            'name' => json_encode($nameTranslations),
            'descriptions' => json_encode($descriptionsTranslations),
            'seo_title' => json_encode($seoTitleTranslations),
            'seo_description' => json_encode($seoDescriptionTranslations),
            'province_id' => $validated['province_id'],
            'district_id' => $validated['district_id'],
            'commune_id' => $validated['commune_id'],
            'village_id' => $validated['village_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'opening_time' => $validated['opening_time'],
            'closing_time' => $validated['closing_time'],
            'seo_image' => $validated['seo_image'],
            'seo_keywords' => $validated['seo_keywords'],
        ]);

        return redirect()->route('user.dashboard')
            ->with('success', 'Business updated successfully!');
    }

    // API endpoints for location dropdowns
    public function getDistricts($province)
    {
        $districts = District::where('province_id', $province)->get();
        return response()->json($districts);
    }

    public function getCommunes($district)
    {
        $communes = Commune::where('district_id', $district)->get();
        return response()->json($communes);
    }

    public function getVillages($commune)
    {
        $villages = Village::where('commune_id', $commune)->get();
        return response()->json($villages);
    }
}