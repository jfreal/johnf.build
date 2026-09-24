/* Daily rebuild, so product changelogs stay fresh.
 *
 * The product cards and pages read Merge & Tell changelogs at build time
 * (lib/changelog.js). Without this, a new entry only shows up on the next push.
 *
 * Setup: Netlify → Site configuration → Build & deploy → Build hooks →
 * "Add build hook" (branch: master). Put its URL in the env var
 * NETLIFY_BUILD_HOOK_URL. It's a secret: anyone holding it can trigger builds.
 *
 * The netlify.toml `ignore` rule lets these builds through, because a hook
 * build has CACHED_COMMIT_REF == COMMIT_REF, which that rule treats as "build".
 *
 * Zero dependencies. The cron schedule is in netlify.toml
 * ([functions."daily-rebuild"].schedule).
 */
export const handler = async () => {
  const hook = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!hook) {
    console.warn("[daily-rebuild] NETLIFY_BUILD_HOOK_URL is not set. Skipping.");
    return { statusCode: 200 };
  }

  let response;
  try {
    response = await fetch(hook, { method: "POST", body: "{}" });
  } catch (error) {
    // Never log error.message: for a malformed URL, fetch puts the URL in it,
    // and the hook URL is a secret. The error's name is enough to go on.
    console.error(`[daily-rebuild] Could not trigger a build (${error.name}).`);
    return { statusCode: 500 };
  }

  if (!response.ok) {
    console.error(`[daily-rebuild] Build hook answered HTTP ${response.status}.`);
    return { statusCode: 500 };
  }
  console.log("[daily-rebuild] Build triggered.");
  return { statusCode: 200 };
};
