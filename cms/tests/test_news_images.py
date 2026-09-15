# cms/tests/test_news_images.py
import glob
import importlib.util
import os
import re
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SPEC = importlib.util.spec_from_file_location(
    'build_news', os.path.join(ROOT, 'cms', 'build-news.py'))
bn = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(bn)

TRANSFORMS = ('IMG_PAGE', 'IMG_FIG', 'IMG_CARD', 'IMG_OG')
CMS_IMG = re.compile(r"url\('(https://images\.microcms-assets\.io/[^']+)'\)")


class TestTransforms(unittest.TestCase):
    """Asking microCMS for a width alone leaves the aspect ratio to chance:
    the rendition arrives in the source's own shape and the fixed-height CSS
    slot centre-crops whatever it gets. A 2334x3500 portrait hero was sliced
    through the hand that way (2026-09-16)."""

    def test_every_transform_pins_both_dimensions(self):
        for name in TRANSFORMS:
            value = getattr(bn, name)
            self.assertRegex(value, r'[?&]w=\d+', name)
            self.assertRegex(value, r'[?&]h=\d+', name)

    def test_every_transform_crops_rather_than_squashing(self):
        for name in TRANSFORMS:
            self.assertIn('fit=crop', getattr(bn, name), name)

    def test_every_transform_picks_the_crop_by_content(self):
        # center slices whatever sits at the frame edge; entropy keeps the
        # subject whole and lets the cut fall on empty ground.
        for name in TRANSFORMS:
            self.assertIn('crop=', getattr(bn, name), name)


class TestBuiltPages(unittest.TestCase):
    """The invariant on the real pages: no CMS image is ever requested in an
    unconstrained shape."""

    @classmethod
    def setUpClass(cls):
        cls.pages = {}
        for p in glob.glob(os.path.join(ROOT, 'news*.html')):
            with open(p, encoding='utf-8') as f:
                cls.pages[os.path.basename(p)] = f.read()

    def test_there_are_pages_to_check(self):
        self.assertTrue(self.pages)

    def test_no_cms_image_is_requested_without_a_crop(self):
        bad = []
        for name, html in self.pages.items():
            for url in CMS_IMG.findall(html):
                if 'fit=crop' not in url:
                    bad.append(f'{name}: {url}')
        self.assertEqual(bad, [])


if __name__ == '__main__':
    unittest.main()
