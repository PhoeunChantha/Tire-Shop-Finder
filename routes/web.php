<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backends\UserController;
use App\Http\Controllers\Backends\RoleController;
use App\Http\Controllers\Backends\PermissionController;
use App\Http\Controllers\Backends\BusinessController as AdminBusinessController;
use App\Http\Controllers\Backends\ServiceController as AdminServiceController;
use App\Http\Controllers\Backends\BusinessSettingController;
use App\Http\Controllers\Backends\SeoController;
use App\Http\Controllers\Backends\BannerController;
use App\Http\Controllers\Frontends\BusinessController;
use App\Http\Controllers\Frontends\HomeController;
use App\Http\Controllers\Frontends\ServiceController;
use App\Http\Controllers\Frontends\PublicController;
use App\Http\Controllers\Frontends\ReviewController;
use App\Http\Controllers\Auth\SocialController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// SEO Routes
Route::get('/robots.txt', function () {
    $businessSettings = \App\Models\BusinessSetting::pluck('value', 'type')->toArray();
    $robotsTxt = $businessSettings['robots_txt'] ?? null;

    if ($robotsTxt) {
        return response($robotsTxt)->header('Content-Type', 'text/plain');
    }

    // Default robots.txt content
    $defaultContent = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: " . url('/sitemap.xml');
    return response($defaultContent)->header('Content-Type', 'text/plain');
})->name('robots');

Route::get('/about', [HomeController::class, 'about'])->name('about');

Route::get('/contact', [HomeController::class, 'contact'])->name('contact');

// Test translations page
Route::get('/test-translations', function () {
    return \Inertia\Inertia::render('test-translations');
})->name('test.translations');

// Language switching
Route::get('/language/{locale}', function ($locale) {
    $availableLocales = config('app.available_locales', ['en']);

    if (in_array($locale, $availableLocales)) {
        session(['locale' => $locale]);
    }

    return redirect()->back();
})->name('language.switch');

// Public tire shop directory routes
Route::get('/tire-shops', [PublicController::class, 'businesses'])->name('public.businesses');
Route::get('/tire-shops/{business:slug}', [PublicController::class, 'businessDetail'])->name('public.business.show');

// API endpoints for public location lookups
Route::get('/api/public/districts/{province}', [PublicController::class, 'getDistricts']);
Route::get('/api/public/communes/{district}', [PublicController::class, 'getCommunes']);
Route::get('/api/public/villages/{commune}', [PublicController::class, 'getVillages']);
Route::post('/api/public/reverse-geocode', [PublicController::class, 'reverseGeocode']);
Route::post('/api/public/expand-maps-url', [PublicController::class, 'expandMapsUrl']);

// Review routes
Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
Route::get('/api/businesses/{business}/reviews', [ReviewController::class, 'getBusinessReviews'])->name('reviews.business');
Route::get('/api/businesses/{business}/review-stats', [ReviewController::class, 'getBusinessReviewStats'])->name('reviews.stats');

// Social Authentication Routes
Route::get('/auth/{provider}', [SocialController::class, 'redirectToProvider'])->name('social.redirect');
Route::get('/auth/{provider}/callback', [SocialController::class, 'handleProviderCallback'])->name('social.callback');

// Business creation routes (for new users after registration)
Route::middleware(['auth', 'business'])->group(function () {
    // Route::middleware(['business'])->group(function () {
        // User dashboard - protected by business middleware
        Route::get('user-dashboard', function () {
            $business = \App\Models\Business::where('created_by', auth()->id())->with('services')->first();
            return Inertia::render('frontend/user/dashboard', [
                'business' => $business
            ]);
        })->name('user.dashboard');
        Route::get('create-business', [BusinessController::class, 'create'])->name('business.create');
        Route::post('create-business', [BusinessController::class, 'store'])->name('business.store');

        // Business edit routes (for business owners)
        Route::get('businesses/{business:slug}/edit', [BusinessController::class, 'edit'])->name('business.edit');
        Route::put('businesses/{business:slug}', [BusinessController::class, 'update'])->name('business.update');

        // Service management routes
        Route::get('businesses/{business:slug}/services/create', [ServiceController::class, 'create'])->name('services.create');
        Route::post('businesses/{business:slug}/services', [ServiceController::class, 'store'])->name('services.store');
        Route::get('businesses/{business:slug}/services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
        Route::put('businesses/{business:slug}/services/{service}', [ServiceController::class, 'update'])->name('services.update');
        Route::delete('businesses/{business:slug}/services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');
    // });

    // API endpoints for location dropdowns
    Route::get('api/districts/{province}', [BusinessController::class, 'getDistricts']);
    Route::get('api/communes/{district}', [BusinessController::class, 'getCommunes']);
    Route::get('api/villages/{commune}', [BusinessController::class, 'getVillages']);
});

// Admin routes
Route::prefix('admin')->middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    // User CRUD routes
    Route::resource('users', UserController::class);

    // Role CRUD routes  
    Route::resource('roles', RoleController::class);

    // Permission CRUD routes
    Route::resource('permissions', PermissionController::class);

    // Business CRUD routes
    Route::resource('businesses', AdminBusinessController::class);
    Route::patch('businesses/{business}/verify', [AdminBusinessController::class, 'verify'])->name('businesses.verify');
    Route::patch('businesses/{business}/reject', [AdminBusinessController::class, 'reject'])->name('businesses.reject');

    // Admin API endpoints for location dropdowns
    Route::get('api/districts/{province}', [AdminBusinessController::class, 'getDistricts']);
    Route::get('api/communes/{district}', [AdminBusinessController::class, 'getCommunes']);
    Route::get('api/villages/{commune}', [AdminBusinessController::class, 'getVillages']);

    // Admin Service routes
    Route::get('businesses/{business}/services/create', [AdminServiceController::class, 'create'])->name('admin.services.create');
    Route::post('businesses/{business}/services', [AdminServiceController::class, 'store'])->name('admin.services.store');
    Route::get('services/{service}/edit', [AdminServiceController::class, 'edit'])->name('admin.services.edit');
    Route::put('services/{service}', [AdminServiceController::class, 'update'])->name('admin.services.update');
    Route::delete('services/{service}', [AdminServiceController::class, 'destroy'])->name('admin.services.destroy');

    // Business Settings routes
    Route::resource('business-settings', BusinessSettingController::class)->only(['index', 'store', 'update']);

    // SEO Settings routes
    Route::resource('seo', SeoController::class)->only(['index', 'store', 'update']);

    // Banner CRUD routes
    Route::resource('banners', BannerController::class);
    Route::patch('banners/{banner}/toggle-status', [BannerController::class, 'toggleStatus'])->name('banners.toggle-status');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
