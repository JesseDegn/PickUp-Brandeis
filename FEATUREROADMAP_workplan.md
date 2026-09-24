# Pickup Brandeis — Feature Roadmap and Workplan

How to read this plan: every task is a small checkbox. Each one lists **what is being built**, **which files are created or changed**, **which earlier tasks it depends on**, **a plain-English "done" definition**, and **a simple test you can do yourself**. Tasks are done in order. After each task is finished and tested, it is committed to Git and pushed to GitHub, and the box below is ticked.

All app files live in the `public/` folder. "Run it" means: open a terminal in the project folder and type `npx wrangler dev`, then open the address it prints. (If you would rather not use Wrangler, `python3 -m http.server 8000 --directory public` and `http://localhost:8000` also works.)

**Status:** Phase 0 complete. Tasks 1.1 to 1.3 complete. Next up: Task 1.4.

Legend: `[ ]` not started, `[x]` finished and tested.

---

## Phase 0 — Planning documents (done before any app code)

- [x] **0.1 Write README.md, ProductSpec.md, and this workplan; make the first commit**
  - Builds: the three planning documents.
  - Files: `README.md`, `ProductSpec.md`, `FEATUREROADMAP_workplan.md`.
  - Depends on: nothing.
  - Done when: the three files exist and are committed.
  - Test it yourself: open the three files and confirm they read clearly.

---

## Phase 1 — Project foundation and basic visual design

- [x] **1.1 Create the folder structure and an empty page**
  - Builds: the `public/` folder with an `index.html` that shows the text "Pickup Brandeis" and loads a CSS file and a JavaScript file.
  - Files: create `public/index.html`, `public/css/styles.css`, `public/js/app.js`, `.gitignore`.
  - Depends on: 0.1.
  - Done when: opening the page shows "Pickup Brandeis" and there are no errors in the browser's console (the hidden panel that lists problems; open it with F12 or right-click > Inspect).
  - Test it yourself: run it, see the words on the screen, open the console, and confirm no red messages.

- [x] **1.2 Add the colors, font, and basic look**
  - Builds: shared visual settings (navy, bright blue, white, light gray; Inter font; rounded corners; spacing) as named values called *CSS variables* (one place to change a color for the whole app).
  - Files: modify `public/css/styles.css`, `public/index.html` (font link).
  - Depends on: 1.1.
  - Done when: the page background is light gray, headings are navy, and text uses the Inter font.
  - Test it yourself: run it and compare the colors and font to the Figma screens.

- [x] **1.3 Build the phone-shaped app shell**
  - Builds: a centered app area that fills the screen on phones and appears as a phone-width column on desktop, with an empty place for screens and an empty place for the tab bar.
  - Files: modify `public/index.html`, `public/css/styles.css`.
  - Depends on: 1.2.
  - Done when: on a desktop browser the app is a tidy narrow column in the middle; on a phone it fills the screen.
  - Test it yourself: make your browser window very narrow, then wide, and watch the layout adapt.

- [ ] **1.4 Build the bottom tab bar (Home, Create, My Games, Profile)**
  - Builds: the four-tab bar with simple icons and labels. The active tab is blue and bold. Tabs are at least 48 pixels tall.
  - Files: create `public/js/components/tabBar.js`; modify `public/css/styles.css`, `public/index.html`.
  - Depends on: 1.3.
  - Done when: four tabs show at the bottom, and clicking each one highlights it.
  - Test it yourself: click every tab and confirm the highlight moves.

- [ ] **1.5 Add the screen switcher (router)**
  - Builds: a small *router* (the code that decides which screen to show based on the web address, such as `#/home`). Each tab shows a placeholder title for now ("Home", "Create", "My Games", "Profile"). Browser back button works.
  - Files: create `public/js/router.js`; modify `public/js/app.js`.
  - Depends on: 1.4.
  - Done when: clicking a tab changes the screen title and the address ends in `#/home`, `#/create`, `#/my-games`, or `#/profile`.
  - Test it yourself: click each tab, then press the browser Back button and confirm it goes back one screen.

