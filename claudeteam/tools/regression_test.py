# /// script
# requires-python = ">=3.10"
# dependencies = ["playwright>=1.48"]
# ///
"""Regression test for hishamabuella.com: run it before every push.

    uv run claudeteam/tools/regression_test.py            # full run (about 3 minutes)
    uv run claudeteam/tools/regression_test.py --quick    # laptop/dark + phone/light only

1. The static checks: site_check.py, ar_parity.py, ar_parity.py home, ar_style.py.
2. Every live page (gateway, full site EN/AR, CV, 404, the four tracks EN/AR, every article
   EN/AR, a skinned article per track, the project pages) at 390px and 1440px, light and dark:
   no JS errors, no failed local requests, no horizontal scroll, no broken images.
3. Behaviour: the gateway countdown and its stop, "Continue" after a track, reader-path set
   and cleared, article skins, the Back menu, the Listen player, the language switch, the
   theme switch, mini Hisham (mono on the vibe track) and the Hairline stations.

Uses the installed Google Chrome (falls back to Playwright's Chromium). Exit code 1 on any
failure. Expected noise is ignored: GoatCounter, and the Arabic narration not recorded yet.
"""
import functools
import http.server
import os
import re
import subprocess
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
QUICK = '--quick' in sys.argv
failures = []


def fail(where, what):
    failures.append(f'{where}: {what}')
    print(f'  FAIL {where}: {what}')


def ok(msg):
    print(f'  ok   {msg}')


# ---------------------------------------------------------------- 1. static checks
def static_checks():
    print('== static checks')
    for cmd in (['site_check.py'], ['ar_parity.py'], ['ar_parity.py', 'home'], ['ar_style.py']):
        r = subprocess.run([sys.executable, os.path.join(ROOT, 'claudeteam/tools', cmd[0]), *cmd[1:]],
                           cwd=ROOT, capture_output=True, text=True)
        last = (r.stdout.strip().splitlines() or ['(no output)'])[-1]
        if r.returncode != 0 or 'FAIL' in r.stdout:
            fail(' '.join(cmd), r.stdout.strip()[-600:] or r.stderr.strip()[-600:])
        else:
            ok(f'{" ".join(cmd)}: {last}')


