<?php

namespace App\Http\Controllers\Api;

use App\Models\Tournament;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TournamentController
{
    public function index(Request $request): JsonResponse
    {
        $query = Tournament::query()->with('game')->withCount('entries')->when($request->status, fn ($q, $status) => $q->where('status', $status));
        return response()->json(['data' => $query->orderBy('starts_at')->paginate(20)]);
    }

    public function join(Request $request, Tournament $tournament): JsonResponse
    {
        abort_unless(in_array($tournament->status, ['open', 'live'], true), 422, 'This tournament is not open.');
        abort_if($tournament->entries()->where('user_id', $request->user()->id)->exists(), 422, 'You are already registered.');
        DB::transaction(fn () => $tournament->entries()->create(['user_id' => $request->user()->id, 'status' => 'registered']));
        return response()->json(['message' => 'You are registered for the tournament.']);
    }

    public function bracket(Tournament $tournament): JsonResponse { return response()->json(['data' => $tournament->only(['id', 'name', 'status', 'bracket'])]); }
}
