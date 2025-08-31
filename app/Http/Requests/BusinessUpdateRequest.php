<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BusinessUpdateRequest extends FormRequest
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
            'status' => 'required|boolean',
            'is_vierify' => 'required|boolean',
            'province_id' => 'required|exists:provinces,id',
            'district_id' => 'required|exists:districts,id',
            'commune_id' => 'nullable|exists:communes,id',
            'village_id' => 'nullable|exists:villages,id',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'seo_image' => 'nullable|string|max:2048',
            'seo_keywords' => 'nullable|array',
            'seo_keywords.*' => 'string|max:100',
        ];
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
        ];
    }
}