// IndexNow for the whole portfolio: tell Bing (and Yandex, Seznam, Naver, Yep)
// which pages changed, without a job in every repo.
//
// For each site this fetches the live sitemap, diffs it against the last
// snapshot, and submits every URL that is new, gone, or has a different
// <lastmod>. A site whose sitemap has no <lastmod> only reports new and removed
// pages: an edit to an existing page is invisible to it.
//
// Sites: johnf.build itself, plus every product in src/_data/products.json
// that has a `url`. Set `"indexnow": false` on a product to leave it out.
//
// Snapshots are one JSON file per site, { url: lastmod }. The workflow keeps
// them on the `indexnow-snapshots` branch (master only takes PRs), so that
// branch's history is a day-by-day log of every sitemap.
//
// Env:
//   INDEXNOW_KEY   the key. Unset means a dry run: diff and snapshot, submit nothing.
//   SNAPSHOT_DIR   where snapshots live. Default: indexnow-snapshots
//   FORCE          "true" skips the mass-change guard for this run.
//
// Run from the repo root. Zero dependencies. Node 22+.

import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const USER_AGENT = "johnf.build-indexnow (+https://johnf.build)";
const TIMEOUT_MS = 30000;
const MAX_SITEMAP_BYTES = 50 * 1024 * 1024; // the sitemap spec's own cap
const MAX_CHILD_SITEMAPS = 100;
const MAX_URLS_PER_REQUEST = 10000; // IndexNow's cap
const MAX_URLS_LOGGED = 50;

// Mass-change guard. A sitemap that stamps every page with "now" on each build
// would resubmit the whole site daily and get us rate limited. Past both bars
// the site is skipped and its old snapshot kept, so a FORCE run can still send it.
const GUARD_MIN_CHANGES = 10;
const GUARD_SHARE = 0.5;

const key = (process.env.INDEXNOW_KEY || "").trim();
const snapshotDir = process.env.SNAPSHOT_DIR || "indexnow-snapshots";
const force = process.env.FORCE === "true";

// A problem with one site. It's reported, and the other sites still run.
class SiteError extends Error {}

