# Pickup Brandeis

**Pickup Brandeis** is a simple web app that helps Brandeis students find, create, and join pickup basketball games, so they no longer have to dig through group chats, texts, or word of mouth.

> Status: **working prototype, shared database built and locally tested.** The main screens and features are built and tested (Phases 1-8), deployed to Cloudflare (Phase 10), and the shared-database version with an admin dashboard (Phase 11) has been built and tested locally. The real, live shared database has been created on your Cloudflare account and connected in `wrangler.jsonc`; pushing this code to GitHub is the next step - see [`DEPLOY_ACCOUNTS.md`](DEPLOY_ACCOUNTS.md).

---

## The problem it solves

Right now, pickup basketball at Brandeis is organized through scattered group chats and word of mouth. A student who wants to play has to ask around, wait for replies, and still might show up to an empty court or a game that already has too many people.

## Who it is for

Brandeis undergraduate and graduate students who want to play casual basketball, at any skill level, and want an easy way to know **when, where, and how many people** are playing.

## How the MVP works

MVP means "minimum viable product": the smallest version that still shows whether the idea is useful.

1. A student opens the app and sees a **Welcome screen**. They tap **PLAY**.
2. They see the **Home** screen: a list of upcoming pickup basketball games.
3. Before joining or creating a game, they create a **profile** (name, Brandeis email, skill level, and optionally height and preferred positions).
4. They can open any game to see its details, then **join** or **leave** it.
5. They can **create** a new game in under a minute, naming it so others know what it is.
6. **My Games** shows the games they joined and the games they created.
7. When a game reaches its desired number of players, it shows **"GAME ON — Enough players confirmed."**
8. A game's creator can delete it at any time. A game also deletes itself automatically once its last confirmed player leaves.

Everyone shares the same games: a game created on one phone shows up for every other student, on any device, because it lives in a shared database on the server rather than in one person's browser (see "The shared database" below).

Only basketball exists in this version.

Full details are in [`ProductSpec.md`](ProductSpec.md). The step-by-step build plan is in [`FEATUREROADMAP_workplan.md`](FEATUREROADMAP_workplan.md). The visual design lives in Figma (see "Design" below).

## The shared database

Every student's games and joins are stored in one shared database (Cloudflare D1 - see the technology table below), not in each person's browser. This device still remembers *your own* profile (name, email, skill, height, positions) locally, so you don't have to retype it every time, but it is sent to the server so other students can see your name next to games you've joined or created. Other students only ever see your **first name, last name**, and whether you're in a game - never your email, height, or preferred positions.

There is also a hidden **admin dashboard**, reachable only by typing `#/admin` at the end of the web address (there is no button for it anywhere in the app). It is protected by a passcode that is set directly on the server and never appears in this code or repository. It shows how many players, games, and joins exist, lists every game, and lets an admin remove one. See [`DEPLOY_ACCOUNTS.md`](DEPLOY_ACCOUNTS.md) for how to set the passcode.

## Important limitations of this first version

- **The sign-in is a prototype.** The app only checks that an email ends in `@brandeis.edu`. It does **not** send a verification email or confirm the person owns that address. Anyone could type someone else's Brandeis email. This is called a *prototype authentication system*: good enough for a class demo, not secure enough for real use.
- **It is a website, not a native phone app.** It runs in a browser (on phones and computers) and is not in the App Store or Google Play.
- **New games appear when you look, not instantly.** The app checks the shared database for the latest games each time you open a screen (Home, My Games, a game, Create), rather than updating a screen you're already looking at in real time. If someone joins the game you're currently viewing, you'll see the new count next time you move to another screen and back, or after joining/leaving yourself.

## The technology being used (in plain English)

The project deliberately uses only the basics so you can understand and change it later.

| Term | What it means |
|---|---|
| **HTML** | The structure of a web page: headings, buttons, text boxes. |
| **CSS** | The styling: colors, fonts, rounded corners, spacing. |
| **JavaScript** | The behavior: what happens when you tap a button. |
| **Framework** | A big toolkit (like React) that changes how you write a web app. We are **not** using one, to keep things simple. |
| **localStorage** | A small storage area built into every web browser. It keeps data on that one device even after you refresh the page. |
| **Static assets** | Ready-made files (HTML, CSS, JavaScript, images) that are sent to the browser exactly as they are, with no server code running. |
| **Cloudflare** | A company that hosts websites. |
| **Cloudflare Workers** | Cloudflare's hosting product. It serves the app's files directly (as "static assets") and also runs one small piece of server code (`src/worker.js`) for anything starting with `/api/`, such as "list games" or "join this game." |
| **Cloudflare D1** | Cloudflare's free SQL database product. It stores the players, games, and who's joined what - the one copy of the data that every device reads from and writes to. |
| **SQL database** | A database organized into tables and rows, like a very structured spreadsheet, with rules about what can and can't be stored. |
| **API** | Short for "application programming interface" - here, just a handful of specific web addresses (like `/api/games`) that the app's own code calls to read or change data, instead of a person visiting them in a browser. |
| **Workers Free plan** | Cloudflare's no-cost tier. It is enough for this MVP. |
| **wrangler / `wrangler.jsonc`** | Wrangler is Cloudflare's command-line tool. `wrangler.jsonc` is the small settings file that tells it what to deploy. |
| **Single-page application (SPA)** | An app where one page loads once and then changes what it shows as you tap around, rather than loading a new page each time. |
| **Repository (repo)** | The folder of project files, with a full history of changes, stored on GitHub. |
| **Commit** | A saved snapshot of the project, with a short message describing what changed. |
| **Git / GitHub** | Git tracks changes to the files. GitHub is the website that stores the repository online. |

