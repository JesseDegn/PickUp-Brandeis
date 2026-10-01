# Pickup Brandeis — Product Specification

Version 0.1 (MVP). This document defines *what* the app must do. It does not describe how the code is written.

Design reference (Figma): <https://www.figma.com/design/CdHaM6iucX5sPiZ6yMjuRm>. If the built app and the Figma design ever disagree, tell the project owner instead of silently changing the design.

---

## 1. The problem

Pickup basketball at Brandeis is organized through scattered group chats, texts, and word of mouth. Students cannot easily see what games are happening, how many people are coming, or what skill level a game is for. Games get canceled, courts sit empty, or too many people show up.

## 2. Target user

A Brandeis student who wants to play casual basketball.

- Age and background: typical undergraduate or graduate student, comfortable with a phone.
- Skill: anywhere from beginner to advanced.
- Needs: to quickly answer "Is there a game I can join, when, where, and is it full?" and to start a game without messaging twenty people.
- Device: most likely a phone, sometimes a laptop.

## 3. Core user journey

1. Open the app and see the Welcome screen. Tap **PLAY**.
2. Land on **Home** and browse upcoming games.
3. Tap **Join Game**. If no profile exists yet, the app asks the student to create one first.
4. Create a profile: first name, last name, Brandeis email, skill level, and optionally height and preferred positions.
5. Return to the game and join it. The player count goes up by one and the student's initials appear.
6. Open a game to see all its details and who is coming.
7. Create a new game: name it, then set date, time, location, skill level, and number of players.
8. Open **My Games** to see games they joined and games they created.
9. Leave a game if plans change. The count goes down by one. If that was the last confirmed player, the game disappears for everyone.
10. If they created a game, they can delete it at any time from Game Details, removing it for everyone.

## 4. Navigation

There are four main sections in a bottom tab bar, always visible after the Welcome screen:

| Tab | Purpose |
|---|---|
| Home | Upcoming pickup basketball games |
| Create | Create a new game |
| My Games | Games the student joined or created |
| Profile | The student's information |

The Welcome screen is shown before the tab bar and has no tab bar.

## 5. Screens

### 5.0 Welcome screen

- Big title "PICKUP" (white) above "BRANDEIS" (blue) across the screen.
- The Brandeis University seal at the top center on a white circle.
- A simple original owl illustration in the bottom-left corner and a simple original judge illustration in the bottom-right corner. (These are not official mascot artwork.)
- The line "Find or create pickup games."
- A large **PLAY** button in the middle (no emoji). It opens the Home screen.
- Shown each time the app is opened fresh. It is skipped when the student moves between tabs.

### 5.1 Home

- Header: "Pickup Basketball at Brandeis" with the small label "PICKUP BRANDEIS" and a short subtitle.
- A heading "Upcoming games" and a list of game cards, soonest first.
- Each **game card** shows: 🏀 the game's name (chosen by its creator); date and time (for example "Today · 6:00 PM", "Tomorrow · 7:30 PM", "Saturday · 2:00 PM"); location; skill level chip; small circles with player initials; "X / Y players confirmed"; and one large button.
- The button says **JOIN GAME**, **LEAVE GAME** (if the student already joined), or **FULL** (if the game is full and the student is not in it). The **FULL** button is disabled and also shows the word FULL, so the state does not rely on color alone.
- Tapping the card (anywhere except the button) opens Game Details.
- If there are no upcoming games, show a friendly message and a button that goes to Create.

### 5.2 Game Details

Shows all of: the game's name, date, start time, location, skill level, players needed, confirmed players ("X / Y"), who created the game, the list of confirmed players (initials and full name), and a Join or Leave button (or FULL).

- When confirmed players equal players needed, show a banner: **"GAME ON — Enough players confirmed"**.
- A back control returns to the previous screen.
- The creator is shown in the player list and marked "Organizer".
- If the viewer created the game, a **"Creator tools"** section with a **DELETE GAME** button is shown (not shown to anyone else). Deleting asks for confirmation ("Delete this game? This removes it for everyone and cannot be undone.") before removing the game for every student.

### 5.3 Create

Fields, all with visible labels:

| Field | Type | Required |
|---|---|---|
| Name | short text, up to 40 characters (shown above Date, the first field) | Yes |
| Date | date picker | Yes |
| Start time | time picker | Yes |
| Location | dropdown: Gosman Courts, Outdoor Basketball Courts, Other | Yes |
| Other location name | text box, appears only if "Other" is chosen | Yes, if "Other" |
| Skill level | choice: Beginner, Intermediate, Advanced, All skill levels | Yes |
| Desired number of players | number | Yes |

Button: **CREATE GAME**.

- On success, show a clear confirmation ("Game created!"), and the game appears immediately on Home and under "Games I Created" and "Games I'm Joining" as appropriate.
- The creator is automatically counted as attending.
- If the student has no profile, they are sent to Profile first with an explanation.

