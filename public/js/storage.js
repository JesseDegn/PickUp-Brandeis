// Pickup Brandeis - the ONE place that saves and loads data.
//
// Every screen asks this file for games and players, and tells it about
// changes (join, leave, create). Nothing else in the app touches localStorage.
// Later, shared online data can be added by changing only this file.
//
// "localStorage" is a small storage area inside each web browser. It keeps
// data on that one device, even after the page is refreshed.

window.PB = window.PB || {};

(function () {
  let prefix = "pb.v1."; // tests switch this so they never touch real data
  const memory = {}; // used if the browser blocks localStorage

  const status = {
    usingMemory: false, // true when saving to the browser is not possible
    recovered: false, // true when damaged saved data had to be reset
  };

  // ----- raw reading and writing (with safe fallbacks) -----

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

  function isArray(v) {
    return Array.isArray(v);
  }
  function isObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  // ----- setup -----

  // Call once when the app starts. Makes sure sample players and games exist.
  function init(now) {
    now = now || PB.now();
    let players = read("players", null, isObject);
    let games = read("games", null, isArray);

    if (players === null) {
      players = {};
      PB.sample.PEOPLE.forEach(function (p) {
        players[p.id] = p;
      });
      // Keep the current user's name available if a profile exists.
      const profile = read("profile", null, isObject);
      if (profile && profile.id) {
        players[profile.id] = { id: profile.id, firstName: profile.firstName, lastName: profile.lastName };
      }
      write("players", players);
    }

    if (games === null) {
      games = PB.sample.makeGames(now);
    } else {
      // Keep the demo alive: if every sample game has passed, add fresh ones.
      const anyUpcomingSample = games.some(function (g) {
        return g.sample && PB.format.startOf(g).getTime() > now.getTime();
      });
      const hasSample = games.some(function (g) {
        return g.sample;
      });
      if (hasSample && !anyUpcomingSample) {
        games = games.filter(function (g) {
          return !g.sample;
        });
        games = games.concat(PB.sample.makeGames(now));
      }
    }
    write("games", games);
  }

  // ----- profile -----

  function getProfile() {
    return read("profile", null, isObject);
  }

  // Saves the profile (adds an id the first time) and remembers the name so
  // it can show up in player lists.
  function saveProfile(fields) {
    const existing = getProfile();
    const id = existing && existing.id ? existing.id : "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const profile = {
      id: id,
      firstName: String(fields.firstName).trim(),
      lastName: String(fields.lastName).trim(),
      email: String(fields.email).trim().toLowerCase(),
      skill: fields.skill,
      height: fields.height || "",
      positions: fields.positions || [],
    };
    write("profile", profile);
    const players = read("players", {}, isObject);
    players[id] = { id: id, firstName: profile.firstName, lastName: profile.lastName };
    write("players", players);
    return profile;
  }

  // ----- players -----

  function getPlayer(id) {
    const players = read("players", {}, isObject);
    return players[id] || { id: id, firstName: "Player", lastName: "" };
  }

  // ----- games -----

  function getGames() {
    return read("games", [], isArray);
  }

  function saveGames(games) {
    write("games", games);
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

  // Adds a person to a game if the rules allow it.
  // Returns { ok: true, game } or { ok: false, reason }.
  function joinGame(gameId, userId, now) {
    now = now || PB.now();
    const games = getGames();
    const game = games.find(function (g) {
      return g.id === gameId;
    });
    if (!game) return { ok: false, reason: "not-found" };
    if (hasStarted(game, now)) return { ok: false, reason: "started" };
    if (isJoined(game, userId)) return { ok: false, reason: "already" };
    if (isFull(game)) return { ok: false, reason: "full" };
    game.playerIds.push(userId);
    saveGames(games);
    return { ok: true, game: game };
  }

  // Removes a person from a game.
  function leaveGame(gameId, userId, now) {
    now = now || PB.now();
    const games = getGames();
    const game = games.find(function (g) {
      return g.id === gameId;
    });
    if (!game) return { ok: false, reason: "not-found" };
    if (hasStarted(game, now)) return { ok: false, reason: "started" };
    if (!isJoined(game, userId)) return { ok: false, reason: "not-joined" };
    game.playerIds = game.playerIds.filter(function (id) {
      return id !== userId;
    });
    saveGames(games);
    return { ok: true, game: game };
  }

  // Creates a game. The creator is automatically counted as attending.
  function createGame(fields, creatorId) {
    const games = getGames();
    const game = {
      id: "g-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      sample: false,
      sport: "basketball",
      date: fields.date,
      time: fields.time,
      location: fields.location,
      skill: fields.skill,
      maxPlayers: Number(fields.maxPlayers),
      description: String(fields.description || "").trim(),
      creatorId: creatorId,
      playerIds: [creatorId],
    };
    games.push(game);
    saveGames(games);
    return game;
  }

  // Wipes everything and starts again with the sample data.
  function resetAll(now) {
    ["profile", "players", "games"].forEach(rawRemove);
    status.recovered = false;
    init(now);
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
    resetAll: resetAll,
    isFull: isFull,
    isJoined: isJoined,
    hasStarted: hasStarted,
    useNamespace: useNamespace,
    // For tests only: put raw text into a storage slot (e.g. damaged data).
    _rawSet: rawSet,
    _rawRemove: rawRemove,
  };
})();
