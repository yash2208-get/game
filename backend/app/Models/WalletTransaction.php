<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    protected $fillable = ['wallet_id', 'type', 'amount', 'status', 'reference', 'meta'];
    protected function casts(): array { return ['amount' => 'decimal:2', 'meta' => 'array']; }
}
