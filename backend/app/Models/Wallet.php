<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wallet extends Model
{
    protected $fillable = ['user_id', 'balance', 'winning_balance', 'bonus_balance', 'currency'];
    protected function casts(): array { return ['balance' => 'decimal:2', 'winning_balance' => 'decimal:2', 'bonus_balance' => 'decimal:2']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function transactions() { return $this->hasMany(WalletTransaction::class); }
}
