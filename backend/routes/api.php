<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\TournamentController;
use App\Http\Controllers\Api\WalletController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:api')->group(function (): void {
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/otp/verify', [AuthController::class, 'verifyOtp']);
    Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);

    Route::get('games', [GameController::class, 'index']);
    Route::get('games/{game:slug}', [GameController::class, 'show']);
    Route::get('tournaments', [TournamentController::class, 'index']);
    Route::get('leaderboard', [DashboardController::class, 'leaderboard']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::get('dashboard', [DashboardController::class, 'index']);

        Route::post('games/{game:slug}/rooms', [GameController::class, 'createRoom']);
        Route::post('rooms/{room}/join', [GameController::class, 'joinRoom']);
        Route::post('rooms/{room}/spectate', [GameController::class, 'spectate']);
        Route::get('matches', [GameController::class, 'matches']);

        Route::post('tournaments/{tournament}/join', [TournamentController::class, 'join']);
        Route::get('tournaments/{tournament}/bracket', [TournamentController::class, 'bracket']);

        Route::get('wallet', [WalletController::class, 'show']);
        Route::get('wallet/transactions', [WalletController::class, 'transactions']);
        Route::post('wallet/deposits/intent', [WalletController::class, 'createDepositIntent']);
        Route::post('wallet/withdrawals', [WalletController::class, 'withdraw']);
    });
});