- [ ] **1.6 Build the Welcome screen**
  - Builds: the Welcome screen from Figma: navy background, "PICKUP" (white) over "BRANDEIS" (blue), the line "Find or create pickup games", a large **PLAY** button, the seal on a white circle at the top, and the owl and judge illustrations in the bottom corners. No tab bar here. **PLAY** opens Home.
  - Files: create `public/js/views/welcome.js`, `public/images/` (logo and illustration files); modify `public/css/styles.css`, `public/js/router.js`, `public/js/app.js`.
  - Depends on: 1.5. (You will supply the logo file; a placeholder circle is used until then.)
  - Done when: opening the app shows the Welcome screen, and PLAY takes you to Home with the tab bar visible.
  - Test it yourself: open the app from scratch, tap PLAY, and confirm you land on Home.

- [ ] **1.7 Prepare Cloudflare settings early**
  - Builds: the `wrangler.jsonc` file with the static-assets setting, single-page-application fallback, observability on, and today's date as the compatibility date. Nothing is deployed yet.
  - Files: create `wrangler.jsonc`.
  - Depends on: 1.1.
  - Done when: `npx wrangler dev` serves the app.
  - Test it yourself: run `npx wrangler dev` and open the address it shows.

---

## Phase 2 — Profile creation and @brandeis.edu validation

- [ ] **2.1 Build the sample-people data**
  - Builds: a list of fictional players (names and initials) used later for sample games.
  - Files: create `public/js/sampleData.js`, `public/js/config.js` (skill levels, locations, position names).
  - Depends on: 1.1.
  - Done when: the lists exist and load without errors.
  - Test it yourself: run it and check the console has no red messages.

- [ ] **2.2 Build the storage layer (the one file that saves data)**
  - Builds: `storage.js` with simple functions to get and save the profile, get and save games, and clear everything. It saves to *localStorage* now, but the rest of the app only talks to these functions. Later they can be swapped to use a shared online database.
  - Files: create `public/js/storage.js`.
  - Depends on: 2.1.
  - Done when: from the browser console you can call a function to save a test profile, refresh, and read it back.
  - Test it yourself: follow the two console commands I give you and confirm your test value is still there after a refresh.

- [ ] **2.3 Build the validation rules**
  - Builds: `validation.js` with checks for: name not blank, email ends in `@brandeis.edu` (ignoring capitals and extra spaces), skill level chosen, height format (optional), player count (whole number 2 to 20), date/time in the future.
  - Files: create `public/js/validation.js`.
  - Depends on: 2.1.
  - Done when: each check returns a clear message or "OK" for good and bad examples I test.
  - Test it yourself: use the small test page (`public/tests.html`) I add; it should show all checks passing.

- [ ] **2.4 Draw the Profile form**
  - Builds: the Profile screen from Figma: first name, last name, Brandeis email, skill level chips, optional height, position chips, and the SAVE PROFILE button. Every field has a visible label. A note says "Prototype sign-in: Brandeis email only."
  - Files: create `public/js/views/profile.js`; modify `public/css/styles.css`, `public/js/router.js`.
  - Depends on: 1.5, 2.2.
  - Done when: the Profile tab shows the full form matching the design.
  - Test it yourself: open the Profile tab and compare to the Figma screen.

- [ ] **2.5 Make skill level and position chips work**
  - Builds: choosing one skill level at a time; toggling any number of position chips with a checkmark; "Any position" clears the others and vice versa.
  - Files: modify `public/js/views/profile.js`, `public/css/styles.css`.
  - Depends on: 2.4.
  - Done when: skill level allows only one choice, and you can select three positions at once.
  - Test it yourself: select Point Guard, Center, and Small Forward together; then tap "Any position" and confirm the others clear.

- [ ] **2.6 Validate and save the profile**
  - Builds: pressing SAVE PROFILE checks everything. Errors appear under each problem field in plain words. A wrong email shows exactly "Please use your Brandeis email." A good profile is saved and a confirmation message appears.
  - Files: modify `public/js/views/profile.js`, `public/js/storage.js`.
  - Depends on: 2.2, 2.3, 2.5.
  - Done when: `test@gmail.com` is rejected with the exact message; `test@brandeis.edu` is saved; blank names are rejected.
  - Test it yourself: try a Gmail address (rejected), then a Brandeis address (saved), then leave the first name blank (rejected).

- [ ] **2.7 Show the saved profile when returning**
  - Builds: when a profile exists, the Profile screen shows its values pre-filled so the student can edit them.
  - Files: modify `public/js/views/profile.js`.
  - Depends on: 2.6.
  - Done when: after saving and switching tabs, the form still shows your information.
  - Test it yourself: save a profile, click Home, click Profile again, and confirm your info is there.

---

## Phase 3 — Home screen with sample pickup basketball games

