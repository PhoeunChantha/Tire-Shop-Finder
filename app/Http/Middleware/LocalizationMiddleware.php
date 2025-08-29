<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LocalizationMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $availableLocales = config('app.available_locales', ['en']);
        
        if ($request->has('lang') && in_array($request->get('lang'), $availableLocales)) {
            $locale = $request->get('lang');
            Session::put('locale', $locale);
        } else {
            $locale = Session::get('locale', config('app.locale'));
            
            if (!in_array($locale, $availableLocales)) {
                $locale = config('app.locale');
            }
        }
        
        App::setLocale($locale);
        
        return $next($request);
    }
}