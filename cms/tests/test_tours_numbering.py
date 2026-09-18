# cms/tests/test_tours_numbering.py
"""Tour display numbers: unique, gapless, and never colliding with a pin.

Regression cover for the 2026-09-18 bug: the home page showed two "No. 01"
tiles and no "No. 05" at all.

Two numbering schemes shared one namespace. `tours-config.json` pins numbers
by hand (01-04); every other tour derived one from its *position* in
`tours-slugs.json`. Nothing reconciled the two, so an unpinned tour sitting at
registry position 1 derived "01" and collided with the pinned ikebana tour,
while position 5 belonged to a pinned tour and so nobody ever derived "05".

The position was not even stable. `tours_slug.save_registry` sorts keys on
every save, but a key added mid-run is *appended* in memory. So
`kamakura-enoshima-yokohama-local` published as "No. 05" on the run that minted
it (appended, position 5) and silently became "No. 01" on the very next build
(loaded sorted, position 1) -- verified in commits 6333b54 -> de8b268.

The invariant tests below read the built pages, so they fail on the symptom the
client would actually see. The unit tests pin the allocation rule itself.
"""
import glob, json, os, re, unittest

from cms import bokun_source

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# The two surfaces a visitor reads a tour number off. The home tile is where
# the duplicate "No. 01" was reported; the grid card is the same number on
# tours.html, and the two disagreeing would be its own bug.
SURFACES = {
    'index.html': r'<a class="dest" href="tour-([a-z0-9-]+)\.html">'
                  r'.*?<span class="num-tag">No\.\s*([0-9]+)</span>',
    'tours.html': r'<a class="tcard" href="tour-([a-z0-9-]+)\.html"'
                  r'.*?<span class="num">No\.\s*([0-9]+)</span>',
}


def built_numbers(page):
    """{slug: number} as the committed page actually renders it."""
    with open(os.path.join(ROOT, page), encoding='utf-8') as f:
        html = f.read()
    return dict(re.findall(SURFACES[page], html, re.S))


def committed_config_and_registry():
    with open(os.path.join(ROOT, 'cms', 'tours-config.json'), encoding='utf-8') as f:
        cfg = json.load(f)
    with open(os.path.join(ROOT, 'cms', 'tours-slugs.json'), encoding='utf-8') as f:
        registry = json.load(f)
    return cfg, registry


class TestBuiltCatalogueNumbering(unittest.TestCase):
    """The invariant, asserted against what the site actually serves."""

    def test_no_two_tours_share_a_number(self):
        for page in SURFACES:
            numbers = built_numbers(page)
            self.assertTrue(numbers, f'{page}: found no tour numbers to check')
            seen = {}
            for slug, num in sorted(numbers.items()):
                seen.setdefault(num, []).append(slug)
            clashes = {n: s for n, s in seen.items() if len(s) > 1}
            self.assertEqual(clashes, {}, f'{page}: duplicate tour numbers: {clashes}')

    def test_the_numbers_run_from_01_with_no_gaps(self):
        for page in SURFACES:
            numbers = built_numbers(page)
            self.assertTrue(numbers, f'{page}: found no tour numbers to check')
            got = sorted(numbers.values())
            want = [f'{i:02d}' for i in range(1, len(numbers) + 1)]
            self.assertEqual(got, want, f'{page}: numbering is not a clean run')

    def test_both_surfaces_agree_on_every_tours_number(self):
        self.assertEqual(built_numbers('index.html'), built_numbers('tours.html'))


class TestNumberAllocation(unittest.TestCase):
    """The rule: a pin wins; everyone else takes the lowest number no pin has
    claimed, in registry order."""

    def test_a_derived_number_never_takes_a_number_a_pin_claimed(self):
        # 'a' is pinned to 01. 'b' sits at registry position 1 and is
        # unpinned -- the old rule handed it 01 too.
        cfg = {'tours': {'100': {'slug': 'a', 'number': '01'}}}
        registry = {'50': 'b', '100': 'a'}
        self.assertEqual(bokun_source.derive_number('50', registry, cfg), '02')

    def test_derived_numbers_fill_the_numbers_pins_leave_free(self):
        # Pins hold 01 and 03, so the two unpinned tours take 02 and 04.
        cfg = {'tours': {'100': {'slug': 'a', 'number': '01'},
                         '300': {'slug': 'c', 'number': '03'}}}
        registry = {'100': 'a', '200': 'b', '300': 'c', '400': 'd'}
        self.assertEqual(bokun_source.derive_number('200', registry, cfg), '02')
        self.assertEqual(bokun_source.derive_number('400', registry, cfg), '04')

    def test_a_pinned_tour_takes_its_pin_and_consumes_no_derived_slot(self):
        cfg = {'tours': {'100': {'slug': 'a', 'number': '07'}}}
        registry = {'100': 'a', '200': 'b'}
        self.assertEqual(bokun_source.derive_number('100', registry, cfg), '07')
        # 'b' is the only unpinned tour, so it takes 01 -- not 02.
        self.assertEqual(bokun_source.derive_number('200', registry, cfg), '01')

    def test_the_committed_config_and_registry_allocate_cleanly(self):
        """The real data must produce a unique, gapless run -- this is the
        pure-computation twin of the built-page invariant above."""
        cfg, registry = committed_config_and_registry()
        nums = [bokun_source.derive_number(pid, registry, cfg) for pid in registry]
        self.assertEqual(sorted(nums),
                         [f'{i:02d}' for i in range(1, len(registry) + 1)])


if __name__ == '__main__':
    unittest.main()