- [ ] **3.1 Generate the sample games**
  - Builds: sample games created relative to today (Today 6:00 PM, Tomorrow 7:30 PM, Saturday 2:00 PM, Sunday 4:00 PM full) using fictional players, saved the first time the app loads.
  - Files: modify `public/js/sampleData.js`, `public/js/storage.js`.
  - Depends on: 2.2.
  - Done when: on first load, four games exist in storage with the right counts (8, 6, 4, 10 players).
  - Test it yourself: open the app in a fresh private window and use the console command I give you to list the games.

- [ ] **3.2 Build the game card**
  - Builds: a reusable *component* (a reusable piece of the interface) that shows the card from Figma: title, date/time, location, skill chip, initials circles, "X / Y players confirmed", and a button.
  - Files: create `public/js/components/gameCard.js`, `public/js/components/avatar.js`; modify `public/css/styles.css`.
  - Depends on: 3.1.
  - Done when: a card renders with sample data and matches the design.
  - Test it yourself: compare one card to the Figma Home screen.

- [ ] **3.3 Build the Home screen**
  - Builds: the Home header ("Pickup Basketball at Brandeis") and the list of upcoming games as cards, soonest first.
  - Files: create `public/js/views/home.js`; modify `public/js/router.js`.
  - Depends on: 3.2.
  - Done when: Home shows the four sample games in time order.
  - Test it yourself: open Home and count four cards in order.

- [ ] **3.4 Format dates the friendly way**
  - Builds: "Today", "Tomorrow", or the weekday name, plus a 12-hour time ("6:00 PM").
  - Files: create `public/js/format.js`; modify `public/js/components/gameCard.js`.
  - Depends on: 3.2.
  - Done when: card dates read like "Today · 6:00 PM".
  - Test it yourself: check the sample cards' date lines.

- [ ] **3.5 Hide past games and show an empty state**
  - Builds: games whose start time has passed are not listed. If none remain, show a friendly message and a button to Create.
  - Files: modify `public/js/views/home.js`, `public/js/storage.js`.
  - Depends on: 3.3.
  - Done when: an old game is not shown; with all games removed, the empty message appears.
  - Test it yourself: use the console command I provide to add an old game and confirm it does not appear.

---

## Phase 4 — Game details

- [ ] **4.1 Open a game from a card**
  - Builds: tapping a card opens a Game Details screen at a web address like `#/game/abc123`, with a Back button.
  - Files: create `public/js/views/gameDetails.js`; modify `public/js/router.js`, `public/js/components/gameCard.js`.
  - Depends on: 3.3.
  - Done when: tapping a card opens its details and Back returns to Home.
  - Test it yourself: tap a card, then tap Back.

- [ ] **4.2 Show all game information**
  - Builds: date, start time, location, skill level, players needed, confirmed count, creator, optional description, and the list of confirmed players (initials and full names, organizer labeled).
  - Files: modify `public/js/views/gameDetails.js`, `public/css/styles.css`.
  - Depends on: 4.1.
  - Done when: every field from the spec is visible and matches the Figma screen.
  - Test it yourself: open each sample game and check each field.

- [ ] **4.3 Show the "GAME ON" banner**
  - Builds: when confirmed players reach the desired number, show "GAME ON — Enough players confirmed" (green, with a check icon, and in words).
  - Files: modify `public/js/views/gameDetails.js`, `public/css/styles.css`.
  - Depends on: 4.2.
  - Done when: the Sunday sample game (10 / 10) shows the banner and the others do not.
  - Test it yourself: open all four sample games and confirm only the full one has the banner.

- [ ] **4.4 Handle a game that no longer exists**
  - Builds: a friendly "This game could not be found" message with a link back to Home.
  - Files: modify `public/js/views/gameDetails.js`.
  - Depends on: 4.1.
  - Done when: a made-up web address `#/game/nope` shows the message instead of a blank page.
  - Test it yourself: type `#/game/nope` at the end of the address.

---

## Phase 5 — Join and leave games

- [ ] **5.1 Build the game-rule functions**
  - Builds: functions in `storage.js` for join and leave that enforce the rules (no duplicate joins, never above the maximum, leaving lowers the count).
  - Files: modify `public/js/storage.js`.
  - Depends on: 2.2, 3.1.
  - Done when: my test page shows joining twice adds one player, and joining a full game is refused.
  - Test it yourself: run `public/tests.html` and confirm all join/leave tests pass.

