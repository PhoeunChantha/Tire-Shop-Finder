<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BusinessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Allow admin users to access business dashboard (for testing/management)
        if ($user->hasRole('admin')) {
            return $next($request);
        }

        // Check if user has business role
        if (!$user->hasRole('business')) {
            if ($user->hasRole('customer')) {
                return redirect()->route('home')->with('error', 'You need to register a business to access the dashboard.');
            }
            
            // For users without any specific role, redirect to home
            return redirect()->route('home')->with('error', 'Access denied. You need to register a business to access the dashboard.');
        }

        return $next($request);
    }
}