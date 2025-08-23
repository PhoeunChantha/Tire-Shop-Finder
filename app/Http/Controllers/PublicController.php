<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Province;
use App\Models\District;
use App\Models\Commune;
use App\Models\Village;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function businesses(Request $request): Response
    {
        $query = Business::with(['province', 'district', 'commune', 'village', 'services'])
            ->where('status', true)
            ->where('is_vierify', true); // Only show verified businesses

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by province
        if ($request->filled('province_id')) {
            $query->where('province_id', $request->province_id);
        }

        // Filter by district
        if ($request->filled('district_id')) {
            $query->where('district_id', $request->district_id);
        }

        // Filter by commune
        if ($request->filled('commune_id')) {
            $query->where('commune_id', $request->commune_id);
        }

        // Filter by village
        if ($request->filled('village_id')) {
            $query->where('village_id', $request->village_id);
        }

        // Filter by services (if business has specific services)
        if ($request->filled('service')) {
            $query->whereHas('services', function ($serviceQuery) use ($request) {
                $serviceQuery->where('name', 'like', '%' . $request->service . '%')
                           ->where('status', true);
            });
        }

        // Order by most recent first
        $query->orderBy('created_at', 'desc');

        $businesses = $query->paginate(12);
        
        // Get filter data
        $provinces = Province::all();
        $districts = collect();
        if ($request->filled('province_id')) {
            $districts = District::where('province_id', $request->province_id)->get();
        }

        return Inertia::render('public/businesses/index', [
            'businesses' => $businesses,
            'provinces' => $provinces,
            'districts' => $districts,
            'filters' => $request->only(['search', 'province_id', 'district_id', 'commune_id', 'village_id', 'service'])
        ]);
    }

    public function businessDetail(Business $business): Response
    {
        // Only show verified businesses
        if (!$business->status || !$business->is_vierify) {
            abort(404, 'Business not found');
        }

        $business->load([
            'province', 
            'district', 
            'commune', 
            'village', 
            'services' => function ($query) {
                $query->where('status', true);
            }
        ]);

        // Get nearby businesses (same district)
        $nearbyBusinesses = Business::with(['province', 'district'])
            ->where('district_id', $business->district_id)
            ->where('id', '!=', $business->id)
            ->where('status', true)
            ->where('is_vierify', true)
            ->limit(6)
            ->get();

        return Inertia::render('public/businesses/show', [
            'business' => $business,
            'nearbyBusinesses' => $nearbyBusinesses
        ]);
    }

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

    public function reverseGeocode(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $lat = $request->latitude;
        $lng = $request->longitude;

        // For Cambodia, this is a simplified reverse geocoding
        // In a real application, you would use a proper geocoding service like:
        // - Google Maps Geocoding API
        // - OpenStreetMap Nominatim
        // - Here Geocoding API
        
        // For now, we'll return the closest location based on a simple proximity check
        // This is a basic implementation - you should replace with a proper geocoding service
        
        try {
            // Find the closest province/district/commune/village based on coordinates
            // This is a simplified example - you'd need actual coordinate data for locations
            
            // For demonstration, let's assume we have coordinate data and find closest match
            // In reality, you'd want to store lat/lng for each location in your database
            // or use a proper geocoding service
            
            // Sample logic (replace with actual geocoding):
            $business = Business::whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->selectRaw("*, (
                    6371 * acos(
                        cos(radians(?)) * 
                        cos(radians(CAST(latitude AS DECIMAL(10,8)))) * 
                        cos(radians(CAST(longitude AS DECIMAL(11,8))) - radians(?)) + 
                        sin(radians(?)) * 
                        sin(radians(CAST(latitude AS DECIMAL(10,8))))
                    )
                ) AS distance", [$lat, $lng, $lat])
                ->orderBy('distance')
                ->with(['province', 'district', 'commune', 'village'])
                ->first();

            if ($business) {
                return response()->json([
                    'province_id' => $business->province_id,
                    'district_id' => $business->district_id,
                    'commune_id' => $business->commune_id,
                    'village_id' => $business->village_id,
                    'location_name' => $business->province?->name . ', ' . $business->district?->name
                ]);
            }

            // Fallback: return a default location (e.g., Phnom Penh)
            $defaultProvince = Province::where('name', 'like', '%Phnom Penh%')->first();
            if ($defaultProvince) {
                $defaultDistrict = District::where('province_id', $defaultProvince->id)->first();
                
                return response()->json([
                    'province_id' => $defaultProvince->id,
                    'district_id' => $defaultDistrict?->id,
                    'commune_id' => null,
                    'village_id' => null,
                    'location_name' => 'Phnom Penh (estimated)'
                ]);
            }

            return response()->json([
                'province_id' => null,
                'district_id' => null,
                'commune_id' => null,
                'village_id' => null,
                'location_name' => 'Location not found'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unable to determine location',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}