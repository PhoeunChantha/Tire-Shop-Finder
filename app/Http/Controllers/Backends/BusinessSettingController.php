<?php

namespace App\Http\Controllers\Backends;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Helpers\ImageManager;
use App\Models\BusinessSetting;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class BusinessSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("admin/business-setting/Index", [
            'businessSettings' => BusinessSetting::all()
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
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|array',
                'type.business_name' => 'required|string|max:255',
                'type.description' => 'nullable|string|max:1000',
                'type.login_bg_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB
                'type.system_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB
                'type.system_fav_icon' => 'nullable|image|mimes:ico,png|max:512', // 512KB for favicon
            ]);

            $imageTypes = ['login_bg_image', 'system_logo', 'system_fav_icon'];

            foreach ($validated['type'] as $key => $value) {
                if (is_null($value) && $key !== 'business_name') {
                    continue;
                }

                $existingSetting = BusinessSetting::where('type', $key)->first();

                if ($existingSetting) {
                    if (in_array($key, $imageTypes) && $value) {
                        $imagePath = ImageManager::updateImage($value, $existingSetting->value, 'business-settings');
                        $existingSetting->update(['value' => $imagePath]);
                    } elseif (!in_array($key, $imageTypes)) {
                        $existingSetting->update(['value' => $value]);
                    }
                } else {
                    // Create new setting
                    $finalValue = $value;
                    
                    if (in_array($key, $imageTypes) && $value) {
                        $finalValue = ImageManager::uploadImage($value, 'business-settings');
                    }
                    
                    if ($finalValue) {
                        BusinessSetting::create([
                            'type' => $key,
                            'value' => $finalValue,
                        ]);
                    }
                }
            }

            return to_route('business-settings.index')
                ->with('success', 'Business settings saved successfully.');

        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
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
        return $this->store($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BusinessSetting $businessSetting)
    {
        //
    }
}
