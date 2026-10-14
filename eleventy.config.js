// Eleventy config. Pages live in src/ and get the shared layout; everything
// else (styles, scripts, images, favicons) ships from the repo root as-is.
const PASSTHROUGH_DIRS = ["css", "js", "img", "assets"];

const PASSTHROUGH_FILES = [
    // IndexNow key, served at the site root. Every portfolio site carries the
    // same file; IndexNow fetches it to check the daily job's submissions.
    "a0b4cc5a5653b1278fbe1db5a316aaeb.txt",
    "android-chrome-192x192.png",
    "android-chrome-384x384.png",
    "apple-touch-icon.png",
    "browserconfig.xml",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon.ico",
    "index.js",
    "mstile-150x150.png",
    "safari-pinned-tab.svg",
    "site.webmanifest",
];

const { execFileSync } = require("node:child_process");

// Last commit that touched any of these files, as an ISO timestamp. Feeds the
// sitemap's <lastmod>, which the IndexNow job diffs to spot edited pages.
// Git, not file times: a fresh clone stamps every file with the build time,
// which would mark every page as changed on every deploy. "" (no <lastmod>)
// when git can't answer honestly: no git, an uncommitted file, or a shallow
// clone, where every file looks last touched by the one commit it has.
const gitDates = new Map();
let shallow;
function lastCommitDate(files) {
    const key = files.join("\n");
    if (gitDates.has(key)) return gitDates.get(key);
    let date = "";
    try {
        shallow ??= execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf8" }).trim() === "true";
        if (!shallow) {
            date = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...files], { encoding: "utf8" }).trim();
        }
    } catch {
        date = "";
    }
    gitDates.set(key, date);
    return date;
}

module.exports = function (eleventyConfig) {
    for (const path of [...PASSTHROUGH_DIRS, ...PASSTHROUGH_FILES]) {
        eleventyConfig.addPassthroughCopy({ [path]: path });
    }

    // "2026-09-22T14:03:00.000Z" -> "Sep 22, 2026". UTC so the build machine's
    // time zone can't shift the day.
    const shortDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
    eleventyConfig.addFilter("shortDate", (iso) => shortDate.format(new Date(iso)));

    // Pages build to flat files (stack.html) but are served and linked at the
    // clean URL (/stack). This is the one place that mapping lives: canonical
    // tags, the sitemap, nav matching, and _redirects all go through it.
    // "/index.html" -> "/", "/stack.html" -> "/stack".
    eleventyConfig.addFilter("cleanUrl", (url) =>
        url.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, ""));

    // A page's <lastmod>: its own file, plus the data files named in its
    // `lastmodFrom` front matter. List only the data that carries the page's
    // main content (index reads products.json for its cards). Incidental bits
    // like layouts, the nav, or the "How it fits" box stay out: one edit there
    // would mark most of the site changed, and IndexNow's guard skips that.
    eleventyConfig.addFilter("lastModified", (inputPath, lastmodFrom = []) =>
        lastCommitDate([inputPath, ...lastmodFrom]));

    // lib/ feeds the data files; rebuild when it changes during `npm start`.
    eleventyConfig.addWatchTarget("./lib/");

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data",
        },
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
    };
};
