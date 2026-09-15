# cms/tests/test_watchdog.py
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)))))
from cms import watchdog


class TestExpectedPages(unittest.TestCase):
    def test_an_article_id_becomes_its_page_name(self):
        self.assertEqual(watchdog.article_pages([{'id': 'z3zhwzgsp'}]),
                         {'news-z3zhwzgsp.html'})

    def test_no_articles_expects_no_pages(self):
        self.assertEqual(watchdog.article_pages([]), set())


class TestCmsToRepoDrift(unittest.TestCase):
    """The failure of 2026-08-11: published in the CMS, absent from the repo."""

    def test_an_article_with_no_page_is_reported(self):
        found = watchdog.check(expected={'news-a.html', 'news-b.html'},
                               on_disk={'news-a.html'},
                               index_html='<a href="news-a.html">',
                               status={'news-a.html': 200})
        self.assertIn('news-b.html', found['missing_from_repo'])

    def test_a_fully_built_site_reports_nothing(self):
        found = watchdog.check(expected={'news-a.html'},
                               on_disk={'news-a.html'},
                               index_html='<a href="news-a.html">',
                               status={'news-a.html': 200})
        self.assertEqual(watchdog.findings(found), [])

    def test_a_page_the_cms_does_not_know_about_is_not_a_finding(self):
        # Retiring an article is a CMS decision; cleanup is the build's job,
        # not something to page a human about.
        found = watchdog.check(expected={'news-a.html'},
                               on_disk={'news-a.html', 'news-old.html'},
                               index_html='<a href="news-a.html">',
                               status={'news-a.html': 200})
        self.assertEqual(watchdog.findings(found), [])


class TestRepoToSiteDrift(unittest.TestCase):
    """The page exists in the repo but the deployed site does not serve it."""

    def test_a_page_missing_from_the_live_index_is_reported(self):
        found = watchdog.check(expected={'news-a.html'},
                               on_disk={'news-a.html'},
                               index_html='<a href="news-other.html">',
                               status={'news-a.html': 200})
        self.assertIn('news-a.html', found['missing_from_index'])

    def test_a_page_that_does_not_serve_is_reported(self):
        found = watchdog.check(expected={'news-a.html'},
                               on_disk={'news-a.html'},
                               index_html='<a href="news-a.html">',
                               status={'news-a.html': 404})
        self.assertIn('news-a.html (HTTP 404)', found['unreachable'])

    def test_a_page_that_could_not_be_fetched_at_all_says_so(self):
        # A DNS or TLS failure has no status code; "HTTP 0" in an alert reads
        # like a bug in the watchdog rather than an outage of the site.
        found = watchdog.check(expected={'news-a.html'},
                               on_disk={'news-a.html'},
                               index_html='<a href="news-a.html">',
                               status={'news-a.html': 0})
        self.assertIn('news-a.html (unreachable)', found['unreachable'])

    def test_a_page_missing_from_the_repo_is_not_also_reported_unreachable(self):
        # One root cause, one finding: an unbuilt page cannot serve, and
        # saying so twice buries the thing that actually broke.
        found = watchdog.check(expected={'news-a.html'},
                               on_disk=set(),
                               index_html='',
                               status={})
        self.assertEqual(found['missing_from_repo'], ['news-a.html'])
        self.assertEqual(found['missing_from_index'], [])
        self.assertEqual(found['unreachable'], [])


class TestReport(unittest.TestCase):
    def test_findings_are_flat_human_readable_lines(self):
        found = watchdog.check(expected={'news-b.html'}, on_disk=set(),
                               index_html='', status={})
        lines = watchdog.findings(found)
        self.assertEqual(len(lines), 1)
        self.assertIn('news-b.html', lines[0])
        self.assertIn('microCMS', lines[0])


if __name__ == '__main__':
    unittest.main()
