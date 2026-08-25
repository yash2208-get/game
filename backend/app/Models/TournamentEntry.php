<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TournamentEntry extends Model
{
    protected $fillable = ['tournament_id', 'user_id', 'seed', 'status', 'placement', 'prize'];
    protected function casts(): array { return ['prize' => 'decimal:2']; }
}
