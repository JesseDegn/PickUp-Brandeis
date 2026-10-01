// Pickup Brandeis - starting point of the app.
// It runs once when the page loads and sets everything up.

window.PB = window.PB || {};

(async function () {
  const screenBox = document.getElementById("screen");
  const tabBarBox = document.getElementById("tab-bar");
  const noticeBox = document.getElementById("notice");

  // 1. Draw the bottom tab bar and list every screen and the web address
  //    that shows it, before we try to load anything - so if loading the
  //    first screen's data fails, the person still sees a working app
  //    shell (tab bar, header) around the error message, not a blank page.
  PB.tabBar.render(tabBarBox, "home");
  PB.router.define(
    [
      { name: "welcome", pattern: /^(?:#\/?|#\/welcome)?$/, tab: null, title: "Welcome", view: PB.views.welcome },
      { name: "home", pattern: /^#\/home$/, tab: "home", title: "Home", view: PB.views.home },
      { name: "create", pattern: /^#\/create$/, tab: "create", title: "Create", view: PB.views.create },
      { name: "my-games", pattern: /^#\/my-games$/, tab: "my-games", title: "My Games", view: PB.views.myGames },
      { name: "profile", pattern: /^#\/profile$/, tab: "profile", title: "Profile", view: PB.views.profile },
      { name: "game", pattern: /^#\/game\/([^/]+)$/, tab: "home", title: "Game Details", view: PB.views.gameDetails },
      // Hidden on purpose: not linked from anywhere in the app. See views/admin.js.
      { name: "admin", pattern: /^#\/admin$/, tab: null, title: "Admin", view: PB.views.admin },
      // Hidden on purpose, same as Admin. See views/founder.js.
      { name: "founder", pattern: /^#\/founder$/, tab: null, title: "Founder Dashboard", view: PB.views.founder },
    ],
    { screen: screenBox, tabBar: tabBarBox }
  );

  // 2. One listener handles every Join / Leave button on every screen.
  screenBox.addEventListener("click", PB.actions.onClick);

  // 3. Tell the person if saving a profile to this device is not possible.
  if (PB.storage.status.usingMemory) {
    noticeBox.hidden = false;
    noticeBox.textContent =
      "Your browser is blocking saved data, so your profile will be forgotten when you close this page.";
  }

  // 4. Show the first screen. (Screens that need the shared games list -
  //    Home, My Games, a game's details, Create - fetch it themselves the
  //    first time they are drawn; see router.js. The Welcome screen needs
  //    nothing from the server, so it appears immediately.)
  await PB.router.start();

  // 5. If the profile saved on this device was damaged, we already quietly
  //    started fresh (see storage.js) - just let the person know.
  if (PB.storage.status.recovered) {
    PB.ui.toast("Some saved data was damaged, so we started fresh.", "error");
    PB.storage.status.recovered = false;
  }
})();
