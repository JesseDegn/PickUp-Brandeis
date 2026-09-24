// Pickup Brandeis - the rules for what counts as valid information.
// Each check returns an empty string "" when the value is fine, or a plain-
// English message when it is not. (Height also hands back a tidy version.)

window.PB = window.PB || {};

(function () {
  const C = PB.config;

  function isBlank(value) {
    return value === undefined || value === null || String(value).trim() === "";
  }

  // A name must not be blank and must be a sensible length.
  function name(value, label) {
    if (isBlank(value)) return "Please enter your " + label + ".";
    if (String(value).trim().length > C.NAME_MAX) {
      return "Please keep your " + label + " under " + C.NAME_MAX + " characters.";
    }
    return "";
  }

  // The email must end in @brandeis.edu (capitals and extra spaces are ignored).
  function email(value) {
    if (isBlank(value)) return "Please enter your Brandeis email.";
    const cleaned = String(value).trim().toLowerCase();
    const pattern = /^[^\s@]+@brandeis\.edu$/;
    if (!pattern.test(cleaned)) return "Please use your Brandeis email.";
    return "";
  }

  function skill(value, allowed) {
    if (isBlank(value) || allowed.indexOf(value) === -1) return "Please choose a skill level.";
    return "";
  }

  // Height is optional. Accepts 6'1", 6' 1, 6-1, 6ft 1in and phone "smart
  // quotes". Returns { error, normalized } where normalized looks like 6'1".
  function height(value) {
    if (isBlank(value)) return { error: "", normalized: "" };
    const pattern = /^\s*(\d)\s*(?:['’′]|ft\.?|feet|foot|-)\s*(?:(\d{1,2})\s*(?:["”″]|in\.?|inches|inch)?)?\s*$/i;
    const m = String(value).match(pattern);
    const message =
      "Enter your height like 6'1\" (between 4'0\" and 7'6\"), or leave it blank.";
    if (!m) return { error: message, normalized: "" };
    const feet = Number(m[1]);
    const inches = m[2] === undefined ? 0 : Number(m[2]);
    const total = feet * 12 + inches;
    if (inches > 11 || total < C.HEIGHT_MIN_INCHES || total > C.HEIGHT_MAX_INCHES) {
      return { error: message, normalized: "" };
    }
    return { error: "", normalized: feet + "'" + inches + '"' };
  }

  // Desired number of players: a whole number from MIN to MAX.
  function players(value) {
    if (isBlank(value)) return "Please enter how many players you want.";
    const text = String(value).trim();
    if (!/^\d+$/.test(text)) return "Please enter a whole number, like 10.";
    const n = Number(text);
    if (n < C.MIN_PLAYERS || n > C.MAX_PLAYERS) {
      return "Players must be between " + C.MIN_PLAYERS + " and " + C.MAX_PLAYERS + ".";
    }
    return "";
  }

  function date(value) {
    if (isBlank(value)) return "Please choose a date.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Please choose a valid date.";
    return "";
  }

  function time(value) {
    if (isBlank(value)) return "Please choose a start time.";
    if (!/^\d{2}:\d{2}$/.test(value)) return "Please choose a valid start time.";
    return "";
  }

  // The chosen date and time must still be in the future.
  function futureDateTime(dateValue, timeValue, now) {
    if (date(dateValue) || time(timeValue)) return ""; // reported by the checks above
    const start = PB.format.startOf({ date: dateValue, time: timeValue });
    if (start.getTime() <= now.getTime()) return "Please choose a start time that is still in the future.";
    return "";
  }

  function location(choice, otherText) {
    if (isBlank(choice) || C.LOCATIONS.indexOf(choice) === -1) return "Please choose a location.";
    if (choice === "Other") {
      if (isBlank(otherText)) return "Please type the location name.";
      if (String(otherText).trim().length > C.OTHER_LOCATION_MAX) {
        return "Please keep the location under " + C.OTHER_LOCATION_MAX + " characters.";
      }
    }
    return "";
  }

  function description(value) {
    if (value && String(value).length > C.DESCRIPTION_MAX) {
      return "Please keep the description under " + C.DESCRIPTION_MAX + " characters.";
    }
    return "";
  }

  PB.validation = {
    isBlank: isBlank,
    name: name,
    email: email,
    skill: skill,
    height: height,
    players: players,
    date: date,
    time: time,
    futureDateTime: futureDateTime,
    location: location,
    description: description,
  };
})();
