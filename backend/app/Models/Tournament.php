<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tournament extends Model
{
    protected $fillable = ['game_id', 'name', 'slug', 'entry_fee', 'prize_pool', 'max_players', 'starts_at', 'status', 'bracket'];
    protected function casts(): array { return ['entry_fee' => 'decimal:2', 'prize_pool' => 'decimal:2', 'starts_at' => 'datetime', 'bracket' => 'array']; }
    public function entries(): HasMany { return $this->hasMany(TournamentEntry::class); }
    public function game() { return $this->belongsTo(Game::class); }
}
