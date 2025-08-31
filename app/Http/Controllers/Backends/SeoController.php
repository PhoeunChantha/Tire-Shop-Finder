<?php

namespace App\Http\Controllers\Backends;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\BusinessSetting;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class SeoController extends Controller
{
    /**
     * Display the SEO settings form.
     */
    public function index()
    {
        $seoSettings = BusinessSetting::whereIn('type', [
            'meta_title',
            'meta_description',
            'meta_keywords',
            'google_analytics_id',
            'facebook_pixel_id',
            'google_site_verification',
            'robots_txt'
        ])->get();

        return Inertia::render("admin/seo/Index", [
            'seoSettingsData' => $seoSettings
        ]);
    }

    /**
     * Store or update SEO settings.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|array',
                'type.meta_title' => 'nullable|string|max:60',
                'type.meta_description' => 'nullable|string|max:160',
                'type.meta_keywords' => 'nullable|string|max:255',
                'type.google_analytics_id' => 'nullable|string|max:50',
                'type.facebook_pixel_id' => 'nullable|string|max:50',
                'type.google_site_verification' => 'nullable|string|max:100',
                'type.robots_txt' => 'nullable|string|max:2000',
            ]);

            foreach ($validated['type'] as $key => $value) {
                if (is_null($value)) {
                    continue;
                }

                $existingSetting = BusinessSetting::where('type', $key)->first();

                if ($existingSetting) {
                    $existingSetting->update(['value' => $value]);
                } else {
                    BusinessSetting::create([
                        'type' => $key,
                        'value' => $value,
                    ]);
                }
            }

            return to_route('seo.index')
                ->with('success', 'SEO settings saved successfully.');

        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to save SEO settings. Please try again.')
                ->withInput();
        }
    }

    /**
     * Update the SEO settings (alias for store).
     */
    public function update(Request $request, $id = null)
    {
        return $this->store($request);
    }
}
