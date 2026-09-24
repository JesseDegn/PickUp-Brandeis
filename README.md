# Pickup Brandeis

**Pickup Brandeis** is a simple web app that helps Brandeis students find, create, and join pickup basketball games, so they no longer have to dig through group chats, texts, or word of mouth.

> Status: **planning phase.** This repository currently contains only documentation. No application code has been written yet.

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
5. They can **create** a new game in under a minute.
6. **My Games** shows the games they joined and the games they created.
7. When a game reaches its desired number of players, it shows **"GAME ON — Enough players confirmed."**

Only basketball exists in this version.

Full details are in [`ProductSpec.md`](ProductSpec.md). The step-by-step build plan is in [`FEATUREROADMAP_workplan.md`](FEATUREROADMAP_workplan.md). The visual design lives in Figma (see "Design" below).

## Important limitations of this first version

- **Games are not shared between devices.** All data (profile, games, who joined) is saved in the browser you are using, using something called *localStorage* (explained below). If you create a game on your phone, a friend on their phone will **not** see it. This first prototype is meant to demonstrate the idea and the experience, not to run a real campus-wide service yet. Shared online data is the planned next step.
- **The sign-in is a prototype.** The app only checks that an email ends in `@brandeis.edu`. It does **not** send a verification email or confirm the person owns that address. Anyone could type someone else's Brandeis email. This is called a *prototype authentication system*: good enough for a class demo, not secure enough for real use.
- **It is a website, not a native phone app.** It runs in a browser (on phones and computers) and is not in the App Store or Google Play.

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
| **Cloudflare Workers** | Cloudflare's hosting product. Our app uses only its "static assets" feature, so there is no server code to maintain. |
| **Workers Free plan** | Cloudflare's no-cost tier. It is enough for this MVP. |
| **wrangler / `wrangler.jsonc`** | Wrangler is Cloudflare's command-line tool. `wrangler.jsonc` is the small settings file that tells it what to deploy. |
| **Single-page application (SPA)** | An app where one page loads once and then changes what it shows as you tap around, rather than loading a new page each time. |
| **Repository (repo)** | The folder of project files, with a full history of changes, stored on GitHub. |
| **Commit** | A saved snapshot of the project, with a short message describing what changed. |
| **Git / GitHub** | Git tracks changes to the files. GitHub is the website that stores the repository online. |

### Technology choices

- Plain **HTML, CSS, and JavaScript**. No React, no other framework.
- **localStorage** for saving data in the browser.
- Code organized into **separate files** (one for storage, one for each screen, and so on). All the code that reads and writes data lives in **one place** (`public/js/storage.js`). That means shared online data can be added later by changing that one file instead of rebuilding the interface.
- Deployed on **Cloudflare Workers (Free plan)** using static assets, with the setting `not_found_handling: "single-page-application"`. The app does **not** use Durable Objects, WebSockets, or a Node server, because this version has no shared live data.

### Design

The screens were designed in Figma first. The app should match them. The design file is "Brandeis Pickup - App Mockup" in the project owner's Figma account: <https://www.figma.com/design/CdHaM6iucX5sPiZ6yMjuRm> (the file title predates the app's final name and may be renamed).

The look is dark navy, bright blue, white, and light gray, with rounded cards, large buttons, and a clean sans-serif font (Inter).

## How to run it locally

*(This section applies after the app has been built. Until then there is nothing to run.)*

You will need **Node.js** installed (a free program that lets your computer run JavaScript tools). Download it from <https://nodejs.org>.

**Easiest option (no install of Wrangler needed):**

1. Open the project folder in a terminal (the text window where you type commands).
2. Run: `npx wrangler dev`
3. Open the address it prints (usually `http://localhost:8787`) in your browser.

`npx` downloads and runs a tool temporarily. `localhost` means "this computer," so the app is only visible to you.

**Alternative:** because the app is only static files, you can also run `python3 -m http.server 8000 --directory public` and open `http://localhost:8000`.

To see it the way a phone user would, open your browser's developer tools and switch to a phone-sized view.

## How it will be deployed

1. Create a free Cloudflare account.
2. From the project folder, run `npx wrangler login` once (it opens a browser window to sign in).
3. Run `npx wrangler deploy`.
4. Cloudflare prints a public web address ending in `workers.dev`. Share that address to let others try the prototype.

The deployment settings live in `wrangler.jsonc`:

- `assets.directory` points to the `public` folder that holds the app.
- `assets.not_found_handling` is `"single-page-application"`.
- `compatibility_date` is set to the date of deployment.
- `observability` is enabled, so Cloudflare keeps basic logs.

## Project structure (planned)

```
brandeis-pickup/
├── README.md
├── ProductSpec.md
├── FEATUREROADMAP_workplan.md
├── wrangler.jsonc
├── .gitignore
└── public/                 <- everything the browser receives
    ├── index.html
    ├── css/styles.css
    ├── images/             <- logo file goes here
    └── js/
        ├── app.js          <- starts the app
        ├── router.js       <- switches between screens
        ├── config.js       <- shared settings (locations, skill levels)
        ├── sampleData.js   <- fictional sample games and players
        ├── storage.js      <- the ONLY file that reads/writes saved data
        ├── validation.js   <- rules for email, height, player count
        ├── components/     <- reusable pieces (game card, avatars, tab bar)
        └── views/          <- one file per screen
```

## Not in this version

Other sports, payments, ratings, rankings, statistics, teams or leagues, messaging, group chats, friends or followers, real Brandeis single sign-on, push notifications, native mobile apps, court reservations, AI recommendations, ads, and monetization. See `ProductSpec.md` for the full list.

## Notes on the Brandeis name and logo

The Brandeis University seal on the Welcome screen comes from a file supplied by the project owner. Use of university marks is usually governed by Brandeis brand guidelines. Check them before sharing the app publicly.
