// Pickup Brandeis - the Admin screen (hidden dashboard, passcode only).
//
// This is NOT part of the normal app flow - there is no button that leads
// here on purpose, and it is not one of the four main tabs. A staff member
// (or the professor) opens it by typing "#/admin" at the end of the web
// address. It asks for a passcode that only lives on the server (see
// src/worker.js and the ADMIN_PASSCODE note in DEPLOY_ACCOUNTS.md) - anyone
// who does not know it just sees "That passcode is not right."
//
// On purpose, the passcode is kept only in this browser tab's memory (a
// plain variable below), never saved to disk. Closing the tab or reloading
// the page means typing it again.

window.PB = window.PB || {};
PB.views = PB.views || {};

(function () {
  const esc = PB.ui.esc;
  let passcode = null; // remembered only for this tab, only in memory

  function render(container) {
    const header = PB.header.html({ title: "Admin", subtitle: "Staff only.", backHref: "#/profile", backLabel: "Back" });
    if (!passcode) {
      renderLogin(container, header, "");
      return;
    }
    loadDashboard(container, header);
  }

  function renderLogin(container, header, error) {
    container.innerHTML =
      header +
      '<div class="page-body">' +
      '<form class="card form" id="admin-login">' +
      '<div class="field"><label for="admin-passcode">Admin passcode</label>' +
      '<input id="admin-passcode" name="passcode" type="password" autocomplete="off" aria-describedby="admin-login-error">' +
      '<p class="field-error" id="admin-login-error" role="alert">' + esc(error || "") + "</p></div>" +
      '<button type="submit" class="btn btn--primary">VIEW DASHBOARD</button>' +
      "</form></div>";

    const form = container.querySelector("#admin-login");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const typed = form.passcode.value;
      const submitButton = form.querySelector("button[type=submit]");
      submitButton.disabled = true;
      try {
        await PB.storage.adminOverview(typed); // just a check - throws if wrong
        passcode = typed;
        loadDashboard(container, header);
      } catch (e) {
        submitButton.disabled = false;
        renderLogin(container, header, e.message);
        const input = container.querySelector("#admin-passcode");
        if (input) input.focus();
      }
    });
  }

  async function loadDashboard(container, header) {
    container.innerHTML = header + '<div class="page-body"><p class="muted" role="status">Loading…</p></div>';
    let data;
    try {
      data = await PB.storage.adminOverview(passcode);
    } catch (e) {
      // The passcode may have been correct a moment ago but is not any
      // more (or the server had a problem) - ask again rather than get stuck.
      passcode = null;
      renderLogin(container, header, e.message);
      return;
    }
    renderDashboard(container, header, data);
  }

  function statCard(label, value) {
    return '<div class="stat"><p class="stat__value">' + esc(value) + '</p><p class="stat__label">' + esc(label) + "</p></div>";
  }

  function gameRow(game) {
    const when = PB.format.formatWhen(game, PB.now());
    return (
      '<div class="card admin-game">' +
      '<div class="admin-game__info">' +
      "<p><strong>" + esc(game.location) + "</strong> · " + esc(when) + "</p>" +
      '<p class="muted">' + esc(game.players.length) + "/" + esc(game.maxPlayers) + " players · created by " +
      esc(game.creator.firstName + " " + game.creator.lastName) + "</p>" +
      "</div>" +
      '<div class="admin-game__actions" data-game-id="' + esc(game.id) + '">' +
      '<button type="button" class="btn btn--outline" data-admin-action="remove-start">REMOVE</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderDashboard(container, header, data) {
    const stats = data.stats;
    const games = data.games.slice().sort(function (a, b) {
      return PB.format.startOf(a) - PB.format.startOf(b);
    });

    const gamesList = games.length
      ? games.map(gameRow).join("")
      : '<div class="empty"><p><strong>No games yet.</strong></p></div>';

    container.innerHTML =
      header +
      '<div class="page-body">' +
      '<div class="stat-grid">' +
      statCard("Players", stats.playerCount) +
      statCard("Games", stats.gameCount) +
      statCard("Joins", stats.joinCount) +
      "</div>" +
      '<div class="button-row"><button type="button" class="btn btn--outline" id="admin-logout">LOG OUT</button></div>' +
      "<h2>All games</h2>" +
      gamesList +
      "</div>";

    container.querySelector("#admin-logout").addEventListener("click", function () {
      passcode = null;
      render(container);
    });

    container.querySelectorAll("[data-admin-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        onAdminAction(container, header, button);
      });
    });
  }

  function onAdminAction(container, header, button) {
    const actionsBox = button.closest("[data-game-id]");
    const gameId = actionsBox.dataset.gameId;
    const action = button.dataset.adminAction;

    if (action === "remove-start") {
      actionsBox.innerHTML =
        '<p role="alert"><strong>Remove this game?</strong> This cannot be undone.</p>' +
        '<div class="button-row"><button type="button" class="btn btn--danger" data-admin-action="remove-yes">YES, REMOVE</button>' +
        '<button type="button" class="btn btn--outline" data-admin-action="remove-no">CANCEL</button></div>';
      actionsBox.querySelectorAll("[data-admin-action]").forEach(function (b) {
        b.addEventListener("click", function () { onAdminAction(container, header, b); });
      });
      return;
    }
    if (action === "remove-no") {
      loadDashboard(container, header);
      return;
    }
    if (action === "remove-yes") {
      button.disabled = true;
      PB.storage
        .adminDeleteGame(gameId, passcode)
        .then(function () {
          PB.ui.toast("Game removed.", "success");
          loadDashboard(container, header);
        })
        .catch(function (e) {
          PB.ui.toast(e.message, "error");
          loadDashboard(container, header);
        });
    }
  }

  PB.views.admin = { render: render };
})();
