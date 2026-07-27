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
