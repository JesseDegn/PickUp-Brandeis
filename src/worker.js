// Pickup Brandeis - the server. This is the ONLY piece of code that talks to
// the shared database. It runs on Cloudflare, not in anyone's browser.
//
// The browser code (in /public) calls small web addresses like
// "/api/games" to ask this file for data, or to tell it about a change
// (a new profile, a new game, joining, leaving). This file is the referee:
// it is the one place that decides whether something is actually allowed,
// so no one can cheat by editing code in their own browser.
//
// How a request finds its way here: wrangler.jsonc tells Cloudflare "any
// address starting with /api/ goes to this file first; everything else is
// just a file in the public folder." So GET /api/games runs the code below,
// but opening the app itself (index.html, the pictures, etc.) never does.
//
// NOTE ON KEEPING THINGS IN SYNC: the browser code checks that entries look
// right (a real Brandeis email, a name that isn't blank, and so on) in
// public/js/validation.js. This file checks the SAME rules again, here on
// the server, using its own copy of them below. That may look repetitive,
// but it matters: the browser's checks are only a courtesy (a quick "that
// doesn't look right" message) - a person could switch them off. The
// server's checks are the real gate. If you ever change a rule in
// validation.js or config.js, make the matching change here too.

// ----- copied settings (must match public/js/config.js) -----

const EMAIL_DOMAIN = "@brandeis.edu";
const PROFILE_SKILLS = ["Beginner", "Intermediate", "Advanced"];
const GAME_SKILLS = ["Beginner", "Intermediate", "Advanced", "All skill levels"];
const LOCATIONS = ["Gosman Courts", "Outdoor Basketball Courts", "Other"];
const POSITIONS = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center", "Any position"];
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 20;
const GAME_NAME_MAX = 40;
const NAME_MAX = 40;
const OTHER_LOCATION_MAX = 60;

// ----- small helpers -----

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function fail(status, message) {
  return json({ error: message }, status);
}

function isBlank(v) {
  return v === undefined || v === null || String(v).trim() === "";
}

function newId(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch (e) {
    return null;
  }
}

// ----- validation (server-side copy; see the note at the top of this file) -----

function checkName(value, label) {
  if (isBlank(value)) return "Please enter a " + label + ".";
  if (String(value).trim().length > NAME_MAX) return "That " + label + " is too long.";
  return "";
}

function checkEmail(value) {
  if (isBlank(value)) return "Please enter a Brandeis email.";
  const cleaned = String(value).trim().toLowerCase();
  const pattern = /^[^\s@]+@brandeis\.edu$/;
  if (!pattern.test(cleaned)) return "Please use a Brandeis email.";
  return "";
}

function checkSkill(value, allowed) {
  if (isBlank(value) || allowed.indexOf(value) === -1) return "Please choose a valid skill level.";
  return "";
}

function checkHeight(value) {
  // Height is optional and, unlike the other fields, is not re-validated
  // strictly on the server - it is cosmetic text shown only to the person
  // who typed it. We just cap the length so no one can send something huge.
  if (isBlank(value)) return "";
  if (String(value).length > 12) return "That doesn't look like a height.";
  return "";
}

function checkPositions(value) {
  if (!Array.isArray(value)) return "Positions must be a list.";
  for (const p of value) {
    if (POSITIONS.indexOf(p) === -1) return "That is not a valid position.";
  }
  return "";
}

function checkPlayers(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < MIN_PLAYERS || n > MAX_PLAYERS) {
    return "Players must be a whole number between " + MIN_PLAYERS + " and " + MAX_PLAYERS + ".";
  }
  return "";
}

