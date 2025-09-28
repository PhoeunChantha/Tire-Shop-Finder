<?php

namespace App\Http\Controllers\Frontends;

use Inertia\Inertia;
use App\Models\Business;
use App\Models\Banner;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function index()
    {
        // Get active banners for carousel
        $banners = Banner::active()
            ->ordered()
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'title' => $banner->title,
                    'descriptions' => $banner->descriptions,
                    'image' => $banner->image,
                    'url' => $banner->url,
                    'sort_order' => $banner->sort_order,
                ];
            });

        $featuredBusinesses = Business::with(['province', 'district', 'services', 'owner'])
            ->where('is_vierify', 1)
            ->where('status', 1)
            // ->whereNotN  ull('image')
            ->latest()
            // ->limit(6)
            ->get()
            ->map(function ($business) {
                return [
                    'id' => $business->id,
                    'slug' => $business->slug,
                    'name' => $business->name,
                    'location' => ($business->province ? $business->province->name : '') .
                        ($business->district ? ', ' . $business->district->name : ''),
                    'image' => $business->image,
                    'average_rating' => round($business->average_rating, 1),
                    'review_count' => $business->review_count,
                    'services' => $business->services->take(3)->pluck('name'),
                    'formatted_hours' => $business->formatted_hours,
                    'phone' => $business->owner ? $business->owner->phone : null,
                ];
            });

        return Inertia::render('frontend/welcome', [
            'banners' => $banners,
            'featuredBusinesses' => $featuredBusinesses
        ]);
    }

    public function about()
    {
        // Get business setting for about banner
        $aboutBanner = \App\Models\BusinessSetting::where('type', 'about_banner_image')->first();
        $bannerUrl = null;
        
        if ($aboutBanner && $aboutBanner->value) {
            $bannerUrl = asset('uploads/business-settings/' . $aboutBanner->value);
        }
        
        return Inertia::render('frontend/about', [
            'aboutBanner' => $bannerUrl
        ]);
    }

    public function contact()
    {
        // Get business setting for contact banner
        $contactBanner = \App\Models\BusinessSetting::where('type', 'contact_banner_image')->first();
        $bannerUrl = null;
        
        if ($contactBanner && $contactBanner->value) {
            $bannerUrl = asset('uploads/business-settings/' . $contactBanner->value);
        }
        
        return Inertia::render('frontend/contact', [
            'contactBanner' => $bannerUrl
        ]);
    }
}
