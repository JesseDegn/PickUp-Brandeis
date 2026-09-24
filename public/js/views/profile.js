// Pickup Brandeis - the Profile screen (prototype sign-in).
//
// Note: this only checks that the email ends in @brandeis.edu. It does NOT
// send a verification email, so it is a prototype, not real security.

window.PB = window.PB || {};
PB.views = PB.views || {};

(function () {
  const esc = PB.ui.esc;
  const C = PB.config;

  // A group of pick-one buttons (real radio buttons, so the keyboard works).
  function radioChips(name, options, selected, legend, describedBy) {
    return (
      '<fieldset class="field" aria-describedby="' + describedBy + '"><legend>' + esc(legend) + "</legend>" +
      '<div class="chip-group">' +
      options.map(function (opt, i) {
        return (
          '<label class="choice"><input type="radio" name="' + name + '" value="' + esc(opt) + '"' +
          (opt === selected ? " checked" : "") + (i === 0 ? " required" : "") + ">" +
          "<span>" + esc(opt) + "</span></label>"
        );
      }).join("") +
      "</div>" +
      '<p class="field-error" id="' + describedBy + '" role="alert"></p></fieldset>'
    );
  }

  function textField(id, label, value, extra) {
    extra = extra || {};
    return (
      '<div class="field"><label for="' + id + '">' + esc(label) + "</label>" +
      '<input id="' + id + '" name="' + id + '" type="' + (extra.type || "text") + '" value="' + esc(value || "") + '"' +
      (extra.autocomplete ? ' autocomplete="' + extra.autocomplete + '"' : "") +
      (extra.inputmode ? ' inputmode="' + extra.inputmode + '"' : "") +
      ' autocapitalize="' + (extra.autocapitalize || "words") + '" spellcheck="false"' +
      ' aria-describedby="err-' + id + '"' +
      (extra.placeholder ? ' placeholder="' + esc(extra.placeholder) + '"' : "") + ">" +
      (extra.hint ? '<p class="hint" id="hint-' + id + '">' + esc(extra.hint) + "</p>" : "") +
      '<p class="field-error" id="err-' + id + '" role="alert"></p></div>'
    );
  }

  function render(container) {
    const profile = PB.storage.getProfile() || {};
    const notice = PB.state.notice;
    PB.state.notice = null;

    const positionChips = C.POSITIONS.map(function (pos) {
      const checked = (profile.positions || []).indexOf(pos) !== -1;
      return (
        '<label class="choice choice--check"><input type="checkbox" name="positions" value="' + esc(pos) + '"' +
        (checked ? " checked" : "") + "><span>" + esc(pos) + "</span></label>"
      );
    }).join("");

    container.innerHTML =
      PB.header.html({ title: "Your Profile", subtitle: "Prototype sign-in: Brandeis email only." }) +
      '<div class="page-body">' +
      (notice ? '<div class="banner banner--info" role="status">' + esc(notice) + "</div>" : "") +
      '<form class="card form" id="profile-form" novalidate>' +
      textField("firstName", "First name", profile.firstName, { autocomplete: "given-name" }) +
      textField("lastName", "Last name", profile.lastName, { autocomplete: "family-name" }) +
      textField("email", "Brandeis email", profile.email, {
        type: "email", autocomplete: "email", inputmode: "email", autocapitalize: "none", placeholder: "you@brandeis.edu",
      }) +
      radioChips("skill", C.PROFILE_SKILLS, profile.skill, "Basketball skill level", "err-skill") +
      textField("height", "Height (optional)", profile.height, {
        placeholder: "6'1\"", autocapitalize: "none", hint: "For example 6'1\" or 5-10",
      }) +
      '<fieldset class="field" aria-describedby="hint-positions"><legend>Positions you prefer to play</legend>' +
      '<p class="hint" id="hint-positions">Select as many as you like</p>' +
      '<div class="chip-group" id="positions-group">' + positionChips + "</div></fieldset>" +
      '<button type="submit" class="btn btn--primary">SAVE PROFILE</button>' +
      "</form>" +
      '<section class="card reset" aria-labelledby="reset-title">' +
      '<h2 id="reset-title">Demo tools</h2>' +
      '<p class="muted">Clears your profile and games on this device and brings back the sample games.</p>' +
      '<div id="reset-area"><button type="button" class="btn btn--outline" id="reset-start">RESET DEMO DATA</button></div>' +
      "</section>" +
      "</div>";

    bind(container);
  }

  function setError(container, id, message) {
    const box = container.querySelector("#" + id);
    if (box) box.textContent = message || "";
    const input = container.querySelector("#" + id.replace("err-", ""));
    if (input && input.tagName === "INPUT") {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
  }

  function bind(container) {
    const form = container.querySelector("#profile-form");

    // "Any position" and specific positions cannot be mixed.
    container.querySelector("#positions-group").addEventListener("change", function (event) {
      const changed = event.target;
      if (changed.name !== "positions") return;
      const boxes = container.querySelectorAll('input[name="positions"]');
      boxes.forEach(function (box) {
        if (changed.checked) {
          if (changed.value === C.ANY_POSITION && box !== changed) box.checked = false;
          if (changed.value !== C.ANY_POSITION && box.value === C.ANY_POSITION) box.checked = false;
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        skill: (form.querySelector('input[name="skill"]:checked') || {}).value || "",
        height: form.height.value,
        positions: Array.prototype.map.call(form.querySelectorAll('input[name="positions"]:checked'), function (b) { return b.value; }),
      };

      const errors = {
        "err-firstName": PB.validation.name(data.firstName, "first name"),
        "err-lastName": PB.validation.name(data.lastName, "last name"),
        "err-email": PB.validation.email(data.email),
        "err-skill": PB.validation.skill(data.skill, C.PROFILE_SKILLS),
      };
      const heightCheck = PB.validation.height(data.height);
      errors["err-height"] = heightCheck.error;

      let firstBad = null;
      Object.keys(errors).forEach(function (id) {
        setError(container, id, errors[id]);
        if (errors[id] && !firstBad) firstBad = id;
      });

      if (firstBad) {
        const target = container.querySelector("#" + firstBad.replace("err-", "")) ||
          container.querySelector('input[name="skill"]');
        if (target) target.focus();
        return;
      }

      data.height = heightCheck.normalized;
      PB.storage.saveProfile(data);

      const returnTo = PB.state.returnTo;
      PB.state.returnTo = null;
      if (returnTo) {
        PB.ui.toast("Profile saved. You can join now!", "success");
        PB.router.navigate(returnTo);
      } else {
        PB.ui.toast("Profile saved!", "success");
        PB.router.refresh();
      }
    });

    // Reset demo data: two steps, so it cannot be tapped by accident.
    const area = container.querySelector("#reset-area");
    area.addEventListener("click", function (event) {
      const id = event.target.id;
      if (id === "reset-start") {
        area.innerHTML =
          '<p role="alert"><strong>Really reset?</strong> This cannot be undone.</p>' +
          '<div class="button-row"><button type="button" class="btn btn--danger" id="reset-yes">YES, RESET</button>' +
          '<button type="button" class="btn btn--outline" id="reset-no">CANCEL</button></div>';
        const yes = area.querySelector("#reset-yes");
        if (yes) yes.focus();
      } else if (id === "reset-no") {
        PB.router.refresh();
      } else if (id === "reset-yes") {
        PB.storage.resetAll(PB.now());
        PB.state.returnTo = null;
        PB.ui.toast("Demo data reset.", "success");
        PB.router.refresh();
      }
    });
  }

  PB.views.profile = { render: render };
})();
