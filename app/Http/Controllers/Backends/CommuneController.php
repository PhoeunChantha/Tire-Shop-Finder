<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Commune;
use App\Models\District;
use App\Models\Province;
use Illuminate\Http\Request;
use App\Http\Traits\HasDataTableFilters;

class CommuneController extends Controller
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
                'fields' => ['name', 'code','khmer_name']
            ],
        ];

        // Get paginated permissions with filters
        $communes = $this->getPaginatedWithFilters(
            Commune::query()->with(['district','province']),
            $request,
            $filterConfig,
            10 // default per page
        );
        $filters = $request->only([
            'search','per_page','page'
        ]);
        return Inertia::render('Communes/Index', [
            'communes' => $communes,
            'filters' => $filters
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Communes/Create', [
            'provinces' => Province::all(),
            'districts' => District::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name'          => 'required|string|max:255|unique:communes,name',
                'code'          => 'required|string|max:255|unique:communes,code',
                'khmer_name'    => 'required|string|max:255|unique:communes,khmer_name',
                'type'          => 'required|string|max:255',
                'province_id'   => 'required|exists:provinces,id',
                'district_id'   => 'required|exists:districts,id',
            ]);
            Commune::create($request->all());
            return redirect()->route('communes.index')
                ->with('success', 'Commune created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('communes.index')
                ->with('error', 'Failed to create commune.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Commune $commune)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Commune $commune)
    {
        return Inertia::render('Communes/Edit', [
            'commune' => $commune,
            'provinces' => Province::all(),
            'districts' => District::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Commune $commune)
    {
        try {
            $request->validate([
                'name'          => 'required|string|max:255|unique:communes,name,' . $commune->id,
                'code'          => 'required|string|max:255|unique:communes,code,' . $commune->id,
                'khmer_name'    => 'required|string|max:255|unique:communes,khmer_name,' . $commune->id,
                'type'          => 'required|string|max:255',
                'province_id'   => 'required|exists:provinces,id',
                'district_id'   => 'required|exists:districts,id',
            ]);
            $commune->update($request->all());
            return redirect()->route('communes.index')
                ->with('success', 'Commune updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('communes.index')
                ->with('error', 'Failed to update commune.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Commune $commune)
    {
        try {
            $commune->delete();
            return redirect()->route('communes.index')
                ->with('success', 'Commune deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('communes.index')
                ->with('error', 'Failed to delete commune.');
        }
    }

    /**
     * Get communes by district ID
     */
    public function getByDistrict($districtId)
    {
        $communes = Commune::where('district_id', $districtId)
            ->select('id', 'name', 'khmer_name')
            ->get();
        
        return response()->json($communes);
    }
}
