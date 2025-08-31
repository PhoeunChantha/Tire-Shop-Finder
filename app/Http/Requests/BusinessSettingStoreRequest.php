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
        return [
            'type' => 'required|array',
            'type.business_name' => 'required|string|max:255',
            'type.description' => 'nullable|string|max:1000',
            'type.login_bg_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB
            'type.system_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB
            'type.system_fav_icon' => 'nullable|file|mimes:jpeg,png,jpg,gif,ico|max:2048', // 2MB for favicon
            // Social Login Settings
            'type.google_login_status' => 'nullable|string|in:enabled,disabled',
            'type.google_client_id' => 'nullable|string|max:255',
            'type.google_client_secret' => 'nullable|string|max:255',
            'type.google_redirect_uri' => 'nullable|url|max:255',
            'type.facebook_login_status' => 'nullable|string|in:enabled,disabled',
            'type.facebook_client_id' => 'nullable|string|max:255',
            'type.facebook_client_secret' => 'nullable|string|max:255',
            'type.facebook_redirect_uri' => 'nullable|url|max:255',
        ];
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