- [ ] **5.2 Make JOIN GAME work from the card**
  - Builds: pressing JOIN GAME adds you, changes the button to LEAVE GAME, updates the count and initials circles immediately.
  - Files: modify `public/js/components/gameCard.js`, `public/js/views/home.js`.
  - Depends on: 5.1, 2.6.
  - Done when: joining the 8/10 game makes it 9/10 and shows your initials.
  - Test it yourself: save a profile, press JOIN GAME on the first card, and watch the count go from 8 to 9.

- [ ] **5.3 Make LEAVE GAME work**
  - Builds: pressing LEAVE GAME removes you and returns the button to JOIN GAME; the count drops by one.
  - Files: modify `public/js/components/gameCard.js`.
  - Depends on: 5.2.
  - Done when: leaving returns the count to 8.
  - Test it yourself: press LEAVE GAME and watch 9 return to 8.

- [ ] **5.4 Show FULL for full games**
  - Builds: a full game shows a disabled button that says FULL (unless you are in it, then LEAVE GAME).
  - Files: modify `public/js/components/gameCard.js`, `public/css/styles.css`.
  - Depends on: 5.1.
  - Done when: the Sunday game shows FULL; joining the Tomorrow game up to 10/10 turns its button to LEAVE GAME for you and FULL would show for others.
  - Test it yourself: check the Sunday card, then fill another game and see it change.

- [ ] **5.5 Require a profile before joining**
  - Builds: without a profile, tapping JOIN GAME sends you to Profile with the message "Create your profile to join games."
  - Files: modify `public/js/components/gameCard.js`, `public/js/views/profile.js`.
  - Depends on: 5.2.
  - Done when: in a fresh browser, JOIN GAME takes you to Profile; after saving, you can join.
  - Test it yourself: open a private window, press JOIN GAME, and follow the prompt.

- [ ] **5.6 Join and leave from Game Details**
  - Builds: the Join / Leave / FULL button on Game Details works the same, and the confirmed list updates instantly.
  - Files: modify `public/js/views/gameDetails.js`.
  - Depends on: 5.2, 5.3, 4.2.
  - Done when: joining on the details screen also shows your name in the list and the count matches the card on Home.
  - Test it yourself: join on details, go Back, and confirm the card shows the same count.

- [ ] **5.7 Update every screen after every action**
  - Builds: one shared "re-draw the screen" step so nothing needs a manual refresh.
  - Files: modify `public/js/app.js`, `public/js/router.js`, view files.
  - Depends on: 5.6.
  - Done when: no action ever needs a page refresh to show the new state.
  - Test it yourself: perform five joins and leaves in a row and confirm every number is right without refreshing.

---

## Phase 6 — Create a pickup game

- [ ] **6.1 Draw the Create form**
  - Builds: the Create screen from Figma: date, start time, location dropdown (Gosman Courts, Outdoor Basketball Courts, Other), skill level chips (Beginner, Intermediate, Advanced, All skill levels), number of players, optional description, and CREATE GAME.
  - Files: create `public/js/views/create.js`; modify `public/css/styles.css`, `public/js/router.js`.
  - Depends on: 1.5, 2.1.
  - Done when: the form matches the design with visible labels.
  - Test it yourself: open the Create tab and compare to Figma.

- [ ] **6.2 Show a text box when "Other" is chosen**
  - Builds: choosing Other reveals a required "Location name" box.
  - Files: modify `public/js/views/create.js`.
  - Depends on: 6.1.
  - Done when: selecting Other shows the box; selecting another location hides it.
  - Test it yourself: switch the dropdown between options.

- [ ] **6.3 Validate the form**
  - Builds: required fields cannot be blank; players must be a whole number from 2 to 20; date and time must be in the future; description limit of 140 characters. Errors appear beside each field.
  - Files: modify `public/js/views/create.js`, `public/js/validation.js`.
  - Depends on: 6.1, 2.3.
  - Done when: an empty form, a player count of 0 or 500, and a yesterday date are each rejected with a clear message.
  - Test it yourself: try each bad value one at a time.

- [ ] **6.4 Save the new game**
  - Builds: CREATE GAME saves the game with you as creator and as a confirmed player, shows "Game created!", and sends you to Home.
  - Files: modify `public/js/views/create.js`, `public/js/storage.js`.
  - Depends on: 6.3, 5.5.
  - Done when: the new game appears on Home immediately, showing 1 / your chosen number.
  - Test it yourself: create a game for tomorrow at 5:00 PM with 6 players and find it on Home.

