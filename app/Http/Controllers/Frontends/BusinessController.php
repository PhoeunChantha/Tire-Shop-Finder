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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'descriptions' => 'nullable|string',
            'province_id' => 'required|exists:provinces,id',
            'district_id' => 'required|exists:districts,id',
            'commune_id' => 'nullable|exists:communes,id',
            'village_id' => 'nullable|exists:villages,id',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
        ]);

        $business = Business::create([
            'name' => $validated['name'],
            'descriptions' => $validated['descriptions'],
            'province_id' => $validated['province_id'],
            'district_id' => $validated['district_id'],
            'commune_id' => $validated['commune_id'],
            'village_id' => $validated['village_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'opening_time' => $validated['opening_time'],
            'closing_time' => $validated['closing_time'],
            'created_by' => Auth::id(),
            'status' => true,
            'is_vierify' => false, // Requires admin verification
        ]);

        return redirect()->route('services.create', $business->id)
            ->with('success', 'Business created successfully! Now add your services.');
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