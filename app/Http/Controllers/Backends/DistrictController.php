<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\District;
use App\Models\Province;
use Illuminate\Http\Request;
use App\Http\Traits\HasDataTableFilters;

class DistrictController extends Controller
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
        $districts = $this->getPaginatedWithFilters(
            District::query()->with('province'),
            $request,
            $filterConfig,
            10 // default per page
        );
        $filters = $request->only([
            'search','per_page','page'
        ]);
        return Inertia::render('Districts/Index', [
            'districts' => $districts,
            'filters' => $filters
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Districts/Create', [
            'provinces' => Province::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name'          => 'required|string|max:255|unique:districts,name',
                'code'          => 'required|string|max:255|unique:districts,code',
                'khmer_name'    => 'required|string|max:255|unique:districts,khmer_name',
                'type'          => 'required|string|max:255',
                'province_id'   => 'required|exists:provinces,id',
            ]);
            District::create($request->all());
            return redirect()->route('districts.index')
                ->with('success', 'District created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('districts.index')
                ->with('error', 'Failed to create district.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(District $district)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(District $district)
    {
        return Inertia::render('Districts/Edit', [
            'district' => $district,
            'provinces' => Province::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, District $district)
    {
        try {
            $request->validate([
                'name'          => 'required|string|max:255|unique:districts,name,' . $district->id,
                'code'          => 'required|string|max:255|unique:districts,code,' . $district->id,
                'khmer_name'    => 'required|string|max:255|unique:districts,khmer_name,' . $district->id,
                'type'          => 'required|string|max:255',
                'province_id'   => 'required|exists:provinces,id',
            ]);
            $district->update($request->all());
            return redirect()->route('districts.index')
                ->with('success', 'District updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('districts.index')
                ->with('error', 'Failed to update district.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district)
    {
        try {
            $district->delete();
            return redirect()->route('districts.index')
                ->with('success', 'District deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('districts.index')
                ->with('error', 'Failed to delete district.');
        }
    }

    /**
     * Get districts by province ID
     */
    public function getByProvince($provinceId)
    {
        $districts = District::where('province_id', $provinceId)
            ->select('id', 'name', 'khmer_name')
            ->get();
        
        return response()->json($districts);
    }
}