### 5.4 My Games

Two sections using the same game cards as Home:

1. **Games I'm Joining**: games the student joined (including ones they created, because they are attending).
2. **Games I Created**: games the student created.

Each section has an empty-state message that says what to do next (for example, "You haven't created a game yet. Tap Create to start one."). Only upcoming games are shown.

### 5.5 Profile

Fields, all with visible labels:

| Field | Type | Required |
|---|---|---|
| First name | text | Yes |
| Last name | text | Yes |
| Brandeis email | email | Yes, must end in `@brandeis.edu` |
| Basketball skill level | choice: Beginner, Intermediate, Advanced | Yes |
| Height | text, for example `6'1"` | No |
| Positions you prefer to play | multiple choice, select as many as you like | No |

Position choices: Point Guard, Shooting Guard, Small Forward, Power Forward, Center, Any position. Each choice is a toggle chip showing a checkmark when selected.

- Selecting "Any position" clears the other choices. Selecting any specific position clears "Any position."
- Button: **SAVE PROFILE**. After saving, show a confirmation.
- The Profile screen is labeled a **prototype sign-in**: only the email domain is checked.
- If the email does not end in `@brandeis.edu`, show exactly: **"Please use your Brandeis email."**

## 6. Required features (checklist)

Profile and access
- [ ] Create and edit a profile with a `@brandeis.edu` email.
- [ ] Choose a skill level (Beginner, Intermediate, Advanced).
- [ ] Optionally enter height and choose any number of preferred positions.
- [ ] Welcome screen with PLAY button leading to Home.

Games
- [ ] View upcoming games.
- [ ] Open a game and see all its information.
- [ ] Join a game and leave a game.
- [ ] See the confirmed count update immediately.
- [ ] See player initials on cards and full list in details.
- [ ] Create a game, naming it; it appears right away on Home and My Games.
- [ ] See games I joined and games I created.
- [ ] "GAME ON" message when a game reaches its desired number.
- [ ] As a creator, delete a game I created.
- [ ] A game with zero confirmed players disappears automatically.

Quality
- [ ] Data survives a browser refresh.
- [ ] Works comfortably on a phone-sized screen and on desktop.
- [ ] Every visible button works.

## 7. Product rules

1. A user cannot join the same game twice.
2. Leaving a game decreases the confirmed count by one.
3. A game can never have more confirmed players than its maximum.
4. A full game shows **FULL** instead of JOIN GAME.
5. The creator of a game automatically counts as attending. The creator can leave their own game; if they do, and at least one other player is still confirmed, the game stays listed (the player list still shows who created it).
6. If a game's confirmed count reaches zero - everyone has left, including the creator if they were the last one to go - the game is deleted automatically for everyone.
7. A game's creator can also delete it outright at any time, with a confirmation step, regardless of how many players are confirmed. This removes it for everyone and cannot be undone.
8. Games whose start time has passed do not appear in upcoming lists (Home or My Games).
9. Required fields cannot be blank. Whitespace-only text counts as blank.
10. A game's name can be up to 40 characters.
11. Desired number of players must be a whole number from **2 to 20**.
12. Date and start time must be in the future when creating a game.
13. Email must end in `@brandeis.edu` (not case-sensitive, and extra spaces around it are ignored).
14. Height, if entered, must look like feet and inches between 4'0" and 7'6" (accepted styles: `6'1"`, `6' 1`, `6-1`, `6ft 1in`). Otherwise show a clear error.
15. Joining or creating a game requires a saved profile.
16. The app updates the screen after every action. The user never has to refresh.
17. Only basketball exists.
18. The app starts with zero games and zero players. The first game anyone sees is a real one, created by a real student. (Earlier drafts of this prototype showed fictional sample games on first load, before a shared database existed; see the "Build notes" in `FEATUREROADMAP_workplan.md`.)
19. Every game and profile is stored on a shared server, not in one person's browser - see section 10. Other students can only ever see a player's first name and last name next to a game, never their email, height, or preferred positions.
20. A hidden admin dashboard (reachable only by typing `#/admin`, with no link to it anywhere in the app) can view totals and remove any game, protected by a passcode known only to the site's operator - see section 10.
21. A second hidden, read-only founder dashboard (`#/founder`, same passcode) shows a handful of usage signals computed live from the real data - see section 10 and `DASHBOARD_SPEC.md` for exactly what each one means and what it does not tell you. It cannot change or delete anything.
21. There is no way to delete a profile or "sign out" in this prototype - a Brandeis email is all that identifies a student, so there is nothing sensitive stored on a device to clear.

## 8. Sample data (single-device prototype only - not part of the live app)

This section documents the fictional demo data used **before** the shared database existed, for historical reference. It is no longer part of the app.

Fictional names only. Example games that used to appear:

