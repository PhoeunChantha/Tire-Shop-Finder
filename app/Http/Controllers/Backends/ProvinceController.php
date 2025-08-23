<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Province;
use Illuminate\Http\Request;
use App\Http\Traits\HasDataTableFilters;

class ProvinceController extends Controller
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
        $provinces = $this->getPaginatedWithFilters(
            Province::query(),
            $request,
            $filterConfig,
            10 // default per page
        );
        $filters = $request->only([
            'search','per_page','page'
        ]);
        return Inertia::render('Provinces/Index', [
            'provinces' => $provinces,
            'filters' => $filters
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Provinces/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:provinces,name',
                'code' => 'required|string|max:255|unique:provinces,code',
                'khmer_name' => 'required|string|max:255|unique:provinces,khmer_name',
                'type' => 'required|string|max:255',
            ]);
            Province::create($request->all());
            return redirect()->route('provinces.index')
                ->with('success', 'Province created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('provinces.index')
                ->with('error', 'Failed to create province.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Province $province)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Province $province)
    {
        return Inertia::render('Provinces/Edit', [
            'province' => $province
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Province $province)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:provinces,name,' . $province->id,
                'code' => 'required|string|max:255|unique:provinces,code,' . $province->id,
                'khmer_name' => 'required|string|max:255|unique:provinces,khmer_name,' . $province->id,
                'type' => 'required|string|max:255',
            ]);
            $province->update($request->all());
            return redirect()->route('provinces.index')
                ->with('success', 'Province updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('provinces.index')
                ->with('error', 'Failed to update province.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Province $province)
    {
        try {
            $province->delete();
            return redirect()->route('provinces.index')
                ->with('success', 'Province deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('provinces.index')
                ->with('error', 'Failed to delete province.');
        }
    }
}
