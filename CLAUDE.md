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
- **`<meta name="cms-revised">` in `cms/templates/article.html`.** The watchdog
  compares it against microCMS to spot an *edited* article whose page was never
  rebuilt — the majority of the 2026-08-11 incident. Staging's template has no
  such tag, so an adoption silently blinds that check, and it fails open: pages
  without the stamp are reported as fine.
- **The push-race retry loop in `.github/workflows/build-news.yml`.** Two
  publishes in quick succession race; the loser's push is rejected and its
  rebuild is dropped silently. This actually happened on 2026-08-11 and the
  content had to be recovered by hand in `fcd82c3`.
- **`relay/`** is the source of the DigitalOcean function `contact.html` still
  POSTs to. The function runs whether or not the source is here; deleting it
  loses the source of something live.
- **The Turnstile widget in `contact.html`.** The relay verifies a Turnstile
  token and fails closed, so a `contact.html` without the widget does not
  degrade gracefully — every send returns 403 and the booking form stops
  taking enquiries with no error anywhere but the visitor's screen. Staging's
  `contact.html` predates it. Sitekey `0x4AAAAAAE_jtfvAG3HK1aNR`, action
  `booking`; `cms/tests/test_turnstile_embed.py` guards both halves, and the
  action string has to match on both sides or every token is rejected.

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
- `cms/watchdog.py` — checks the **deployed site** against microCMS daily
  (`watchdog.yml`, 07:00 JST) and opens an issue on drift. Exit 1 means the two
  disagree; exit 2 means it could not find out. It never fails the job red.

The news build runs on the microCMS webhook *and* hourly at `:30`. The webhook
stopped firing between 2026-08-11 and 2026-09-16 with nothing to show for it, so
the schedule is the floor on staleness; `:30` keeps it clear of `build-tours` at
`:00`, which pushes to the same branch.

**Images:** every microCMS rendition pins width *and* height with
`fit=crop&crop=faces,entropy`. Asking for a width alone returns the source's own
shape, and the fixed-height CSS slots then centre-crop it — which sliced a
portrait hero through the subject. Portrait figures take `IMG_FIG_TALL`, because
they land in a taller box (`.fig .ph.tall`).

**`build-news.py` refuses to publish an empty catalogue** (`--allow-empty`
overrides). An empty `contents` arrives as a 200, and the stale sweep would then
delete every article page and push the deletion.

Unknown fields from either API are ignored — `pick()` and `.get()` throughout —
so a retired CMS field cannot break a build.

## Tests

`python3 -m pytest cms/tests` — 526 tests. Also `python3 -m unittest discover -s
cms/tests -t .`, which is what CI uses so the runner needs no install.

**Both build workflows run them**, after the build and before the commit, so a
failure stops publication rather than merely colouring a run red. Nothing ran
them until 2026-09-16, which is how two sat red from the first tour the client
published until someone happened to look.

`test_archive_is_untouched` skips here by design: `archive/` is a staging-only
holding pen and is deliberately not published to this repo.
