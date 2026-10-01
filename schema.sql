-- Pickup Brandeis - shared database schema (Cloudflare D1, which is SQL).
--
-- Three tables:
--   players      one row per person who has saved a profile
--   games        one row per pickup game
--   game_players who has joined which game (the creator is a row here too)
--
-- This file is meant to be run once, when the database is first set up.
-- Run it with:
--   npx wrangler d1 execute pickup-brandeis-db --remote --file=./schema.sql
-- (See DEPLOY_ACCOUNTS.md for the full one-time setup steps.)

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  skill TEXT NOT NULL,
  height TEXT NOT NULL DEFAULT '',
  positions TEXT NOT NULL DEFAULT '[]',   -- a JSON list, e.g. ["Point Guard","Center"]
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  sport TEXT NOT NULL DEFAULT 'basketball',
  name TEXT NOT NULL DEFAULT '',          -- what the creator named the game
  date TEXT NOT NULL,                     -- 'YYYY-MM-DD'
  time TEXT NOT NULL,                     -- 'HH:MM', 24-hour
  location TEXT NOT NULL,
  skill TEXT NOT NULL,
  max_players INTEGER NOT NULL,
  creator_id TEXT NOT NULL REFERENCES players(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS game_players (
  game_id TEXT NOT NULL REFERENCES games(id),
  player_id TEXT NOT NULL REFERENCES players(id),
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (game_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_games_date_time ON games(date, time);
CREATE INDEX IF NOT EXISTS idx_game_players_game ON game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_game_players_player ON game_players(player_id);
