# zenrise.jp

The live Zenrise site. GitHub Pages serves `main` at the repo root on the custom
domain `zenrise.jp`.

**Everything committed here is published.** `cms/build-news.py` is readable at
`https://zenrise.jp/cms/build-news.py`. Jekyll consumes `CNAME` and skips paths
beginning with `_`, but assume anything else you add is world-readable on the
client's domain. Internal planning notes belong in `PerpetuaDev/zenrise-staging`
under `docs/`, not here.

## The staging repo is not a branch

`PerpetuaDev/zenrise-staging` is an independent rebuild with **no common
ancestor** — `git merge-base` returns nothing. It is a separate line of work that
periodically gets adopted wholesale, not a branch to fast-forward from.

Staging is also a project page (`perpetuadev.github.io/zenrise-staging/`), so it
is configured for client review rather than production. Adopting it means taking
its tree and then re-applying everything below. The 2026-09-11 go-live (`13f16e1`)
is the worked example.

## Invariants — a staging merge will revert these

Each of these exists only here, and staging will silently undo it:

- **`CNAME`** (`zenrise.jp`). Staging has no custom domain. Without this file
  Pages drops the domain and its certificate.
- **`robots.txt` must be `Allow: /`.** Staging ships `Disallow: /` so client
  review is never indexed. Shipping that verbatim deindexes the live site.
- **The GA tag `G-R1DWL2Q80B`** belongs on every page *and* in all three
  `cms/templates/`. Pages alone is not enough — `tour-*.html` and `news-*.html`
  are generated, so a rebuild strips the tag straight back out if the template
  lacks it.
- **The push-race retry loop in `.github/workflows/build-news.yml`.** Two
  publishes in quick succession race; the loser's push is rejected and its
  rebuild is dropped silently. This actually happened on 2026-08-11 and the
  content had to be recovered by hand in `fcd82c3`.
- **`relay/`** is the source of the DigitalOcean function `contact.html` still
  POSTs to. The function runs whether or not the source is here; deleting it
  loses the source of something live.

## Build pipeline

- `cms/build-news.py` — microCMS → `news.html`, `news-<slug>.html`, **and
  `sitemap.xml`**. It is the single sitemap writer; `build-tours.py` feeds it
  `cms/tours-index.json`. Triggered by `repository_dispatch: [microcms]` from a
  microCMS webhook.
- `cms/build-tours.py` — Bokun → `tours.html`, `tour-<slug>.html`, `go/<slug>/`.
  The catalogue is whatever the Bokun product list named in
  `cms/tours-config.json` (`productListName`) contains; the `allowlist` is only a
  fallback for when no such list exists. `tours-config.json` entries are pinned
  slug/number overrides, not publish decisions.

Unknown fields from either API are ignored — `pick()` and `.get()` throughout —
so a retired CMS field cannot break a build.

## Tests

`python3 -m pytest cms/tests` — 464 tests. **Neither workflow runs them.** They
guard the zero-touch pipeline, so run them before touching `cms/`.

`test_archive_is_untouched` skips here by design: `archive/` is a staging-only
holding pen and is deliberately not published to this repo.
