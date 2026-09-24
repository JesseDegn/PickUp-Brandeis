// Pickup Brandeis - the Home screen: upcoming pickup basketball games.

window.PB = window.PB || {};
PB.views = PB.views || {};

(function () {
  function render(container) {
    const now = PB.now();
    const profile = PB.storage.getProfile();
    const ctx = { now: now, userId: profile ? profile.id : null };
    const games = PB.storage.getUpcomingGames(now);

    let list;
    if (games.length === 0) {
      list =
        '<div class="empty">' +
        "<p><strong>No upcoming games yet.</strong></p>" +
        "<p>Be the first: create a game and let others join.</p>" +
        '<a class="btn btn--primary" href="#/create">CREATE A GAME</a>' +
        "</div>";
    } else {
      list = '<div class="card-list">' + games.map(function (g) { return PB.gameCard.html(g, ctx); }).join("") + "</div>";
    }

    container.innerHTML =
      PB.header.html({
        title: "Pickup Basketball at Brandeis",
        subtitle: "Find a game. Join in one tap.",
      }) +
      '<div class="page-body"><h2>Upcoming games</h2>' + list + "</div>";
  }

  PB.views.home = { render: render };
})();
