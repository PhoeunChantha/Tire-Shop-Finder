import React from 'react';

interface FlagIconProps {
    country: 'en' | 'km';
    className?: string;
    alt?: string;
}

export function FlagIcon({ country, className = "w-6 h-4", alt }: FlagIconProps) {
    const flags = {
        en: '/images/flags/us.svg',
        km: '/images/flags/kh.svg',
    };

    return (
        <img 
            src={flags[country]} 
            alt={alt || `${country} flag`}
            className={`object-cover rounded-sm ${className}`}
            loading="lazy"
        />
    );
}