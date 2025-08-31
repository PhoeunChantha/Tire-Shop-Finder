<?php

namespace App\Helpers;

use Illuminate\Support\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class ImageManager
{
    /**
     * Upload image to a given folder inside public/uploads.
     * Creates the folder if it doesn't exist.
     *
     * @param  \Illuminate\Http\UploadedFile  $image
     * @param  string  $folder  Subfolder inside 'uploads'
     * @return string  Relative path to the uploaded image
     */
    public static function uploadImage(UploadedFile $image, string $folder): string
    {
        $destinationPath = public_path('uploads/' . trim($folder, '/'));

        if (!File::exists($destinationPath)) {
            File::makeDirectory($destinationPath, 0755, true);
        }

        $extension = $image->getClientOriginalExtension();
        if (empty($extension)) {
            $extension = 'png';
        }

        $imageName = Carbon::now()->toDateString() . "-" . uniqid() . "." . $extension;
        $image->move($destinationPath, $imageName);

        return $imageName;
    }

    /**
     * Delete image file from public folder if it exists.
     *
     * @param  string|null  $imagePath  Relative path (e.g. 'uploads/user/file.jpg') or filename
     * @param  string|null  $folder  Folder path if imagePath is just a filename
     * @return bool  True if deleted or file not found, false if error
     */
    public static function deleteImage(?string $imagePath, ?string $folder = null): bool
    {
        if (!$imagePath) {
            return true;
        }

        // If folder is provided and imagePath doesn't contain 'uploads/', assume it's just a filename
        if ($folder && !str_contains($imagePath, 'uploads/')) {
            $fullPath = public_path('uploads/' . trim($folder, '/') . '/' . $imagePath);
        } else {
            // imagePath contains full relative path or is a filename without folder
            $fullPath = str_contains($imagePath, 'uploads/') 
                ? public_path($imagePath) 
                : public_path('uploads/' . $imagePath);
        }

        if (File::exists($fullPath)) {
            return File::delete($fullPath);
        }

        return true;
    }

    /**
     * Update image by deleting old image and uploading new one.
     *
     * @param  \Illuminate\Http\UploadedFile|null  $newImage
     * @param  string|null  $oldImagePath
     * @param  string  $folder  Upload folder
     * @return string|null  New image path or old image path if no new image provided
     */
    public static function updateImage(?UploadedFile $newImage, ?string $oldImagePath, string $folder): ?string
    {
        if ($newImage) {
            self::deleteImage($oldImagePath, $folder);

            return self::uploadImage($newImage, $folder);
        }

        return $oldImagePath;
    }
}