function checkDate(value) {
  if (isBlank(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Please choose a valid date.";
  return "";
}

function checkTime(value) {
  if (isBlank(value) || !/^\d{2}:\d{2}$/.test(value)) return "Please choose a valid start time.";
  return "";
}

function checkLocation(value) {
  if (isBlank(value) || LOCATIONS.indexOf(value) === -1) return "Please choose a valid location.";
  return "";
}

function checkGameName(value) {
  if (isBlank(value)) return "Please name the game.";
  if (String(value).trim().length > GAME_NAME_MAX) return "That name is too long.";
  return "";
}

// ----- shaping data for the browser -----
//
// Other students only ever see a player's id, first name and last name.
// Their email, height and preferred positions are never sent to anyone
// but themselves - see the privacy note in the README / ProductSpec.

async function loadGamesShaped(db) {
  const playersRows = await db.prepare("SELECT id, first_name, last_name FROM players").all();
  const playersById = {};
  for (const p of playersRows.results) {
    playersById[p.id] = { id: p.id, firstName: p.first_name, lastName: p.last_name };
  }

  const gamesRows = await db.prepare("SELECT * FROM games ORDER BY date, time").all();
  const membershipRows = await db
    .prepare("SELECT game_id, player_id FROM game_players ORDER BY joined_at")
    .all();

  const memberIdsByGame = {};
  for (const row of membershipRows.results) {
    (memberIdsByGame[row.game_id] = memberIdsByGame[row.game_id] || []).push(row.player_id);
  }

  function playerOrFallback(id) {
    return playersById[id] || { id: id, firstName: "Player", lastName: "" };
  }

  return gamesRows.results.map(function (g) {
    const playerIds = memberIdsByGame[g.id] || [];
    return {
      id: g.id,
      sport: g.sport,
      name: g.name,
      date: g.date,
      time: g.time,
      location: g.location,
      skill: g.skill,
      maxPlayers: g.max_players,
      creatorId: g.creator_id,
      playerIds: playerIds,
      players: playerIds.map(playerOrFallback),
      creator: playerOrFallback(g.creator_id),
    };
  });
}

// ----- route handlers -----

async function handleGetGames(env) {
  const games = await loadGamesShaped(env.DB);
  return json({ games: games });
}

async function handleSaveProfile(env, request) {
  const body = await readJson(request);
  if (!body) return fail(400, "That request did not make sense.");

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const skill = body.skill;
  const height = String(body.height || "").trim();
  const positions = body.positions || [];

  const errors = {
    firstName: checkName(firstName, "first name"),
    lastName: checkName(lastName, "last name"),
    email: checkEmail(email),
    skill: checkSkill(skill, PROFILE_SKILLS),
    height: checkHeight(height),
    positions: checkPositions(positions),
  };
  const firstError = Object.values(errors).find(Boolean);
  if (firstError) return fail(400, firstError);

  // If this email already has a profile (maybe from a different device),
  // reuse that same id instead of creating a second, duplicate person.
  const existing = await env.DB.prepare("SELECT id FROM players WHERE email = ?").bind(email).first();
  const id = existing ? existing.id : body.id && String(body.id).trim() ? String(body.id).trim() : newId("u");

  await env.DB
    .prepare(
      `INSERT INTO players (id, first_name, last_name, email, skill, height, positions, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         first_name = excluded.first_name,
         last_name = excluded.last_name,
         email = excluded.email,
         skill = excluded.skill,
         height = excluded.height,
         positions = excluded.positions,
         updated_at = datetime('now')`
    )
    .bind(id, firstName, lastName, email, skill, height, JSON.stringify(positions))
    .run();

  return json({ profile: { id: id, firstName: firstName, lastName: lastName, email: email, skill: skill, height: height, positions: positions } });
}

async function handleCreateGame(env, request) {
  const body = await readJson(request);
  if (!body) return fail(400, "That request did not make sense.");

  const creatorId = String(body.creatorId || "").trim();
  if (isBlank(creatorId)) return fail(400, "Please create your profile first.");
  const creator = await env.DB.prepare("SELECT id FROM players WHERE id = ?").bind(creatorId).first();
  if (!creator) return fail(400, "Please create your profile first.");

  const name = String(body.name || "").trim();
  const date = body.date;
  const time = body.time;
  const location = String(body.location || "").trim();
  const skill = body.skill;
  const maxPlayers = body.maxPlayers;

  const errors = {
    name: checkGameName(name),
    date: checkDate(date),
    time: checkTime(time),
    location: isBlank(location) ? "Please choose a location." : (location.length > OTHER_LOCATION_MAX ? "That location name is too long." : ""),
    skill: checkSkill(skill, GAME_SKILLS),
    maxPlayers: checkPlayers(maxPlayers),
  };
  const firstError = Object.values(errors).find(Boolean);
  if (firstError) return fail(400, firstError);

  const id = newId("g");
  await env.DB
    .prepare(
      `INSERT INTO games (id, sport, name, date, time, location, skill, max_players, creator_id, created_at)
       VALUES (?, 'basketball', ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
    .bind(id, name, date, time, location, skill, Number(maxPlayers), creatorId)
    .run();

  // The creator is automatically counted as attending their own game.
  await env.DB
    .prepare("INSERT INTO game_players (game_id, player_id, joined_at) VALUES (?, ?, datetime('now'))")
    .bind(id, creatorId)
    .run();

  const games = await loadGamesShaped(env.DB);
  const game = games.find(function (g) { return g.id === id; });
  return json({ game: game });
}

async function handleJoin(env, request, gameId) {
  const body = await readJson(request);
  const playerId = body && String(body.playerId || "").trim();
  if (isBlank(playerId)) return fail(400, "Please create your profile first.");

  const game = await env.DB.prepare("SELECT id FROM games WHERE id = ?").bind(gameId).first();
  if (!game) return json({ ok: false, reason: "not-found" });

  const already = await env.DB
    .prepare("SELECT 1 FROM game_players WHERE game_id = ? AND player_id = ?")
    .bind(gameId, playerId)
    .first();
  if (already) return json({ ok: false, reason: "already" });

  try {
    // This single statement is the whole safety check: it only inserts the
    // new row if the game is not already full, counted at the same instant
    // it inserts - so two people tapping Join at the exact same moment for
    // the very last spot cannot both get in.
    const result = await env.DB
      .prepare(
        `INSERT INTO game_players (game_id, player_id, joined_at)
         SELECT ?, ?, datetime('now')
         WHERE (SELECT COUNT(*) FROM game_players WHERE game_id = ?) < (SELECT max_players FROM games WHERE id = ?)`
      )
      .bind(gameId, playerId, gameId, gameId)
      .run();

    if (result.meta && result.meta.changes > 0) {
      const games = await loadGamesShaped(env.DB);
      return json({ ok: true, game: games.find(function (g) { return g.id === gameId; }) });
    }
    return json({ ok: false, reason: "full" });
  } catch (e) {
    // Two taps landed at the same moment and both tried to insert the same
    // row; the database's own rules stopped the second one.
    return json({ ok: false, reason: "already" });
  }
}

async function handleLeave(env, request, gameId) {
  const body = await readJson(request);
  const playerId = body && String(body.playerId || "").trim();
  if (isBlank(playerId)) return fail(400, "Please create your profile first.");

  const game = await env.DB.prepare("SELECT id FROM games WHERE id = ?").bind(gameId).first();
  if (!game) return json({ ok: false, reason: "not-found" });

  const result = await env.DB
    .prepare("DELETE FROM game_players WHERE game_id = ? AND player_id = ?")
    .bind(gameId, playerId)
    .run();

  if (!(result.meta && result.meta.changes > 0)) {
    return json({ ok: false, reason: "not-joined" });
  }

  // If that was the last person in the game (the creator included), the
  // game no longer makes sense to keep around - remove it entirely rather
  // than leaving an empty, orphaned game on Home forever.
  const remaining = await env.DB
    .prepare("SELECT COUNT(*) AS n FROM game_players WHERE game_id = ?")
    .bind(gameId)
    .first();
  if (remaining.n === 0) {
    await env.DB.prepare("DELETE FROM games WHERE id = ?").bind(gameId).run();
    return json({ ok: true, game: null, deleted: true });
  }

  const games = await loadGamesShaped(env.DB);
  return json({ ok: true, game: games.find(function (g) { return g.id === gameId; }), deleted: false });
}

// A game's creator can delete it outright, at any time, whether or not
// anyone else has joined. There is no real login, so - same as everywhere
// else in this prototype - "being the creator" means sending the creator's
// own id, which the browser already has saved.
async function handleDeleteGame(env, request, gameId) {
  const body = await readJson(request);
  const creatorId = body && String(body.creatorId || "").trim();
  if (isBlank(creatorId)) return fail(400, "Please create your profile first.");

  const game = await env.DB.prepare("SELECT creator_id FROM games WHERE id = ?").bind(gameId).first();
  if (!game) return json({ ok: false, reason: "not-found" });
  if (game.creator_id !== creatorId) return json({ ok: false, reason: "not-creator" });

  await env.DB.prepare("DELETE FROM game_players WHERE game_id = ?").bind(gameId).run();
  await env.DB.prepare("DELETE FROM games WHERE id = ?").bind(gameId).run();
  return json({ ok: true });
}

// ----- admin (protected by a passcode set only on the server) -----

function checkAdmin(env, request) {
  const given = request.headers.get("x-admin-passcode") || "";
  if (!env.ADMIN_PASSCODE) {
    return fail(500, "Admin access is not set up on the server yet.");
  }
  if (given !== env.ADMIN_PASSCODE) {
    return fail(401, "That passcode is not right.");
  }
  return null; // means "allowed, keep going"
}

async function handleAdminOverview(env, request) {
  const denied = checkAdmin(env, request);
  if (denied) return denied;

  const players = await env.DB.prepare("SELECT COUNT(*) AS n FROM players").first();
  const games = await env.DB.prepare("SELECT COUNT(*) AS n FROM games").first();
  const joins = await env.DB.prepare("SELECT COUNT(*) AS n FROM game_players").first();

  const shapedGames = await loadGamesShaped(env.DB);

  return json({
    stats: {
      playerCount: players.n,
      gameCount: games.n,
      joinCount: joins.n,
    },
    games: shapedGames,
  });
}

async function handleAdminDeleteGame(env, request, gameId) {
  const denied = checkAdmin(env, request);
  if (denied) return denied;

  await env.DB.prepare("DELETE FROM game_players WHERE game_id = ?").bind(gameId).run();
  const result = await env.DB.prepare("DELETE FROM games WHERE id = ?").bind(gameId).run();

  if (result.meta && result.meta.changes > 0) return json({ ok: true });
  return fail(404, "That game could not be found.");
}

// ----- routing -----

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      if (path === "/api/games" && method === "GET") return await handleGetGames(env);
      if (path === "/api/profile" && method === "POST") return await handleSaveProfile(env, request);
      if (path === "/api/games" && method === "POST") return await handleCreateGame(env, request);

      let m = path.match(/^\/api\/games\/([^/]+)\/join$/);
      if (m && method === "POST") return await handleJoin(env, request, decodeURIComponent(m[1]));

      m = path.match(/^\/api\/games\/([^/]+)\/leave$/);
      if (m && method === "POST") return await handleLeave(env, request, decodeURIComponent(m[1]));

      m = path.match(/^\/api\/games\/([^/]+)\/delete$/);
      if (m && method === "POST") return await handleDeleteGame(env, request, decodeURIComponent(m[1]));

      if (path === "/api/admin/overview" && method === "GET") return await handleAdminOverview(env, request);

      m = path.match(/^\/api\/admin\/games\/([^/]+)$/);
      if (m && method === "DELETE") return await handleAdminDeleteGame(env, request, decodeURIComponent(m[1]));

      // Any other /api/* address: nothing matched.
      return fail(404, "Unknown API address.");
    } catch (err) {
      // A real, unexpected problem (not a normal "invalid input" case).
      return fail(500, "Something went wrong on the server. Please try again.");
    }
  },
};
