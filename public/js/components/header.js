// Pickup Brandeis - the navy banner at the top of each screen.

window.PB = window.PB || {};

(function () {
  // options: { title, subtitle, backHref, backLabel }
  function html(options) {
    const back = options.backHref
      ? '<a class="page-header__back" href="' + PB.ui.esc(options.backHref) + '">&#8249; ' + PB.ui.esc(options.backLabel || "Back") + "</a>"
      : "";
    const subtitle = options.subtitle
      ? '<p class="page-header__subtitle">' + PB.ui.esc(options.subtitle) + "</p>"
      : "";
    return (
      '<header class="page-header">' +
      back +
      '<p class="page-header__brand">PICKUP BRANDEIS</p>' +
      "<h1>" + PB.ui.esc(options.title) + "</h1>" +
      subtitle +
      "</header>"
    );
  }

  PB.header = { html: html };
})();
