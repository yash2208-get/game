# Nexora data model

The production schema is in `backend/database/migrations/2026_01_01_000000_create_nexora_schema.php` and is designed for MySQL 8.4. Monetary values use fixed-point `DECIMAL(14,2)` and every balance mutation is protected by a row lock inside a database transaction.

```mermaid
erDiagram
  USERS ||--|| WALLETS : owns
  WALLETS ||--o{ WALLET_TRANSACTIONS : records
  USERS ||--o{ GAME_ROOMS : creates
  GAMES ||--o{ GAME_ROOMS : hosts
  GAME_ROOMS ||--o{ ROOM_PLAYERS : has
  USERS ||--o{ ROOM_PLAYERS : joins
  GAMES ||--o{ MATCHES : powers
  MATCHES ||--o{ MATCH_PLAYERS : has
  USERS ||--o{ MATCH_PLAYERS : plays
  GAMES ||--o{ TOURNAMENTS : features
  TOURNAMENTS ||--o{ TOURNAMENT_ENTRIES : accepts
  USERS ||--o{ TOURNAMENT_ENTRIES : enters
  USERS ||--o{ KYC_DOCUMENTS : submits
  USERS ||--o{ FRIENDS : connects
  USERS ||--o{ USER_ACHIEVEMENTS : unlocks
  ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : tracks

  USERS { bigint id PK string email UK int xp int rank }
  WALLETS { bigint id PK bigint user_id FK decimal balance decimal winning_balance decimal bonus_balance }
  WALLET_TRANSACTIONS { bigint id PK bigint wallet_id FK string type decimal amount string status string reference UK }
  GAMES { bigint id PK string slug UK string category boolean is_active json config }
  GAME_ROOMS { bigint id PK bigint game_id FK bigint owner_id FK string code UK string visibility string status }
  ROOM_PLAYERS { bigint id PK bigint room_id FK bigint user_id FK string role }
  MATCHES { bigint id PK bigint game_id FK bigint room_id FK bigint winner_id FK string status decimal stake json result }
  MATCH_PLAYERS { bigint id PK bigint match_id FK bigint user_id FK int score string result }
  TOURNAMENTS { bigint id PK bigint game_id FK string slug UK decimal entry_fee decimal prize_pool int max_players datetime starts_at }
  TOURNAMENT_ENTRIES { bigint id PK bigint tournament_id FK bigint user_id FK int seed int placement decimal prize }
  KYC_DOCUMENTS { bigint id PK bigint user_id FK string document_type string status }
  ACHIEVEMENTS { bigint id PK string slug UK int xp_reward json criteria }
  USER_ACHIEVEMENTS { bigint id PK bigint user_id FK bigint achievement_id FK int progress }
  FRIENDS { bigint id PK bigint user_id FK bigint friend_id FK string status }
```

## Integrity rules

- `wallets` has one row per user; never update a wallet without `lockForUpdate()` inside `DB::transaction()`.
- A user can enter a tournament once (`tournament_id`, `user_id` unique key).
- A user can be a player in a room once (`room_id`, `user_id` unique key).
- Game and tournament lists are indexed for matchmaking (`is_active`, `category`, `status`, `starts_at`).
- `audit_logs` stores privileged/admin changes and KYC reviews.
