<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BusinessStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'descriptions' => 'nullable|string',
            // Translation fields
            'name_translations' => 'nullable|array',
            'name_translations.en' => 'required|string|max:255',
            'name_translations.km' => 'nullable|string|max:255',
            'descriptions_translations' => 'nullable|array',
            'descriptions_translations.en' => 'nullable|string',
            'descriptions_translations.km' => 'nullable|string',
            'created_by' => 'required|exists:users,id',
            'province_id' => 'required|exists:provinces,id',
            'district_id' => 'required|exists:districts,id',
            'commune_id' => 'nullable|exists:communes,id',
            'village_id' => 'nullable|exists:villages,id',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
            'status' => 'nullable|boolean',
            'is_vierify' => 'nullable|boolean',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            // SEO Translation fields
            'seo_title_translations' => 'nullable|array',
            'seo_title_translations.en' => 'nullable|string|max:255',
            'seo_title_translations.km' => 'nullable|string|max:255',
            'seo_description_translations' => 'nullable|array',
            'seo_description_translations.en' => 'nullable|string|max:500',
            'seo_description_translations.km' => 'nullable|string|max:500',
            'seo_image' => 'nullable|string|max:2048',
            'seo_keywords' => 'nullable|array',
            'seo_keywords.*' => 'string|max:100',
            'image' => 'nullable',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $image = $this->input('image');
            
            if ($image !== null) {
                if (is_file($image)) {
                    // Validate file
                    if (!$image->isValid()) {
                        $validator->errors()->add('image', 'The uploaded file is not valid.');
                        return;
                    }
                    
                    $maxSize = 5120; // 5MB in KB
                    if ($image->getSize() > $maxSize * 1024) {
                        $validator->errors()->add('image', "The image must not exceed {$maxSize}KB.");
                        return;
                    }
                    
                    $allowedMimes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
                    $extension = strtolower($image->getClientOriginalExtension());
                    if (!in_array($extension, $allowedMimes)) {
                        $validator->errors()->add('image', 'The image must be a file of type: jpeg, jpg, png, gif, webp.');
                    }
                } elseif (is_string($image)) {
                    // Validate URL
                    if (!filter_var($image, FILTER_VALIDATE_URL)) {
                        $validator->errors()->add('image', 'The image must be a valid URL.');
                    }
                }
            }
        });
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'business name',
            'descriptions' => 'description',
            'created_by' => 'business owner',
            'province_id' => 'province',
            'district_id' => 'district',
            'commune_id' => 'commune',
            'village_id' => 'village',
            'opening_time' => 'opening time',
            'closing_time' => 'closing time',
            'seo_title' => 'SEO title',
            'seo_description' => 'SEO description',
            'seo_image' => 'SEO image',
            'seo_keywords' => 'SEO keywords',
            'image' => 'business image',
        ];
    }
}