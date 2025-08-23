<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Village;
use App\Models\Commune;
use App\Models\District;
use App\Models\Province;
use Illuminate\Http\Request;
use App\Http\Traits\HasDataTableFilters;

class VillageController extends Controller
{
    use HasDataTableFilters;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterConfig = [
            'search' => [
                'type' => 'search',
                'fields' => ['name', 'code', 'khmer_name']
            ],
        ];

        // Get paginated villages with filters
        $villages = $this->getPaginatedWithFilters(
            Village::query()->with(['district', 'province', 'commune']),
            $request,
            $filterConfig,
            10 // default per page
        );

        $filters = $request->only([
            'search', 'per_page', 'page'
        ]);

        return Inertia::render('Villages/Index', [
            'villages' => $villages,
            'filters' => $filters
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Villages/Create', [
            'provinces' => Province::all(),
            'districts' => District::all(),
            'communes' => Commune::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'khmer_name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:villages',
            'type' => 'required|string|max:100',
            'province_id' => 'required|exists:provinces,id',
            'district_id' => 'required|exists:districts,id',
            'commune_id' => 'required|exists:communes,id',
        ]);

        Village::create([
            'name' => $request->name,
            'khmer_name' => $request->khmer_name,
            'code' => $request->code,
            'type' => $request->type,
            'province_id' => $request->province_id,
            'district_id' => $request->district_id,
            'commune_id' => $request->commune_id,
        ]);

        return redirect()->route('villages.index')
            ->with('success', 'Village created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Village $village)
    {
        $village->load(['province', 'district', 'commune']);
        
        return Inertia::render('Villages/Show', [
            'village' => $village
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Village $village)
    {
        return Inertia::render('Villages/Edit', [
            'village' => $village,
            'provinces' => Province::all(),
            'districts' => District::all(),
            'communes' => Commune::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Village $village)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'khmer_name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:villages,code,' . $village->id,
            'type' => 'required|string|max:100',
            'province_id' => 'required|exists:provinces,id',
            'district_id' => 'required|exists:districts,id',
            'commune_id' => 'required|exists:communes,id',
        ]);

        $village->update([
            'name' => $request->name,
            'khmer_name' => $request->khmer_name,
            'code' => $request->code,
            'type' => $request->type,
            'province_id' => $request->province_id,
            'district_id' => $request->district_id,
            'commune_id' => $request->commune_id,
        ]);

        return redirect()->route('villages.index')
            ->with('success', 'Village updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Village $village)
    {
        $village->delete();

        return redirect()->route('villages.index')
            ->with('success', 'Village deleted successfully.');
    }

    /**
     * Get villages by commune ID
     */
    public function getByCommune($communeId)
    {
        $villages = Village::where('commune_id', $communeId)
            ->select('id', 'name', 'khmer_name')
            ->get();
        
        return response()->json($villages);
    }
}