- [ ] **6.5 Require a profile before creating**
  - Builds: without a profile, Create sends you to Profile with a short explanation.
  - Files: modify `public/js/views/create.js`.
  - Depends on: 6.4.
  - Done when: in a fresh browser, the Create tab prompts for a profile first.
  - Test it yourself: open a private window and click Create.

---

## Phase 7 — My Games

- [ ] **7.1 Build the "Games I'm Joining" section**
  - Builds: a My Games screen listing games you joined (including ones you created), using the same cards.
  - Files: create `public/js/views/myGames.js`; modify `public/js/router.js`.
  - Depends on: 5.2, 3.2.
  - Done when: joining a game makes it appear in this section.
  - Test it yourself: join a game and open My Games.

- [ ] **7.2 Build the "Games I Created" section**
  - Builds: the second section listing games you created.
  - Files: modify `public/js/views/myGames.js`.
  - Depends on: 6.4, 7.1.
  - Done when: a game you create appears here and also under Games I'm Joining.
  - Test it yourself: create a game and check both sections.

- [ ] **7.3 Keep My Games up to date**
  - Builds: leaving a game removes it from "Games I'm Joining" immediately; buttons on these cards work.
  - Files: modify `public/js/views/myGames.js`.
  - Depends on: 7.1, 5.3.
  - Done when: leaving from My Games removes the card without a refresh.
  - Test it yourself: leave a game while on My Games.

- [ ] **7.4 Add empty-state messages**
  - Builds: friendly messages when a section is empty, with a next step (Find a game / Create one).
  - Files: modify `public/js/views/myGames.js`, `public/css/styles.css`.
  - Depends on: 7.2.
  - Done when: with nothing joined, each section says what to do next and the buttons work.
  - Test it yourself: in a fresh browser (with a saved profile), open My Games.

---

## Phase 8 — Data persistence with localStorage

- [ ] **8.1 Save everything through the storage layer**
  - Builds: confirm the profile, games, and joined state are all saved to localStorage and nothing bypasses `storage.js`.
  - Files: review `public/js/storage.js` and all views.
  - Depends on: Phases 2 to 7.
  - Done when: a search of the code shows only `storage.js` touches localStorage.
  - Test it yourself: I will show you the search result.

- [ ] **8.2 Survive a refresh**
  - Builds: proof that the profile, created games, and joins remain after refreshing.
  - Files: fix anything found in `public/js/storage.js`.
  - Depends on: 8.1.
  - Done when: after creating a game, joining another, and refreshing, everything is still there and the counts are unchanged.
  - Test it yourself: do those actions, press refresh, and compare.

- [ ] **8.3 Do not duplicate sample games on refresh**
  - Builds: sample games are added only the first time, not every refresh.
  - Files: modify `public/js/storage.js`.
  - Depends on: 3.1.
  - Done when: refreshing ten times still shows four sample games.
  - Test it yourself: refresh repeatedly and count.

- [ ] **8.4 Handle damaged or missing saved data**
  - Builds: if the saved data is corrupted or the browser blocks storage, the app shows a friendly message and starts fresh instead of a blank screen.
  - Files: modify `public/js/storage.js`, `public/js/app.js`.
  - Depends on: 8.2.
  - Done when: putting junk in storage using the console command I give you does not break the app.
  - Test it yourself: run the junk command and refresh.

- [ ] **8.5 Add a "Reset demo data" control**
  - Builds: a small, clearly labeled button on the Profile screen (with a confirmation) that clears saved data so a class demo can start fresh.
  - Files: modify `public/js/views/profile.js`, `public/js/storage.js`.
  - Depends on: 8.2.
  - Done when: pressing it and confirming returns the app to its first-load state.
  - Test it yourself: use it and check the sample games return.

---

## Phase 9 — Mobile responsiveness, accessibility, and error handling

- [ ] **9.1 Polish the phone layout**
  - Builds: fix spacing, text sizes, and tap sizes at 360, 390, and 430 pixel widths; keep the tab bar from covering content.
  - Files: modify `public/css/styles.css`.
  - Depends on: Phases 1 to 7.
  - Done when: every screen looks right at those widths with no sideways scrolling.
  - Test it yourself: in your browser's phone view, check every screen at each width.

