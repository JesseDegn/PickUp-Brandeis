// Pickup Brandeis - the game card shown on Home and My Games,
// plus the Join / Leave / FULL button that Game Details reuses.

window.PB = window.PB || {};

(function () {
  const esc = PB.ui.esc;

  // A short phrase describing a game, for screen readers on buttons.
  function describe(game, now) {
    return PB.format.formatWhen(game, now) + " at " + game.location;
  }

  // The big button. Its wording depends on whether the person is in the
  // game, or whether the game is full. The word FULL is written out, so the
  // state never relies on color alone.
  function actionButton(game, ctx) {
    const label = describe(game, ctx.now);
    if (PB.storage.isJoined(game, ctx.userId)) {
      return (
        '<button type="button" class="btn btn--outline" data-action="leave" data-id="' + esc(game.id) + '"' +
        ' aria-label="Leave game: ' + esc(label) + '">LEAVE GAME</button>'
      );
    }
    if (PB.storage.isFull(game)) {
      return (
        '<button type="button" class="btn btn--disabled" disabled' +
        ' aria-label="This game is full: ' + esc(label) + '">FULL</button>'
      );
    }
    return (
      '<button type="button" class="btn btn--primary" data-action="join" data-id="' + esc(game.id) + '"' +
      ' aria-label="Join game: ' + esc(label) + '">JOIN GAME</button>'
    );
  }

  // Whole card. ctx = { now, userId }
  function html(game, ctx) {
    const players = game.playerIds.map(PB.storage.getPlayer);
    const chipClass = game.skill === "Advanced" ? "chip chip--dark" : "chip";
    return (
      '<article class="game-card" data-game-id="' + esc(game.id) + '">' +
      '<div class="game-card__top">' +
      '<h3 class="game-card__title"><a class="game-card__link" href="#/game/' + encodeURIComponent(game.id) + '">' +
      "<span aria-hidden=\"true\">&#127936;</span> Pickup Basketball</a></h3>" +
      '<span class="' + chipClass + '">' + esc(PB.format.shortSkill(game.skill)) + "</span>" +
      "</div>" +
      '<p class="game-card__when">' + esc(PB.format.formatWhen(game, ctx.now)) + "</p>" +
      '<p class="game-card__where"><span aria-hidden="true">&#128205;</span> ' + esc(game.location) + "</p>" +
      '<div class="game-card__players">' +
      PB.avatar.row(players, 4) +
      '<span class="game-card__count">' + game.playerIds.length + " / " + game.maxPlayers + " players confirmed</span>" +
      "</div>" +
      actionButton(game, ctx) +
      "</article>"
    );
  }

  PB.gameCard = { html: html, actionButton: actionButton, describe: describe };
})();
