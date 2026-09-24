// Pickup Brandeis - small round "avatar" circles showing player initials.

window.PB = window.PB || {};

(function () {
  // A few blues from the Brandeis-inspired palette. A person always gets the
  // same color, based on their id.
  const COLORS = ["#1a5fe6", "#0b1f4b", "#3b6fc4", "#2a4a8f", "#164a9e", "#4f7fd6"];

  function colorFor(id) {
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    return COLORS[sum % COLORS.length];
  }

  // One circle. The initials are decoration; the real names are listed
  // elsewhere for screen readers, so this is hidden from them.
  function circle(player) {
    return (
      '<span class="avatar" style="background:' + colorFor(player.id) + '" aria-hidden="true">' +
      PB.ui.esc(PB.format.initials(player)) +
      "</span>"
    );
  }

  // An overlapping row of circles (max `limit`, then "+N").
  function row(players, limit) {
    const shown = players.slice(0, limit);
    const extra = players.length - shown.length;
    const names = players.map(PB.format.fullName).join(", ");
    let html = '<span class="avatar-row" role="img" aria-label="Players: ' + PB.ui.esc(names || "none yet") + '">';
    html += shown.map(circle).join("");
    if (extra > 0) html += '<span class="avatar avatar--more" aria-hidden="true">+' + extra + "</span>";
    html += "</span>";
    return html;
  }

  PB.avatar = { circle: circle, row: row };
})();
