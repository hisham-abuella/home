"""Style check for the Egyptian Arabic pages.

    python3 claudeteam/tools/ar_style.py              # every Arabic page, deck and track
    python3 claudeteam/tools/ar_style.py FILE ...     # only these files

Flags the mistakes the October 2026 review found, so they are caught before a human reads:
  translit   an English technical word written in Arabic letters (سيرفر, موديل, سكريبت ...);
             the site keeps them in Latin script: server, model, script
  wa-space   "و" left detached before a Latin word or tag ("و CSS" should be "وCSS")
  al-arabic  "الـ " in front of an Arabic word (it belongs only before Latin words)
  lal        "لالـ" (write "للـ")
  msa        a Modern Standard form where the site uses Egyptian (قراءة -> قراية)
  gender     a number word that disagrees with كتب (ست كتب -> ستة كتب)
Exit code 1 when anything is flagged. <style> blocks and lang="en" text are skipped.
"""
import glob, re, sys

AR = r'[ء-يـ]'
B, E = r'(?<!' + AR + r')', r'(?!' + AR + r')'
PFX = r'(?:و?لل|وبال|وال|بال|فال|ال|وب|ول|وف|و|ف|ب|ل)?'

# Arabic spelling -> the Latin word the site uses. Everyday words stay Arabic (see SKILL.md).
TRANSLIT = {
    'موديل': 'model', 'موديلات': 'models', 'موديول': 'module', 'كود': 'code', 'سكريبت': 'script',
    'سكريبتات': 'scripts', 'سيرفر': 'server', 'هاردوير': 'hardware', 'سوفتوير': 'software',
    'فولدر': 'folder', 'داتا': 'data', 'ديسك': 'disk', 'تايمر': 'timer', 'كويزات': 'quizzes',
    'أوفلاين': 'offline', 'أونلاين': 'online', 'دارك مود': 'dark mode', 'بودكاست': 'podcast',
    'أنيميشن': 'animation', 'كليك': 'click', 'كليكات': 'clicks', 'ليزر': 'laser', 'باكتات': 'packets',
    'بروجكتور': 'projector', 'هيدر': 'header', 'شات': 'chat', 'باسوردات': 'passwords',
    'بروتوتايب': 'prototype', 'كيبورد': 'keyboard', 'ماوس': 'mouse', 'لايف': 'live',
    'أوتوماتيك': 'automatic', 'فلاتر': 'filters', 'فلترة': 'filtering', 'مودم': 'modem',
    'مودمات': 'modems', 'بلوك': 'block', 'بلوكات': 'blocks', 'ستايل': 'style', 'كوتا': 'quota',
    'سلايد': 'slide', 'سلايدز': 'slides', 'ثيم': 'theme', 'ثيمات': 'themes', 'سكيل': 'skill',
    'كلود': 'Claude', 'أبل': 'Apple', 'باور بوينت': 'PowerPoint', 'كي نوت': 'Keynote',
    'جافاسكريبت': 'JavaScript', 'ليه آوت': 'layout', 'بيكسل': 'pixel', 'فريم': 'frame',
    'بيلد': 'build', 'واي فاي': 'Wi-Fi', 'داشبورد': 'dashboard', 'فريم وورك': 'framework',
}
# Same spelling, everyday meaning: a tyre model is not a technical "model".
ALLOW = ['موديل الكاوتش', 'موديلين من']
MSA = {'للقراءة': 'للقراية', 'القراءة': 'القراية'}

def strip(html):
    blank = lambda m: '\n' * m.group(0).count('\n')  # keep line numbers true
    html = re.sub(r'\n<style[^>]*>.*?</style>', blank, html, flags=re.S)
    # English-only elements (not <html>: the gateway and tracks open in English and switch in place)
    html = re.sub(r'<((?!html\b)\w+)[^>]*\blang="en[^"]*"[^>]*>.*?</\1>', blank, html, flags=re.S)
    for a in ALLOW:
        html = html.replace(a, '')
    return html

def check(path):
    text = strip(open(path, encoding='utf-8').read())
    out = []
    def hit(kind, m, hint):
        line = text.count('\n', 0, m.start()) + 1
        out.append(f'{path}:{line}: {kind}: «{m.group(0).strip()}» {hint}')
    for ar in sorted(TRANSLIT, key=len, reverse=True):
        for m in re.finditer(B + PFX + re.escape(ar) + E, text):
            hit('translit', m, f'-> {TRANSLIT[ar]}')
    for m in re.finditer(r'(?:^|\s)و (?=[A-Za-z0-9]|<(?:strong|code|kbd|em|b)>)', text):
        hit('wa-space', m, '-> attach و to the next word')
    for m in re.finditer(r'الـ(?:\s|&nbsp;)+' + AR + r'{2,}', text):
        hit('al-arabic', m, '-> الـ goes only before Latin words')
    for m in re.finditer('لالـ', text):
        hit('lal', m, '-> للـ')
    for k, v in MSA.items():
        for m in re.finditer(B + re.escape(k) + E, text):
            hit('msa', m, f'-> {v}')
    for m in re.finditer(B + r'(?:ال)?(?:ست|سبع|تسع|تمان) كتب' + E + '|الكتب الست' + E, text):
        hit('gender', m, '-> ستة/سبعة/تسعة/تمانية (كتاب is masculine)')
    return out

def files():
    fs = ['ar/home.html', 'index.html'] + sorted(glob.glob('Articles/ar/*.html'))
    fs += sorted(glob.glob('tracks/*.html')) + sorted(glob.glob('projects/presentation-skill/**/*-ar.html', recursive=True))
    return fs

if __name__ == '__main__':
    found = [line for f in (sys.argv[1:] or files()) for line in check(f)]
    print('\n'.join(found) if found else 'OK   no style issues')
    sys.exit(1 if found else 0)
