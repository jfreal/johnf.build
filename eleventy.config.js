// Eleventy config. Pages live in src/ and get the shared layout; everything
// else (styles, scripts, images, favicons) ships from the repo root as-is.
const PASSTHROUGH_DIRS = ["css", "js", "img", "assets"];

const PASSTHROUGH_FILES = [
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
