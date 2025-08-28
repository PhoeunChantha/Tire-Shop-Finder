/**
 * Get the image URL for a given image filename and path.
 * 
 * @param image - The image filename
 * @param path - The path where the image is stored
 * @returns The full URL to the image or default image
 */
export function getImageUrl(image: string | null | undefined, path: string): string {
    if (!image) {
        return '/uploads/default-image.jpeg';
    }
    
    // If the image already includes the uploads path, return as is
    if (image.startsWith('uploads/') || image.startsWith('/uploads/')) {
        return image.startsWith('/') ? image : `/${image}`;
    }
    
    return `/uploads/${path}/${image}`;
}