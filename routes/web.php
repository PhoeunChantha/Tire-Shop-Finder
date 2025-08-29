<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backends\UserController;
use App\Http\Controllers\Backends\RoleController;
use App\Http\Controllers\Backends\PermissionController;
use App\Http\Controllers\Backends\BusinessController as AdminBusinessController;
use App\Http\Controllers\Backends\ServiceController as AdminServiceController;
use App\Http\Controllers\Backends\BusinessSettingController;
use App\Http\Controllers\Frontends\BusinessController;
use App\Http\Controllers\Frontends\HomeController;
use App\Http\Controllers\Frontends\ServiceController;
use App\Http\Controllers\Frontends\PublicController;
use App\Http\Controllers\Frontends\ReviewController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/about', [HomeController::class, 'about'])->name('about');

Route::get('/contact', [HomeController::class, 'contact'])->name('contact');

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

// Business creation routes (for new users after registration)
Route::middleware(['auth'])->group(function () {
    // User dashboard
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
    
    // API endpoints for location dropdowns
    Route::get('api/districts/{province}', [BusinessController::class, 'getDistricts']);
    Route::get('api/communes/{district}', [BusinessController::class, 'getCommunes']);
    Route::get('api/villages/{commune}', [BusinessController::class, 'getVillages']);
    
    // Service management routes
    Route::get('businesses/{business:slug}/services/create', [ServiceController::class, 'create'])->name('services.create');
    Route::post('businesses/{business:slug}/services', [ServiceController::class, 'store'])->name('services.store');
    Route::get('businesses/{business:slug}/services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    Route::put('businesses/{business:slug}/services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('businesses/{business:slug}/services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');
    
   
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
    
    // Business Settings routes
    Route::resource('business-settings', BusinessSettingController::class)->only(['index', 'store', 'update']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