### Technology choices

- Plain **HTML, CSS, and JavaScript** in the browser. No React, no other framework.
- **localStorage** for remembering your own profile on your own device only.
- **Cloudflare D1** (SQL) for the one shared copy of every player, game, and join.
- Code organized into **separate files** (one for storage, one for each screen, and so on). All the code that reads and writes data lives in **one place** on each side: `public/js/storage.js` in the browser, `src/worker.js` on the server.
- Deployed on **Cloudflare Workers (Free plan)**, combining static assets (the app's files) with one small Worker script for `/api/*` requests only, using `run_worker_first` and `not_found_handling: "single-page-application"`. The app still does **not** use Durable Objects or WebSockets - see the "Refresh-on-navigation" note in `FEATUREROADMAP_workplan.md`'s Build notes for why that trade-off still makes sense.

### Design

The screens were designed in Figma first. The app should match them. The design file is "Brandeis Pickup - App Mockup" in the project owner's Figma account: <https://www.figma.com/design/CdHaM6iucX5sPiZ6yMjuRm> (the file title predates the app's final name and may be renamed).

The look is dark navy, bright blue, white, and light gray, with rounded cards, large buttons, and a clean sans-serif font (Inter).

## How to run it locally

Now that games live in a shared database rather than the browser, double-clicking `public/index.html` on its own no longer shows games, joining, or creating (those screens need the server) - though Welcome and Profile still work, since Profile only saves to this device until Step 3 in `DEPLOY_ACCOUNTS.md` is done.

**Cloudflare's local preview (matches how it will run when deployed, including a local copy of the database).** You will need **Node.js** installed (a free program that lets your computer run JavaScript tools). Download it from <https://nodejs.org>.

**Steps:**

1. Open the project folder in a terminal (the text window where you type commands).
2. Run: `npx wrangler dev`
3. Open the address it prints (usually `http://localhost:8787`) in your browser.

`npx` downloads and runs a tool temporarily. `localhost` means "this computer," so the app is only visible to you. Wrangler automatically creates a small local copy of the database on your computer for this local preview - it never touches the real, live database.

To see it the way a phone user would, open your browser's developer tools and switch to a phone-sized view.

## How it will be deployed

This project is connected to Cloudflare Workers Builds: pushing to the `main` branch on GitHub deploys automatically, the same as every earlier phase. See [`DEPLOY_ACCOUNTS.md`](DEPLOY_ACCOUNTS.md) for the one-time steps to connect the real shared database and set the admin passcode - those only need to happen once, not on every future push.

The deployment settings live in `wrangler.jsonc`:

- `assets.directory` points to the `public` folder that holds the app's files.
- `assets.not_found_handling` is `"single-page-application"`.
- `main` points to `src/worker.js`, and `assets.run_worker_first` limits it to `/api/*` addresses - everything else is still served as plain files, not run through any server code.
- `d1_databases` connects the Worker to the real shared database (added once that database exists - see `DEPLOY_ACCOUNTS.md`).
- `compatibility_date` is set to the date of deployment.
- `observability` is enabled, so Cloudflare keeps basic logs.

## Project structure

```
brandeis-pickup/
├── README.md
├── ProductSpec.md
├── FEATUREROADMAP_workplan.md
├── DEPLOY_ACCOUNTS.md      <- one-time setup: the shared database and admin passcode
├── schema.sql              <- the shared database's tables (run once, when it's created)
├── wrangler.jsonc
├── .gitignore
├── src/
│   └── worker.js           <- the server: the ONLY code that talks to the shared database
└── public/                 <- everything the browser receives
    ├── index.html
    ├── tests.html          <- self-check page: open it to run the automated rule tests
    ├── css/styles.css
    ├── images/             <- the Brandeis seal
    └── js/
        ├── app.js          <- starts the app
        ├── router.js       <- switches between screens; fetches fresh games before drawing one
        ├── config.js       <- shared settings (locations, skill levels, limits)
        ├── storage.js      <- the ONLY browser file that reads/writes data (talks to src/worker.js)
        ├── validation.js   <- rules for email, height, player count
        ├── format.js       <- friendly dates, times, and names
        ├── actions.js      <- what Join and Leave do
        ├── ui.js           <- small helpers (safe text, pop-up messages)
        ├── components/     <- reusable pieces (game card, avatars, tab bar, header)
        └── views/          <- one file per screen (welcome, home, game details,
                               create, my games, profile, admin)
```

## Testing

Open `public/tests.html` in a browser. It runs the app's rules through dozens of checks (valid and invalid emails, heights, player counts, joining, leaving, full games, saving, damaged data, and talking to the shared database) and shows **ALL TESTS PASSED** or lists what failed. It talks to a pretend, in-page copy of the server, so it never touches real students' data. Because this sandbox could not install Cloudflare's own `wrangler` tool, `src/worker.js` and `schema.sql` were separately checked by running the exact same code against a real SQL database and a scripted browser acting as two different students plus an admin - see the Build notes in `FEATUREROADMAP_workplan.md` for details.

## Not in this version

Other sports, payments, ratings, rankings, statistics, teams or leagues, messaging, group chats, friends or followers, real Brandeis single sign-on, push notifications, native mobile apps, court reservations, AI recommendations, ads, and monetization. See `ProductSpec.md` for the full list.

## Notes on the Brandeis name and logo

The Brandeis University seal on the Welcome screen comes from a file supplied by the project owner. Use of university marks is usually governed by Brandeis brand guidelines. Check them before sharing the app publicly.