- [ ] **9.2 Polish the desktop layout**
  - Builds: a comfortable centered layout on wide screens.
  - Files: modify `public/css/styles.css`.
  - Depends on: 9.1.
  - Done when: a wide window looks intentional, not stretched.
  - Test it yourself: open the app in a full-size window.

- [ ] **9.3 Accessibility pass**
  - Builds: labels on every field, buttons at least 48 pixels tall, keyboard navigation that works with Tab and Enter, visible focus outlines, contrast checked, FULL and GAME ON always in words, and meaningful text for screen readers on icons and initials.
  - Files: modify `public/css/styles.css`, view and component files.
  - Depends on: 9.1.
  - Done when: you can complete the whole flow using only the keyboard, and a contrast checker passes text colors.
  - Test it yourself: put your mouse aside and use Tab and Enter to create a profile.

- [ ] **9.4 Error and confirmation messages review**
  - Builds: every error is plain language and next to the problem; confirmations appear after saving a profile and creating a game; nothing fails silently.
  - Files: modify view files.
  - Depends on: Phases 2 to 6.
  - Done when: I can show each error and confirmation on request.
  - Test it yourself: deliberately trigger every error listed in the spec.

- [ ] **9.5 "No dead buttons" check**
  - Builds: a written checklist of every button in the app and what it does.
  - Files: create `public/tests.html` additions and a checklist in this file.
  - Depends on: Phases 1 to 8.
  - Done when: every button works and none does nothing.
  - Test it yourself: press every button on every screen.

- [ ] **9.6 Match the Figma design**
  - Builds: a side-by-side review of each screen against Figma. Anything that cannot be built the same way is reported to you rather than changed silently.
  - Files: modify `public/css/styles.css` as needed.
  - Depends on: 9.1.
  - Done when: you approve each screen or accept each listed difference.
  - Test it yourself: compare your phone to the Figma frames.

---

## Phase 10 — Cloudflare deployment and final testing

- [ ] **10.1 Update deployment settings**
  - Builds: set `compatibility_date` to the deployment day and confirm `assets.directory`, `not_found_handling: "single-page-application"`, and `observability.enabled: true`.
  - Files: modify `wrangler.jsonc`.
  - Depends on: 1.7.
  - Done when: the file contains exactly those settings.
  - Test it yourself: open `wrangler.jsonc` and check them.

- [ ] **10.2 Test the production-style build locally**
  - Builds: run `npx wrangler dev` and go through the whole "done" checklist.
  - Files: none.
  - Depends on: 10.1, Phase 9.
  - Done when: every item in "What done means" passes locally.
  - Test it yourself: follow the checklist in ProductSpec section 12.

- [ ] **10.3 Create the Cloudflare account and log in**
  - Builds: a free Cloudflare account and a saved Wrangler login.
  - Files: none.
  - Depends on: 10.2.
  - Done when: `npx wrangler whoami` shows your account.
  - Test it yourself: run that command.

- [ ] **10.4 Deploy**
  - Builds: `npx wrangler deploy` publishes the app to a public `workers.dev` address on the Workers Free plan.
  - Files: none (maybe `wrangler.jsonc` fixes).
  - Depends on: 10.3.
  - Done when: the public address opens the app.
  - Test it yourself: open the address on your phone using mobile data (not your home Wi-Fi).

- [ ] **10.5 Test the live site and the refresh fallback**
  - Builds: verify a refresh on a deep address such as `.../#/my-games` still loads the app, and repeat the whole flow on a real phone.
  - Files: none.
  - Depends on: 10.4.
  - Done when: the full flow works on your phone and refreshing never shows an error page.
  - Test it yourself: do the complete journey on your phone.

- [ ] **10.6 Final documentation update**
  - Builds: update README (live address, how to redeploy) and mark the spec's "done" list.
  - Files: modify `README.md`, `ProductSpec.md`, this file.
  - Depends on: 10.5.
  - Done when: the docs match what was built and all boxes are ticked.
  - Test it yourself: read the README as if you were a new classmate.

- [ ] **10.7 Class demo script (short)**
  - Builds: a one-page script for demoing the app, including the honest limitation that games are not shared across devices yet, and a list of next-step ideas (shared database, real verification).
  - Files: create `DEMO.md`.
  - Depends on: 10.6.
  - Done when: you can run the demo from the script.
  - Test it yourself: rehearse it once.

---

