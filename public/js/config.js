// Pickup Brandeis - shared settings.
// Anything you might want to change later (locations, skill levels, limits)
// lives here, in one place, so you never have to hunt through the code.

window.PB = window.PB || {};

PB.config = {
  APP_NAME: "Pickup Brandeis",

  // Only email addresses ending like this are accepted (prototype sign-in).
  EMAIL_DOMAIN: "@brandeis.edu",

  // Skill choices on the Profile screen.
  PROFILE_SKILLS: ["Beginner", "Intermediate", "Advanced"],

  // Skill choices when creating a game (adds "All skill levels").
  GAME_SKILLS: ["Beginner", "Intermediate", "Advanced", "All skill levels"],

  // Shorter wording used on the small chips on game cards.
  SKILL_SHORT: { "All skill levels": "All levels" },

  // Location choices when creating a game.
  LOCATIONS: ["Gosman Courts", "Outdoor Basketball Courts", "Other"],

  // Positions a player can prefer. They can pick as many as they like.
  POSITIONS: [
    "Point Guard",
    "Shooting Guard",
    "Small Forward",
    "Power Forward",
    "Center",
    "Any position",
  ],
  ANY_POSITION: "Any position",

  // Limits.
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 20,
  DESCRIPTION_MAX: 140,
  NAME_MAX: 40,
  OTHER_LOCATION_MAX: 60,
  HEIGHT_MIN_INCHES: 48, // 4'0"
  HEIGHT_MAX_INCHES: 90, // 7'6"
};

// "What time is it now?" lives in one place so tests can pretend it is a
// different time. The app itself always uses the real clock.
PB.now = function () {
  return new Date();
};
