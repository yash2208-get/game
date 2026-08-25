<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameRoom extends Model
{
    protected $fillable = ['game_id', 'owner_id', 'code', 'visibility', 'status', 'settings'];
    protected function casts(): array { return ['settings' => 'array']; }
    protected static function booted(): void { static::creating(fn (self $room) => $room->code ??= strtoupper(str()->random(6))); }
    public function users() { return $this->belongsToMany(User::class, 'room_players', 'room_id', 'user_id')->withPivot('role'); }
}