- [ ] **10.8 Connect the GitHub repository to Cloudflare (automatic deploys)**
  - Builds: in the Cloudflare dashboard, import the GitHub repo as a Workers project so every push to `main` updates the live site. You can do this instead of tasks 10.3 and 10.4 if you prefer clicking to typing commands.
  - Files: none (maybe small `wrangler.jsonc` fixes).
  - Depends on: 10.2 and the repo being on GitHub.
  - Done when: pushing a small text change to GitHub makes the live site show that change within a few minutes.
  - Test it yourself: change the Welcome tagline, push, wait, and reload the live site.

---

## Phase 11 — Shared online data (AFTER user testing; do not start until you approve)

Goal: every student sees the same games. The screens stay the same; only what `storage.js` talks to changes. Uses Cloudflare Workers (a small server piece) and Cloudflare D1 (a free SQL database, meaning a database that stores information in tables). It does **not** need WebSockets or Durable Objects, since the app only re-checks for new data every 15 to 30 seconds.

- [ ] **11.1 Decide what to keep and what to change based on testing**
  - Builds: a short list of changes from what testers said.
  - Files: `FEATUREROADMAP_workplan.md`.
  - Depends on: Phase 10 and some real testers.
  - Done when: you and I agree on the final feature list for the shared version.
  - Test it yourself: read the list and confirm it matches what you want.

- [ ] **11.2 Create the D1 database and tables**
  - Builds: tables for players, games, and joins, plus a setup script.
  - Files: create `schema.sql`; modify `wrangler.jsonc`.
  - Depends on: 11.1.
  - Done when: the tables exist in a local test database and accept sample rows.
  - Test it yourself: run the query command I give you and see the sample games.

- [ ] **11.3 Build the API (the server's list of requests it understands)**
  - Builds: requests such as "list games," "create game," "join game," "leave game," and "save profile," with the rules enforced on the server (no double join, never over the maximum, past games hidden).
  - Files: create `src/worker.js`; modify `wrangler.jsonc` (keep the static assets and `single-page-application` settings).
  - Depends on: 11.2.
  - Done when: tests show a double join is refused and the last spot can only go to one person.
  - Test it yourself: run my test script and confirm every check passes.

- [ ] **11.4 Point `storage.js` at the server**
  - Builds: the same functions as before, now calling the API instead of localStorage (localStorage stays as a backup for the profile only).
  - Files: modify `public/js/storage.js`.
  - Depends on: 11.3.
  - Done when: two browsers see each other's new games and joins.
  - Test it yourself: create a game in one browser window and see it in a second one.

- [ ] **11.5 Refresh the list automatically**
  - Builds: re-check for new games every 15 to 30 seconds and after every action, without disturbing what someone is typing.
  - Files: modify `public/js/app.js`, view files.
  - Depends on: 11.4.
  - Done when: a join in one window shows up in the other within about 30 seconds.
  - Test it yourself: watch a count change in one window after joining in another.

- [ ] **11.6 Handle slow or failed connections**
  - Builds: friendly messages when the network is down, and no lost data.
  - Files: modify `public/js/storage.js`, view files.
  - Depends on: 11.4.
  - Done when: turning off Wi-Fi shows a clear message instead of a broken screen.
  - Test it yourself: turn off Wi-Fi and try to join a game.

- [ ] **11.7 Clearly label the unverified-email limitation**
  - Builds: a visible note that this prototype does not confirm email ownership, and basic protections against spam (limit how many games one person can create per day).
  - Files: modify `public/js/views/profile.js`, `src/worker.js`.
  - Depends on: 11.3.
  - Done when: the note is visible and the daily limit works.
  - Test it yourself: try to create more games than the limit.

- [ ] **11.8 Deploy and test with several phones**
  - Builds: deploy the server and database to Cloudflare and test with real people on real phones.
  - Files: modify `wrangler.jsonc` as needed.
  - Depends on: 11.5, 11.6, 11.7.
  - Done when: three phones all see and can join the same game and the counts agree.
  - Test it yourself: try it with two friends.

---

## Later ideas (not in this version)

Real email verification (a link sent to the student's inbox), notifications, more sports. Nothing here will be built until you decide to.

## Git rules for the build

- One commit after each completed and tested task, with a clear message such as "Task 2.6: validate and save profile."
- Push to GitHub after each commit. Never force-push.
- Never delete working features to build new ones.
- This file is updated (boxes ticked) as tasks finish.
- When something fails, I will explain the problem in plain English before trying a big change of approach.
