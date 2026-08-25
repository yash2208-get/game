<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'phone', 'password', 'avatar_url', 'referral_code'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed', 'is_admin' => 'boolean'];
    }

    public function wallet() { return $this->hasOne(Wallet::class); }
    public function matches() { return $this->belongsToMany(MatchGame::class, 'match_players', 'user_id', 'match_id')->withPivot(['score', 'result']); }
    public function createdRooms() { return $this->hasMany(GameRoom::class, 'owner_id'); }
}
