<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backends\UserController;
use App\Http\Controllers\Backends\RoleController;
use App\Http\Controllers\Backends\PermissionController;
use App\Http\Controllers\Backends\BusinessController as AdminBusinessController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PublicController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public tire shop directory routes
Route::get('/tire-shops', [PublicController::class, 'businesses'])->name('public.businesses');
Route::get('/tire-shops/{business}', [PublicController::class, 'businessDetail'])->name('public.business.show');

// API endpoints for public location lookups
Route::get('/api/public/districts/{province}', [PublicController::class, 'getDistricts']);
Route::get('/api/public/communes/{district}', [PublicController::class, 'getCommunes']);
Route::get('/api/public/villages/{commune}', [PublicController::class, 'getVillages']);
Route::post('/api/public/reverse-geocode', [PublicController::class, 'reverseGeocode']);

// Business creation routes (for new users after registration)
// Route::middleware(['auth'])->group(function () {
    Route::get('create-business', [BusinessController::class, 'create'])->name('business.create');
    Route::post('create-business', [BusinessController::class, 'store'])->name('business.store');
    
    // API endpoints for location dropdowns
    Route::get('api/districts/{province}', [BusinessController::class, 'getDistricts']);
    Route::get('api/communes/{district}', [BusinessController::class, 'getCommunes']);
    Route::get('api/villages/{commune}', [BusinessController::class, 'getVillages']);
    
    // Service management routes
    Route::get('businesses/{business}/services/create', [ServiceController::class, 'create'])->name('services.create');
    Route::post('businesses/{business}/services', [ServiceController::class, 'store'])->name('services.store');
    Route::get('businesses/{business}/services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    Route::put('businesses/{business}/services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('businesses/{business}/services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');
    
    // User dashboard (separate from admin)
    Route::get('user-dashboard', function () {
        $business = \App\Models\Business::where('created_by', auth()->id())->with('services')->first();
        return Inertia::render('user/dashboard', [
            'business' => $business
        ]);
    })->name('user.dashboard');
// });

// Admin routes - protected by admin middleware
// Route::prefix('admin')->middleware(['auth', 'verified', 'admin'])->group(function () {
Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
