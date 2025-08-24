/**
 * Utility functions for parsing Google Maps URLs and extracting coordinates
 */

export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Extracts coordinates from various Google Maps URL formats
 * 
 * Supported formats:
 * - https://maps.app.goo.gl/EkVPKdQk7cgaNNFX8 (shortened URLs)
 * - https://www.google.com/maps/@11.5564,104.9282,17z
 * - https://www.google.com/maps/place/Phnom+Penh/@11.5564,104.9282,17z
 * - https://maps.google.com/maps?q=11.5564,104.9282
 * - https://www.google.com/maps/search/11.5564,104.9282
 * - https://goo.gl/maps/abc123 (legacy shortened URLs)
 */
export async function parseGoogleMapsUrl(url: string): Promise<Coordinates | null> {
    if (!url || typeof url !== 'string') {
        return null;
    }

    // Clean the URL
    const cleanUrl = url.trim();
    
    try {
        // Use backend API to handle URL expansion and parsing
        // This avoids CORS issues with shortened URLs
        const response = await fetch('/api/public/expand-maps-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: cleanUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to parse URL');
        }

        if (data.success && data.coordinates) {
            return {
                lat: data.coordinates.lat,
                lng: data.coordinates.lng
            };
        }

        return null;
    } catch (error) {
        console.error('Error parsing Google Maps URL:', error);
        return null;
    }
}


/**
 * Validates if coordinates are reasonable for Cambodia
 * Cambodia bounds: lat 10.4-14.7, lng 102.3-107.6
 */
export function validateCambodiaCoordinates(coords: Coordinates): boolean {
    const { lat, lng } = coords;
    
    // Basic validation
    if (!isFinite(lat) || !isFinite(lng)) {
        return false;
    }
    
    // Cambodia approximate bounds
    const cambodiaBounds = {
        minLat: 10.0,
        maxLat: 15.0,
        minLng: 102.0,
        maxLng: 108.0
    };
    
    return lat >= cambodiaBounds.minLat && 
           lat <= cambodiaBounds.maxLat && 
           lng >= cambodiaBounds.minLng && 
           lng <= cambodiaBounds.maxLng;
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coords: Coordinates): string {
    return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
}