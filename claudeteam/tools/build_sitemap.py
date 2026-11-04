"""Build sitemap.xml from the pages themselves.

    python3 claudeteam/tools/build_sitemap.py           # write sitemap.xml
    python3 claudeteam/tools/build_sitemap.py --check   # exit 1 if sitemap.xml is out of date

A page is listed when it is tracked in git, outside different_designs/ and claudeteam/, has no
robots noindex, and its canonical link points at its own address. Its hreflang links become
<xhtml:link> alternates (so the tracks' ?lang=ar versions are announced without being listed
twice), and <lastmod> is the date of the file's last commit. Run it after adding, moving or
removing a page; the regression test runs --check.
"""
import os
import re
import subprocess
import sys
from html import escape

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE = 'https://www.hishamabuella.com/'
SKIP = ('different_designs/', 'claudeteam/')


def own_url(path):
    if path == 'index.html':
        return SITE
    if path.endswith('/index.html'):
        return SITE + path[:-len('index.html')]
    return SITE + path


def entries():
    files = subprocess.check_output(['git', 'ls-files', '*.html'], cwd=ROOT, text=True).split()
    out = []
    for f in sorted(files):
        if f.startswith(SKIP):
            continue
        html = open(os.path.join(ROOT, f), encoding='utf-8').read()
        if re.search(r'<meta\s+name="robots"\s+content="[^"]*noindex', html, re.I):
            continue
        m = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', html)
        if not m or m.group(1) != own_url(f):
            continue
        alts = re.findall(r'<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"', html)
        date = subprocess.check_output(['git', 'log', '-1', '--format=%cs', '--', f], cwd=ROOT, text=True).strip()
        out.append((m.group(1), date, alts))
    out.sort(key=lambda e: (e[0] != SITE, e[0]))  # front page first
    return out


def render():
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
             '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for url, date, alts in entries():
        lines.append('  <url>')
        lines.append(f'    <loc>{escape(url)}</loc>')
        if date:
            lines.append(f'    <lastmod>{date}</lastmod>')
        for lang, href in alts:
            lines.append(f'    <xhtml:link rel="alternate" hreflang="{escape(lang)}" href="{escape(href)}"/>')
        lines.append('  </url>')
    lines.append('</urlset>')
    return '\n'.join(lines) + '\n'


def main():
    path = os.path.join(ROOT, 'sitemap.xml')
    new = render()
    if '--check' in sys.argv:
        old = open(path, encoding='utf-8').read() if os.path.exists(path) else ''
        # lastmod moves with every commit; compare the list of pages and alternates only
        strip = lambda s: re.sub(r'\s*<lastmod>[^<]*</lastmod>', '', s)
        if strip(old) != strip(new):
            print('FAIL sitemap.xml is out of date: run python3 claudeteam/tools/build_sitemap.py')
            sys.exit(1)
        print(f'OK   sitemap ({new.count("<loc>")} pages)')
        return
    open(path, 'w', encoding='utf-8').write(new)
    print(f'wrote sitemap.xml ({new.count("<loc>")} pages)')


if __name__ == '__main__':
    main()
