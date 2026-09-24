// Pickup Brandeis - bottom tab bar (Home, Create, My Games, Profile).
//
// A "component" is a reusable piece of the interface. This one draws the four
// tabs at the bottom of the app and highlights the active one.
//
// Note: the app uses plain <script> files (no build tools), so each file adds
// what it offers to one shared object called "PB" (short for Pickup Brandeis).
// This also means you can test the app by double-clicking index.html.

window.PB = window.PB || {};

(function () {
  // Simple line icons drawn as SVG (small vector pictures). They use
  // "currentColor", so they automatically match the tab's text color.
  const ICONS = {
    home:
      '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    create:
      '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    myGames:
      '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4V3h6v1"/><path d="M8.5 10h7M8.5 14h7M8.5 18h4"/>',
    profile:
      '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c.8-4 3.7-6 7.5-6s6.7 2 7.5 6"/>',
  };

  // The four main sections. "route" is the web address fragment each one uses.
  const TABS = [
    { id: "home", label: "Home", route: "#/home", icon: ICONS.home },
    { id: "create", label: "Create", route: "#/create", icon: ICONS.create },
    { id: "my-games", label: "My Games", route: "#/my-games", icon: ICONS.myGames },
    { id: "profile", label: "Profile", route: "#/profile", icon: ICONS.profile },
  ];

  // Draws the tab bar inside `container` with `activeId` highlighted.
  function render(container, activeId) {
    const links = TABS.map(function (tab) {
      const isActive = tab.id === activeId;
      return (
        '<a class="tab' + (isActive ? " tab--active" : "") + '"' +
        ' href="' + tab.route + '"' +
        ' data-tab="' + tab.id + '"' +
        (isActive ? ' aria-current="page"' : "") + ">" +
        '<svg class="tab__icon" viewBox="0 0 24 24" width="24" height="24" fill="none"' +
        ' stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
        ' stroke-linejoin="round" aria-hidden="true">' + tab.icon + "</svg>" +
        '<span class="tab__label">' + tab.label + "</span>" +
        "</a>"
      );
    }).join("");

    container.innerHTML = '<nav class="tab-bar" aria-label="Main">' + links + "</nav>";
  }

  // Moves the highlight to a different tab without redrawing everything.
  function setActive(container, activeId) {
    container.querySelectorAll(".tab").forEach(function (link) {
      const isActive = link.dataset.tab === activeId;
      link.classList.toggle("tab--active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  window.PB.tabBar = { render: render, setActive: setActive, TABS: TABS };
})();
