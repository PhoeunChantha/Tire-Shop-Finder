<?php

namespace App\Http\Controllers\Backends;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\BusinessSetting;
use App\Http\Controllers\Controller;
use App\Services\BusinessSettingService;
use App\Http\Requests\BusinessSettingStoreRequest;

class BusinessSettingController extends Controller
{
    public function __construct(
        private BusinessSettingService $businessSettingService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("admin/business-setting/Index", [
            'businessSettingsData' => BusinessSetting::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BusinessSettingStoreRequest $request)
    {
        try {
            $validated = $request->validated();
            
            $this->businessSettingService->updateSettings($validated);

            return redirect()->route('business-settings.index')
                ->with('success', 'Business settings saved successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to save business settings. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BusinessSetting $businessSetting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BusinessSetting $businessSetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id = null)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BusinessSetting $businessSetting)
    {
        //
    }
}
