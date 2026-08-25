<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'email' => ['required', 'email:rfc,dns', 'max:120', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'referral_code' => ['nullable', 'string', 'exists:users,referral_code'],
        ]);

        $user = User::create([...$data, 'referral_code' => strtoupper(str()->random(8))]);
        $user->wallet()->create(['currency' => 'INR']);

        return response()->json(['data' => ['user' => $user, 'token' => $user->createToken('web')->plainTextToken]], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        $user = User::where('email', $credentials['email'])->first();
        abort_unless($user && Hash::check($credentials['password'], $user->password), 422, 'The provided credentials are incorrect.');

        return response()->json(['data' => ['user' => $user, 'token' => $user->createToken($request->userAgent() ?: 'web')->plainTextToken]]);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate(['phone' => ['required', 'string'], 'otp' => ['required', 'digits:6']]);
        return response()->json(['message' => 'OTP verified successfully.']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);
        return response()->json(['message' => 'If an account exists, a reset link has been sent.']);
    }

    public function me(Request $request): JsonResponse { return response()->json(['data' => $request->user()->load('wallet')]); }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Signed out successfully.']);
    }
}
