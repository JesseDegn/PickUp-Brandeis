# Founder Dashboard — specification

What this is: a small, read-only, live dashboard at the hidden address `#/founder`
on your real Pickup Brandeis site, protected by the same admin passcode as
`#/admin`. It answers a few specific founder questions from real (if still
sparse) usage, so you can decide things with evidence instead of guessing.
Built for BUS131, Fail Faster, Fail Smarter - Week 5 MVP dashboard brief.

It is not a generic analytics platform, not a growth chart, and not proof of
product-market fit. It is small, honest evidence for specific decisions.

## Founder questions this answers

You told me three things on 2026-10-01, and this dashboard is built around them:

1. **Success, to you, means repeat use** - not just trying the app once, but
   coming back to create or join another game later.
2. **The next decision** this should inform: whether to expand beyond
   basketball to other sports.
3. **The open worry**: trust - will a stranger who says they'll show up to a
   game actually show up. (See "Not built," below - this one is not
   measurable yet with the current app.)

## The four signals

Each signal below states: the founder question it answers, its exact
definition, where the numbers come from, and what it does NOT tell you. All
four are computed fresh, live, on every page load - nothing is pre-computed,
cached, or stored separately from your existing `players`, `games`, and
`game_players` tables.

### 1. Reach → core value

**Question:** Is there real demand for basketball itself, before adding
another sport?

**Definition:** Of everyone who has ever saved a profile, the share who are
*currently* joined to, or the creator of, at least one game that still
exists. Counted by player id (one row in `players`).

**Source:** existing `players` and `game_players` tables. No new
instrumentation.

**What it does NOT tell you:** Leaving a game deletes that `game_players` row
entirely - there is no history of past joins. So someone who signed up,
joined a game, then left before this measurement is **not** counted as
reached, even though they clearly tried the app. This signal can only
undercount real trial; it can never overcount it. It also doesn't tell you
*why* someone signed up and never joined - that needs a conversation, not a
number.

### 2. Game fill rate

**Question:** Is basketball itself working - do created games actually reach
the number of players they asked for?

**Definition:** Of games that currently exist, the share whose confirmed
player count (current rows in `game_players` for that game) is at least the
game's `max_players`.

**Source:** existing `games` and `game_players` tables, current snapshot only.

**What it does NOT tell you, and the known blind spot:** A game that filled
up and was later deleted - either by its creator (Phase 12.3) or
automatically once everyone left (Phase 12.4) - disappears from both the
numerator and denominator entirely. It is not remembered as a past success
or counted as a failure; it simply vanishes. This means the fill rate you see
is a snapshot of games that happen to still exist right now, not a true
historical success rate, and it likely reads more optimistic than reality
once games start getting deleted regularly. Verified directly in
`test_founder_signals.mjs`: deleting a full game drops it from both
`totalGames` and `fullGames`.

### 3. Repeat use

**Question:** The one you said matters most - are people coming back, not
just trying it once?

**Definition:** Of players currently joined to or the creator of at least one
game (the denominator from signal 1), the share whose current
`game_players.joined_at` timestamps span two or more different calendar
dates.

**Source:** existing `game_players.joined_at` column.

**What it does NOT tell you:** Same blind spot as signal 1, and it compounds
here: because leaving a game deletes the record of *when* that join
happened, a player who joined on day 1, left, and joined a different game on
day 5 may show only the day-5 record - counted as having used the app on
only one date, even though they genuinely came back. Like signal 1, this can
only undercount real repeat use, never overcount it. Also: with only a
handful of real users so far, this is a count, not a statistically
meaningful trend - treat 1-out-of-3 as "ask these people what brought them
back," not as a trendline.

### 4. Where activity concentrates

**Question:** Secondary context for the sport-expansion decision - which
locations and skill levels are people actually using?

**Definition:** Count of currently-existing games grouped by `location`, and
separately by `skill`.

**Source:** existing `games` table, current snapshot only (same blind spot
as signal 2 - a deleted game's location/skill is no longer counted).

**What it does NOT tell you:** This is descriptive, not causal - it tells you
where games get created, not where demand would be for a *different* sport.

## Not built: trust / no-shows

You named this as your biggest open worry, and it is the one signal this
version genuinely cannot show you. Nothing in the app records whether a
confirmed player actually showed up, and leaving a game deletes the record
outright - there is no history of late cancellations or no-shows to look at
at all.

The smallest addition that would start measuring this: instead of deleting a
`game_players` row when someone leaves, keep it and add a `left_at` column
(or a status flag), so a leave becomes a recorded event instead of an erased
one. That would let a future version show, for example, how often someone
leaves within a few hours of a game's start time - an early-warning proxy for
no-shows, though still not proof someone actually showed up in person.

This was deliberately left out of this version because it changes how the
*live app* writes data (a schema change and a change to the leave behavior
in `src/worker.js`), not just a new read-only page - so it needs its own
separate approval, the same as every other change to the real database in
this project. For now, trust is something to ask real users about directly
rather than something this dashboard can show.

## Data mode and privacy

**Mode: live**, by your explicit choice (2026-10-01) - not the
local/demo-only default this kind of dashboard would normally start with.
No synthetic or fixture data is used anywhere in the shipped page; every
number comes from your real, live Cloudflare D1 database at the moment the
page is opened.

**Access control:** the same server-side passcode check already used by
`#/admin` (`checkAdmin` in `src/worker.js`, comparing an `x-admin-passcode`
header against the `ADMIN_PASSCODE` secret that lives only on the server).
This is enforced on the server, not just hidden by a frontend password or an
unlisted link - a request to `/api/admin/founder` without the right header is
refused with a 401 before any data is read, verified directly in
`test_founder_signals.mjs`.

**What this page can see:** only aggregate counts and the same non-sensitive
fields already shown on `#/admin` (locations, skill levels, counts). It
never reads or displays an individual player's email, height, or preferred
positions - the privacy rule from `ProductSpec.md` section 10 applies here
unchanged.

**No new tracking:** this page adds zero new database writes, zero new
columns, and zero new stored events. It only reads what the app already
records for its normal operation.

## What is not built (summary)

- Trust / no-shows (see above) - needs a separate, approved schema change.
- Any date-range filter - everything shown is "right now," since there
  isn't enough history yet for a meaningful time window, and adding filter
  controls would be scope the current evidence doesn't need yet.
- Export or CSV download - not requested, not built.
- Any control that changes data - this page is read-only; it cannot edit,
  delete, or message anyone. (Use `#/admin` for removing a game.)
- Automatic tracking of the Feedback & next experiment panel - it is a
  hand-edited list in `public/js/views/founder.js` (`FEEDBACK_LOG`), not a
  live form, by design (see "No new tracking" above).
