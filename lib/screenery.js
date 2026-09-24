// Product screenshots from Screenery, read at build time.
//
// Each product in src/_data/products.json names a Screenery project, a hero
// asset for its card, and a curated gallery. Screenery has no hero flag,
// caption, or alt text, so the picking and the words live in products.json.
// This file only turns asset names into URLs and sizes.
//
// The gallery endpoint is public for public projects: no token, 60 reads a
// minute per IP. One read per product.
//
// Images use the `@latest` channel URL, so a merge that re-shoots a screen
// updates this site without a rebuild. The width/height come from the build.

const API = "https://app.screenery.dev/v1/projects";
const CDN = "https://cdn.screenery.dev";
const TIMEOUT_MS = 20000;

// A 4xx other than 429 means the project or channel is gone or private.
// Guessed URLs can't fix that, so it fails the build instead of falling back.
class PermanentError extends Error {}

// Every asset on the channel, across pages. The cursor is opaque; pass it back.
async function fetchAssets(project) {
    const assets = [];
    let cursor = null;
    do {
        const query = `limit=200${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
        const response = await fetch(`${API}/${project}/channels/latest/gallery?${query}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!response.ok) {
            const Err = response.status >= 400 && response.status < 500 && response.status !== 429
                ? PermanentError
                : Error;
            throw new Err(`HTTP ${response.status}`);
        }
        const doc = await response.json();
        assets.push(...doc.groups.flatMap((group) => group.assets));
        cursor = doc.page?.has_more ? doc.page.next_cursor : null;
    } while (cursor);
    return assets;
}

// Asset URL by convention, no size. Used when the API is down so the page
// still shows the screenshot instead of nothing.
function guess(project, asset) {
    return { src: `${CDN}/${project}/${asset}@latest.png`, width: null, height: null };
}

async function load(product) {
    const { project, hero, gallery = [] } = product.screenery;

    let all;
    try {
        all = await fetchAssets(project);
    } catch (error) {
        if (error instanceof PermanentError) {
            throw new Error(`[screenery] ${project} @latest answered ${error.message}. Is it public, and does the channel exist?`);
        }
        // A Screenery outage should not take the whole site down with it.
        const reason = error.name === "TimeoutError" ? "timed out" : error.message;
        console.warn(`[screenery] Could not read ${project} (${reason}). Using guessed URLs.`);
        return {
            hero: guess(project, hero),
            gallery: gallery.map((item) => ({ ...item, ...guess(project, item.asset) })),
        };
    }

    const assets = new Map(
        all
            .filter((asset) => asset.visibility === "public" && asset.to)
            .map((asset) => [asset.name, asset.to]),
    );

    // The API answered, so a missing name is our mistake, not an outage.
    // Fail the build rather than ship a broken image.
    const pick = (name) => {
        const to = assets.get(name);
        if (!to) {
            throw new Error(
                `[screenery] ${project} has no public "${name}" on @latest. ` +
                    `Was it renamed? Fix src/_data/products.json.`,
            );
        }
        return { src: to.channel_url, width: to.width, height: to.height };
    };

    return {
        hero: pick(hero),
        gallery: gallery.map((item) => ({ ...item, ...pick(item.asset) })),
    };
}

module.exports = { load, origin: CDN };
