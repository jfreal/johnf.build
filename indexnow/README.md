# IndexNow

One daily job tells Bing (and Yandex, Seznam, Naver, Yep) which pages changed
on every site in the portfolio. No job in each project repo. Google doesn't use
IndexNow; it still reads the sitemaps on its own.

## How it works

`.github/workflows/indexnow.yml` runs `check.mjs` every day at 11:00 UTC. For
each site it:

1. Finds the sitemap: the `Sitemap:` lines in `robots.txt`, else `/sitemap.xml`.
   Sitemap indexes are followed one level down.
2. Diffs it against the last snapshot.
3. Submits every URL that is new, removed, or has a different `<lastmod>`. One
   request per host.
4. Saves the new snapshot.

Snapshots live on the `indexnow-snapshots` branch, one JSON file per site.
Browse that branch's history to see what changed in any sitemap on any day.

## Which sites

`johnf.build` itself, plus every product in `src/_data/products.json` with a
`url`. A new product card joins automatically. To leave one out, add
`"indexnow": false` to its entry.

## Setup per site

Each host needs the key file: a text file named `<key>.txt` at the site root,
holding only the key. The same key works on every host. If a site redirects to
another domain, the file goes on the domain its sitemap URLs use. A site that
lives at a path (NightForge, at `jfreal.github.io/nightforge/`) keeps the file
at that path instead.

The key itself is the repo variable `INDEXNOW_KEY`. It isn't a secret: anyone
can read it from the key file. While it's unset the job is a dry run. Snapshots
update, nothing is submitted.

## When it goes red

- **A sitemap 404s or isn't XML.** That site is skipped, the others still run,
  and its snapshot stays as it was. An empty sitemap is treated the same way, so
  a bad deploy can't read as "every page was deleted."
- **IndexNow says no.** `403` means the key file is missing or wrong. The
  snapshot isn't updated, so the next run retries the same URLs.

## The mass-change guard

If more than 10 URLs and more than half of a site change in one day, that site
is skipped with a warning instead of submitted. The usual cause is a sitemap
that stamps every page with today's date on each build. That spams IndexNow and
gets the host rate limited. Fix the sitemap. If the change is real (a new
section, a migration), run the workflow by hand with **force** on.

## Sites with no `<lastmod>`

The job still sees pages appear and disappear, but an edit to an existing page
doesn't change the sitemap, so it isn't submitted.

## Run it locally

```
node indexnow/check.mjs
```

Leave `INDEXNOW_KEY` unset for a dry run. Snapshots go in `indexnow-snapshots/`,
which git ignores.
