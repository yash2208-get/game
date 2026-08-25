<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            ['name' => 'Royal Ludo', 'slug' => 'royal-ludo', 'category' => 'board', 'icon' => '✦'],
            ['name' => 'Blitz Arena', 'slug' => 'blitz-arena', 'category' => 'strategy', 'icon' => '♞'],
            ['name' => 'Neon Snakes', 'slug' => 'neon-snakes', 'category' => 'arcade', 'icon' => '↝'],
            ['name' => 'Quiz Rush', 'slug' => 'quiz-rush', 'category' => 'trivia', 'icon' => '?'],
            ['name' => 'Mind Flip', 'slug' => 'mind-flip', 'category' => 'memory', 'icon' => '◈'],
            ['name' => 'Block Theory', 'slug' => 'block-theory', 'category' => 'puzzle', 'icon' => '▦'],
            ['name' => 'Tic Tac Royale', 'slug' => 'tic-tac-royale', 'category' => 'board', 'icon' => '×'],
        ];
        Game::upsert($games, ['slug'], ['name', 'category', 'icon']);

        $user = User::factory()->create([
            'name' => 'Aiden Xavier',
            'email' => 'aiden@nexora.gg',
            'referral_code' => 'AIDENX24',
            'xp' => 10860,
            'rank' => 184,
            'win_rate' => 74.2,
        ]);
        $user->wallet()->create(['balance' => 2840.50, 'winning_balance' => 2140.50, 'bonus_balance' => 700]);
    }
}
