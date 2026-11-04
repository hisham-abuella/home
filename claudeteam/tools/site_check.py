"""Site check: local links, anchors, assets, canonical/og:url, hreflang, alt text and
?v= tag consistency across every live page. Usage: python3 claudeteam/tools/site_check.py
Exit code 1 when anything is found."""
import os, re, sys, subprocess, collections
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
os.chdir(ROOT)
files = subprocess.check_output(['git','ls-files','*.html']).decode().split()
files = [f for f in files if not f.startswith(('different_designs/','claudeteam/'))]
# Pages that are tools or error pages, not indexed content
NO_META = ('404.html', 'projects/presentation-skill/editor.html', 'projects/presentation-skill/template.html')
SITE='https://www.hishamabuella.com'
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.links=[]; s.ids=set(); s.meta={}; s.canon=None; s.hreflang=[]; s.imgs_noalt=[]; s.scripts=[]; s.styles=[]; s.blank_noopener=[]; s.lang=None; s.title=False; s.has_title=False; s.goat=False; s.dataids=set()
    def handle_starttag(s,t,a):
        a=dict(a)
        if 'id' in a: s.ids.add(a['id'])
        if 'data-id' in a: s.dataids.add(a['data-id'])
        if t=='a' and 'name' in a: s.ids.add(a['name'])
        if t=='html': s.lang=a.get('lang')
        if t=='title': s.has_title=True
        for k in ('href','src','poster','data-src'):
            if k in a and a[k] is not None: s.links.append((t,k,a[k]))
        if t=='source' and a.get('srcset'): 
            for part in a['srcset'].split(','): s.links.append((t,'srcset',part.strip().split(' ')[0]))
        if t=='img' and a.get('srcset'):
            for part in a['srcset'].split(','): s.links.append((t,'srcset',part.strip().split(' ')[0]))
        if t=='link' and a.get('rel')=='canonical': s.canon=a.get('href')
        if t=='link' and a.get('rel')=='alternate' and a.get('hreflang'): s.hreflang.append((a['hreflang'],a.get('href')))
        if t=='meta' and a.get('property'): s.meta[a['property']]=a.get('content')
        if t=='meta' and a.get('name'): s.meta[a['name']]=a.get('content')
        if t=='img' and 'alt' not in a: s.imgs_noalt.append(a.get('src'))
        if t=='script' and a.get('src'): s.scripts.append(a['src'])
        if t=='script' and 'goatcounter' in (a.get('data-goatcounter') or '') : s.goat=True
        if t=='link' and a.get('rel')=='stylesheet': s.styles.append(a.get('href'))
        if t=='a' and a.get('target')=='_blank' and 'noopener' not in (a.get('rel') or '') and 'noreferrer' not in (a.get('rel') or ''): s.blank_noopener.append(a.get('href'))
parsed={}
for f in files:
    p=P(); p.feed(open(f,encoding='utf-8').read()); parsed[f]=p
issues=collections.defaultdict(list)
verstags=collections.defaultdict(lambda: collections.defaultdict(list))
for f,p in parsed.items():
    for t,k,v in p.links:
        v=v.strip()
        if not v or v.startswith(('mailto:','tel:','javascript:','data:','http://','https://','//','blob:')) or '${' in v or '{{' in v: 
            if v.startswith('http://') and 'localhost' not in v: issues[f].append(f'insecure http link: {v}')
            continue
        u=urlparse(v)
        path=unquote(u.path)
        if not path:
            target=f
        elif path.startswith('/'):
            target=path.lstrip('/')
        else:
            target=os.path.normpath(os.path.join(os.path.dirname(f),path))
        if target=='' or os.path.isdir(target): target=os.path.join(target,'index.html')
        if not os.path.exists(target):
            if k == 'data-src' and re.search(r'audio/articles/ar/[^/]+\.mp3$', target):
                continue  # Arabic narration not recorded yet; the player stays hidden
            issues[f].append(f'MISSING {k}={v}')
            continue
        if u.query and re.search(r'\bv=',u.query) and target.endswith(('.js','.css')):
            verstags[target][u.query].append(f)
        if u.fragment and target.endswith('.html') and target in parsed:
            deck = parsed[target].dataids if hasattr(parsed[target], 'dataids') else set()
            if u.fragment not in parsed[target].ids and u.fragment not in deck and not u.fragment.isdigit() and u.fragment not in ('top',''):
                issues[f].append(f'missing anchor #{u.fragment} in {target}')
        elif u.fragment and target.endswith('.html') and not u.fragment.startswith(('/',)):
            pass
    if f.startswith(('projects/local-model-performance/decks','projects/local-model-performance/paper/paper')) or f in NO_META: continue
    if not p.canon: issues[f].append('no canonical')
    elif not p.canon.startswith(SITE): issues[f].append(f'canonical not on www: {p.canon}')
    if not p.meta.get('og:url'): issues[f].append('no og:url')
    elif p.canon and p.meta.get('og:url')!=p.canon: issues[f].append(f'og:url != canonical ({p.meta.get("og:url")} vs {p.canon})')
    if p.canon and SITE in p.canon:
        exp='/'+f
        cp=urlparse(p.canon).path
        if cp!=exp and not (exp.endswith('index.html') and cp==exp[:-10]) and not (cp+'.html'==exp):
            issues[f].append(f'canonical path {cp} vs file {exp}')
    if not p.lang: issues[f].append('no html lang')
    if not p.has_title: issues[f].append('no title')
    if not p.meta.get('description'): issues[f].append('no meta description')
    if not p.meta.get('og:image'): issues[f].append('no og:image')
    if not p.meta.get('viewport'): issues[f].append('no viewport')
    if p.imgs_noalt: issues[f].append(f'img without alt: {p.imgs_noalt[:3]}')
for f in ['index.html']+[x for x in files if x.startswith('tracks/')]:
    hl=dict(parsed[f].hreflang)
    for want in ('en','ar','x-default'):
        if want not in hl: issues[f].append(f'missing hreflang {want}')
for f in files:
    if f.startswith('Articles/'):
        hl=dict(parsed[f].hreflang)
        if 'en' not in hl or 'ar' not in hl: issues[f].append(f'article hreflang incomplete {hl}')
print('== per-file issues')
for f in sorted(issues):
    for i in issues[f]: print(f'{f}: {i}')
print('== asset version tag inconsistencies')
for t,qs in sorted(verstags.items()):
    if len(qs)>1:
        print(t)
        for q,fs in qs.items(): print('   ',q,len(fs),fs[:4])
# unversioned shared script/style references
print('== unversioned refs to versioned assets')
for f,p in parsed.items():
    for t,k,v in p.links:
        if v.endswith(('.js','.css')) and '?' not in v:
            u=urlparse(v); path=u.path
            target=path.lstrip('/') if path.startswith('/') else os.path.normpath(os.path.join(os.path.dirname(f),path))
            if target in verstags: print(f'{f}: {v} (others use ?v=)')

problems = sum(len(v) for v in issues.values()) + sum(1 for qs in verstags.values() if len(qs) > 1)
print('OK   site check' if not problems else f'FAIL {problems} problem(s)')
sys.exit(1 if problems else 0)
