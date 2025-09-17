<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        @php
            $businessSettings = app('App\Models\BusinessSetting')::pluck('value', 'type')->toArray();
            $systemFavIcon = $businessSettings['system_fav_icon'] ?? null;
            $metaTitle = $businessSettings['meta_title'] ?? config('app.name', 'Laravel');
            $metaDescription = $businessSettings['meta_description'] ?? null;
            $metaKeywords = $businessSettings['meta_keywords'] ?? null;
            $seoImage = $businessSettings['seo_image'] ?? null;
            $googleAnalyticsId = $businessSettings['google_analytics_id'] ?? null;
            $facebookPixelId = $businessSettings['facebook_pixel_id'] ?? null;
            $googleSiteVerification = $businessSettings['google_site_verification'] ?? null;
        @endphp

        <title inertia></title>

        {{-- SEO Meta Tags --}}
        @if($metaDescription)
            <meta name="description" content="{{ $metaDescription }}">
        @endif
        
        @if($metaKeywords)
            <meta name="keywords" content="{{ $metaKeywords }}">
        @endif

        @if($googleSiteVerification)
            <meta name="google-site-verification" content="{{ $googleSiteVerification }}">
        @endif

        {{-- Open Graph Meta Tags --}}
        <meta property="og:title" content="{{ $metaTitle }}">
        @if($metaDescription)
            <meta property="og:description" content="{{ $metaDescription }}">
        @endif
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ request()->url() }}">
        <meta property="og:site_name" content="{{ config('app.name', 'Laravel') }}">
        @if($seoImage)
            <meta property="og:image" content="{{ asset('uploads/seo/' . $seoImage) }}">
            <meta property="og:image:width" content="1200">
            <meta property="og:image:height" content="630">
        @endif
        
        {{-- Twitter Card Meta Tags --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $metaTitle }}">
        @if($metaDescription)
            <meta name="twitter:description" content="{{ $metaDescription }}">
        @endif
        @if($seoImage)
            <meta name="twitter:image" content="{{ asset('uploads/seo/' . $seoImage) }}">
        @endif

        @if($systemFavIcon)
            <link rel="icon" href="{{ asset('uploads/business-settings/' . $systemFavIcon) }}" type="image/x-icon">
        @else
            {{-- <link rel="icon" href="/favicon.ico" sizes="any">
            <link rel="icon" href="/favicon.svg" type="image/svg+xml"> --}}
        @endif
        {{-- <link rel="apple-touch-icon" href="/apple-touch-icon.png"> --}}

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
        {{-- Google Analytics --}}
        @if($googleAnalyticsId)
            <!-- Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ $googleAnalyticsId }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '{{ $googleAnalyticsId }}');
            </script>
        @endif

        {{-- Facebook Pixel --}}
        @if($facebookPixelId)
            <!-- Facebook Pixel Code -->
            <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '{{ $facebookPixelId }}');
                fbq('track', 'PageView');
            </script>
            <noscript>
                <img height="1" width="1" style="display:none"
                     src="https://www.facebook.com/tr?id={{ $facebookPixelId }}&ev=PageView&noscript=1"/>
            </noscript>
        @endif
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
