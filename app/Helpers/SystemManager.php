<?php
if (!function_exists('getImageUrl')) {

    /**
     * Get the image URL for a given image path.
     *
     * @param string $path The path to the image.
     * @return string The URL to the image.
     */
    function getImageUrl($image, $path)
    {
        $imagePath = public_path($path . '/' . $image);

        if (file_exists($imagePath) && !empty($image)) {
            return asset($path . '/' . $image);
        }

        return asset('uploads/default-image.jpeg');
    }

}