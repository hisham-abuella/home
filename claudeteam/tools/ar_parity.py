"""Check an Arabic article against its English source.

    python3 claudeteam/tools/ar_parity.py journey        # one article
    python3 claudeteam/tools/ar_parity.py home           # the full site: home.html vs ar/home.html
    python3 claudeteam/tools/ar_parity.py                # all articles plus home

Passes when both pages have the same body structure (same tags in the same
order, same href/src targets once the extra ../ is allowed for) and the Arabic
page has no long English sentences left in its visible text (code, pre,
translate="no", lang="en", quotes in «…» and blocks like .search-dump are skipped:
they hold quoted source material, such as prompts given to a model).
"""
import re
import glob, os, re, sys
from html.parser import HTMLParser

SKIP = {'script', 'style', 'code', 'pre', 'kbd', 'samp'}
# Quoted material that stays in its original language (e.g. the real search results in Two Nails).
KEEP_CLASSES = {'search-dump'}

class Walk(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags, self.links, self.text, self.stack = [], [], [], []
        self.body = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'body': self.body = True
        if not self.body: return
        self.tags.append(tag)
        for k in ('href', 'src', 'data-src'):
            if a.get(k): self.links.append(a[k])
        if tag not in ('br', 'img', 'meta', 'link', 'input', 'source', 'hr', 'wbr'):
            keep = a.get('translate') == 'no' or a.get('lang', '').startswith('en') or KEEP_CLASSES & set((a.get('class') or '').split())
            self.stack.append('pre' if keep else tag)
    def handle_endtag(self, tag):
        if self.stack:
            self.stack.pop()
    def handle_data(self, data):
        if self.body and not any(t in SKIP for t in self.stack):
            self.text.append(' '.join(data.split()))

def norm_article(link):
    link = re.sub(r'^(\.\./)+', '../', link)
    link = link.replace('audio/articles/ar/', 'audio/articles/')
    link = re.sub(r'(presentation-skill/(?:examples/|thumbs/)?[\w-]+)-ar\.(html|jpg)', r'\1.\2', link)  # Arabic decks and their thumbnails
    link = re.sub(r'[?&]lang=ar$', '', link)
    link = link.replace('../ar/home.html', '../home.html')
    link = re.sub(r'^\.\./(\w[\w-]*\.html)$', r'\1', link)  # Arabic page's "Read in English" link
    link = re.sub(r'^ar/', '', link)                         # English page's "Arabic" link
    return link

def norm_home(link):
    link = link.replace('/Wireless-101/ar/', '/Wireless-101/')  # Arabic pages open Wireless 101 in Arabic
    link = re.sub(r'^(\.\./)+', '', link)
    link = link.replace('Articles/ar/', 'Articles/').replace('ar/home.html', 'home.html')
    return re.sub(r'[?&]lang=ar$', '', link)

def check(slug):
    en, ar = Walk(), Walk()
    pair = ('home.html', 'ar/home.html') if slug == 'home' else (f'Articles/{slug}.html', f'Articles/ar/{slug}.html')
    en.feed(open(pair[0], encoding='utf-8').read())
    ar.feed(open(pair[1], encoding='utf-8').read())
    global norm
    norm = norm_home if slug == 'home' else norm_article
    problems = []
    if en.tags != ar.tags:
        for i, (x, y) in enumerate(zip(en.tags, ar.tags)):
            if x != y:
                problems.append(f'element #{i}: English <{x}>, Arabic <{y}>'); break
        else:
            problems.append(f'element count: English {len(en.tags)}, Arabic {len(ar.tags)}')
    el, al = [norm(l) for l in en.links], [norm(l) for l in ar.links]
    if el != al:
        diff = [(x, y) for x, y in zip(el, al) if x != y][:3]
        problems.append(f'links differ: {diff or (len(el), len(al))}')
    words = re.findall(r"[A-Za-z][A-Za-z'’-]+(?: [A-Za-z][A-Za-z'’,.-]*){5,}", re.sub(r'«[^»]*»', '', ' | '.join(ar.text)))
    if words:
        problems.append(f'{len(words)} English run(s) of 6+ words left, e.g. "{words[0][:80]}"')
    return problems

slugs = sys.argv[1:] or [os.path.basename(p)[:-5] for p in sorted(glob.glob('Articles/ar/*.html'))] + ['home']
bad = 0
for s in slugs:
    p = check(s)
    print(('OK   ' if not p else 'FAIL ') + s + ''.join('\n     - ' + x for x in p))
    bad += bool(p)
sys.exit(1 if bad else 0)
