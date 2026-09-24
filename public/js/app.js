// Pickup Brandeis - starting point of the app.
// It runs once when the page loads and sets everything up.

window.PB = window.PB || {};

(function () {
  const screenBox = document.getElementById("screen");
  const tabBarBox = document.getElementById("tab-bar");
  const noticeBox = document.getElementById("notice");

  // 1. Load (or create) the saved data: sample players and games.
  PB.storage.init(PB.now());

  // 2. Tell the person if saving is not possible or old data was damaged.
  if (PB.storage.status.usingMemory) {
    noticeBox.hidden = false;
    noticeBox.textContent =
      "Your browser is blocking saved data, so your changes will be lost when you close this page.";
  } else if (PB.storage.status.recovered) {
    PB.ui.toast("Some saved data was damaged, so we started fresh.", "error");
    PB.storage.status.recovered = false;
  }

  // 3. Draw the bottom tab bar.
  PB.tabBar.render(tabBarBox, "home");

  // 4. List every screen and the web address that shows it.
  PB.router.define(
    [
      { name: "welcome", pattern: /^(?:#\/?|#\/welcome)?$/, tab: null, title: "Welcome", view: PB.views.welcome },
      { name: "home", pattern: /^#\/home$/, tab: "home", title: "Home", view: PB.views.home },
      { name: "create", pattern: /^#\/create$/, tab: "create", title: "Create", view: PB.views.create },
      { name: "my-games", pattern: /^#\/my-games$/, tab: "my-games", title: "My Games", view: PB.views.myGames },
      { name: "profile", pattern: /^#\/profile$/, tab: "profile", title: "Profile", view: PB.views.profile },
      { name: "game", pattern: /^#\/game\/([^/]+)$/, tab: "home", title: "Game Details", view: PB.views.gameDetails },
    ],
    { screen: screenBox, tabBar: tabBarBox }
  );

  // 5. One listener handles every Join / Leave button on every screen.
  screenBox.addEventListener("click", PB.actions.onClick);

  // 6. Show the first screen.
  PB.router.start();
})();
