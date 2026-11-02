#!/usr/bin/env python3
"""Build the CV part of cv.html from cv.md.

    python3 tools/build_cv.py           # rewrite cv.html from cv.md
    python3 tools/build_cv.py --check   # exit 1 if cv.html is out of date

Only the block between <!-- CV:START --> and <!-- CV:END --> in cv.html is
replaced. The buttons (Back, Copy CV text, Save as PDF), styles, print rules
and scripts around it are never touched. No dependencies: plain Python 3.
The line formats are documented at the top of cv.md.
"""
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MD = ROOT / 'cv.md'
HTML = ROOT / 'cv.html'
START = '<!-- CV:START: generated from cv.md by tools/build_cv.py. Edit cv.md, not this block. -->'
END = '<!-- CV:END -->'


def inline(text):
    """Escape, then turn **bold** and [text](url) into HTML."""
    out = html.escape(text, quote=False)

    def link(m):
        label, url = m.group(1), html.unescape(m.group(2))
        if not re.match(r'(https?:|mailto:)', url):
            raise SystemExit(f'cv.md: links must start with https:, http: or mailto: ({url!r})')
        extra = '' if url.startswith('mailto:') else ' target="_blank"'
        return f'<a href="{html.escape(url, quote=True)}"{extra}>{label}</a>'

    out = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, out)
    out = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', out)
    return out


def parse(md):
    """Return (name, contact_lines, sections, footer)."""
    md = re.sub(r'<!--.*?-->', '', md, flags=re.S)
    lines = [l.rstrip() for l in md.splitlines()]
    name, contact, sections, footer = None, [], [], None
    sec = entry = None
    for line in lines:
        if not line.strip():
            continue
        if line.startswith('# '):
            name = line[2:].strip()
        elif line.startswith('## '):
            sec = {'title': line[3:].strip(), 'blocks': []}
            sections.append(sec)
            entry = None
        elif line.startswith('### '):
            entry = {'kind': 'entry', 'title': line[4:].strip(), 'sub': None, 'bullets': [], 'details': []}
            sec['blocks'].append(entry)
        elif line.startswith('> '):
            footer = line[2:].strip()
        elif sec is None:
            contact.append(line.strip())
        elif entry is not None and entry['sub'] is None:
            if line.startswith('- ') or re.match(r'\d+\.\s', line):
                raise SystemExit(f'cv.md: "### {entry["title"]}" needs its place and dates line before the bullets')
            entry['sub'] = line.strip()
        elif line.startswith('- '):
            if entry is not None:
                entry['bullets'].append(line[2:].strip())
            else:
                if not sec['blocks'] or sec['blocks'][-1]['kind'] != 'list':
                    sec['blocks'].append({'kind': 'list', 'items': []})
                sec['blocks'][-1]['items'].append(line[2:].strip())
        elif re.match(r'\d+\.\s', line):
            sec['blocks'].append({'kind': 'pub', 'text': line.strip()})
        elif entry is not None:
            entry['details'].append(line.strip())
        elif re.match(r'\*\*[^*]+:\*\*\s', line):
            m = re.match(r'\*\*([^*]+:)\*\*\s+(.*)', line)
            sec['blocks'].append({'kind': 'dated', 'date': m.group(1), 'text': m.group(2)})
        else:
            raise SystemExit(f'cv.md: do not know how to place this line: {line!r}')
    if not name:
        raise SystemExit('cv.md: missing the "# Name" line')
    return name, contact, sections, footer


def render(md):
    name, contact, sections, footer = parse(md)
    I = '    '  # one indent step, matching the rest of cv.html
    out = [f'{I*2}<header class="header">',
           f'{I*3}<h1>{html.escape(name)}</h1>',
           f'{I*3}<div class="contact-info">']
    for k, line in enumerate(contact):
        out.append(f'{I*4}{inline(line)}' + ('<br>' if k < len(contact) - 1 else ''))
    out += [f'{I*3}</div>', f'{I*2}</header>']

    for sec in sections:
        out += ['', f'{I*2}<section>', f'{I*3}<div class="section-title">{inline(sec["title"])}</div>']
        for b in sec['blocks']:
            if b['kind'] == 'list':
                out.append(f'{I*3}<ul>')
                out += [f'{I*4}<li>{inline(t)}</li>' for t in b['items']]
                out.append(f'{I*3}</ul>')
            elif b['kind'] == 'pub':
                out += [f'{I*3}<div class="publication">', f'{I*4}{inline(b["text"])}', f'{I*3}</div>']
            elif b['kind'] == 'dated':
                out += [f'{I*3}<div class="award-item">',
                        f'{I*4}<span class="award-date">{inline(b["date"])}</span> {inline(b["text"])}',
                        f'{I*3}</div>']
            elif b['kind'] == 'entry':
                # A job has bullets; a degree has detail lines (Thesis, Advisor, Courses).
                degree = bool(b['details']) or not b['bullets']
                box, title, sub = ('education-item', 'degree', 'school') if degree else ('job', 'job-title', 'job-company')
                out += [f'{I*3}<div class="{box}">',
                        f'{I*4}<div class="{title}">{inline(b["title"])}</div>',
                        f'{I*4}<div class="{sub}">{inline(b["sub"] or "")}</div>']
                if b['bullets']:
                    out.append(f'{I*4}<ul>')
                    out += [f'{I*5}<li>{inline(t)}</li>' for t in b['bullets']]
                    out.append(f'{I*4}</ul>')
                if b['details']:
                    out.append(f'{I*4}<div class="edu-details">')
                    d = b['details']
                    out += [f'{I*5}{inline(t)}' + ('<br>' if k < len(d) - 1 else '') for k, t in enumerate(d)]
                    out.append(f'{I*4}</div>')
                out.append(f'{I*3}</div>')
        out.append(f'{I*2}</section>')

    if footer:
        out += ['', f'{I*2}<div class="footer">', f'{I*3}<span>{inline(footer)}</span>', f'{I*2}</div>']
    # The Markdown itself, for the page's "Copy Markdown" / "View Markdown" menu
    # (embedded so it works offline and without fetching cv.md).
    # Stored as JSON with "<" escaped, so no CV text can ever end or bend the <script> block.
    clean = re.sub(r'<!--.*?-->', '', md, flags=re.S).strip() + '\n'
    data = json.dumps(clean, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
    out += ['', f'{I*2}<script type="application/json" id="cv-md">{data}</script>']
    return '\n'.join(out)


def main():
    page = HTML.read_text(encoding='utf-8')
    if START not in page or END not in page or page.index(START) > page.index(END):
        raise SystemExit('cv.html: CV:START / CV:END markers not found (or in the wrong order)')
    head, rest = page.split(START, 1)
    _, tail = rest.split(END, 1)
    new = head + START + '\n' + render(MD.read_text(encoding='utf-8')) + '\n        ' + END + tail
    if '--check' in sys.argv:
        if new != page:
            print('cv.html is out of date: run python3 tools/build_cv.py')
            sys.exit(1)
        print('cv.html is up to date with cv.md')
        return
    if new != page:
        HTML.write_text(new, encoding='utf-8')
        print('cv.html rebuilt from cv.md')
    else:
        print('cv.html already matches cv.md')


if __name__ == '__main__':
    main()
