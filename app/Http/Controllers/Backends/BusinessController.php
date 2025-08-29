<?php

namespace App\Http\Controllers\Backends;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Province;
use App\Models\District;
use App\Models\Commune;
use App\Models\Village;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Http\Traits\HasDataTableFilters;

class BusinessController extends Controller
{
    use HasDataTableFilters;

    public function index(Request $request): Response
    {
        $query = Business::with(['owner', 'province', 'district', 'commune', 'village'])
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('descriptions', 'like', "%{$search}%")
                  ->orWhereHas('owner', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $status = $request->get('status');
            if ($status === 'verified') {
                $query->where('is_vierify', true);
            } elseif ($status === 'pending') {
                $query->where('is_vierify', false);
            }
        }

        if ($request->filled('province_id')) {
            $query->where('province_id', $request->get('province_id'));
        }

        $businesses = $query->paginate($request->get('per_page', 10));
        $filters = $this->getFilters($request);

        return Inertia::render('admin/business/index', [
            'businesses' => $businesses,
            'filters' => $filters,
            'provinces' => Province::all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/business/create', [
            'provinces' => Province::all(),
            'users' => User::select('id', 'name', 'email')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'descriptions' => 'nullable|string',
            'created_by' => 'required|exists:users,id',
            'province_id' => 'required|exists:provinces,id',
            'district_id' => 'required|exists:districts,id',
            'commune_id' => 'nullable|exists:communes,id',
            'village_id' => 'nullable|exists:villages,id',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
            'status' => 'nullable|boolean',
            'is_vierify' => 'nullable|boolean',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_image' => 'nullable|string|max:2048',
            'seo_keywords' => 'nullable|array',
            'seo_keywords.*' => 'string|max:100',
        ]);

        // Default values for admin-created businesses
        $validated['status'] = $validated['status'] ?? true;
        $validated['is_vierify'] = $validated['is_vierify'] ?? true;

        $business = Business::create($validated);

        return redirect()->route('admin.services.create', $business->id)
            ->with('success', 'Business created successfully! Now add services for this business.');
    }

    // API endpoints for location dropdowns
    public function getDistricts(Province $province)
    {
        return response()->json($province->districts);
    }

    public function getCommunes(District $district)
    {
        return response()->json($district->communes);
    }

    public function getVillages(Commune $commune)
    {
        return response()->json($commune->villages);
    }

    public function show(Business $business): Response
    {
        $business->load(['owner', 'province', 'district', 'commune', 'village']);
        
        return Inertia::render('admin/business/show', [
            'business' => $business
        ]);
    }

    public function edit(Business $business): Response
    {
        $business->load(['owner', 'province', 'district', 'commune', 'village']);
        
        return Inertia::render('admin/business/edit', [
            'business' => $business,
            'provinces' => Province::all(),
        ]);
    }

    public function update(Request $request, Business $business): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'descriptions' => 'nullable|string',
            'status' => 'required|boolean',
            'is_vierify' => 'required|boolean',
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
            'seo_image' => 'nullable|string|max:2048',
            'seo_keywords' => 'nullable|array',
            'seo_keywords.*' => 'string|max:100',
        ]);

        $business->update($validated);

        return redirect()->route('businesses.index')
            ->with('success', 'Business updated successfully!');
    }

    public function destroy(Business $business): RedirectResponse
    {
        $business->delete();
        
        return redirect()->route('businesses.index')
            ->with('success', 'Business deleted successfully!');
    }

    public function verify(Business $business): RedirectResponse
    {
        $business->update([
            'is_vierify' => true,
            'status' => true
        ]);

        return back()->with('success', 'Business verified successfully!');
    }

    public function reject(Business $business): RedirectResponse
    {
        $business->update([
            'is_vierify' => false,
            'status' => false
        ]);

        return back()->with('success', 'Business rejected successfully!');
    }

    private function getFilters(Request $request): array
    {
        return [
            'search' => $request->get('search'),
            'status' => $request->get('status'),
            'province_id' => $request->get('province_id'),
            'per_page' => $request->get('per_page', 10),
            'page' => $request->get('page', 1),
        ];
    }
}