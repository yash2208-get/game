<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    protected $fillable = ['name', 'slug', 'category', 'description', 'icon', 'is_active', 'config'];
    protected function casts(): array { return ['is_active' => 'boolean', 'config' => 'array']; }
    public function rooms(): HasMany { return $this->hasMany(GameRoom::class); }
}
