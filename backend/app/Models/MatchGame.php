<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchGame extends Model
{
    protected $table = 'matches';
    protected $fillable = ['game_id', 'room_id', 'winner_id', 'status', 'stake', 'result', 'started_at', 'ended_at'];
    protected function casts(): array { return ['stake' => 'decimal:2', 'result' => 'array', 'started_at' => 'datetime', 'ended_at' => 'datetime']; }
    public function players() { return $this->belongsToMany(User::class, 'match_players', 'match_id', 'user_id')->withPivot(['score', 'result']); }
}
