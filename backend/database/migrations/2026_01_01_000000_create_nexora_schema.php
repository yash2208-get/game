<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 80);
            $table->string('email', 120)->unique();
            $table->string('phone', 20)->nullable()->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar_url')->nullable();
            $table->string('referral_code', 16)->unique();
            $table->unsignedInteger('xp')->default(0);
            $table->unsignedInteger('rank')->default(0);
            $table->decimal('win_rate', 5, 2)->default(0);
            $table->boolean('is_admin')->default(false);
            $table->rememberToken();
            $table->timestamps();
            $table->index(['xp', 'rank']);
        });

        Schema::create('personal_access_tokens', function (Blueprint $table): void {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('games', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category', 30);
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('config')->nullable();
            $table->timestamps();
            $table->index(['is_active', 'category']);
        });

        Schema::create('wallets', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('balance', 14, 2)->default(0);
            $table->decimal('winning_balance', 14, 2)->default(0);
            $table->decimal('bonus_balance', 14, 2)->default(0);
            $table->char('currency', 3)->default('INR');
            $table->timestamps();
        });

        Schema::create('wallet_transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->cascadeOnDelete();
            $table->string('type', 40);
            $table->decimal('amount', 14, 2);
            $table->string('status', 20)->default('pending');
            $table->string('reference')->nullable()->unique();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->index(['wallet_id', 'created_at']);
        });

        Schema::create('game_rooms', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('game_id')->constrained()->restrictOnDelete();
            $table->foreignId('owner_id')->constrained('users')->restrictOnDelete();
            $table->string('code', 8)->unique();
            $table->string('visibility', 12)->default('public');
            $table->string('status', 20)->default('waiting');
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->index(['game_id', 'status', 'visibility']);
        });

        Schema::create('room_players', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('room_id')->constrained('game_rooms')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role', 15)->default('player');
            $table->timestamp('joined_at')->useCurrent();
            $table->unique(['room_id', 'user_id']);
        });

        Schema::create('matches', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('game_id')->constrained()->restrictOnDelete();
            $table->foreignId('room_id')->nullable()->constrained('game_rooms')->nullOnDelete();
            $table->foreignId('winner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 20)->default('active');
            $table->decimal('stake', 14, 2)->default(0);
            $table->json('result')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
            $table->index(['game_id', 'status', 'created_at']);
        });

        Schema::create('match_players', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('match_id')->constrained('matches')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('score')->default(0);
            $table->string('result', 15)->nullable();
            $table->unique(['match_id', 'user_id']);
        });

        Schema::create('tournaments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('game_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('entry_fee', 14, 2)->default(0);
            $table->decimal('prize_pool', 14, 2)->default(0);
            $table->unsignedInteger('max_players')->default(64);
            $table->timestamp('starts_at');
            $table->string('status', 20)->default('draft');
            $table->json('bracket')->nullable();
            $table->timestamps();
            $table->index(['status', 'starts_at']);
        });

        Schema::create('tournament_entries', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('tournament_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('seed')->nullable();
            $table->string('status', 20)->default('registered');
            $table->unsignedInteger('placement')->nullable();
            $table->decimal('prize', 14, 2)->default(0);
            $table->timestamps();
            $table->unique(['tournament_id', 'user_id']);
        });

        Schema::create('friends', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('friend_id')->constrained('users')->cascadeOnDelete();
            $table->string('status', 15)->default('pending');
            $table->timestamps();
            $table->unique(['user_id', 'friend_id']);
        });

        Schema::create('kyc_documents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('document_type', 30);
            $table->string('document_number')->nullable();
            $table->string('front_path');
            $table->string('back_path')->nullable();
            $table->string('status', 20)->default('pending');
            $table->text('review_note')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('achievements', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('icon')->nullable();
            $table->unsignedInteger('xp_reward')->default(0);
            $table->json('criteria');
            $table->timestamps();
        });
        Schema::create('user_achievements', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('achievement_id')->constrained()->cascadeOnDelete();
            $table->timestamp('unlocked_at')->nullable();
            $table->unsignedInteger('progress')->default(0);
            $table->unique(['user_id', 'achievement_id']);
        });

        Schema::create('coupons', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->unique();
            $table->string('type', 15);
            $table->decimal('value', 14, 2);
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('auditable_type')->nullable();
            $table->unsignedBigInteger('auditable_id')->nullable();
            $table->json('changes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            $table->index(['auditable_type', 'auditable_id']);
        });
    }

    public function down(): void
    {
        foreach (['audit_logs', 'coupons', 'user_achievements', 'achievements', 'kyc_documents', 'friends', 'tournament_entries', 'tournaments', 'match_players', 'matches', 'room_players', 'game_rooms', 'wallet_transactions', 'wallets', 'games', 'personal_access_tokens', 'users'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
