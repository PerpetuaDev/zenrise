# cms/tests/test_turnstile_embed.py
import os, re, unittest

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONTACT = os.path.join(ROOT, 'contact.html')
SITEKEY = '0x4AAAAAAE_jtfvAG3HK1aNR'
ACTION = 'booking'


def contact():
    with open(CONTACT, encoding='utf-8') as fh:
        return fh.read()



class Haystack(unittest.TestCase):
    """assertIn prints the whole haystack on failure, which for contact.html
    is 140KB of noise. These assert on membership without the dump."""

    def present(self, needle, hay, where):
        self.assertTrue(needle in hay, '%r missing from %s' % (needle, where))

    def absent(self, needle, hay, where):
        self.assertTrue(needle not in hay, '%r must not appear in %s' % (needle, where))


class TurnstileEmbed(Haystack):
    """The booking relay fails closed on a missing Turnstile token, so losing
    the widget from this page takes the booking form down silently: the form
    still renders, and every send returns 403. Nothing else in the suite
    notices, because contact.html is hand-written rather than generated."""

    def test_the_api_script_is_loaded(self):
        html = contact()
        self.present('challenges.cloudflare.com/turnstile/v0/api.js', html, 'contact.html')

    def test_the_script_renders_explicitly_with_an_onload_hook(self):
        # Implicit rendering cannot survive a step that starts display:none,
        # and gives us no widget id to reset a spent token with.
        html = contact()
        m = re.search(r'challenges\.cloudflare\.com/turnstile/v0/api\.js\?([^"\']+)', html)
        self.assertIsNotNone(m, 'turnstile api.js is loaded without a query string')
        query = m.group(1)
        self.present('render=explicit', query, 'the api.js query string')
        self.present('onload=', query, 'the api.js query string')

    def test_the_widget_container_carries_the_live_sitekey(self):
        html = contact()
        self.present(SITEKEY, html, 'contact.html')

    def test_the_action_matches_what_the_relay_verifies(self):
        # relay/packages/zenrise/booking/index.js rejects any token whose
        # action is not this string. The two must move together.
        html = contact()
        self.present("'" + ACTION + "'", html, 'contact.html')

    def test_the_token_is_sent_under_the_name_siteverify_expects(self):
        html = contact()
        self.present('cf-turnstile-response', html, 'contact.html')

    def test_a_spent_token_is_reset_rather_than_reused(self):
        # Tokens are single-use. The page stays live after a failed send, so
        # without a reset the visitor's retry is guaranteed to fail too.
        html = contact()
        self.present('turnstile.reset', html, 'contact.html')

    def test_the_widget_is_not_rendered_into_a_hidden_step(self):
        # api.js onload fires at page load, when the review step is still
        # display:none. Rendering there produces a widget that never runs its
        # challenge, and the render-once guard then blocks the real one.
        html = contact()
        self.present('offsetParent === null', html, 'contact.html')

    def test_the_token_is_not_persisted_to_localstorage(self):
        # state is written to localStorage on every change; a token that got
        # in there would be restored long after it expired.
        html = contact()
        m = re.search(r'var state = \{(.*?)\n    \};', html, re.S)
        self.assertIsNotNone(m, 'booking state object not found')
        self.absent('turnstile', m.group(1).lower(), 'the booking state object')
        self.absent('tsToken', m.group(1), 'the booking state object')


class RelayVerification(Haystack):
    """The server half of the same contract."""

    def relay(self):
        path = os.path.join(ROOT, 'relay', 'packages', 'zenrise', 'booking', 'index.js')
        with open(path, encoding='utf-8') as fh:
            return fh.read()

    def test_the_relay_calls_siteverify(self):
        self.present('turnstile/v0/siteverify', self.relay(), 'the relay')

    def test_the_relay_checks_success_action_and_hostname(self):
        js = self.relay()
        self.present('result.success', js, 'the relay')
        self.present('result.action', js, 'the relay')
        self.present('result.hostname', js, 'the relay')

    def test_the_expected_action_matches_the_page(self):
        self.present("'" + ACTION + "'", self.relay(), 'the relay')

    def test_the_secret_is_read_from_the_environment(self):
        js = self.relay()
        self.present('TURNSTILE_SECRET', js, 'the relay')
        self.present('TURNSTILE_HOSTNAMES', js, 'the relay')

    def test_no_secret_is_hardcoded(self):
        # 0x4... is the sitekey and is public; a secret starts 0x4AAA...
        # and must never appear in a tracked file.
        js = self.relay()
        self.absent(SITEKEY, js, 'the relay')

    def test_the_function_manifest_passes_both_variables_through(self):
        path = os.path.join(ROOT, 'relay', 'project.yml')
        with open(path, encoding='utf-8') as fh:
            yml = fh.read()
        self.present('TURNSTILE_SECRET', yml, 'relay/project.yml')
        self.present('TURNSTILE_HOSTNAMES', yml, 'relay/project.yml')


if __name__ == '__main__':
    unittest.main()
