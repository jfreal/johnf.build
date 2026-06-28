/* ───────────────────────────── CONFIG ─────────────────────────────
 * Edit these. Webhook URLs live in Netlify env vars (Site settings →
 * Environment variables), NOT in this file — they're secrets.
 *
 *   DISCORD_WEBHOOK_STORE  → the store's (Lotus Games) Discord   [required]
 *   DISCORD_WEBHOOK_GROUP  → the separate / group Discord         [required]
 *
 * Optional display-name overrides (what the post shows as the author):
 *   DISCORD_USERNAME_STORE
 *   DISCORD_USERNAME_GROUP
 *
 * This is a zero-dependency function. The cron schedule is declared in
 * netlify.toml ([functions."kill-team-reminder"].schedule), so there's no
 * @netlify/functions import and no build/install step.
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
 * Declared in netlify.toml as: schedule = "0 22,23 * * 0"
 * That fires every Sunday at BOTH 22:00 and 23:00 UTC. We then gate on the
 * local Eastern hour being 18 (6 PM), so exactly one of the two invocations
 * does the work whether it's EDT (22:00 UTC = 6 PM) or EST (23:00 UTC = 6 PM).
 * This keeps it at 6 PM ET year-round despite DST.
 * Cron timing is best-effort, not exact-to-second.
 */
const SEND_HOUR_ET = 18; // 6 PM

/* ───────────────────────── BIWEEKLY PARITY ────────────────────────
 * The schedule fires EVERY Sunday. We only do the work on alternating
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
 * Parity check (work runs at 6 PM ET Sunday, ANCHOR = Jun 28 00:00 UTC):
 *   Sun 2026-06-28 → floor(~22h / 1wk)   = 0  even → RUN   (event Wed Jul 1)
 *   Sun 2026-07-05 → floor(~7d22h / 1wk)  = 1  odd  → SKIP
 *   Sun 2026-07-12 → floor(~14d22h / 1wk) = 2  even → RUN   (event Wed Jul 15)
 *   Sun 2026-07-19 → floor(~21d22h / 1wk) = 3  odd  → SKIP
 *
 * To skip tomorrow and start the cycle on Jul 12 instead, set ANCHOR to
 * Date.UTC(2026, 6, 12).
 */
const ANCHOR = Date.UTC(2026, 5, 28); // months are 0-based: 5 = June

const WEEK_MS = 6.048e8; // 7 * 24 * 60 * 60 * 1000
const POST_TIMEOUT_MS = 10000;

/** Day-of-week (0=Sun..6=Sat) for `date` in timezone `tz`. */
function weekdayInTz(date, tz) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

/** Hour 0–23 for `date` in timezone `tz`. */
function hourInTz(date, tz) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date),
  );
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

// Group Discord — crew tone. Names the venue + town (different community).
function groupMessage(now) {
  const when = upcomingEventLabel(now);
  return (
    `${LOTUS} **${EVENT_NAME}** this **${when}** at **Lotus Games** in Colchester, CT, let's go! 🎲\n` +
    `First game or your hundredth, everyone's welcome. Bring a team and your dice.\n` +
    `👍 the message so we know who's in.`
  );
}

const TARGETS = [
  { env: "DISCORD_WEBHOOK_STORE", username: process.env.DISCORD_USERNAME_STORE, label: "store", build: storeMessage },
  { env: "DISCORD_WEBHOOK_GROUP", username: process.env.DISCORD_USERNAME_GROUP, label: "group", build: groupMessage },
];

async function postToDiscord(target, content) {
  const url = process.env[target.env];
  const body = { content };
  if (target.username) body.username = target.username;

  // Don't let a stuck webhook hang the whole run (Promise.allSettled waits for all).
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), POST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${target.label} webhook failed: ${res.status} ${text}`);
    }
    console.log(`[kill-team-reminder] posted to "${target.label}"`);
  } finally {
    clearTimeout(timeoutId);
  }
}

export const handler = async () => {
  const now = new Date();

  // One of the two Sunday firings (22:00/23:00 UTC) lands at 6 PM ET; ignore the other.
  if (hourInTz(now, TZ) !== SEND_HOUR_ET) {
    return { statusCode: 200 };
  }

  // Off week — do nothing.
  const weeksSince = Math.floor((now.getTime() - ANCHOR) / WEEK_MS);
  if (weeksSince % 2 !== 0) {
    console.log(`[kill-team-reminder] off week (weeksSince=${weeksSince}), skipping`);
    return { statusCode: 200 };
  }

  // Both webhooks are required. Fail loudly on a misconfigured deploy rather
  // than silently posting to one (or none) and reporting success.
  const missing = TARGETS.filter((t) => !process.env[t.env]).map((t) => t.env);
  if (missing.length) {
    console.error(`[kill-team-reminder] missing required env: ${missing.join(", ")}`);
    return { statusCode: 500 };
  }

  // Each target gets its own message; one failure shouldn't block the other.
  const results = await Promise.allSettled(
    TARGETS.map((t) => postToDiscord(t, t.build(now))),
  );

  const failed = results.filter((r) => r.status === "rejected");
  for (const f of failed) console.error(`[kill-team-reminder] ${f.reason}`);

  // 500 if any send failed (visible in logs / retried), else 200.
  return { statusCode: failed.length ? 500 : 200 };
};
