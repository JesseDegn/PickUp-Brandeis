// Pickup Brandeis - the Game Details screen.

window.PB = window.PB || {};
PB.views = PB.views || {};

(function () {
  const esc = PB.ui.esc;

  function row(label, value) {
    return '<div class="info-row"><dt>' + esc(label) + "</dt><dd>" + esc(value) + "</dd></div>";
  }

  function render(container, params) {
    const now = PB.now();
    const game = PB.storage.getGame(params[0]);
    const header = { title: "Game Details", backHref: PB.state.backTo || "#/home", backLabel: "Back" };

    if (!game) {
      container.innerHTML =
        PB.header.html(header) +
        '<div class="page-body"><div class="empty">' +
        "<p><strong>This game could not be found.</strong></p>" +
        "<p>It may have been removed, or the link is not right.</p>" +
        '<a class="btn btn--primary" href="#/home">BACK TO HOME</a></div></div>';
      return;
    }

    const profile = PB.storage.getProfile();
    const ctx = { now: now, userId: profile ? profile.id : null };
    const started = PB.storage.hasStarted(game, now);
    const players = game.playerIds.map(PB.storage.getPlayer);
    const creator = PB.storage.getPlayer(game.creatorId);
    const gameOn = game.playerIds.length >= game.maxPlayers;

    header.subtitle = PB.format.formatWhen(game, now);

    const banner = gameOn
      ? '<div class="banner banner--on" role="status"><span aria-hidden="true">&#10003;</span> GAME ON — Enough players confirmed</div>'
      : "";

    const info =
      '<dl class="card info-card">' +
      row("Date", PB.format.longDate(game.date)) +
      row("Start time", PB.format.formatTime(game.time)) +
      row("Location", game.location) +
      row("Skill level", game.skill) +
      row("Players needed", String(game.maxPlayers)) +
      row("Confirmed", game.playerIds.length + " / " + game.maxPlayers) +
      row("Created by", PB.format.fullName(creator)) +
      "</dl>";

    const description = game.description
      ? '<section class="card"><h2>About this game</h2><p class="muted">' + esc(game.description) + "</p></section>"
      : "";

    const playerItems = players
      .map(function (p) {
        const organizer = p.id === game.creatorId ? '<span class="tag">Organizer</span>' : "";
        return (
          '<li class="player">' + PB.avatar.circle(p) +
          '<span class="player__name">' + esc(PB.format.fullName(p)) + "</span>" + organizer + "</li>"
        );
      })
      .join("");
    const playerList =
      '<section class="card"><h2>Confirmed players (' + game.playerIds.length + ")</h2>" +
      (players.length ? '<ul class="player-list">' + playerItems + "</ul>" : '<p class="muted">No one has joined yet.</p>') +
      "</section>";

    const action = started
      ? '<div class="banner banner--info" role="status">This game has already started.</div>'
      : PB.gameCard.actionButton(game, ctx);

    container.innerHTML =
      PB.header.html(header) +
      '<div class="page-body">' + banner + info + description + playerList + action + "</div>";
  }

  PB.views.gameDetails = { render: render };
})();
