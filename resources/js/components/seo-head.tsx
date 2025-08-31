import React from 'react';
import { Head } from '@inertiajs/react';

interface SEOHeadProps {
    title?: unknown;
    description?: unknown;
    image?: unknown;
    url?: unknown;
    type?: unknown;
    keywords?: unknown;
    siteName?: unknown;
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
    try {
        // Safely convert all string props to handle potential Symbol values
        const safeString = (value: unknown): string => {
            if (value == null || typeof value === 'symbol') {
                return '';
            }
            try {
                return String(value);
            } catch (error) {
                console.warn('Failed to convert value to string:', value, error);
                return '';
            }
        };
        
        
        const safeTitle = safeString(title) || 'Tire Shop';
        const safeDescription = safeString(description);
        const safeImage = safeString(image);
        const safeSiteName = safeString(siteName) || 'Tire Shop Finder Cambodia';
        const safeType = safeString(type) || 'website';
        
        // Safely process keywords array
        const safeKeywords = Array.isArray(keywords) 
            ? keywords.map(k => safeString(k)).filter(k => k.length > 0)
            : [];
        
        const fullTitle = safeTitle && safeSiteName && safeTitle.includes(safeSiteName) ? safeTitle : `${safeTitle} - ${safeSiteName}`;
        const canonicalUrl = safeString(url) || (typeof window !== 'undefined' ? window.location.href : '');
    
        // Create safe meta tags with explicit string conversion
        const metaTags = [];
        
        // Basic meta tags
        if (fullTitle) metaTags.push(<title key="title">{String(fullTitle)}</title>);
        if (safeDescription) metaTags.push(<meta key="description" name="description" content={String(safeDescription)} />);
        if (safeKeywords.length > 0) {
            metaTags.push(<meta key="keywords" name="keywords" content={String(safeKeywords.join(', '))} />);
        }
        if (canonicalUrl) metaTags.push(<link key="canonical" rel="canonical" href={String(canonicalUrl)} />);

        // Open Graph
        if (safeType) metaTags.push(<meta key="og:type" property="og:type" content={String(safeType)} />);
        if (canonicalUrl) metaTags.push(<meta key="og:url" property="og:url" content={String(canonicalUrl)} />);
        if (safeTitle) metaTags.push(<meta key="og:title" property="og:title" content={String(safeTitle)} />);
        if (safeDescription) metaTags.push(<meta key="og:description" property="og:description" content={String(safeDescription)} />);
        if (safeSiteName) metaTags.push(<meta key="og:site_name" property="og:site_name" content={String(safeSiteName)} />);
        if (safeImage) {
            metaTags.push(<meta key="og:image" property="og:image" content={String(safeImage)} />);
            metaTags.push(<meta key="og:image:width" property="og:image:width" content="1200" />);
            metaTags.push(<meta key="og:image:height" property="og:image:height" content="630" />);
        }

        // Twitter
        metaTags.push(<meta key="twitter:card" property="twitter:card" content="summary_large_image" />);
        if (canonicalUrl) metaTags.push(<meta key="twitter:url" property="twitter:url" content={String(canonicalUrl)} />);
        if (safeTitle) metaTags.push(<meta key="twitter:title" property="twitter:title" content={String(safeTitle)} />);
        if (safeDescription) metaTags.push(<meta key="twitter:description" property="twitter:description" content={String(safeDescription)} />);
        if (safeImage) metaTags.push(<meta key="twitter:image" property="twitter:image" content={String(safeImage)} />);

        // Business specific
        if (safeType === 'business.business') {
            metaTags.push(<meta key="business:locality" property="business:contact_data:locality" content="Cambodia" />);
            metaTags.push(<meta key="business:country" property="business:contact_data:country_name" content="Cambodia" />);
        }

        return (
            <Head>
                {metaTags}
            </Head>
        );
    } catch (error) {
        console.error('SEOHead component error:', error);
        // Return minimal Head component on error
        return (
            <Head>
                <title>Tire Shop Finder Cambodia</title>
            </Head>
        );
    }
}