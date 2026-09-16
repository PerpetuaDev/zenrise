"""End-to-end check: does the deployed site match the CMS?

Both of this project's zero-touch pipelines have failed silently. The tours
cron sat commented out from go-live; the microCMS webhook stopped firing on
2026-08-11 and six articles -- two new, four edited -- were missing from the
site for ten days before the client, not us, noticed. A pipeline that stops
publishing looks exactly like a CMS nobody has edited, so the only honest
check is against the live site itself rather than against the pipeline's own
green ticks.

Two layers, because they fail for different reasons and want different fixes:

  CMS  -> repo   the build did not run (dead webhook, skipped cron, red run)
  repo -> site   the build ran but the deploy did not (Pages failure, cache)

The pure functions below take already-fetched data so they can be tested
without network access; main() does the I/O.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request

SITE = 'https://zenrise.jp'
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def article_pages(articles):
    """The page name the build gives each microCMS article."""
    return {f"news-{a['id']}.html" for a in articles}


def check(expected, on_disk, index_html, status,
          cms_revised=None, live_revised=None):
    """Compare what the CMS says should exist against repo and live site.

    A page missing from the repo is reported once, at that layer: it cannot
    serve or be linked, and repeating it downstream buries the root cause.
    A page the CMS no longer knows about is not a finding -- retiring an
    article is an editorial decision and removing its page is the build's job.

    Existence is only half of it. Four of the six articles stranded on
    2026-08-11 were edits to pages that already existed, which no count of
    pages can see, so a page that serves is also checked against the
    revision stamp the build writes into it. A page that could not be read
    has an unknown revision rather than a wrong one, and a page built before
    the stamp existed carries none -- neither is reported.
    """
    cms_revised = cms_revised or {}
    live_revised = live_revised or {}
    missing_from_repo = sorted(p for p in expected if p not in on_disk)
    built = [p for p in sorted(expected) if p in on_disk]
    serving = [p for p in built if status.get(p) == 200]
    return {
        'missing_from_repo': missing_from_repo,
        'missing_from_index': [p for p in built if p not in index_html],
        'unreachable': [f'{p} ({_why(status.get(p))})' for p in built
                        if status.get(p) != 200],
        'stale': [p for p in serving
                  if live_revised.get(p) and cms_revised.get(p)
                  and live_revised[p] != cms_revised[p]],
    }


def _why(code):
    """0 means the request never completed -- DNS, TLS, timeout. Printing
    "HTTP 0" in an alert reads as a watchdog bug rather than a site outage."""
    return f'HTTP {code}' if code else 'unreachable'


def findings(found):
    """One human-readable line per problem, most upstream first."""
    lines = []
    for p in found['missing_from_repo']:
        lines.append(f'{p} is published in microCMS but was never built -- '
                     f'the news build has not run since it was published')
    for p in found['missing_from_index']:
        lines.append(f'{p} exists but {SITE}/news.html does not link it')
    for p in found['unreachable']:
        lines.append(f'{p} does not serve on {SITE}')
    for p in found['stale']:
        lines.append(f'{p} was edited in microCMS after the copy on {SITE} '
                     f'was built -- the site is serving the older text')
    return lines


def _get(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode('utf-8', 'replace')


def _page(url):
    """(status, html). 0 for a request that never completed."""
    try:
        return _get(url)
    except urllib.error.HTTPError as e:
        return e.code, ''
    except OSError:
        return 0, ''


REVISED = re.compile(r'<meta name="cms-revised" content="([^"]*)"')

# Exit codes are the alert's vocabulary, so they have to mean different
# things: 1 is "the site and the CMS disagree", 2 is "the watchdog could not
# find out". Collapsing them made every outage -- a rotated API key, microCMS
# down, zenrise.jp unreachable -- open an issue confidently blaming the news
# build for a problem it had no part in.
OK, DRIFT, CANNOT_CHECK = 0, 1, 2


def main():
    service = os.environ.get('MICROCMS_SERVICE_ID')
    key = os.environ.get('MICROCMS_API_KEY')
    if not (service and key):
        print('watchdog cannot run: MICROCMS_SERVICE_ID / MICROCMS_API_KEY '
              'are not set', file=sys.stderr)
        return CANNOT_CHECK

    try:
        _, body = _get(
            f'https://{service}.microcms.io/api/v1/news'
            f'?limit=100&fields=id,revisedAt,updatedAt',
            {'X-MICROCMS-API-KEY': key})
        articles = json.loads(body)['contents']
    except Exception as e:                      # noqa: BLE001 - reported, not handled
        print(f'watchdog cannot run: microCMS did not answer ({e})', file=sys.stderr)
        return CANNOT_CHECK

    try:
        _, index_html = _get(f'{SITE}/news.html')
    except Exception as e:                      # noqa: BLE001
        print(f'watchdog cannot run: {SITE}/news.html did not answer ({e})',
              file=sys.stderr)
        return CANNOT_CHECK

    expected = article_pages(articles)
    cms_revised = {f"news-{a['id']}.html": (a.get('revisedAt')
                                            or a.get('updatedAt') or '')
                   for a in articles}
    on_disk = {p for p in os.listdir(ROOT) if p.startswith('news-')}

    status, live_revised = {}, {}
    for page in sorted(expected):
        if page not in on_disk:
            continue
        code, html = _page(f'{SITE}/{page}')
        status[page] = code
        m = REVISED.search(html)
        live_revised[page] = m.group(1) if m else ''

    found = check(expected, on_disk, index_html, status, cms_revised, live_revised)
    lines = findings(found)
    if not lines:
        print(f'OK: {len(expected)} article(s) in microCMS, all built, '
              f'serving and current')
        return OK
    print('DRIFT between microCMS and the live site:')
    for line in lines:
        print(f'  - {line}')
    return DRIFT


if __name__ == '__main__':
    sys.exit(main())
