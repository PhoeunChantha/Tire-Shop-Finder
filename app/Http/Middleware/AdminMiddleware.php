<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
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

        if (!$user->hasRole('admin')) {
            if ($user->hasRole('customer')) {
                return redirect()->route('home')->with('error', 'Access denied. Admin privileges required.');
            } elseif ($user->hasRole('business')) {
                return redirect()->route('user.dashboard')->with('error', 'Access denied. Admin privileges required.');
            } else {
                return redirect()->route('home')->with('error', 'Access denied. Admin privileges required.');
            }
        }

        return $next($request);
    }
}
