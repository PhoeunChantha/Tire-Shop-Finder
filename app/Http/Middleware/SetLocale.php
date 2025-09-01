<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $availableLocales = config('app.available_locales', ['en', 'km']);
        
        // Get locale from session, URL parameter, or user preference
        $locale = session('locale') 
            ?? $request->get('locale') 
            ?? auth()->user()?->locale 
            ?? config('app.locale', 'en');
            
        // Ensure locale is valid
        if (!in_array($locale, $availableLocales)) {
            $locale = config('app.locale', 'en');
        }
        
        app()->setLocale($locale);
        
        return $next($request);
    }
}
