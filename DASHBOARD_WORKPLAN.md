# Founder Dashboard — workplan

See `DASHBOARD_SPEC.md` for what each signal means and why. This file tracks
what's done, what's left, and exactly how to re-run the tests.

## Status: built and tested locally, not yet pushed

- [x] Approval gate followed: app/source identified, three founder questions
      asked and answered, scope (4 signals + trust blind spot, live mode, no
      synthetic data) proposed and explicitly approved before any code was
      written.
- [x] Read-only API endpoint `GET /api/admin/founder` in `src/worker.js`,
      protected by the existing `checkAdmin` passcode check.
- [x] Client call `PB.storage.founderOverview(passcode)` in `public/js/storage.js`.
- [x] New hidden screen `public/js/views/founder.js` at `#/founder` - login
      gate, four evidence cards, a 3-step user journey funnel, a
      location/skill breakdown, and a manually-edited feedback panel.
- [x] Wired into `public/js/app.js` (route) and `public/index.html` (script tag).
- [x] New CSS for evidence cards, funnel bars, and breakdown bars in
      `public/css/styles.css`, reusing the app's existing color tokens.
- [x] Deterministic fixture test of the SQL/math itself (not mocked) -
      `test_founder_signals.mjs` (17 checks, kept outside this repo since it
      needs Node's `node:sqlite`, the same workaround already used for
      `src/worker.js` elsewhere in this project - see the Build notes in
      `FEATUREROADMAP_workplan.md`).
- [x] End-to-end Playwright coverage added to the existing two-device
      walkthrough: an honest "No data yet" state before anyone signs up, a
      wrong-passcode refusal that reveals nothing, and real numbers checked
      against known state later in the walkthrough (8 new checks, 35 total).
- [x] Visual check: screenshotted the rendered page at phone and desktop
      widths, including a genuine zero value in the funnel (fixed a real
      issue found this way - see "Known issues found and fixed" below).
- [ ] Pushed to GitHub / deployed to the real Cloudflare site - **not done
      yet, this is your next step**, the same copy-into-GitHub-Desktop,
      commit, push workflow as every other change in this project.
- [ ] Trust/no-shows instrumentation - not started; needs its own separate
      approval since it changes live write behavior (see `DASHBOARD_SPEC.md`).

## How to re-run the tests yourself

These all require Node.js and a local checkout of this project (they are not
part of the deployed app - `test_founder_signals.mjs` isn't even in this zip,
since it's a development-time check, same as the Playwright walkthrough).

1. Unit tests (in-browser, mocked server): open `public/tests.html` in any
   browser. Expect **ALL TESTS PASSED (75)**.
2. Everything else needs `wrangler dev` (or the Node-based devserver
   workaround this sandbox used) running locally, then pointing a script at
   it. If you have Node and can run `npx wrangler dev`, the real worker code
   and real schema are exercised directly - no separate fixture script needed
   there.

## Known issues found and fixed during this build

- The funnel's zero-value step showed a small visible sliver instead of an
  empty bar (a fixed minimum width was applied even at a true zero). Fixed
  in `founder.js`'s `funnelStep()` before shipping - a zero now renders as
  genuinely empty, not "a little happened."
- The original signal wording said players were counted if they "ever"
  joined or created a game. Checking this against the real leave/delete
  flow during testing showed that's not actually what the query measures -
  leaving deletes the row, so it only reflects "currently." Reworded both
  the reach and repeat-use signals (and their definitions in
  `DASHBOARD_SPEC.md`) to say so honestly, with the blind spot spelled out,
  rather than ship a definition the data doesn't actually support.

## Next safe step after an interruption

If you're picking this back up after a break: everything above is committed
locally. The next step is simply the same push workflow you already know -
copy the updated project into your GitHub Desktop folder, commit, push - and
then open `#/founder` on your real site with your admin passcode. Nothing
here requires a new Cloudflare resource, secret, or approval beyond the push
itself.
