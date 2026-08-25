<?php

namespace App\Http\Controllers\Api;

use App\Models\Tournament;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->load('wallet');
        return response()->json(['data' => [
            'user' => $user,
            'stats' => ['rank' => 184, 'xp' => 10860, 'win_rate' => 74.2, 'play_time_minutes' => 1122],
            'tournaments' => Tournament::query()->whereIn('status', ['live', 'open'])->with('entries')->limit(5)->get(),
            'activity' => $user->matches()->latest()->limit(10)->get(),
        ]]);
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $players = User::query()->orderByDesc('xp')->paginate($request->integer('per_page', 20));
        return response()->json($players);
    }
}
