# Pickup Brandeis — one-time setup for the shared database

This file is for the one-time steps needed to turn on the shared database and
the admin dashboard on your real, live Cloudflare account. You only need to
do this once. Everything else (the day-to-day "push to GitHub, Cloudflare
updates itself" workflow you already use) stays the same afterward.

**Status: Steps 1-2 are done, including the Step 2 column fix below. Step 3
is ready whenever you are. Steps 4-5 are yours to do.** The database exists
on your real Cloudflare account and `wrangler.jsonc` now points at it, but
none of this affects your live site until you push this code to GitHub
(Step 3). Your current live site keeps working exactly as it does right now
until you do that.

## Before you start: what is about to change

Right now, your live site keeps every game only on the one device that
created it — a game you make on your phone is invisible on a laptop. After
this setup, everyone's phone and computer will show the same games, because
they will all be reading from one shared database instead of the device
they're on. Nothing about how the app looks or feels changes.

## Step 1 — Create the shared database ✅ done

A Cloudflare D1 database now exists on your account:

- Database name: `pickup-brandeis-db`
- Database ID: `3fd70097-7386-4630-b2e9-ca003439899f`
- What it holds: three tables — `players`, `games`, `game_players` — exactly
  as laid out in `schema.sql` in this project. No other data, and no real
  student data yet — it's brand new and empty.
- You can see it yourself at any time in the Cloudflare dashboard → **Workers
  & Pages** → **D1 SQL Database**.
- This has not affected your live site — the live site is still running the
  old, single-device code until Step 3.

## Step 2 — Load the tables into the new database ✅ done

The contents of `schema.sql` have been run against the new database, creating
the three empty tables (confirmed by listing them back). This has not
touched your live site either.

**Update ✅ done:** after Step 2 was done, you asked for the Create screen's
optional "Description" field to be replaced with a required game "Name"
field (see `FEATUREROADMAP_workplan.md`, Phase 12.1). The `games` table that
was already created on the real database still had the old `description`
column, not `name`. With your explicit go-ahead, and after reconfirming the
real database was still completely empty (no real games, players, or joins),
this was fixed by running `ALTER TABLE games RENAME COLUMN description TO
name;` directly against the real `pickup-brandeis-db` database. This has been
confirmed: the `games` table now has a `name` column, matching the updated
`schema.sql` in this project, and it did not affect your live site.

## Step 3 — Push this code to deploy it (this part is yours)

`wrangler.jsonc` has already been updated to point at the real database:

```jsonc
{
  "main": "src/worker.js",
  "assets": {
    "directory": "./public",
    "binding": "ASSETS",
    "run_worker_first": ["/api/*"],
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "pickup-brandeis-db",
      "database_id": "3fd70097-7386-4630-b2e9-ca003439899f"
    }
  ]
}
```

This tells Cloudflare: "requests to `/api/...` should run `src/worker.js`;
everything else (the app itself) is still served as plain files, exactly as
before." **This is the step that actually changes your live site**, so it
only happens when you push it: copy the files from the zip into your
GitHub-Desktop folder, commit, and push, the same as every earlier update.
Cloudflare Workers Builds deploys it automatically.

**Important:** right after you push, the main app (profiles, games, joining,
leaving) will work immediately. The hidden admin page will show "Admin
access is not set up on the server yet" until you also do Step 4.

## Step 4 — Set the admin passcode (only you can do this)

The admin dashboard (see below) is protected by a passcode that must never
appear in the code or in this chat, so no one who reads the GitHub repository
can find it. That means it has to be typed directly into Cloudflare's
dashboard by you:

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers
   & Pages** → **pickup-brandeis** → **Settings** → **Variables and Secrets**.
2. Add a new secret:
   - Name: `ADMIN_PASSCODE`
   - Value: anything you like — a short phrase is fine, it just needs to be
     something a stranger couldn't guess. Do not reuse a real password you
     use elsewhere.
3. Save. Cloudflare will redeploy automatically when a secret changes.
4. Remember this passcode somewhere safe (a notes app, not a shared
   document) — there is no "forgot passcode" flow. If you lose it, you set
   a new one the same way, in the same dashboard screen.

## Step 5 — Try it out

- Open your site on two different devices (or two different browsers on one
  computer). Create a profile and a game on one; confirm it shows up on the
  other.
- Go to `https://<your-site>.workers.dev/#/admin` (note the `#/admin` at the
  end — there is no button for this anywhere in the app on purpose). Enter
  the passcode from Step 4. You should see counts of players, games, and
  joins, and a list of every game with a Remove button.
- Go to `https://<your-site>.workers.dev/#/founder` (same passcode as
  `#/admin`) to see the founder usage dashboard — reach, game fill rate,
  repeat use, and where games get created, computed live from the real
  database. See `DASHBOARD_SPEC.md` for what each number means. It's
  read-only, so there's nothing there to break.

## If something needs to be undone

- **Wrong admin passcode saved, or you want to change it:** repeat Step 4 —
  saving a new value for `ADMIN_PASSCODE` replaces the old one immediately.
- **A game needs to be removed** (inappropriate content, a mistake, a test
  game): use the admin dashboard's Remove button — no code change needed.
- **Something is badly broken after deploying:** Cloudflare Workers Builds
  keeps every previous deployment. In the dashboard, under
  **Deployments**, you can roll back to the last working one with a click,
  the same as undoing any other bad deploy.

## Good to know

- The database itself (players' names, emails, games) lives entirely on
  Cloudflare, in your account. It is not stored anywhere else, and this
  chat never sees the actual data in it — only the code that reads and
  writes it.
- Other students only ever see a player's first name and last name next to a
  game. Their email address, height, and preferred positions are private —
  the server never sends those to anyone but the person they belong to.
- This is still a prototype sign-in (email domain only, not a real Brandeis
  login), same as before. The shared database does not change that.
