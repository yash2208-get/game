<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', static fn () => response()->json([
    'service' => 'nexora-api',
    'status' => 'ok',
    'timestamp' => now()->toIso8601String(),
]));
