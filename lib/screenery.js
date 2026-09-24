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

async function fetchGallery(project) {
    const response = await fetch(`${API}/${project}/channels/latest/gallery?limit=200`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const doc = await response.json();
    if (doc.page?.has_more) {
        console.warn(`[screenery] ${project} has more than 200 assets. Only the first page was read.`);
    }
    return doc;
}

// Asset URL by convention, no size. Used when the API is down so the page
// still shows the screenshot instead of nothing.
function guess(project, asset) {
    return { src: `${CDN}/${project}/${asset}@latest.png`, width: null, height: null };
}

async function load(product) {
    const { project, hero, gallery = [] } = product.screenery;

    let doc;
    try {
        doc = await fetchGallery(project);
    } catch (error) {
        // A Screenery outage should not take the whole site down with it.
        console.warn(`[screenery] Could not read ${project} (${error.message}). Using guessed URLs.`);
        return {
            hero: guess(project, hero),
            gallery: gallery.map((item) => ({ ...item, ...guess(project, item.asset) })),
        };
    }

    const assets = new Map(
        doc.groups
            .flatMap((group) => group.assets)
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
