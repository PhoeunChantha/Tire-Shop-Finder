import React from 'react';
import { Head } from '@inertiajs/react';

interface SEOHeadProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'business.business';
    keywords?: string[];
    siteName?: string;
}

export function SEOHead({
    title,
    description,
    image,
    url,
    type = 'website',
    keywords = [],
    siteName = 'Tire Shop Finder Cambodia'
}: SEOHeadProps) {
    const fullTitle = title.includes(siteName) ? title : `${title} - ${siteName}`;
    const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    
    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords.length > 0 && (
                <meta name="keywords" content={keywords.join(', ')} />
            )}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteName} />
            {image && <meta property="og:image" content={image} />}
            {image && <meta property="og:image:width" content="1200" />}
            {image && <meta property="og:image:height" content="630" />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            {image && <meta property="twitter:image" content={image} />}

            {/* Additional Business-specific meta tags */}
            {type === 'business.business' && (
                <>
                    <meta property="business:contact_data:locality" content="Cambodia" />
                    <meta property="business:contact_data:country_name" content="Cambodia" />
                </>
            )}
        </Head>
    );
}