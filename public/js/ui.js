// Pickup Brandeis - small helpers used by many screens.

window.PB = window.PB || {};

// Shared memory for things screens need to pass to each other.
PB.state = {
  returnTo: null, // where to go after saving a profile (e.g. back to a game)
  notice: null, // a message to show on the next Profile screen
  backTo: "#/home", // where the Back button on Game Details goes
};

(function () {
  // Makes text safe to place inside HTML. ALWAYS use this for anything a
  // person typed (names, descriptions), so it can never be treated as code.
  function esc(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  let toastTimer = null;

  // A short message near the bottom of the screen ("Game created!").
  // `kind` is "success" or "error". It is announced to screen readers.
  function toast(message, kind) {
    const box = document.getElementById("toast");
    if (!box) return;
    box.textContent = message;
    box.className = "toast toast--visible toast--" + (kind || "success");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      box.className = "toast";
    }, 4200);
  }

  PB.ui = { esc: esc, toast: toast };
})();
