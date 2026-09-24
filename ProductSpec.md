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
7. Create a new game: date, time, location, skill level, number of players, optional note.
8. Open **My Games** to see games they joined and games they created.
9. Leave a game if plans change. The count goes down by one.

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
- Each **game card** shows: 🏀 "Pickup Basketball"; date and time (for example "Today · 6:00 PM", "Tomorrow · 7:30 PM", "Saturday · 2:00 PM"); location; skill level chip; small circles with player initials; "X / Y players confirmed"; and one large button.
- The button says **JOIN GAME**, **LEAVE GAME** (if the student already joined), or **FULL** (if the game is full and the student is not in it). The **FULL** button is disabled and also shows the word FULL, so the state does not rely on color alone.
- Tapping the card (anywhere except the button) opens Game Details.
- If there are no upcoming games, show a friendly message and a button that goes to Create.
- Several fictional sample games are present the first time the app loads (see section 8).

### 5.2 Game Details

Shows all of: date, start time, location, skill level, players needed, confirmed players ("X / Y"), who created the game, optional description, the list of confirmed players (initials and full name), and a Join or Leave button (or FULL).

- When confirmed players equal players needed, show a banner: **"GAME ON — Enough players confirmed"**.
- A back control returns to the previous screen.
- The creator is shown in the player list and marked "Organizer".

### 5.3 Create

Fields, all with visible labels:

| Field | Type | Required |
|---|---|---|
| Date | date picker | Yes |
| Start time | time picker | Yes |
| Location | dropdown: Gosman Courts, Outdoor Basketball Courts, Other | Yes |
| Other location name | text box, appears only if "Other" is chosen | Yes, if "Other" |
| Skill level | choice: Beginner, Intermediate, Advanced, All skill levels | Yes |
| Desired number of players | number | Yes |
| Description | short text, up to 140 characters | No |

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
- [ ] Create a game; it appears right away on Home and My Games.
- [ ] See games I joined and games I created.
- [ ] "GAME ON" message when a game reaches its desired number.

Quality
- [ ] Data survives a browser refresh.
- [ ] Works comfortably on a phone-sized screen and on desktop.
- [ ] Every visible button works.

## 7. Product rules

1. A user cannot join the same game twice.
2. Leaving a game decreases the confirmed count by one.
3. A game can never have more confirmed players than its maximum.
4. A full game shows **FULL** instead of JOIN GAME.
5. The creator of a game automatically counts as attending. The creator can leave their own game; if they do, the game stays listed (the description says who created it), and the count goes down by one.
6. Games whose start time has passed do not appear in upcoming lists (Home or My Games).
7. Required fields cannot be blank. Whitespace-only text counts as blank.
8. Desired number of players must be a whole number from **2 to 20**.
9. Date and start time must be in the future when creating a game.
10. Email must end in `@brandeis.edu` (not case-sensitive, and extra spaces around it are ignored).
11. Height, if entered, must look like feet and inches between 4'0" and 7'6" (accepted styles: `6'1"`, `6' 1`, `6-1`, `6ft 1in`). Otherwise show a clear error.
12. Joining or creating a game requires a saved profile.
13. The app updates the screen after every action. The user never has to refresh.
14. Only basketball exists.
15. Sample players are fictional. Sample games fill in when the app first loads and are generated relative to the current day, so "Today" and "Tomorrow" are always correct. If every sample game has already passed (for example, a tester returns days later), fresh sample games are added so the demo never looks empty. Games a person created are never removed.

## 8. Sample data (first load)

Fictional names only. Example games:

| When | Location | Skill | Confirmed |
|---|---|---|---|
| Today · 6:00 PM | Gosman Courts | Intermediate | 8 / 10 |
| Tomorrow · 7:30 PM | Gosman Courts | Advanced | 6 / 10 |
| Saturday · 2:00 PM | Outdoor Basketball Courts | All skill levels | 4 / 10 |
| Sunday · 4:00 PM | Gosman Courts | Beginner | 10 / 10 (shows GAME ON and FULL) |

Fictional players (initials shown as circles): for example Maya Klein (MK), Jordan Reyes (JR), Alex Lin (AL), Dana Park (DP), Tyler Stone (TS), Noor Bakr (NB), Chris Wu (CW), Ellis Hart (EH), Riley Grant (RG), Sam Moreno (SM), Kai Ortiz (KO), Leo Brandt (LB), Finn Tate (FT), Hana Voss (HV), Omar Yusuf (OY).

If a sample game's time has passed (for example, the app is opened late in the evening), it is hidden and no fake "past" games are shown.

## 9. Accessibility and usability requirements

- Buttons are at least 48 pixels tall and easy to tap on a phone.
- Text has strong contrast against its background.
- Every form field has a visible label.
- Important states do not rely only on color: FULL and GAME ON are also written in words, selected chips show a checkmark.
- Text and button colors meet a 4.5:1 contrast ratio. The blue used for text and buttons is a slightly deeper shade (#1A5FE6) than the Figma blue (#1E6FFF) to meet this.
- Clear error messages appear next to the problem field, in plain language.
- A confirmation message appears after a game is created and after a profile is saved.
- Empty sections explain what to do next.

## 10. Data (what the app remembers)

Stored in the browser's localStorage:

- **Profile:** id, first name, last name, email, skill level, height (optional), positions (list, optional).
- **Games:** id, sport ("basketball"), date, start time, location, skill level, maximum players, description, creator's id, list of confirmed player ids.
- **Players (sample and current user):** id, name, initials.

All reading and writing goes through one file (`storage.js`) so it can be swapped for a shared online database later.

## 11. Deliberately out of scope

Other sports (soccer, volleyball, tennis, pickleball, etc.), payments, ratings, player rankings, competitive statistics, teams or leagues, direct messaging, group chats, friends or followers, real Brandeis single sign-on, complex authentication, push notifications, native iOS or Android apps, court reservations, AI recommendations, ads, and monetization.

Also out of scope for this version: accounts with passwords, real-time updates between different students' devices, and email verification. These can be considered after testing whether students find value in the idea.

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

- Games are stored per browser and are **not** shared between devices.
- The email check is only a domain check, not real verification.
- It is a website, not an App Store app.
