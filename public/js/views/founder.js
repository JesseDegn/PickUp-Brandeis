// Pickup Brandeis - the Founder dashboard (hidden, passcode only, read-only).
//
// This is NOT part of the normal app flow - like the Admin screen, there is
// no button that leads here on purpose, and it is not one of the four main
// tabs. Open it by typing "#/founder" at the end of the web address and
// entering the same admin passcode (see src/worker.js and DEPLOY_ACCOUNTS.md).
//
// Every number on this screen is computed fresh from the live, shared
// database every time the screen loads - nothing here is tracked, stored, or
// written. It cannot change or delete anything; it only reads. See
// DASHBOARD_SPEC.md for exactly what each signal means, where the numbers
// come from, and what they do NOT tell you.
//
// The passcode is kept only in this browser tab's memory, never saved to
// disk, same as the Admin screen - closing the tab means typing it again.

window.PB = window.PB || {};
PB.views = PB.views || {};

(function () {
  const esc = PB.ui.esc;
  let passcode = null; // remembered only for this tab, only in memory

  // --- Feedback & next experiment log -------------------------------------
  // This panel is manually maintained, not automatically collected - per the
  // dashboard brief, a founder's own observation from talking to a real user
  // is valid evidence, as long as it's labeled as manual rather than passed
  // off as measured data. To add an entry: add an object to this array (copy
  // the commented-out shape below) and redeploy. Nothing here is user-facing
  // and nothing here is written anywhere automatically.
  const FEEDBACK_LOG = [
    // {
    //   date: "2026-10-01",
    //   observed: "What a real person told you, or what you noticed them do.",
    //   relatesTo: "Which signal above it relates to, if any (or \"none yet\").",
    //   change: "The smallest next experiment or fix you'd try because of it.",
    //   wouldCount: "What result would tell you the experiment worked.",
    // },
  ];

  function render(container) {
    const header = PB.header.html({ title: "Founder Dashboard", subtitle: "Live, read-only. Staff only.", backHref: "#/profile", backLabel: "Back" });
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
      '<form class="card form" id="founder-login">' +
      '<div class="field"><label for="founder-passcode">Admin passcode</label>' +
      '<input id="founder-passcode" name="passcode" type="password" autocomplete="off" aria-describedby="founder-login-error">' +
      '<p class="field-error" id="founder-login-error" role="alert">' + esc(error || "") + "</p></div>" +
      '<button type="submit" class="btn btn--primary">VIEW DASHBOARD</button>' +
      "</form></div>";

    const form = container.querySelector("#founder-login");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const typed = form.passcode.value;
      const submitButton = form.querySelector("button[type=submit]");
      submitButton.disabled = true;
      try {
        await PB.storage.founderOverview(typed); // just a check - throws if wrong
        passcode = typed;
        loadDashboard(container, header);
      } catch (e) {
        submitButton.disabled = false;
        renderLogin(container, header, e.message);
        const input = container.querySelector("#founder-passcode");
        if (input) input.focus();
      }
    });
  }

  async function loadDashboard(container, header) {
    container.innerHTML = header + '<div class="page-body"><p class="muted" role="status">Loading…</p></div>';
    let data;
    try {
      data = await PB.storage.founderOverview(passcode);
    } catch (e) {
      // The passcode may have been correct a moment ago but is not any more
      // (or the server had a problem) - ask again rather than get stuck.
      passcode = null;
      renderLogin(container, header, e.message);
      return;
    }
    renderDashboard(container, header, data);
  }

  // Formats a count-over-count rate honestly: a zero denominator is "No data
  // yet," never 0% or NaN%, because those mean different things.
  function rateText(numerator, denominator) {
    if (!denominator) return "No data yet";
    return Math.round((numerator / denominator) * 100) + "%";
  }

  function evidenceCard(opts) {
    return (
      '<div class="card evidence-card">' +
      '<p class="evidence-card__value">' + esc(opts.value) + "</p>" +
      '<p class="evidence-card__label">' + esc(opts.label) + "</p>" +
      '<p class="evidence-card__def">' + esc(opts.definition) + "</p>" +
      '<p class="evidence-card__meta">' + esc(opts.source) + " · " + esc(opts.window) + "</p>" +
      "</div>"
    );
  }

  function funnelStep(label, count, max) {
    // A true zero shows as an empty bar, not a thin sliver - a sliver would
    // visually claim "a little happened" when nothing did. Only a genuinely
    // nonzero count gets the minimum-visible-width floor.
    const pct = count === 0 || max === 0 ? 0 : Math.max(4, Math.round((count / max) * 100));
    return (
      '<div class="funnel-step">' +
      '<div class="funnel-step__top"><span>' + esc(label) + '</span><span class="funnel-step__count">' + esc(count) + "</span></div>" +
      '<div class="funnel-step__bar"><div class="funnel-step__fill" style="width:' + pct + '%"></div></div>' +
      "</div>"
    );
  }

  function breakdownList(rows, nameKey, emptyText) {
    if (!rows.length) return '<p class="muted">' + esc(emptyText) + "</p>";
    const max = rows[0].count;
    return (
      '<div class="breakdown-list">' +
      rows
        .map(function (r) {
          const pct = max > 0 ? Math.max(4, Math.round((r.count / max) * 100)) : 0;
          return (
            '<div class="breakdown-row">' +
            '<div class="breakdown-row__top"><span>' + esc(r[nameKey]) + '</span><span>' + esc(r.count) + "</span></div>" +
            '<div class="breakdown-row__bar"><div class="breakdown-row__fill" style="width:' + pct + '%"></div></div>' +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function feedbackSection() {
    if (!FEEDBACK_LOG.length) {
      return (
        '<section class="card" aria-labelledby="feedback-title">' +
        '<h2 id="feedback-title">Feedback &amp; next experiment</h2>' +
        '<p class="muted">No peer or user feedback logged yet. This section is filled in by hand, not collected automatically - see the FEEDBACK_LOG note in founder.js.</p>' +
        "</section>"
      );
    }
    const entries = FEEDBACK_LOG.slice()
      .reverse()
      .map(function (entry) {
        return (
          '<div class="feedback-entry">' +
          '<p class="feedback-entry__date muted">' + esc(entry.date) + " · manual observation · relates to: " + esc(entry.relatesTo) + "</p>" +
          "<p><strong>Observed:</strong> " + esc(entry.observed) + "</p>" +
          "<p><strong>Next experiment:</strong> " + esc(entry.change) + "</p>" +
          "<p><strong>Would count as working if:</strong> " + esc(entry.wouldCount) + "</p>" +
          "</div>"
        );
      })
      .join("");
    return (
      '<section class="card" aria-labelledby="feedback-title">' +
      '<h2 id="feedback-title">Feedback &amp; next experiment</h2>' +
      entries +
      "</section>"
    );
  }

  function renderDashboard(container, header, data) {
    const generated = new Date(data.generatedAt);
    const asOf = isNaN(generated.getTime()) ? "just now" : generated.toLocaleString();

    const reachValue = data.reach.totalPlayers === 0 ? "No data yet" : rateText(data.reach.engagedPlayers, data.reach.totalPlayers);
    const fillValue = data.fillRate.totalGames === 0 ? "No data yet" : rateText(data.fillRate.fullGames, data.fillRate.totalGames);
    const repeatValue = data.repeatUse.engagedPlayers === 0 ? "No data yet" : rateText(data.repeatUse.repeatPlayers, data.repeatUse.engagedPlayers);

    const overview =
      '<div class="card-list">' +
      evidenceCard({
        value: reachValue,
        label: "Signed up → currently in a game (" + data.reach.engagedPlayers + " / " + data.reach.totalPlayers + " players)",
        definition: "Of everyone who has saved a profile, the share currently joined to or the creator of at least one still-existing game. Blind spot: leaving a game erases the record of having joined it, so someone who tried the app and then left isn't counted here - this can only undercount real trial, never overcount it.",
        source: "Source: players + game_players tables",
        window: "Window: right now, not “ever”",
      }) +
      evidenceCard({
        value: fillValue,
        label: "Games that are currently full (" + data.fillRate.fullGames + " / " + data.fillRate.totalGames + " games)",
        definition: "Of games that currently exist, the share with as many confirmed players as they asked for right now. A game that filled up and was later deleted (by its creator, or automatically once everyone left) is not counted here - see the known blind spot below.",
        source: "Source: games + game_players tables (current snapshot)",
        window: "Window: right now, existing games only",
      }) +
      evidenceCard({
        value: repeatValue,
        label: "Came back on a later day (" + data.repeatUse.repeatPlayers + " / " + data.repeatUse.engagedPlayers + " players)",
        definition: "Of players currently in at least one game, the share whose remaining records span two or more different calendar dates. This is the number you said matters most: are people coming back, not just trying it once. Blind spot: leaving erases the date of that visit, so someone who joined, left, and joined again later can still show as only one date - like the signal above, this can only undercount real repeat use, never overcount it.",
        source: "Source: game_players.joined_at timestamps",
        window: "Window: right now, not “ever”",
      }) +
      '<div class="card evidence-card evidence-card--gap">' +
      '<p class="evidence-card__label">Trust / no-shows</p>' +
      '<p class="evidence-card__def">Not measurable yet. Nothing in the app currently records whether someone actually showed up, and leaving a game deletes the record rather than keeping a history of it. Ask real users directly about this for now; see DASHBOARD_SPEC.md for the smallest addition that would start measuring it.</p>' +
      "</div>" +
      "</div>";

    const maxFunnel = data.reach.totalPlayers;
    const journey =
      '<section class="card" aria-labelledby="journey-title">' +
      '<h2 id="journey-title">User journey</h2>' +
      '<p class="muted">Where people drop off between signing up and coming back.</p>' +
      '<div class="funnel">' +
      funnelStep("Signed up", data.reach.totalPlayers, maxFunnel) +
      funnelStep("Currently in a game", data.reach.engagedPlayers, maxFunnel) +
      funnelStep("On two or more different days", data.repeatUse.repeatPlayers, maxFunnel) +
      "</div>" +
      "</section>";

    const breakdown =
      '<section class="card" aria-labelledby="breakdown-title">' +
      '<h2 id="breakdown-title">Where activity concentrates</h2>' +
      '<p class="muted">Created games by location and skill level - useful context for the "add another sport" decision, not proof by itself.</p>' +
      "<h3>By location</h3>" +
      breakdownList(data.breakdown.byLocation, "location", "No games yet.") +
      "<h3>By skill level</h3>" +
      breakdownList(data.breakdown.bySkill, "skill", "No games yet.") +
      "</section>";

    container.innerHTML =
      header +
      '<div class="page-body">' +
      '<p class="muted" role="status">As of ' + esc(asOf) + ". Refreshes every time you open this page.</p>" +
      overview +
      journey +
      breakdown +
      feedbackSection() +
      '<div class="button-row"><button type="button" class="btn btn--outline" id="founder-logout">LOG OUT</button></div>' +
      "</div>";

    container.querySelector("#founder-logout").addEventListener("click", function () {
      passcode = null;
      render(container);
    });
  }

  PB.views.founder = { render: render };
})();
