// Pickup Brandeis - the "router": decides which screen to show.
//
// The web address ends in something like "#/home" or "#/game/g-123". The part
// after the "#" tells the router which screen to draw. Because it is only
// the "#" part, the browser's Back button works and the page never reloads.

window.PB = window.PB || {};

(function () {
  let routes = [];
  let screenBox = null;
  let tabBox = null;
  let current = null; // { route, params, hash }
  let previousHash = "";

  // routes: [{ name, pattern (RegExp), tab, title, view }]
  function define(routeList, options) {
    routes = routeList;
    screenBox = options.screen;
    tabBox = options.tabBar;
  }

  function find(hash) {
    for (let i = 0; i < routes.length; i++) {
      const m = hash.match(routes[i].pattern);
      if (m) return { route: routes[i], params: m.slice(1).map(decodeURIComponent) };
    }
    return null;
  }

  // Draws the screen for the current web address.
  // keepScroll = true is used after an action (like Join) so the page does not jump.
  function render(keepScroll) {
    const hash = window.location.hash || "";
    let found = find(hash);
    if (!found) {
      // Unknown address: show Home.
      window.location.replace("#/home");
      return;
    }
    const route = found.route;

    // Remember where a game was opened from, so its Back button returns there.
    if (route.name === "game" && current && (current.route.name === "home" || current.route.name === "my-games")) {
      PB.state.backTo = current.hash;
    }

    const scrollY = window.scrollY;
    document.title = route.title + " · " + PB.config.APP_NAME;

    // The Welcome screen has no tab bar.
    tabBox.hidden = route.tab === null;
    if (route.tab !== null) PB.tabBar.setActive(tabBox, route.tab);

    current = { route: route, params: found.params, hash: hash };
    route.view.render(screenBox, found.params);

    if (keepScroll) {
      window.scrollTo(0, scrollY);
    } else {
      window.scrollTo(0, 0);
      // Move keyboard focus to the new screen so screen readers announce it.
      screenBox.focus({ preventScroll: true });
    }
  }

  function start() {
    window.addEventListener("hashchange", function () {
      previousHash = current ? current.hash : "";
      render(false);
    });
    render(false);
  }

  function navigate(hash) {
    if (window.location.hash === hash) {
      render(false);
    } else {
      window.location.hash = hash;
    }
  }

  // Redraws the current screen (used after joining, leaving, etc.).
  function refresh() {
    render(true);
  }

  function currentHash() {
    return current ? current.hash : "";
  }

  PB.router = {
    define: define,
    start: start,
    navigate: navigate,
    refresh: refresh,
    currentHash: currentHash,
    previousHash: function () {
      return previousHash;
    },
  };
})();
