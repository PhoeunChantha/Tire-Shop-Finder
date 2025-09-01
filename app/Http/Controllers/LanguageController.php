<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    /**
     * Switch the application language
     */
    public function switch(Request $request): RedirectResponse
    {
        $locale = $request->input('locale');
        $availableLocales = config('app.available_locales', ['en', 'km']);
        
        if (in_array($locale, $availableLocales)) {
            Session::put('locale', $locale);
        }
        
        return back();
    }
}
