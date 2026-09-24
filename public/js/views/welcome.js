// Pickup Brandeis - the Welcome screen (shown when the app first opens).
// The owl and the judge are simple original drawings made from basic shapes,
// not official mascot artwork.

window.PB = window.PB || {};
PB.views = PB.views || {};

(function () {
  const OWL =
    '<svg class="welcome__owl" viewBox="0 0 130 150" width="130" height="150" aria-hidden="true" focusable="false">' +
    '<circle cx="35" cy="17" r="17" fill="#f5edd9"/><circle cx="95" cy="17" r="17" fill="#f5edd9"/>' +
    '<ellipse cx="65" cy="83" rx="55" ry="65" fill="#f5edd9"/>' +
    '<circle cx="39" cy="67" r="25" fill="#ffffff"/><circle cx="91" cy="67" r="25" fill="#ffffff"/>' +
    '<circle cx="39" cy="67" r="13" fill="#051029"/><circle cx="91" cy="67" r="13" fill="#051029"/>' +
    '<circle cx="43" cy="62" r="4" fill="#ffffff"/><circle cx="95" cy="62" r="4" fill="#ffffff"/>' +
    '<path d="M55 100h20l-10 17z" fill="#facc40"/>' +
    '<ellipse cx="40" cy="128" rx="15" ry="8" fill="#9ec7ff"/><ellipse cx="90" cy="128" rx="15" ry="8" fill="#9ec7ff"/>' +
    "</svg>";

  const JUDGE =
    '<svg class="welcome__judge" viewBox="0 0 120 150" width="120" height="150" aria-hidden="true" focusable="false">' +
    '<rect x="10" y="66" width="100" height="84" rx="40" fill="#334d8c"/>' +
    '<rect x="46" y="60" width="28" height="40" rx="6" fill="#ffffff"/>' +
    '<circle cx="60" cy="36" r="30" fill="#f2c79e"/>' +
    '<circle cx="30" cy="14" r="10" fill="#ffffff"/><circle cx="90" cy="14" r="10" fill="#ffffff"/>' +
    '<circle cx="23" cy="33" r="11" fill="#ffffff"/><circle cx="97" cy="33" r="11" fill="#ffffff"/>' +
    '<ellipse cx="60" cy="7" rx="25" ry="7" fill="#ffffff"/>' +
    '<circle cx="48" cy="34" r="3.5" fill="#051029"/><circle cx="72" cy="34" r="3.5" fill="#051029"/>' +
    '<rect x="50" y="46" width="20" height="4" rx="2" fill="#051029"/>' +
    '<rect x="96" y="86" width="6" height="44" rx="3" fill="#f5edd9" transform="rotate(-30 96 86)"/>' +
    '<rect x="88" y="68" width="30" height="14" rx="4" fill="#facc40" transform="rotate(-30 88 68)"/>' +
    "</svg>";

  function render(container) {
    container.innerHTML =
      '<section class="welcome" aria-labelledby="welcome-title">' +
      '<div class="welcome__badge"><img src="images/brandeis-seal.png" width="110" height="110" alt="Brandeis University seal"></div>' +
      '<div class="welcome__center">' +
      '<h1 id="welcome-title" class="welcome__title"><span class="welcome__line1">PICKUP</span><span class="welcome__line2">BRANDEIS</span></h1>' +
      '<p class="welcome__tagline">Find or create pickup games</p>' +
      '<a class="welcome__play" href="#/home">PLAY</a>' +
      "</div>" +
      OWL +
      JUDGE +
      "</section>";
  }

  PB.views.welcome = { render: render };
})();