# ---------------------------------------------------------------- server
def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    handler = functools.partial(Quiet, directory=ROOT)
    class Server(http.server.ThreadingHTTPServer):
        def handle_error(self, request, client_address):
            pass  # a browser cancelling an audio load breaks the pipe; not a site problem
    httpd = Server(('127.0.0.1', 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, f'http://127.0.0.1:{httpd.server_address[1]}/'


def live_pages():
    files = subprocess.check_output(['git', 'ls-files', '*.html'], cwd=ROOT, text=True).split()
    keep = []
    for f in files:
        if f.startswith(('different_designs/', 'claudeteam/', 'projects/presentation-skill/',
                         'projects/local-model-performance/decks/', 'projects/bedtime-stories/books/')):
            continue
        keep.append(f)
    extra = ['index.html?lang=ar'] + [f'tracks/{t}.html?lang=ar' for t in ('recruiter', 'engineer', 'vibe', 'learner')]
    extra += [f'Articles/journey.html?via={t}' for t in ('recruiter', 'engineer', 'vibe', 'learner')]
    extra += ['Articles/ar/journey.html?via=vibe', 'Articles/ar/journey.html?via=learner']
    return keep + extra


IGNORED = re.compile(r'goatcounter|gc\.zgo\.at|/audio/articles/ar/[^/]+\.mp3')


def new_context(browser, w, h, scheme, buddy=True):
    ctx = browser.new_context(viewport={'width': w, 'height': h}, color_scheme=scheme)
    ctx.route(re.compile(r'goatcounter|gc\.zgo\.at'), lambda r: r.abort())
    if not buddy:
        ctx.add_init_script("try{localStorage.setItem('mascot-buddy','off')}catch(e){}")
    return ctx


# ---------------------------------------------------------------- 2. page sweep
def sweep(browser, base):
    configs = [(1440, 900, 'dark'), (390, 844, 'light')] if QUICK else \
              [(390, 844, 'light'), (390, 844, 'dark'), (1440, 900, 'light'), (1440, 900, 'dark')]
    pages = live_pages()
    for w, h, scheme in configs:
        print(f'== sweep {w}px {scheme}: {len(pages)} pages')
        ctx = new_context(browser, w, h, scheme)
        bad = 0
        for p in pages:
            pg = ctx.new_page()
            errs = []
            pg.on('pageerror', lambda e: errs.append(f'JS error: {e}'))
            pg.on('console', lambda m: errs.append(f'console: {m.text}')
                  if m.type == 'error' and not re.search(r'ERR_FAILED|ERR_ABORTED|goatcounter', m.text) else None)
            # ERR_ABORTED is a cancelled request (media range loads, listen.js's HEAD check once
            # it has the headers); a missing file shows up as an HTTP 404 below instead.
            pg.on('requestfailed', lambda r: errs.append(f'request failed: {r.url} {r.failure}')
                  if not IGNORED.search(r.url) and 'ERR_ABORTED' not in (r.failure or '') else None)
            pg.on('response', lambda r: errs.append(f'HTTP {r.status}: {r.url}')
                  if r.status >= 400 and not IGNORED.search(r.url) else None)
            try:
                pg.goto(base + p, wait_until='load', timeout=20000)
                pg.wait_for_timeout(300)
                info = pg.evaluate("""() => {
                    const de = document.documentElement;
                    const over = de.scrollWidth - de.clientWidth;
                    const broken = [...document.images].filter(i => i.complete && i.naturalWidth === 0
                        && i.getAttribute('src') && getComputedStyle(i).display !== 'none').map(i => i.getAttribute('src'));
                    return { over, broken };
                }""")
                if info['over'] > 1:
                    errs.append(f'horizontal scroll: {info["over"]}px')
                if info['broken']:
                    errs.append(f'broken images: {info["broken"][:3]}')
            except Exception as e:  # noqa: BLE001
                errs.append(f'load: {str(e)[:120]}')
            for e in dict.fromkeys(errs):
                fail(f'{w}/{scheme} {p}', e)
                bad += 1
            pg.close()
        ctx.close()
        if not bad:
            ok(f'all {len(pages)} pages clean')


# ---------------------------------------------------------------- 3. behaviour
def check(name, cond, detail=''):
    (ok(name) if cond else fail('behaviour', f'{name} {detail}'.strip()))


def behaviour(browser, base):
    print('== behaviour')
    ctx = new_context(browser, 1440, 900, 'dark', buddy=False)
    pg = ctx.new_page()

    # Gateway countdown (fake clock, so it takes no real 30 s)
    for q, home in (('', 'home.html'), ('?lang=ar', 'ar/home.html')):
        pg.clock.install()
        pg.goto(base + 'index.html' + q)
        pg.evaluate('localStorage.clear()')
        pg.reload()
        pg.clock.run_for(31000)
        pg.wait_for_timeout(500)
        check(f'gateway{q} opens {home} after 30 s', pg.url.endswith(home), pg.url)
    pg.close(); pg = ctx.new_page()
    pg.clock.install()
    pg.goto(base + 'index.html')
    pg.keyboard.press('Shift')
    pg.clock.run_for(31000)
    pg.wait_for_timeout(300)
    check('a key press stops the countdown', pg.url.endswith('index.html'), pg.url)
    pg.close(); pg = ctx.new_page()

    # Tracks: reader-path, continue, skin, clear on home
    pg.goto(base + 'tracks/vibe.html')
    check('track stores reader-path', pg.evaluate("localStorage.getItem('reader-path')") == 'vibe')
    pg.goto(base + 'Articles/journey.html'); pg.wait_for_timeout(300)
    check('article takes the stored track skin', 'terminal' in (pg.evaluate('document.documentElement.outerHTML.slice(0,300)') or ''))
    pg.goto(base + 'tracks/learner.html'); pg.goto(base + 'index.html'); pg.wait_for_timeout(500)
    cont = pg.evaluate("(() => { const a = document.getElementById('backGo'); return a && a.offsetParent ? a.getAttribute('href') : null })()")
    check('gateway offers "Continue" to the last track', bool(cont) and 'learner' in cont, str(cont))
    pg.goto(base + 'home.html')
    check('home.html clears reader-path', pg.evaluate("localStorage.getItem('reader-path')") is None)

    # Back menu, both languages
    for f, want in (('Articles/journey.html', ['../home.html', '../tracks/vibe.html']),
                    ('Articles/ar/journey.html', ['../../ar/home.html', '../../tracks/vibe.html?lang=ar'])):
        pg.goto(base + f)
        hrefs = pg.evaluate("[...document.querySelectorAll('.back-menu a')].map(a => a.getAttribute('href'))")
        check(f'Back menu on {f}', all(x in hrefs for x in want) and len(hrefs) >= 5, str(hrefs))

    # Listen player
    pg.goto(base + 'Articles/journey.html'); pg.wait_for_timeout(1500)
    check('English Listen player shown', pg.evaluate("(() => { const l = document.querySelector('.listen'); return !!l && !l.hidden && getComputedStyle(l).display !== 'none' })()"))
    pg.goto(base + 'Articles/ar/journey.html'); pg.wait_for_timeout(1500)
    check('Arabic Listen player hidden until its mp3 exists', pg.evaluate("(() => { const l = document.querySelector('.listen'); return !l || l.hidden || getComputedStyle(l).display === 'none' })()"))

    # Language switch on a track
    pg.goto(base + 'tracks/engineer.html'); pg.wait_for_load_state('load'); pg.wait_for_timeout(300)
    before = pg.evaluate('document.documentElement.dir') or 'ltr'
    pg.click('[data-lang-toggle] >> visible=true'); pg.wait_for_timeout(300)
    after = pg.evaluate('document.documentElement.dir') or 'ltr'
    check('track language switch flips the direction', before != after, f'{before} -> {after}')
    pg.goto(base + 'tracks/engineer.html?lang=ar')
    check('?lang=ar opens the track in Arabic', pg.evaluate('document.documentElement.lang').startswith('ar'))

    # Theme switch on a track
    pg.goto(base + 'tracks/recruiter.html')
    before = pg.evaluate('document.documentElement.dataset.theme')
    btns = pg.query_selector_all('[data-theme-switch] button')
    target = next((b for b in btns if (b.get_attribute('data-theme-choice') or b.text_content().strip().lower()) in ('light', 'فاتح')), None)
    if target:
        target.click(); pg.wait_for_timeout(200)
        check('track theme switch changes the theme', pg.evaluate('document.documentElement.dataset.theme') == 'light', f'was {before}')
    else:
        check('track theme switch has a Light button', False, str([b.text_content() for b in btns]))

    # Mini Hisham and Hairline
    pg.goto(base + 'tracks/vibe.html'); pg.wait_for_timeout(400)
    m = pg.evaluate("[...document.querySelectorAll('.mascot')].map(e => ({kids: e.children.length, f: getComputedStyle(e).filter}))")
    check('mini Hisham mounted on the vibe track', len(m) >= 2 and all(x['kids'] for x in m), str(m))
    check('vibe track mascots are black and white', all('grayscale' in x['f'] for x in m), str(m))
    pg.goto(base + 'tracks/engineer.html'); pg.wait_for_timeout(400)
    check('engineer track mascots in colour', pg.evaluate("[...document.querySelectorAll('.mascot')].every(e => getComputedStyle(e).filter === 'none')"))
    check('no track still shows bio.jpg', pg.evaluate("![...document.images].some(i => /bio\\.jpg/.test(i.src))"))
    pg.goto(base + 'index.html'); pg.wait_for_timeout(1500)
    n = pg.evaluate("[...document.querySelectorAll('.st .fig')].filter(f => f.querySelector('svg,canvas')).length")
    check('gateway: four Hairline station figures on a laptop', n == 4, f'{n} drawn')
    ctx.close()

    ctx = new_context(browser, 390, 844, 'light', buddy=False)
    pg = ctx.new_page(); pg.goto(base + 'index.html'); pg.wait_for_timeout(800)
    check('gateway: Hairline figures hidden on a phone',
          pg.evaluate("[...document.querySelectorAll('.st .fig')].every(f => f.getBoundingClientRect().width === 0)"))
    ctx.close()


def main():
    static_checks()
    httpd, base = serve()
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(channel='chrome')
        except Exception:  # noqa: BLE001
            browser = p.chromium.launch()
        sweep(browser, base)
        behaviour(browser, base)
        browser.close()
    httpd.shutdown()
    print()
    if failures:
        print(f'FAIL {len(failures)} problem(s)')
        sys.exit(1)
    print('OK   regression test passed')


if __name__ == '__main__':
    main()
