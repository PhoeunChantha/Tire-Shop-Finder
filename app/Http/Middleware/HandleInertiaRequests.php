<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines how to format page titles.
     *
     * @see https://inertiajs.com/title-and-meta
     *
     * @param  string  $title
     * @return string
     */
    public function title(string $title): string
    {
        // Try to get business name from settings, fallback to config
        try {
            $businessSettings = \App\Models\BusinessSetting::pluck('value', 'type')->toArray();
            $businessName = $businessSettings['business_name'] ?? config('app.name');
        } catch (\Exception $e) {
            $businessName = config('app.name');
        }
        
        // If title is empty, use business name
        if (empty($title)) {
            return $businessName;
        }
        
        // If title matches business name, just return title
        if ($title === $businessName) {
            return $title;
        }
        
        // Return title with business name
        return $title . ' - ' . $businessName;
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Get business settings
        $businessSettings = null;
        try {
            $businessSettings = \App\Models\BusinessSetting::pluck('value', 'type')->toArray();
        } catch (\Exception $e) {
            // Fail silently if database is not available (e.g., during migrations)
            $businessSettings = [];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user()?->load('roles'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['en', 'km']),
            'businessSettings' => $businessSettings,
        ];
    }
}
