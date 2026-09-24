// Pickup Brandeis - turns stored data into friendly text.
// Dates are stored as "2026-09-27" and times as "16:00" (24-hour) and shown
// as "Today · 4:00 PM".

window.PB = window.PB || {};

(function () {
  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  // Date object -> "2026-09-27" (in the user's own time zone).
  function toDateString(d) {
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  // "2026-09-27" + "16:00" -> a Date for that moment (local time).
  function startOf(game) {
    const d = String(game.date).split("-").map(Number);
    const t = String(game.time).split(":").map(Number);
    return new Date(d[0], d[1] - 1, d[2], t[0] || 0, t[1] || 0, 0, 0);
  }

  // "16:00" -> "4:00 PM"
  function formatTime(hhmm) {
    const parts = String(hhmm).split(":").map(Number);
    let h = parts[0];
    const m = parts[1] || 0;
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return h + ":" + pad2(m) + " " + suffix;
  }

  // Whole days between two calendar dates (ignores the time of day).
  function dayDifference(dateString, now) {
    const p = dateString.split("-").map(Number);
    const target = new Date(p[0], p[1] - 1, p[2]);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target - today) / 86400000);
  }

  // "Today", "Tomorrow", "Saturday", or "Mon, Oct 12" for dates further away.
  function dayLabel(dateString, now) {
    const diff = dayDifference(dateString, now);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    const p = dateString.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2]);
    if (diff > 1 && diff < 7) return WEEKDAYS[d.getDay()];
    return WEEKDAYS[d.getDay()].slice(0, 3) + ", " + MONTHS[d.getMonth()] + " " + d.getDate();
  }

  // "Today · 6:00 PM"
  function formatWhen(game, now) {
    return dayLabel(game.date, now) + " · " + formatTime(game.time);
  }

  // "Sunday, Sept 27"
  function longDate(dateString) {
    const p = dateString.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2]);
    return WEEKDAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate();
  }

  function fullName(player) {
    return (player.firstName + " " + player.lastName).trim();
  }

  // "Maya Klein" -> "MK"
  function initials(player) {
    const a = (player.firstName || "?").charAt(0);
    const b = (player.lastName || "").charAt(0);
    return (a + b).toUpperCase();
  }

  function shortSkill(skill) {
    return PB.config.SKILL_SHORT[skill] || skill;
  }

  PB.format = {
    pad2: pad2,
    toDateString: toDateString,
    startOf: startOf,
    formatTime: formatTime,
    dayLabel: dayLabel,
    formatWhen: formatWhen,
    longDate: longDate,
    fullName: fullName,
    initials: initials,
    shortSkill: shortSkill,
  };
})();
