<?php

namespace App\Services;

use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use RuntimeException;

final class WalletService
{
    public function debit(Wallet $wallet, float $amount, string $type, array $meta = []): void
    {
        DB::transaction(function () use ($wallet, $amount, $type, $meta): void {
            $locked = Wallet::query()->whereKey($wallet->id)->lockForUpdate()->firstOrFail();
            if ((float) $locked->balance < $amount) throw new RuntimeException('Insufficient wallet balance.');
            $locked->decrement('balance', $amount);
            $locked->transactions()->create(['type' => $type, 'amount' => -$amount, 'status' => 'completed', 'meta' => $meta]);
        });
    }

    public function credit(Wallet $wallet, float $amount, string $type, array $meta = []): void
    {
        DB::transaction(function () use ($wallet, $amount, $type, $meta): void {
            $locked = Wallet::query()->whereKey($wallet->id)->lockForUpdate()->firstOrFail();
            $locked->increment('balance', $amount);
            $locked->increment('winning_balance', $amount);
            $locked->transactions()->create(['type' => $type, 'amount' => $amount, 'status' => 'completed', 'meta' => $meta]);
        });
    }
}
