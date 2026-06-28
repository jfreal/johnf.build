import { schedule } from "@netlify/functions";

/* ───────────────────────────── CONFIG ─────────────────────────────
 * Edit these. Webhook URLs live in Netlify env vars (Site settings →
 * Environment variables), NOT in this file — they're secrets.
 *
 *   DISCORD_WEBHOOK_STORE  → the store's (Lotus Games) Discord
 *   DISCORD_WEBHOOK_GROUP  → the separate / group Discord
 *
 * Optional display-name overrides (what the post shows as the author):
 *   DISCORD_USERNAME_STORE
 *   DISCORD_USERNAME_GROUP
 */
const EVENT_NAME = "Kill Team Night";

// Lotus emoji. Unicode 🪷 renders in any server. If the store server has a
// custom emoji, swap the store one for "<:lotus:CUSTOM_ID>" — note that a
// custom emoji only renders in the server it lives in.
const LOTUS = "🪷";

// Optional. Set to something like "6 PM" to include a start time in the
// post. Leave empty ("") to omit it — we don't want to invent a time.
const EVENT_TIME = "";

// The day Kill Team Night happens. 0 = Sun … 3 = Wed … 6 = Sat.
const EVENT_WEEKDAY = 3; // Wednesday

// All dates/labels are computed in this timezone.
const TZ = "America/New_York";

/* ──────────────────────────── SCHEDULE ────────────────────────────
 * Cron: "0 22 * * 0" → every Sunday 22:00 UTC.
 *   = 6:00 PM EDT (Mar–Nov) / 5:00 PM EST (Nov–Mar).
 * Fixed-UTC cron can't track DST. To keep winter at 6 PM instead of 5,
 * change to "0 23 * * 0" when EST is in effect (you lose 7 PM in summer).
 * Cron timing is best-effort, not exact-to-second.
 */
const CRON = "0 22 * * 0";

/* ───────────────────────── BIWEEKLY PARITY ────────────────────────
 * The cron fires EVERY Sunday. We only do the work on alternating
 * Sundays and return early on the off weeks.
 *
 * ANCHOR = the FIRST Sunday we want a reminder to go out (00:00 UTC).
 * "weeks since anchor" is even on run-weeks, odd on skip-weeks.
 *
 * ⇩⇩ CHANGE THIS to shift the whole biweekly cycle. ⇩⇩
 * Set it to the Sunday (00:00 UTC) of the first reminder you want.
 *
 * Current value: 2026-06-28 — the Sunday before the upcoming
 * Wednesday 2026-07-01 Kill Team Night.
 *
 * Parity check (fires Sunday 22:00 UTC, ANCHOR = Jun 28 00:00 UTC):
 *   Sun 2026-06-28 → floor((22h)/1wk)        = 0  even → RUN   (event Wed Jul 1)
 *   Sun 2026-07-05 → floor((7d22h)/1wk)       = 1  odd  → SKIP
 *   Sun 2026-07-12 → floor((14d22h)/1wk)      = 2  even → RUN   (event Wed Jul 15)
 *   Sun 2026-07-19 → floor((21d22h)/1wk)      = 3  odd  → SKIP
 *
 * To skip tomorrow and start the cycle on Jul 12 instead, set ANCHOR to
 * Date.UTC(2026, 6, 12).
 */
const ANCHOR = Date.UTC(2026, 5, 28); // months are 0-based: 5 = June

const WEEK_MS = 6.048e8; // 7 * 24 * 60 * 60 * 1000

/** Day-of-week (0=Sun..6=Sat) for `date` in timezone `tz`. */
function weekdayInTz(date, tz) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

/** "Wednesday, July 1" for the next `EVENT_WEEKDAY` on/after `from`, in TZ. */
function upcomingEventLabel(from) {
  const today = weekdayInTz(from, TZ);
  const daysAhead = (EVENT_WEEKDAY - today + 7) % 7; // 0 if today is the day
  const target = new Date(from.getTime() + daysAhead * 86400000);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(target);
}

// Store Discord — announcement tone. No store name (everyone knows it's the store).
function storeMessage(now) {
  const when = upcomingEventLabel(now);
  const timeLine = EVENT_TIME ? ` Kick-off around **${EVENT_TIME}**.` : "";
  return (
    `${LOTUS} **${EVENT_NAME}** is ON this **${when}**!${timeLine}\n` +
    `New players and seasoned vets alike, tables are open and we want you there.\n` +
    `👍 this post so we can get a headcount.`
  );
}

// Group Discord — crew tone.
function groupMessage(now) {
  const when = upcomingEventLabel(now);
  return (
    `${LOTUS} **${EVENT_NAME}** this **${when}** at **Lotus Games** in Colchester, CT, let's go! 🎲\n` +
    `First game or your hundredth, everyone's welcome. Bring a team and your dice.\n` +
    `👍 the message so we know who's in.`
  );
}

const TARGETS = [
  { url: process.env.DISCORD_WEBHOOK_STORE, username: process.env.DISCORD_USERNAME_STORE, label: "store", build: storeMessage },
  { url: process.env.DISCORD_WEBHOOK_GROUP, username: process.env.DISCORD_USERNAME_GROUP, label: "group", build: groupMessage },
];

async function postToDiscord(target, content) {
  if (!target.url) {
    console.warn(`[kill-team-reminder] no webhook set for "${target.label}", skipping`);
    return;
  }
  const body = { content };
  if (target.username) body.username = target.username;

  const res = await fetch(target.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${target.label} webhook failed: ${res.status} ${text}`);
  }
  console.log(`[kill-team-reminder] posted to "${target.label}"`);
}

const reminder = schedule(CRON, async () => {
  const now = new Date();
  const weeksSince = Math.floor((now.getTime() - ANCHOR) / WEEK_MS);

  // Off week — do nothing.
  if (weeksSince % 2 !== 0) {
    console.log(`[kill-team-reminder] off week (weeksSince=${weeksSince}), skipping`);
    return { statusCode: 200 };
  }

  // Post to all configured webhooks; each gets its own message, and one
  // failure shouldn't block the other.
  const results = await Promise.allSettled(
    TARGETS.map((t) => postToDiscord(t, t.build(now))),
  );

  const failed = results.filter((r) => r.status === "rejected");
  for (const f of failed) console.error(`[kill-team-reminder] ${f.reason}`);

  // Still 200 so Netlify doesn't hammer retries; failures are logged above.
  return { statusCode: 200 };
});

export const handler = reminder;
