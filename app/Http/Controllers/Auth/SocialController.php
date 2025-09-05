<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Spatie\Permission\Models\Role;
use Exception;

class SocialController extends Controller
{
    /**
     * Redirect to social provider
     */
    public function redirectToProvider($provider)
    {
        try {
            return Socialite::driver($provider)->redirect();
        } catch (Exception $e) {
            return to_route('login')->with('error', 'Unable to login with ' . $provider . '. Please try again.');
        }
    }

    /**
     * Handle social provider callback
     */
    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
            
            // Check if user already exists with this provider
            $user = User::where('provider', $provider)
                       ->where('provider_id', $socialUser->getId())
                       ->first();

            if ($user) {
                // Update user info if needed
                $user->update([
                    'name' => $socialUser->getName() ?: $user->name,
                    'email' => $socialUser->getEmail() ?: $user->email,
                    'avatar' => $socialUser->getAvatar() ?: $user->avatar,
                ]);
            } else {
                // Check if user exists with same email
                $existingUser = User::where('email', $socialUser->getEmail())->first();
                
                if ($existingUser) {
                    // Link social account to existing user
                    $existingUser->update([
                        'provider' => $provider,
                        'provider_id' => $socialUser->getId(),
                        'avatar' => $socialUser->getAvatar() ?: $existingUser->avatar,
                    ]);
                    
                    // Ensure user has customer role if they don't have any roles
                    if (!$existingUser->hasAnyRole()) {
                        $customerRole = Role::firstOrCreate(['name' => 'customer']);
                        $existingUser->assignRole($customerRole);
                    }
                    
                    $user = $existingUser;
                } else {
                    // Create new user
                    $user = User::create([
                        'name' => $socialUser->getName(),
                        'email' => $socialUser->getEmail(),
                        'provider' => $provider,
                        'provider_id' => $socialUser->getId(),
                        'avatar' => $socialUser->getAvatar(),
                        'email_verified_at' => now(),
                        'status' => true,
                    ]);

                    // Assign customer role to new social users
                    $customerRole = Role::firstOrCreate(['name' => 'customer']);
                    $user->assignRole($customerRole);
                }
            }

            // Login the user
            Auth::login($user, true);

            // Redirect based on user role
            // if ($user->hasRole('admin')) {
            //     return to_route('admin.dashboard')->with('success', 'Successfully logged in with ' . ucfirst($provider));
            // } elseif ($user->hasRole('business')) {
            //     return to_route('user.dashboard')->with('success', 'Successfully logged in with ' . ucfirst($provider));
            // }
            return to_route('home')->with('success', 'Successfully logged in with ' . ucfirst($provider));
        } catch (Exception $e) {
            return to_route('login')->with('error', 'Unable to login with ' . $provider . '. Please try again.');
        }
    }
}