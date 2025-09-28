<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class BusinessSettingStoreRequest extends FormRequest
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
        $rules = [
            'type' => 'required|array',
            'type.name' => 'required|string|max:255',
            'type.descriptions' => 'nullable|string|max:1000',
            // Translation fields
            'type.name_translations' => 'nullable|array',
            'type.name_translations.en' => 'required|string|max:255',
            'type.name_translations.km' => 'nullable|string|max:255',
            'type.descriptions_translations' => 'nullable|array',
            'type.descriptions_translations.en' => 'nullable|string|max:1000',
            'type.descriptions_translations.km' => 'nullable|string|max:1000',
            // Website description fields
            'type.website_description' => 'nullable|string|max:1000',
            'type.website_description_translations' => 'nullable|array',
            'type.website_description_translations.en' => 'nullable|string|max:1000',
            'type.website_description_translations.km' => 'nullable|string|max:1000',
            // Contact information fields
            'type.contact_address' => 'nullable|string|max:500',
            'type.contact_phone' => 'nullable|string|max:50',
            'type.contact_email' => 'nullable|email|max:255',
            // Social media fields
            'type.social_facebook' => 'nullable|url|max:255',
            'type.social_telegram' => 'nullable|url|max:255',
            'type.social_messenger' => 'nullable|url|max:255',
            'type.login_bg_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB
            'type.system_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB
            'type.system_fav_icon' => 'nullable|file|mimes:jpeg,png,jpg,gif,ico|max:2048', // 2MB for favicon
            // Page Banner Images
            'type.about_banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // 2MB
            'type.contact_banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // 2MB
            // Social Login Settings
            'type.google_login_status' => 'nullable|string|in:enabled,disabled',
            'type.google_client_id' => 'nullable|string|max:255',
            'type.google_client_secret' => 'nullable|string|max:255',
            'type.google_redirect_uri' => 'nullable|url|max:255',
            'type.facebook_login_status' => 'nullable|string|in:enabled,disabled',
            'type.facebook_client_id' => 'nullable|string|max:255',
            'type.facebook_client_secret' => 'nullable|string|max:255',
            'type.facebook_redirect_uri' => 'nullable|url|max:255',
            // Website Statistics
            'type.stats_tire_shops' => 'nullable|numeric|min:0',
            'type.stats_happy_customers' => 'nullable|numeric|min:0',
            'type.stats_provinces_covered' => 'nullable|numeric|min:0',
            'type.stats_average_rating' => 'nullable|numeric|min:0|max:5',
        ];

        // Add dynamic validation for custom social media fields
        if ($this->has('type')) {
            $typeData = $this->input('type', []);
            foreach ($typeData as $key => $value) {
                if (preg_match('/^social_custom_\w+$/', $key)) {
                    $rules["type.{$key}"] = 'nullable|url|max:255';
                } elseif (preg_match('/^social_custom_\w+_name$/', $key)) {
                    $rules["type.{$key}"] = 'nullable|string|max:100';
                }
            }
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'type.required' => 'The business settings field is required.',
            'type.array' => 'The business settings field must be an array.',
            'type.*.required' => 'The :attribute field is required.',
            'type.*.string' => 'The :attribute field must be a string.',
            'type.*.max' => 'The :attribute field must not exceed :max characters.',
            'type.*.image' => 'The :attribute field must be an image.',
            'type.*.mimes' => 'The :attribute field must be a file of type: :values.',
            'type.*.url' => 'The :attribute field must be a valid URL.',
            'type.*.in' => 'The selected :attribute is invalid.',
        ];
    }
}
