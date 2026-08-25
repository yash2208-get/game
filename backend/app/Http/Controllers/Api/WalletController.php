<?php

namespace App\Http\Controllers\Api;

use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class WalletController
{
    public function show(Request $request): JsonResponse { return response()->json(['data' => $request->user()->wallet]); }

    public function transactions(Request $request): JsonResponse
    {
        return response()->json(['data' => $request->user()->wallet->transactions()->latest()->paginate(25)]);
    }

    public function createDepositIntent(Request $request): JsonResponse
    {
        $data = $request->validate(['amount' => ['required', 'numeric', 'min:50', 'max:100000']]);
        // Replace this idempotent intent with the gateway adapter (Razorpay/Stripe) in production.
        return response()->json(['data' => ['intent_id' => 'dep_'.str()->random(20), 'amount' => $data['amount'], 'currency' => 'INR']]);
    }

    public function withdraw(Request $request): JsonResponse
    {
        $data = $request->validate(['amount' => ['required', 'numeric', 'min:100'], 'method' => ['required', Rule::in(['upi', 'bank'])]]);
        DB::transaction(function () use ($request, $data): void {
            $wallet = Wallet::where('user_id', $request->user()->id)->lockForUpdate()->firstOrFail();
            abort_if($wallet->winning_balance < $data['amount'], 422, 'Insufficient winning balance.');
            $wallet->decrement('winning_balance', $data['amount']);
            $wallet->decrement('balance', $data['amount']);
            $wallet->transactions()->create(['type' => 'withdrawal', 'amount' => -$data['amount'], 'status' => 'pending', 'meta' => ['method' => $data['method']]]);
        });
        return response()->json(['message' => 'Withdrawal request submitted.']);
    }
}
