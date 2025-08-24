<?php

namespace App\Http\Controllers\Frontends;

use App\Http\Controllers\Controller;
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
        $userLat = $request->input('user_lat');
        $userLng = $request->input('user_lng');

        $query = Business::with(['province', 'district', 'commune', 'village', 'services'])
            ->where('status', true)
            ->where('is_vierify', true); // Only show verified businesses

        // If user location is provided, calculate distances and sort by proximity
        if ($userLat && $userLng) {
            $query->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->selectRaw("*, (
                    6371 * acos(
                        cos(radians(?)) * 
                        cos(radians(CAST(latitude AS DECIMAL(10,8)))) * 
                        cos(radians(CAST(longitude AS DECIMAL(11,8))) - radians(?)) + 
                        sin(radians(?)) * 
                        sin(radians(CAST(latitude AS DECIMAL(10,8))))
                    )
                ) AS distance", [$userLat, $userLng, $userLat]);
        }

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

        // Order by distance if user location provided, otherwise by most recent
        if ($userLat && $userLng) {
            $query->orderBy('distance', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $businesses = $query->paginate(12);
        
        // Get filter data
        $provinces = Province::all();
        $districts = collect();
        if ($request->filled('province_id')) {
            $districts = District::where('province_id', $request->province_id)->get();
        }

        return Inertia::render('frontend/public/businesses/index', [
            'businesses' => $businesses,
            'provinces' => $provinces,
            'districts' => $districts,
            'filters' => $request->only(['search', 'province_id', 'district_id', 'commune_id', 'village_id', 'service']),
            'userLocation' => [
                'lat' => $userLat,
                'lng' => $userLng
            ]
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

        return Inertia::render('frontend/public/businesses/show', [
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

    public function expandMapsUrl(Request $request)
    {
        $request->validate([
            'url' => 'required|string|url',
        ]);

        $url = $request->input('url');
        \Log::info('Processing Google Maps URL: ' . $url);

        try {
            // Check if it's a shortened Google Maps URL that needs expansion
            if (strpos($url, 'maps.app.goo.gl') !== false || strpos($url, 'goo.gl/maps') !== false) {
                // Use cURL to follow redirects and get the final URL
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_HEADER, true);
                curl_setopt($ch, CURLOPT_NOBODY, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 15);
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
                
                $response = curl_exec($ch);
                $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                \Log::info('URL expansion result: ' . $finalUrl . ' (HTTP: ' . $httpCode . ')');

                if ($httpCode >= 200 && $httpCode < 400 && $finalUrl) {
                    $expandedUrl = $finalUrl;
                } else {
                    return response()->json([
                        'error' => 'Could not expand the shortened URL. Please try a different link.',
                        'debug_info' => [
                            'http_code' => $httpCode,
                            'final_url' => $finalUrl
                        ]
                    ], 400);
                }
            } else {
                // URL doesn't need expansion
                $expandedUrl = $url;
            }

            \Log::info('Parsing coordinates from: ' . $expandedUrl);

            // Parse coordinates from the expanded URL
            $coordinates = $this->parseGoogleMapsCoordinates($expandedUrl);

            if (!$coordinates) {
                return response()->json([
                    'error' => 'Could not extract coordinates from this Google Maps link.',
                    'debug_info' => [
                        'original_url' => $url,
                        'expanded_url' => $expandedUrl,
                        'patterns_tested' => $this->getPatternTestResults($expandedUrl)
                    ]
                ], 400);
            }

            \Log::info('Extracted coordinates: ' . json_encode($coordinates));

            // Validate coordinates are reasonable for Cambodia
            if (!$this->validateCambodiaCoordinates($coordinates['lat'], $coordinates['lng'])) {
                return response()->json([
                    'error' => 'This location appears to be outside Cambodia. Please share a location within Cambodia.',
                    'coordinates' => $coordinates
                ], 400);
            }

            return response()->json([
                'success' => true,
                'expanded_url' => $expandedUrl,
                'coordinates' => $coordinates
            ]);

        } catch (\Exception $e) {
            \Log::error('Error processing Google Maps URL: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error processing the Google Maps link: ' . $e->getMessage()
            ], 500);
        }
    }

    private function parseGoogleMapsCoordinates($url)
    {
        // Pattern 1: @lat,lng,zoom format (most common)
        // Example: /@11.5564,104.9282,17z or /@11.5564,104.9282,17z/data=...
        if (preg_match('/@(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 2: !3d and !4d format (3D coordinates)
        // Example: /data=!3m1!4b1!4m6!3m5!1s0x0:0x0!2s!3d11.5564!4d104.9282
        if (preg_match('/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 3: q=lat,lng format
        if (preg_match('/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 4: search/lat,lng format
        if (preg_match('/\/search\/(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 5: ll parameter
        if (preg_match('/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 6: center parameter
        if (preg_match('/[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 7: coordinates in URL path after place name
        if (preg_match('/\/place\/[^\/]*\/@(-?\d+\.?\d*),(-?\d+\.?\d*),/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 8: More flexible @ pattern with optional decimals
        if (preg_match('/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 9: dir/ coordinates (Google Maps directions)
        if (preg_match('/\/dir\/[^\/]*\/(-?\d+\.?\d*),(-?\d+\.?\d*)/', $url, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2]
            ];
        }

        // Pattern 10: Very loose coordinate pattern - any two numbers separated by comma
        // This should be last as it's very broad
        if (preg_match('/(-?\d{1,2}\.\d+),(-?\d{2,3}\.\d+)/', $url, $matches)) {
            $lat = (float) $matches[1];
            $lng = (float) $matches[2];
            
            // Basic sanity check - lat should be between -90 and 90, lng between -180 and 180
            if ($lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180) {
                return [
                    'lat' => $lat,
                    'lng' => $lng
                ];
            }
        }

        return null;
    }

    private function getPatternTestResults($url)
    {
        $patterns = [
            '@lat,lng format' => '/@(-?\d+\.?\d*),(-?\d+\.?\d*)/',
            '!3d!4d format' => '/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/',
            'q=lat,lng format' => '/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/',
            'search/lat,lng format' => '/\/search\/(-?\d+\.?\d*),(-?\d+\.?\d*)/',
            'll parameter' => '/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/',
            'center parameter' => '/[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/',
            'place/@lat,lng format' => '/\/place\/[^\/]*\/@(-?\d+\.?\d*),(-?\d+\.?\d*),/',
            'flexible @ pattern' => '/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/',
            'dir/ coordinates' => '/\/dir\/[^\/]*\/(-?\d+\.?\d*),(-?\d+\.?\d*)/',
            'loose coordinates' => '/(-?\d{1,2}\.\d+),(-?\d{2,3}\.\d+)/'
        ];

        $results = [];
        foreach ($patterns as $name => $pattern) {
            $matches = [];
            $results[$name] = preg_match($pattern, $url, $matches) ? $matches : 'No match';
        }

        return $results;
    }

    private function validateCambodiaCoordinates($lat, $lng)
    {
        // Cambodia approximate bounds
        $minLat = 10.0;
        $maxLat = 15.0;
        $minLng = 102.0;
        $maxLng = 108.0;
        
        return $lat >= $minLat && $lat <= $maxLat && $lng >= $minLng && $lng <= $maxLng;
    }
}