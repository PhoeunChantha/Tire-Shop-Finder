<?php

namespace App\Http\Middleware;

use Closure;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\BusinessSetting;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ShareBusinessSettings
{
    /**
     * Default business settings to use as fallback
     */
    private const DEFAULT_SETTINGS = [
        'business_name' => 'Tire Shop Finder Cambodia',
        'system_logo' => null,
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Share business settings globally with all Inertia pages
            Inertia::share([
                'businessSettings' => function () {
                    return $this->getBusinessSettings();
                }
            ]);
        } catch (\Exception $e) {
            // Log error but don't break the application
            Log::error('Failed to load business settings: ' . $e->getMessage(), [
                'exception' => $e,
                'request_url' => request()->fullUrl(),
            ]);

            // Provide fallback settings
            Inertia::share([
                'businessSettings' => $this->getFallbackSettings()
            ]);
        }

        return $next($request);
    }

    /**
     * Get business settings from database
     *
     * @return \Illuminate\Support\Collection
     */
    private function getBusinessSettings()
    {
        return BusinessSetting::select(['type', 'value'])
            ->get()
            ->keyBy('type')
            ->pluck('value', 'type')
            ->toArray();
    }

    /**
     * Get fallback settings when database fails
     *
     * @return array
     */
    private function getFallbackSettings(): array
    {
        return self::DEFAULT_SETTINGS;
    }
}