async function request(url) {
    try {
        return await fetch(url, {
            headers: { "User-Agent": USER_AGENT },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
    } catch (error) {
        throw new SiteError(`${url}: request failed (${error.name})`);
    }
}

async function fetchText(url) {
    const response = await request(url);
    if (!response.ok) throw new SiteError(`${url}: HTTP ${response.status}`);
    const text = await response.text();
    if (text.length > MAX_SITEMAP_BYTES) throw new SiteError(`${url}: over ${MAX_SITEMAP_BYTES} bytes`);
    return text;
}

function xmlText(raw) {
    return raw
        .trim()
        .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&")
        .trim();
}

// Exact tag names only, so <image:loc> inside a <url> never passes for <loc>.
function tag(block, name) {
    const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
    return match ? xmlText(match[1]) : "";
}

// Base URL of a site, always ending in "/". NightForge lives at a path
// (jfreal.github.io/nightforge/), so this is not always the origin.
function siteBase(url) {
    const base = new URL(url);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    base.search = "";
    base.hash = "";
    return base;
}

// Sitemaps named in robots.txt, else <base>/sitemap.xml. A site at a path
// doesn't own the host's robots.txt, so it skips straight to the fallback.
async function findSitemaps(base) {
    if (base.pathname === "/") {
        const response = await request(new URL("/robots.txt", base));
        if (response.ok) {
            const robots = await response.text();
            const listed = [...robots.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((match) => match[1]);
            if (listed.length) return listed;
        }
    }
    return [new URL("sitemap.xml", base).href];
}

// Reads a sitemap (or a sitemap index, one level deep) into out: { url: lastmod }.
async function readSitemap(url, out, depth = 0) {
    const xml = await fetchText(url);
    if (/<sitemapindex[\s>]/.test(xml)) {
        if (depth > 0) throw new SiteError(`${url}: sitemap index inside a sitemap index`);
        const children = [...xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)]
            .map((match) => tag(match[1], "loc"))
            .filter(Boolean);
        if (children.length > MAX_CHILD_SITEMAPS) {
            throw new SiteError(`${url}: ${children.length} child sitemaps, cap is ${MAX_CHILD_SITEMAPS}`);
        }
        for (const child of children) await readSitemap(child, out, depth + 1);
        return;
    }
    // An SPA that answers every path with index.html gives a 200 here too.
    if (!/<urlset[\s>]/.test(xml)) throw new SiteError(`${url}: not a sitemap (no <urlset> or <sitemapindex>)`);
    for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
        const loc = tag(match[1], "loc");
        if (loc) out[loc] = tag(match[1], "lastmod");
    }
}

async function readSnapshot(file) {
    try {
        return JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw error;
    }
}

// Sorted keys, one URL per line, so the branch history diffs cleanly.
async function writeSnapshot(file, urls) {
    const sorted = Object.fromEntries(Object.entries(urls).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
    await writeFile(file, `${JSON.stringify(sorted, null, 2)}\n`);
}

function diff(previous, current) {
    const added = [];
    const changed = [];
    const removed = [];
    for (const [url, lastmod] of Object.entries(current)) {
        if (!(url in previous)) added.push(url);
        // A <lastmod> that disappeared isn't news. One that moved is.
        else if (lastmod && lastmod !== previous[url]) changed.push(url);
    }
    for (const url of Object.keys(previous)) {
        if (!(url in current)) removed.push(url);
    }
    return { added, changed, removed };
}

const SUBMIT_HINTS = {
    400: "bad request",
    403: "key file missing or doesn't match",
    422: "URLs don't belong to the host, or the key file is in the wrong place",
    429: "too many requests, rate limited",
};

// One request per host (IndexNow's rule). A redirect can move a site to
// another host (wake-windows.netlify.app lists wakewindows.guru URLs), so the
// host comes from each URL, not from products.json.
async function submit(base, urls) {
    const byHost = new Map();
    for (const url of urls) {
        const { host } = new URL(url);
        if (!byHost.has(host)) byHost.set(host, []);
        byHost.get(host).push(url);
    }
    for (const [host, list] of byHost) {
        // A site at a path keeps its key file there, which also limits it to URLs under that path.
        const keyLocation = host === base.host ? new URL(`${key}.txt`, base).href : new URL(`/${key}.txt`, list[0]).href;
        for (let start = 0; start < list.length; start += MAX_URLS_PER_REQUEST) {
            let response;
            try {
                response = await fetch(ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json; charset=utf-8", "User-Agent": USER_AGENT },
                    body: JSON.stringify({ host, key, keyLocation, urlList: list.slice(start, start + MAX_URLS_PER_REQUEST) }),
                    signal: AbortSignal.timeout(TIMEOUT_MS),
                });
            } catch (error) {
                throw new SiteError(`IndexNow request for ${host} failed (${error.name})`);
            }
            // 200 = accepted. 202 = accepted, key check still pending.
            if (response.status !== 200 && response.status !== 202) {
                const hint = SUBMIT_HINTS[response.status] ? `: ${SUBMIT_HINTS[response.status]}` : "";
                throw new SiteError(`IndexNow answered HTTP ${response.status} for ${host}${hint} (key file: ${keyLocation})`);
            }
        }
    }
}

async function loadSites() {
    const site = JSON.parse(await readFile("src/_data/site.json", "utf8"));
    const products = JSON.parse(await readFile("src/_data/products.json", "utf8"));
    const sites = [{ id: new URL(site.url).hostname, url: site.url }];
    for (const product of products) {
        if (!product.url || product.indexnow === false) continue;
        sites.push({ id: product.key, url: product.url });
    }
    return sites;
}

async function runSite(site) {
    const base = siteBase(site.url);
    const current = {};
    for (const sitemap of await findSitemaps(base)) await readSitemap(sitemap, current);
    const total = Object.keys(current).length;
    // Never let an empty sitemap overwrite a snapshot: it would read as "every page was deleted".
    if (!total) throw new SiteError("sitemap has no URLs");

    const file = path.join(snapshotDir, `${site.id.replace(/[^a-z0-9.-]/gi, "_")}.json`);
    const previous = await readSnapshot(file);
    if (!previous) {
        await writeSnapshot(file, current);
        return { total, result: "first run, snapshot saved" };
    }

    const { added, changed, removed } = diff(previous, current);
    const urls = [...added, ...changed, ...removed];
    const counts = { total, added: added.length, changed: changed.length, removed: removed.length };
    if (!urls.length) {
        await writeSnapshot(file, current);
        return { ...counts, result: "no changes" };
    }

    const previousTotal = Object.keys(previous).length;
    if (!force && urls.length > GUARD_MIN_CHANGES && urls.length > previousTotal * GUARD_SHARE) {
        console.log(
            `::warning title=IndexNow ${site.id}::${urls.length} of ${previousTotal} URLs changed at once. ` +
                "Skipped. If the sitemap stamps every page with today's date, fix that. If the change is real, run the workflow with force.",
        );
        return { ...counts, result: "skipped: too many changes" };
    }

    console.log(`${site.id}: ${urls.length} URL(s)`);
    for (const url of urls.slice(0, MAX_URLS_LOGGED)) console.log(`  ${url}`);
    if (urls.length > MAX_URLS_LOGGED) console.log(`  ...and ${urls.length - MAX_URLS_LOGGED} more`);

    if (key) await submit(base, urls);
    // Only after a good submit: a failed one keeps the old snapshot, so tomorrow retries.
    await writeSnapshot(file, current);
    return { ...counts, result: key ? `submitted ${urls.length}` : `dry run, would submit ${urls.length}` };
}

async function main() {
    if (key && !/^[A-Za-z0-9-]{8,128}$/.test(key)) {
        console.log("::error title=IndexNow::INDEXNOW_KEY must be 8 to 128 characters of a-z, A-Z, 0-9, or dashes.");
        process.exitCode = 1;
        return;
    }
    if (!key) console.log("::notice title=IndexNow::INDEXNOW_KEY isn't set. Dry run: snapshots update, nothing is submitted.");

    await mkdir(snapshotDir, { recursive: true });
    const rows = [];
    let failed = 0;
    for (const site of await loadSites()) {
        try {
            rows.push({ site: site.id, ...(await runSite(site)) });
        } catch (error) {
            if (!(error instanceof SiteError)) throw error;
            failed += 1;
            console.log(`::error title=IndexNow ${site.id}::${error.message}`);
            rows.push({ site: site.id, result: `error: ${error.message}` });
        }
    }

    const cell = (value) => (value === undefined ? "" : String(value).replace(/\|/g, "\\|"));
    const table = [
        "| Site | URLs | New | Changed | Removed | Result |",
        "| --- | --: | --: | --: | --: | --- |",
        ...rows.map((row) =>
            `| ${[row.site, row.total, row.added, row.changed, row.removed, row.result].map(cell).join(" | ")} |`,
        ),
    ].join("\n");
    console.log(`\n${table}`);
    if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `## IndexNow\n\n${table}\n`);

    // Red on any site error, so a broken sitemap shows up as a failed run.
    if (failed) process.exitCode = 1;
}

await main();
