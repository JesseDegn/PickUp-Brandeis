// Pickup Brandeis - the Create screen: start a new pickup basketball game.

window.PB = window.PB || {};
PB.views = PB.views || {};

(function () {
  const esc = PB.ui.esc;
  const C = PB.config;

  function render(container) {
    // You need a profile to create a game.
    if (!PB.actions.requireProfile("Create your profile before creating a game.")) return;

    const now = PB.now();
    const today = PB.format.toDateString(now);

    const locationOptions = C.LOCATIONS.map(function (loc, i) {
      return '<option value="' + esc(loc) + '"' + (i === 0 ? " selected" : "") + ">" + esc(loc) + "</option>";
    }).join("");

    const skillChips = C.GAME_SKILLS.map(function (s) {
      const checked = s === "All skill levels" ? " checked" : "";
      return '<label class="choice"><input type="radio" name="skill" value="' + esc(s) + '"' + checked + "><span>" + esc(s) + "</span></label>";
    }).join("");

    container.innerHTML =
      PB.header.html({ title: "Create a Game", subtitle: "Takes under a minute." }) +
      '<div class="page-body">' +
      '<form class="card form" id="create-form" novalidate>' +
      '<div class="field"><label for="date">Date</label>' +
      '<input id="date" name="date" type="date" value="' + today + '" min="' + today + '" aria-describedby="err-date">' +
      '<p class="field-error" id="err-date" role="alert"></p></div>' +
      '<div class="field"><label for="time">Start time</label>' +
      '<input id="time" name="time" type="time" aria-describedby="err-time">' +
      '<p class="field-error" id="err-time" role="alert"></p></div>' +
      '<div class="field"><label for="location">Location</label>' +
      '<select id="location" name="location" aria-describedby="err-location">' + locationOptions + "</select>" +
      '<p class="field-error" id="err-location" role="alert"></p></div>' +
      '<div class="field" id="other-field" hidden><label for="otherLocation">Location name</label>' +
      '<input id="otherLocation" name="otherLocation" type="text" autocomplete="off" maxlength="' + C.OTHER_LOCATION_MAX + '" aria-describedby="err-otherLocation">' +
      '<p class="field-error" id="err-otherLocation" role="alert"></p></div>' +
      '<fieldset class="field" aria-describedby="err-skill"><legend>Skill level</legend>' +
      '<div class="chip-group">' + skillChips + "</div>" +
      '<p class="field-error" id="err-skill" role="alert"></p></fieldset>' +
      '<div class="field"><label for="maxPlayers">Desired number of players</label>' +
      '<input id="maxPlayers" name="maxPlayers" type="text" inputmode="numeric" value="10" autocomplete="off" aria-describedby="hint-players err-maxPlayers">' +
      '<p class="hint" id="hint-players">A whole number from ' + C.MIN_PLAYERS + " to " + C.MAX_PLAYERS + ", including you.</p>" +
      '<p class="field-error" id="err-maxPlayers" role="alert"></p></div>' +
      '<div class="field"><label for="description">Description (optional)</label>' +
      '<textarea id="description" name="description" rows="3" maxlength="' + C.DESCRIPTION_MAX + '" aria-describedby="hint-desc err-description"></textarea>' +
      '<p class="hint" id="hint-desc"><span id="desc-count">0</span>/' + C.DESCRIPTION_MAX + " characters</p>" +
      '<p class="field-error" id="err-description" role="alert"></p></div>' +
      '<button type="submit" class="btn btn--primary">CREATE GAME</button>' +
      "</form></div>";

    bind(container);
  }

  function setError(container, id, message) {
    const box = container.querySelector("#err-" + id);
    if (box) box.textContent = message || "";
    const input = container.querySelector("#" + id);
    if (input) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
  }

  function bind(container) {
    const form = container.querySelector("#create-form");
    const locationSelect = form.querySelector("#location");
    const otherField = form.querySelector("#other-field");
    const description = form.querySelector("#description");
    const counter = form.querySelector("#desc-count");

    // Show the "Location name" box only when "Other" is chosen.
    locationSelect.addEventListener("change", function () {
      otherField.hidden = locationSelect.value !== "Other";
      if (!otherField.hidden) form.querySelector("#otherLocation").focus();
    });

    description.addEventListener("input", function () {
      counter.textContent = String(description.value.length);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const profile = PB.actions.requireProfile("Create your profile before creating a game.");
      if (!profile) return;

      const now = PB.now();
      const skillPick = form.querySelector('input[name="skill"]:checked');
      const data = {
        date: form.date.value,
        time: form.time.value,
        locationChoice: form.location.value,
        otherLocation: form.otherLocation.value,
        skill: skillPick ? skillPick.value : "",
        maxPlayers: form.maxPlayers.value,
        description: form.description.value,
      };

      const V = PB.validation;
      const dateError = V.date(data.date) || V.futureDateTime(data.date, data.time, now);
      const timeError = V.time(data.time);
      const errors = {
        date: dateError,
        time: timeError,
        // A problem with the dropdown itself, or with the typed "Other" name.
        location: C.LOCATIONS.indexOf(data.locationChoice) === -1 ? "Please choose a location." : "",
        otherLocation: data.locationChoice === "Other" ? V.location(data.locationChoice, data.otherLocation) : "",
        skill: V.skill(data.skill, C.GAME_SKILLS),
        maxPlayers: V.players(data.maxPlayers),
        description: V.description(data.description),
      };

      // The "future" message belongs next to the time field when the date itself is fine.
      if (!V.date(data.date) && V.futureDateTime(data.date, data.time, now) && !timeError) {
        errors.date = "";
        errors.time = V.futureDateTime(data.date, data.time, now);
      }

      const order = ["date", "time", "location", "otherLocation", "skill", "maxPlayers", "description"];
      let firstBad = null;
      order.forEach(function (id) {
        setError(container, id, errors[id]);
        if (errors[id] && !firstBad) firstBad = id;
      });

      if (firstBad) {
        const target = form.querySelector("#" + firstBad) || form.querySelector('input[name="skill"]');
        if (target) target.focus();
        return;
      }

      const location = data.locationChoice === "Other" ? data.otherLocation.trim() : data.locationChoice;
      PB.storage.createGame(
        { date: data.date, time: data.time, location: location, skill: data.skill, maxPlayers: data.maxPlayers, description: data.description },
        profile.id
      );
      PB.ui.toast("Game created! You're in, and it's on the Home screen.", "success");
      PB.router.navigate("#/home");
    });
  }

  PB.views.create = { render: render };
})();
