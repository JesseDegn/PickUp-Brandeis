// Pickup Brandeis - the ONE place that saves and loads data.
//
// Every screen asks this file for games and players, and tells it about
// changes (join, leave, create). Nothing else in the app talks to the
// network or to localStorage directly.
//
// Two different places hold data now:
//   1. The shared server (Cloudflare + a database) has every game and every
//      player, for everyone. This file reaches it over the network using
//      small web addresses ("/api/games", and so on).
//   2. This one browser also remembers YOUR OWN profile in "localStorage"
//      (a small storage area inside the browser), so you do not have to
//      retype your name and email every time you open the app. Nothing
//      else - no games, no other people's info - is kept on the device.
//
// Because the shared data lives on a server, most functions below now take
// a moment (they "return a Promise") instead of finishing instantly. Screens
// that need data call `await` and show a brief loading message while they
// wait - see router.js.

window.PB = window.PB || {};

(function () {
  let prefix = "pb.v1."; // tests switch this so they never touch real data
  const memory = {}; // used if the browser blocks localStorage

  const status = {
    usingMemory: false, // true when saving to the browser is not possible
    recovered: false, // true when damaged saved data had to be reset
  };

  // A cache of the last data we fetched from the server, so screens can read
  // it instantly (no "await") once it has been loaded at least once.
  const cache = {
    games: [], // array of game objects, as sent by the server
    players: {}, // id -> {id, firstName, lastName}, built from the games above
    loaded: false,
  };

  // ----- raw reading and writing (with safe fallbacks) - profile only -----

  function rawGet(key) {
    if (status.usingMemory) return memory[prefix + key] === undefined ? null : memory[prefix + key];
    try {
      return window.localStorage.getItem(prefix + key);
    } catch (e) {
      status.usingMemory = true;
      return memory[prefix + key] === undefined ? null : memory[prefix + key];
    }
  }

  function rawSet(key, text) {
    if (!status.usingMemory) {
      try {
        window.localStorage.setItem(prefix + key, text);
        return;
      } catch (e) {
        status.usingMemory = true;
      }
    }
    memory[prefix + key] = text;
  }

  function rawRemove(key) {
    delete memory[prefix + key];
    try {
      window.localStorage.removeItem(prefix + key);
    } catch (e) {
      /* nothing to remove */
    }
  }

  // Reads JSON. If the saved text is damaged, returns `fallback` and notes it.
  function read(key, fallback, isValid) {
    const text = rawGet(key);
    if (text === null) return fallback;
    try {
      const value = JSON.parse(text);
      if (isValid && !isValid(value)) throw new Error("unexpected shape");
      return value;
    } catch (e) {
      status.recovered = true;
      return fallback;
    }
  }

  function write(key, value) {
    rawSet(key, JSON.stringify(value));
  }

  function isObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  // ----- talking to the server -----

  // A test page can replace this with a fake version that does not need a
  // real network (see tests.html).
  let fetchImpl = function () {
    return window.fetch.apply(window, arguments);
  };
  function useFetch(fn) {
    fetchImpl = fn;
  }

  // Friendly text for network problems, so the app never shows something
  // like "TypeError: Failed to fetch" to a person.
  const OFFLINE_MESSAGE = "Can't reach the server right now. Check your connection and try again.";

  async function api(path, options) {
    let response;
    try {
      response = await fetchImpl(path, options);
    } catch (e) {
      throw new Error(OFFLINE_MESSAGE);
    }
    let body = null;
    try {
      body = await response.json();
    } catch (e) {
      /* no JSON body */
    }
    if (!response.ok) {
      throw new Error((body && body.error) || "Something went wrong. Please try again.");
    }
    return body;
  }

  function rebuildPlayerCache(games) {
    const players = {};
    games.forEach(function (g) {
      (g.players || []).forEach(function (p) {
        players[p.id] = p;
      });
      if (g.creator) players[g.creator.id] = g.creator;
    });
    // Always keep the signed-in person's own name available, even before
    // they have created or joined any game.
    const profile = getProfile();
    if (profile) players[profile.id] = { id: profile.id, firstName: profile.firstName, lastName: profile.lastName };
    cache.players = players;
  }

  // Fetches the latest games from the server and updates the local cache.
  // Every screen calls this (via router.js) before it draws itself, so what
  // people see is never more than a moment out of date.
  async function refreshGames() {
    const body = await api("/api/games");
    cache.games = (body && body.games) || [];
    rebuildPlayerCache(cache.games);
    cache.loaded = true;
    return cache.games;
  }

  // ----- setup -----

  // Call once when the app starts.
  async function init() {
    await refreshGames();
  }

  // ----- profile (kept on this device only) -----

  function getProfile() {
    return read("profile", null, isObject);
  }

  // Saves the profile to the shared server (so other people can see your
  // name on games), and remembers it on this device too.
  async function saveProfile(fields) {
    const existing = getProfile();
    const email = String(fields.email).trim().toLowerCase();
    // Only reuse the id saved on this device if it is still the SAME email.
    // Otherwise, if someone else sits down at this device and enters a
    // different email, we must not accidentally hand them the previous
    // person's identity - the server decides (by matching email) whether
    // this is a returning person or someone brand new.
    const sameEmail = existing && existing.email === email;
    const payload = {
      id: sameEmail ? existing.id : undefined,
      firstName: String(fields.firstName).trim(),
      lastName: String(fields.lastName).trim(),
      email: email,
      skill: fields.skill,
      height: fields.height || "",
      positions: fields.positions || [],
    };
    const body = await api("/api/profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const profile = body.profile;
    write("profile", profile);
    cache.players[profile.id] = { id: profile.id, firstName: profile.firstName, lastName: profile.lastName };
    return profile;
  }

  // ----- players (read from the cache built by refreshGames) -----

  function getPlayer(id) {
    return cache.players[id] || { id: id, firstName: "Player", lastName: "" };
  }

  // ----- games (read from the cache built by refreshGames) -----

  function getGames() {
    return cache.games;
  }

  function getGame(id) {
    return getGames().find(function (g) {
      return g.id === id;
    }) || null;
  }

  function hasStarted(game, now) {
    return PB.format.startOf(game).getTime() <= now.getTime();
  }

  function isFull(game) {
    return game.playerIds.length >= game.maxPlayers;
  }

  function isJoined(game, userId) {
    return !!userId && game.playerIds.indexOf(userId) !== -1;
  }

  // Games that have not started yet, soonest first.
  function getUpcomingGames(now) {
    now = now || PB.now();
    return getGames()
      .filter(function (g) {
        return !hasStarted(g, now);
      })
      .sort(function (a, b) {
        return PB.format.startOf(a) - PB.format.startOf(b);
      });
  }

  // Upcoming games this person joined, and ones they created.
  function getMyGames(userId, now) {
    const upcoming = getUpcomingGames(now);
    return {
      joining: upcoming.filter(function (g) {
        return isJoined(g, userId);
      }),
      created: upcoming.filter(function (g) {
        return g.creatorId === userId;
      }),
    };
  }

  // Adds a person to a game if the server's rules allow it.
  // Returns { ok: true, game } or { ok: false, reason }. Note: this does NOT
  // refresh the local cache itself - router.js always fetches the latest
  // games right before it draws the next screen, so the counts shown are
  // never stale, and we never fetch the list twice in a row.
  async function joinGame(gameId, userId) {
    return api("/api/games/" + encodeURIComponent(gameId) + "/join", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ playerId: userId }),
    });
  }

  // Removes a person from a game. See the note on joinGame above.
  async function leaveGame(gameId, userId) {
    return api("/api/games/" + encodeURIComponent(gameId) + "/leave", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ playerId: userId }),
    });
  }

  // Creates a game. The creator is automatically counted as attending.
  async function createGame(fields, creatorId) {
    const body = await api("/api/games", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: String(fields.name || "").trim(),
        date: fields.date,
        time: fields.time,
        location: fields.location,
        skill: fields.skill,
        maxPlayers: Number(fields.maxPlayers),
        creatorId: creatorId,
      }),
    });
    return body.game;
  }

  // Deletes a game outright. Only the game's creator can do this (the
  // server checks that creatorId matches who actually created it).
  async function deleteGame(gameId, creatorId) {
    return api("/api/games/" + encodeURIComponent(gameId) + "/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ creatorId: creatorId }),
    });
  }

  // ----- admin (a passcode-protected view; see views/admin.js) -----

  async function adminOverview(passcode) {
    return api("/api/admin/overview", { headers: { "x-admin-passcode": passcode } });
  }

  async function adminDeleteGame(gameId, passcode) {
    return api("/api/admin/games/" + encodeURIComponent(gameId), {
      method: "DELETE",
      headers: { "x-admin-passcode": passcode },
    });
  }

  // Tests use a different set of storage names so real data is never touched.
  function useNamespace(newPrefix) {
    prefix = newPrefix;
    status.recovered = false;
  }

  PB.storage = {
    status: status,
    init: init,
    getProfile: getProfile,
    saveProfile: saveProfile,
    getPlayer: getPlayer,
    getGames: getGames,
    getGame: getGame,
    getUpcomingGames: getUpcomingGames,
    getMyGames: getMyGames,
    joinGame: joinGame,
    leaveGame: leaveGame,
    createGame: createGame,
    deleteGame: deleteGame,
    refreshGames: refreshGames,
    adminOverview: adminOverview,
    adminDeleteGame: adminDeleteGame,
    isFull: isFull,
    isJoined: isJoined,
    hasStarted: hasStarted,
    useNamespace: useNamespace,
    useFetch: useFetch, // for tests only
    // For tests only: put raw text into a storage slot (e.g. damaged data).
    _rawSet: rawSet,
    _rawRemove: rawRemove,
  };
})();
