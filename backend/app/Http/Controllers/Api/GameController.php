<?php

namespace App\Http\Controllers\Api;

use App\Models\Game;
use App\Models\GameRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameController
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => Game::query()->where('is_active', true)->when($request->category, fn ($q, $category) => $q->where('category', $category))->orderBy('name')->paginate(24)]);
    }

    public function show(Game $game): JsonResponse { return response()->json(['data' => $game]); }

    public function createRoom(Request $request, Game $game): JsonResponse
    {
        $data = $request->validate(['visibility' => ['required', 'in:public,private'], 'settings' => ['nullable', 'array']]);
        $room = GameRoom::create(['game_id' => $game->id, 'owner_id' => $request->user()->id, ...$data, 'status' => 'waiting']);
        $room->users()->attach($request->user()->id, ['role' => 'owner']);
        return response()->json(['data' => $room], 201);
    }

    public function join(Request $request, GameRoom $room): JsonResponse
    {
        abort_if($room->status !== 'waiting', 422, 'This room is no longer accepting players.');
        $room->users()->syncWithoutDetaching([$request->user()->id => ['role' => 'player']]);
        return response()->json(['data' => $room->load('users')]);
    }

    public function spectate(Request $request, GameRoom $room): JsonResponse
    {
        $room->users()->syncWithoutDetaching([$request->user()->id => ['role' => 'spectator']]);
        return response()->json(['data' => $room->load('users')]);
    }

    public function matches(Request $request): JsonResponse
    {
        return response()->json(['data' => $request->user()->matches()->with('players')->latest()->paginate(20)]);
    }
}
