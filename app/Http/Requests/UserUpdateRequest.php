<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $user = $this->route('user');
        $userId = $user instanceof \App\Models\User ? $user->id : $user;
        
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[+]?[0-9\s\-()]+$/'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'dob' => ['nullable', 'date', 'before:today'],
            'address' => ['nullable', 'string', 'max:500'],
            'profile' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif,webp'],
            'status' => ['sometimes', 'boolean'],
            'role' => ['nullable', 'string', 'exists:roles,name'],
        ];
    }

    /**
     * Get custom validation error messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The full name field is required.',
            'email.required' => 'The email field is required.',
            'email.unique' => 'This email address is already taken.',
            'phone.regex' => 'Please enter a valid phone number format.',
            'dob.before' => 'Date of birth must be before today.',
            'profile.max' => 'Profile image must not exceed 2MB.',
            'role.exists' => 'The selected role is invalid.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Debug what we're preparing
        \Log::info('UserUpdateRequest prepareForValidation:', [
            'before_merge' => $this->all(),
            'name_before' => $this->get('name'),
            'email_before' => $this->get('email'),
        ]);
        
        $this->merge([
            'name' => trim($this->name ?? ''),
            'email' => strtolower(trim($this->email ?? '')),
            'phone' => trim($this->phone ?? ''),
            'first_name' => trim($this->first_name ?? ''),
            'last_name' => trim($this->last_name ?? ''),
            'address' => trim($this->address ?? ''),
        ]);
        
        // Debug after merge
        \Log::info('UserUpdateRequest after merge:', [
            'after_merge' => $this->all(),
            'name_after' => $this->get('name'),
            'email_after' => $this->get('email'),
        ]);
    }
}