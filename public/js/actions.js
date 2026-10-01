// Pickup Brandeis - what happens when someone taps Join or Leave.

window.PB = window.PB || {};

(function () {
  const REASONS = {
    full: "Sorry, this game just filled up.",
    already: "You already joined this game.",
    started: "This game has already started.",
    "not-found": "This game could not be found.",
    "not-joined": "You are not in this game.",
  };

  // Returns the saved profile, or sends the person to the Profile screen
  // (with a message) and returns null. After they save their profile the app
  // brings them back to where they were.
  function requireProfile(message) {
    const profile = PB.storage.getProfile();
    if (profile) return profile;
    PB.state.returnTo = PB.router.currentHash();
    PB.state.notice = message;
    PB.router.navigate("#/profile");
    return null;
  }

  async function join(gameId, button) {
    const profile = requireProfile("Create your profile to join games.");
    if (!profile) return;
    if (button) button.disabled = true;
    try {
      const result = await PB.storage.joinGame(gameId, profile.id);
      if (result.ok) {
        PB.ui.toast("You're in! See you on the court.", "success");
      } else {
        PB.ui.toast(REASONS[result.reason] || "Something went wrong.", "error");
      }
    } catch (e) {
      PB.ui.toast(e.message, "error");
    }
    PB.router.refresh(); // redraw right away so counts are correct
  }

  async function leave(gameId, button) {
    const profile = requireProfile("Create your profile to join games.");
    if (!profile) return;
    if (button) button.disabled = true;
    try {
      const result = await PB.storage.leaveGame(gameId, profile.id);
      if (result.ok) {
        PB.ui.toast(result.deleted ? "You left the game. Since no one was left, it was removed." : "You left the game.", "success");
      } else {
        PB.ui.toast(REASONS[result.reason] || "Something went wrong.", "error");
      }
    } catch (e) {
      PB.ui.toast(e.message, "error");
    }
    PB.router.refresh();
  }

  // One listener on the whole screen handles every Join / Leave button.
  function onClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action === "join") join(button.dataset.id, button);
    if (action === "leave") leave(button.dataset.id, button);
  }

  PB.actions = { requireProfile: requireProfile, join: join, leave: leave, onClick: onClick };
})();