| When | Location | Skill | Confirmed |
|---|---|---|---|
| Today · 6:00 PM | Gosman Courts | Intermediate | 8 / 10 |
| Tomorrow · 7:30 PM | Gosman Courts | Advanced | 6 / 10 |
| Saturday · 2:00 PM | Outdoor Basketball Courts | All skill levels | 4 / 10 |
| Sunday · 4:00 PM | Gosman Courts | Beginner | 10 / 10 (shows GAME ON and FULL) |

Fictional players (initials shown as circles): for example Maya Klein (MK), Jordan Reyes (JR), Alex Lin (AL), Dana Park (DP), Tyler Stone (TS), Noor Bakr (NB), Chris Wu (CW), Ellis Hart (EH), Riley Grant (RG), Sam Moreno (SM), Kai Ortiz (KO), Leo Brandt (LB), Finn Tate (FT), Hana Voss (HV), Omar Yusuf (OY).

## 9. Accessibility and usability requirements

- Buttons are at least 48 pixels tall and easy to tap on a phone.
- Text has strong contrast against its background.
- Every form field has a visible label.
- Important states do not rely only on color: FULL and GAME ON are also written in words, selected chips show a checkmark.
- Text and button colors meet a 4.5:1 contrast ratio. The blue used for text and buttons is a slightly deeper shade (#1A5FE6) than the Figma blue (#1E6FFF) to meet this.
- Clear error messages appear next to the problem field, in plain language.
- A confirmation message appears after a game is created and after a profile is saved.
- Empty sections explain what to do next.

## 10. Data (what the app remembers, and where)

**On the shared server (Cloudflare D1, a SQL database) - visible to everyone:**

- **Players:** id, first name, last name, email, skill level, height (optional), positions (list, optional).
- **Games:** id, sport ("basketball"), name, date, start time, location, skill level, maximum players, creator's id.
- **Game_players:** which players have joined which games.

**On this device only (localStorage) - private to this browser:**

- **Profile:** a copy of your own saved profile (same fields as above), remembered so you don't have to retype it. This is a convenience copy, not the source of truth - the server's copy is what everyone (including other devices you use) actually sees.

**Privacy rule:** other students only ever receive a player's **id, first name, and last name** - never their email, height, or preferred positions. There is no way to look up a player's full profile except your own. The server enforces this; it is not just a matter of the app's screens not showing it.

**Admin dashboard:** a passcode-protected view (see section 7, rule 20) that shows total counts (players, games, joins) and every game's basic details (not players' private fields), and can delete a game. The passcode lives only in the server's own settings (a Cloudflare "secret"), never in this code, and is set directly by whoever runs the deployment.

**Founder dashboard:** a second passcode-protected view (same passcode, see section 7, rule 21) that shows a handful of usage signals - reach, game fill rate, repeat use, and where activity concentrates - computed live from the same tables, plus an honest note on what it cannot show (see `DASHBOARD_SPEC.md`). It is read-only: it cannot edit, delete, or message anyone.

All reading and writing from the browser goes through one file (`storage.js`), which talks to the server through a small set of web addresses (`/api/...`) implemented in `src/worker.js` - the only code that touches the database directly.

## 11. Deliberately out of scope

Other sports (soccer, volleyball, tennis, pickleball, etc.), payments, ratings, player rankings, competitive statistics, teams or leagues, direct messaging, group chats, friends or followers, real Brandeis single sign-on, complex authentication, push notifications, native iOS or Android apps, court reservations, AI recommendations, ads, and monetization.

Also out of scope for this version: accounts with passwords, real-time (instant, no-refresh) updates between different students' devices - the app checks for new data each time you move to a screen, not continuously (see `FEATUREROADMAP_workplan.md`) - and email verification. These can be considered after testing whether students find value in the idea.

## 12. What "done" means

The MVP is complete when a student can, on a phone-sized screen, without manually editing data:

- [ ] Create a profile with a `@brandeis.edu` email.
- [ ] Select a skill level (and optionally height and positions).
- [ ] View upcoming games.
- [ ] Create a pickup game.
- [ ] Join a game.
- [ ] Leave a game.
- [ ] See the player count update correctly.
- [ ] Open a game and see its information.
- [ ] See games they joined.
- [ ] See games they created.
- [ ] Refresh the browser without losing their data.
- [ ] Use every button, with no decorative buttons that do nothing.

And the app is deployed to a public Cloudflare address using the Workers Free plan.

## 13. Known limitations (to be stated honestly to testers)

- The email check is only a domain check, not real verification - anyone could type a Brandeis email that isn't theirs.
- New data appears when you open or return to a screen, not instantly while you're looking at it.
- It is a website, not an App Store app.
- If two people somehow save a profile with the exact same id from two different, brand-new devices at the same moment, the second save wins (extremely unlikely in practice, and each device generates its own random id).
- There is no daily limit yet on how many games one person can create, so nothing currently stops spam beyond the admin dashboard's manual Remove button.
