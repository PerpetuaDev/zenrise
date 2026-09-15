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
import sys
import urllib.error
import urllib.request

SITE = 'https://zenrise.jp'
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def article_pages(articles):
    """The page name the build gives each microCMS article."""
    return {f"news-{a['id']}.html" for a in articles}


def check(expected, on_disk, index_html, status):
    """Compare what the CMS says should exist against repo and live site.

    A page missing from the repo is reported once, at that layer: it cannot
    serve or be linked, and repeating it downstream buries the root cause.
    A page the CMS no longer knows about is not a finding -- retiring an
    article is an editorial decision and removing its page is the build's job.
    """
    missing_from_repo = sorted(p for p in expected if p not in on_disk)
    built = [p for p in sorted(expected) if p in on_disk]
    return {
        'missing_from_repo': missing_from_repo,
        'missing_from_index': [p for p in built if p not in index_html],
        'unreachable': [f'{p} ({_why(status.get(p))})' for p in built
                        if status.get(p) != 200],
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
    return lines


def _get(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode('utf-8', 'replace')


def _status(url):
    try:
        return _get(url)[0]
    except urllib.error.HTTPError as e:
        return e.code
    except OSError:
        return 0


def main():
    service = os.environ.get('MICROCMS_SERVICE_ID')
    key = os.environ.get('MICROCMS_API_KEY')
    if not (service and key):
        print('MICROCMS_SERVICE_ID / MICROCMS_API_KEY are required', file=sys.stderr)
        return 2

    _, body = _get(f'https://{service}.microcms.io/api/v1/news?limit=100&fields=id',
                   {'X-MICROCMS-API-KEY': key})
    expected = article_pages(json.loads(body)['contents'])

    on_disk = {p for p in os.listdir(ROOT) if p.startswith('news-')}
    _, index_html = _get(f'{SITE}/news.html')
    status = {p: _status(f'{SITE}/{p}') for p in sorted(expected) if p in on_disk}

    found = check(expected, on_disk, index_html, status)
    lines = findings(found)
    if not lines:
        print(f'OK: {len(expected)} article(s) in microCMS, all built and serving')
        return 0
    print('DRIFT between microCMS and the live site:')
    for line in lines:
        print(f'  - {line}')
    return 1


if __name__ == '__main__':
    sys.exit(main())
