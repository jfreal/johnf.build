// Product changelogs from Merge & Tell, read at build time.
//
// Merge & Tell publishes each product's changelog as a JSON Feed. The feed URL
// holds an account id that works like a password, so it never goes in the
// repo or the page. Each product names an environment variable instead
// (e.g. CHANGELOG_PHEIDI_URL). Set those in Netlify under Site configuration →
// Environment variables. Get the URL from Merge & Tell's Changelog screen: pick
// the product's feed and copy the JSON link.
//
// Freshness: entries show up on the next deploy, not the moment they publish.
//
// Adapted from pheidi/public/_data/changelog.js.

const LIMIT = 5;
const TIMEOUT_MS = 20000;
const MAX_TITLE = 300;
const MAX_SUMMARY = 320;

// Cap on the raw response, checked while streaming. ~40x a normal feed.
const MAX_BYTES = 2 * 1024 * 1024;

// Strip control characters and cap length. HTML escaping is the template's job.
function cleanText(value, limit) {
    if (typeof value !== "string") return "";
    const text = value
        .replace(/\r\n?/g, "\n")
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "")
        .trim();
    return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

// Entries are bullet lists. The first bullet is the headline change.
function summarize(content) {
    const first = cleanText(content, 20000)
        .split(/\n\s*\n|\n(?=\s*- )/)
        .map((part) => part.replace(/^\s*-\s*/, "").replace(/\s+/g, " ").trim())
        .find(Boolean);
    return cleanText(first || "", MAX_SUMMARY);
}

// Only a real calendar date survives. JS rolls 2024-02-31 into March, so check
// the day it names against a UTC date built from the same numbers.
function cleanDate(value) {
    if (typeof value !== "string") return "";
    const raw = value.trim();
    if (!/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/.test(raw)) return "";
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return "";
    const [year, month, day] = raw.slice(0, 10).split("-").map(Number);
    const asUtc = new Date(Date.UTC(year, month - 1, day));
    if (asUtc.getUTCFullYear() !== year || asUtc.getUTCMonth() !== month - 1 || asUtc.getUTCDate() !== day) {
        return "";
    }
    return parsed.toISOString();
}

// Errors this file raises. Their messages never contain the feed URL.
class FeedError extends Error {}

function safeReason(error) {
    if (error instanceof FeedError) return error.message;
    if (error.name === "TimeoutError") return "timed out";
    if (error instanceof SyntaxError) return "response was not valid JSON";
    return `request failed (${error.name})`;
}

async function readBounded(response) {
    const declared = Number(response.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > MAX_BYTES) {
        throw new FeedError(`response declares ${declared} bytes, over the ${MAX_BYTES} cap`);
    }
    const reader = response.body.getReader();
    const chunks = [];
    let total = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > MAX_BYTES) {
            await reader.cancel();
            throw new FeedError(`response exceeded the ${MAX_BYTES} byte cap`);
        }
        chunks.push(value);
    }
    return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
}

async function load(envName) {
    const url = process.env[envName];
    if (!url) {
        console.warn(`[changelog] ${envName} is not set. That product's updates will render empty.`);
        return [];
    }

    let feed;
    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/feed+json, application/json;q=0.9",
                "User-Agent": "johnf-build/1.0 (+https://johnf.build)",
            },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!response.ok) throw new FeedError(`HTTP ${response.status}`);
        feed = JSON.parse(await readBounded(response));
    } catch (error) {
        // Warn, don't fail. A missing changelog is a smaller problem than a
        // portfolio that can't deploy. Never print error.message as-is: fetch
        // puts the URL in the message for a malformed URL, and that URL is a
        // secret. Only messages this file wrote itself are safe to show.
        console.warn(`[changelog] Could not read ${envName}: ${safeReason(error)}`);
        return [];
    }

    const items = Array.isArray(feed?.items) ? feed.items : [];
    return items
        .filter((item) => item && typeof item.id === "string" && item.id.trim())
        .map((item) => ({
            id: item.id.trim().slice(0, 400),
            title: cleanText(item.title, MAX_TITLE),
            summary: summarize(item.content_text),
            date: cleanDate(item.date_published),
        }))
        .filter((entry) => entry.title)
        .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))
        .slice(0, LIMIT);
}

module.exports = { load };
