// Pickup Brandeis - My Games: games I joined and games I created.

window.PB = window.PB || {};
PB.views = PB.views || {};

(function () {
  function section(title, games, ctx, emptyTitle, emptyText, buttonHref, buttonLabel) {
    let body;
    if (games.length === 0) {
      body =
        '<div class="empty"><p><strong>' + PB.ui.esc(emptyTitle) + "</strong></p><p>" + PB.ui.esc(emptyText) + "</p>" +
        '<a class="btn btn--primary" href="' + buttonHref + '">' + PB.ui.esc(buttonLabel) + "</a></div>";
    } else {
      body = '<div class="card-list">' + games.map(function (g) { return PB.gameCard.html(g, ctx); }).join("") + "</div>";
    }
    return "<section><h2>" + PB.ui.esc(title) + "</h2>" + body + "</section>";
  }

  function render(container) {
    const header = PB.header.html({ title: "My Games", subtitle: "Everything you're playing in." });
    const profile = PB.storage.getProfile();

    if (!profile) {
      container.innerHTML =
        header +
        '<div class="page-body"><div class="empty">' +
        "<p><strong>Create your profile to see your games.</strong></p>" +
        "<p>Once you have a profile, the games you join or create will show up here.</p>" +
        '<a class="btn btn--primary" href="#/profile">CREATE PROFILE</a></div></div>';
      return;
    }

    const now = PB.now();
    const ctx = { now: now, userId: profile.id };
    const mine = PB.storage.getMyGames(profile.id, now);

    container.innerHTML =
      header +
      '<div class="page-body">' +
      section("Games I'm Joining", mine.joining, ctx,
        "You haven't joined any games yet.", "Browse upcoming games and tap Join.", "#/home", "FIND A GAME") +
      section("Games I Created", mine.created, ctx,
        "You haven't created a game yet.", "Tap Create to start one.", "#/create", "CREATE A GAME") +
      "</div>";
  }

  PB.views.myGames = { render: render };
})();
