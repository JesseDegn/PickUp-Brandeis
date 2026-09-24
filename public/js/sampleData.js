// Pickup Brandeis - fictional sample players and games.
// Every name here is made up. Sample games are created relative to "today"
// so "Today" and "Tomorrow" are always correct.

window.PB = window.PB || {};

(function () {
  // Fictional players. The "id" is just a label the app uses internally.
  const PEOPLE = [
    { id: "p-mk", firstName: "Maya", lastName: "Klein" },
    { id: "p-jr", firstName: "Jordan", lastName: "Reyes" },
    { id: "p-al", firstName: "Alex", lastName: "Lin" },
    { id: "p-dp", firstName: "Dana", lastName: "Park" },
    { id: "p-ts", firstName: "Tyler", lastName: "Stone" },
    { id: "p-nb", firstName: "Noor", lastName: "Bakr" },
    { id: "p-cw", firstName: "Chris", lastName: "Wu" },
    { id: "p-eh", firstName: "Ellis", lastName: "Hart" },
    { id: "p-rg", firstName: "Riley", lastName: "Grant" },
    { id: "p-sm", firstName: "Sam", lastName: "Moreno" },
    { id: "p-ko", firstName: "Kai", lastName: "Ortiz" },
    { id: "p-lb", firstName: "Leo", lastName: "Brandt" },
    { id: "p-ft", firstName: "Finn", lastName: "Tate" },
    { id: "p-hv", firstName: "Hana", lastName: "Voss" },
    { id: "p-oy", firstName: "Omar", lastName: "Yusuf" },
  ];

  // Days from today until the next given weekday (0=Sunday ... 6=Saturday),
  // but never sooner than 2 days, so it does not repeat "Today"/"Tomorrow".
  function daysUntilWeekday(now, weekday) {
    let d = (weekday - now.getDay() + 7) % 7;
    if (d < 2) d += 7;
    return d;
  }

  function dateOffset(now, days) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
    return PB.format.toDateString(d);
  }

  // Builds four sample games for the week ahead. `stamp` keeps ids unique
  // if fresh sample games are made on a later day.
  function makeGames(now) {
    const stamp = PB.format.toDateString(now).replace(/-/g, "");
    return [
      {
        id: "s-" + stamp + "-1",
        sample: true,
        sport: "basketball",
        date: dateOffset(now, 0),
        time: "18:00",
        location: "Gosman Courts",
        skill: "Intermediate",
        maxPlayers: 10,
        description: "Full-court games to 11. Bring a light and a dark shirt.",
        creatorId: "p-mk",
        playerIds: ["p-mk", "p-jr", "p-al", "p-dp", "p-ts", "p-nb", "p-cw", "p-eh"],
      },
      {
        id: "s-" + stamp + "-2",
        sample: true,
        sport: "basketball",
        date: dateOffset(now, 1),
        time: "19:30",
        location: "Gosman Courts",
        skill: "Advanced",
        maxPlayers: 10,
        description: "Fast pace, competitive but friendly.",
        creatorId: "p-ts",
        playerIds: ["p-ts", "p-nb", "p-cw", "p-eh", "p-rg", "p-sm"],
      },
      {
        id: "s-" + stamp + "-3",
        sample: true,
        sport: "basketball",
        date: dateOffset(now, daysUntilWeekday(now, 6)),
        time: "14:00",
        location: "Outdoor Basketball Courts",
        skill: "All skill levels",
        maxPlayers: 10,
        description: "Relaxed outdoor run. Everyone is welcome.",
        creatorId: "p-rg",
        playerIds: ["p-rg", "p-sm", "p-ko", "p-lb"],
      },
      {
        id: "s-" + stamp + "-4",
        sample: true,
        sport: "basketball",
        date: dateOffset(now, daysUntilWeekday(now, 0)),
        time: "16:00",
        location: "Gosman Courts",
        skill: "Beginner",
        maxPlayers: 10,
        description: "Casual full-court games, all welcome. Bring water.",
        creatorId: "p-mk",
        playerIds: ["p-mk", "p-lb", "p-ft", "p-hv", "p-oy", "p-al", "p-jr", "p-dp", "p-ko", "p-sm"],
      },
    ];
  }

  PB.sample = { PEOPLE: PEOPLE, makeGames: makeGames };
})();
