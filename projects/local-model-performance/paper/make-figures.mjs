#!/usr/bin/env node
// Builds the paper's data table and black-and-white SVG figures from the study's result files.
// No dependencies. Run: node paper/make-figures.mjs
// Reads (never writes) ../results/*/results.json, the model folders, and ../study/tasks/stats-101-planned/plan.json.
// Writes data/study-data.json, data/tables.md and figures/fig1..fig6 *.svg next to this script.
// Figs 1-5 compare the two main tasks only (no plan). The planned run (local models building from a plan written
// by Opus) is a separate experiment, shown on its own in Fig. 6 and in its own tables; it is never mixed into 1-5.

import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STUDY = path.resolve(HERE, '..');
const DATA_DIR = path.join(HERE, 'data');
const FIG_DIR = path.join(HERE, 'figures');

const RUNS = [
  { task: 'wireless-101', short: 'Wireless 101', abbr: 'W', dir: 'results/20261016-000644' },
  { task: 'stats-101', short: 'STATS 101', abbr: 'S', dir: 'results/20261016-063639-stats-101' },
  { task: 'stats-101-planned', short: 'STATS 101 + plan', abbr: 'P', dir: 'results/20261016-214018-stats-101-planned' },
];
const PLAN_FILE = 'study/tasks/stats-101-planned/plan.json';
const PLANNED = 'stats-101-planned';
const MAIN_RUNS = RUNS.filter((r) => r.task !== PLANNED);
const mainRows = (D) => D.rows.filter((r) => r.task !== PLANNED);
const plannedRows = (D) => D.rows.filter((r) => r.task === PLANNED);

// Display order and names. Labels are the study's own model labels.
const MODELS = {
  opus: { name: 'Opus 5.5', order: 0 },
  sonnet: { name: 'Sonnet 5.5', order: 1 },
  haiku: { name: 'Haiku 5.5', order: 2 },
  'qwen-local': { name: 'qwen3.8 27B', order: 3 },
  'qwen-moe': { name: 'qwen3.6 35B-A3B', order: 4 },
  gemma: { name: 'gemma4 26B', order: 5 },
};
const CRITERIA = ['accuracy', 'coverage', 'teaching', 'visual', 'diagrams', 'notes', 'requirements'];

const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(STUDY, p), 'utf8'));
const exists = (p) => fs.existsSync(path.join(STUDY, p));
const round = (x, d = 2) => (x == null ? null : Math.round(x * 10 ** d) / 10 ** d);

// Last "result" event of a CLI transcript (absent when the run was killed by the timeout).
function lastResultEvent(file) {
  if (!exists(file) && exists(file + '.gz')) file += '.gz';
  if (!exists(file)) return null;
  const raw = fs.readFileSync(path.join(STUDY, file));
  const lines = (file.endsWith('.gz') ? zlib.gunzipSync(raw) : raw).toString('utf8').trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const e = JSON.parse(lines[i]);
      if (e.type === 'result') return e;
    } catch { /* skip partial line */ }
  }
  return null;
}

// Slides and notes the model wrote into output/parts/*.html (its progress before assembling deck.html).
function partialProgress(modelDir) {
  const dir = path.join(STUDY, modelDir, 'output', 'parts');
  if (!fs.existsSync(dir)) return { files: [], slides: 0, notes: 0 };
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html')).sort();
  let slides = 0, notes = 0;
  for (const f of files) {
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    slides += (html.match(/class="slide[\s"]/g) || []).length;
    notes += (html.match(/<aside class="notes/g) || []).length;
  }
  return { files, slides, notes };
}

function statusOf(row, deckExists, resultEvent) {
  if (row.timed_out) return 'timed out';
  if (resultEvent && resultEvent.terminal_reason === 'api_error') return 'API error';
  if (row.exit_code !== 0) return 'API error';
  if (!deckExists) return 'stopped early';
  return 'finished';
}

// ---------------------------------------------------------------- data
function buildData() {
  const rows = [];
  const runs = [];
  for (const R of RUNS) {
    const res = readJSON(`${R.dir}/results.json`);
    runs.push({ task: R.task, run_id: res.run.run_id, ...res.run });
    for (const r of res.rows) {
      const mdir = `${R.dir}/${r.label}`;
      const deckExists = !!r.deck && exists(`${mdir}/${r.deck}`);
      const ev = lastResultEvent(`${mdir}/transcript.jsonl`);
      const status = statusOf(r, deckExists, ev);
      const finished = status === 'finished';
      const J = r.judge;
      let judgeCost = null;
      if (exists(`${mdir}/judge.json`)) {
        const jj = readJSON(`${mdir}/judge.json`);
        judgeCost = jj.total_cost_usd ?? null;
      }
      if (judgeCost == null && J && J.cost_usd != null) judgeCost = J.cost_usd;
      const prog = partialProgress(mdir);
      const st = r.stats || {};
      const tokensRecorded = !!ev; // a killed run has no result event, so the CLI never reported its tokens
      const ic = J ? J.incorrect_claims : null;
      const inv = J ? J.invented_claims : null;
      const ui = J ? J.ui_issues : null;
      rows.push({
        task: R.task,
        label: r.label,
        model_name: MODELS[r.label]?.name ?? r.label,
        model: r.model,
        provider: r.provider,
        finished,
        status,
        cli_reported_finished: r.finished,
        exit_code: r.exit_code,
        terminal_reason: ev ? ev.terminal_reason ?? null : null,
        wall_min: round(r.wall_seconds / 60, 2),
        api_min: r.api_seconds == null ? null : round(r.api_seconds / 60, 2),
        cost_usd: round(r.cost_usd, 4),
        turns: r.turns,
        tool_calls: r.tool_calls,
        output_tokens: tokensRecorded ? r.tokens.output : null,
        // Deck counts and checker: only for a finished deck. For timed-out runs the checker and judge saw the
        // untouched template deck.html, so those values are kept below under template_deck instead.
        slides: finished ? st.slides : null,
        notes: finished ? st.slides_with_notes : null,
        diagrams: finished ? st.diagrams : null,
        animated: finished ? st.slides_with_animation : null,
        placeholders: finished ? st.placeholders : null,
        words_on_slides: finished ? st.words_on_slides : null,
        words_in_notes: finished ? st.words_in_notes : null,
        has_quiz: finished ? st.has_quiz : null,
        checker_pass: finished && r.checker ? r.checker.pass : null,
        checker_issues: finished && r.checker ? r.checker.issues : null,
        judge_overall: finished && J ? J.overall : null,
        ...Object.fromEntries(CRITERIA.map((c) => [`judge_${c}`, finished && J ? J.scores[c] : null])),
        wrong_claims: finished && ic ? ic.length : null,
        wrong_claims_major: finished && ic ? ic.filter((x) => x.severity === 'major').length : null,
        invented_claims: finished && inv ? inv.length : null,
        invented_claims_untrue: finished && inv ? inv.filter((x) => x.true === false).length : null,
        ui_issues: finished && ui ? ui.length : null,
        ui_issues_major: finished && ui ? ui.filter((x) => x.severity === 'major').length : null,
        major_mistakes: finished && J ? J.major_mistakes.length : null,
        judge_cost_usd: round(judgeCost, 4),
        partial_slides: finished ? null : prog.slides,
        partial_notes: finished ? null : prog.notes,
        partial_files: finished ? null : prog.files,
        // planned runs were given the shared PLAN.md, so only the unplanned tasks say whether the model wrote one
        wrote_plan_md: R.task === 'stats-101-planned' ? null : exists(`${mdir}/output/PLAN.md`),
        template_deck: !finished && J ? {
          note: 'deck.html was still the skill template when the run stopped; checker and judge scored the template',
          slides: st.slides, checker_pass: r.checker?.pass ?? null, judge_overall: J.overall,
        } : null,
      });
    }
  }
  const tOrder = Object.fromEntries(RUNS.map((r, i) => [r.task, i]));
  rows.sort((a, b) => tOrder[a.task] - tOrder[b.task] || MODELS[a.label].order - MODELS[b.label].order);

  const plan = readJSON(PLAN_FILE);
  const r0 = runs[0];
  const setup = {
    claude_versions: Object.fromEntries(runs.map((r) => [r.task, r.claude_version])),
    ollama_version: [...new Set(runs.map((r) => r.ollama_version))].join(', '),
    machine: [...new Set(runs.map((r) => r.machine))].join(', '),
    plugin_version: [...new Set(runs.map((r) => r.plugin_version))].join(', '),
    git_commit: [...new Set(runs.map((r) => r.git_commit))].join(', '),
    timeout_min: Object.fromEntries(runs.map((r) => [r.task, r.timeout_min])),
    budget_usd: r0.budget_usd,
    judge_model: [...new Set(rows.flatMap((r) => {
      const res = readJSON(`${RUNS.find((x) => x.task === r.task).dir}/results.json`);
      const row = res.rows.find((x) => x.label === r.label);
      return row.judge?.model ? [row.judge.model] : [];
    }))].join(', '),
    runs: runs.map((r) => ({ task: r.task, run_id: r.run_id, title: r.title })),
    cost_note: 'cost_usd is the Claude CLI API list-price figure; local (Ollama) runs are $0 per token',
  };
  const planObj = {
    task: 'stats-101-planned',
    planner: plan.planner,
    wall_min: round(plan.wall_seconds / 60, 2),
    wall_seconds: plan.wall_seconds,
    cost_usd: round(plan.cost_usd, 4),
    turns: plan.turns,
    output_tokens: plan.tokens?.output ?? null,
    plan_kb: plan.plan_kb,
    plan_slides: Number((fs.readFileSync(path.join(STUDY, path.dirname(PLAN_FILE), 'PLAN.md'), 'utf8').match(/\*\*Total\*\*: (\d+) slides/) || [])[1]) || null,
    patched: plan.patched,
  };
  return { generated_by: 'paper/make-figures.mjs', setup, plan: planObj, rows };
}

// ---------------------------------------------------------------- tables.md
function fmtMin(m) {
  if (m == null) return '–';
  const s = Math.round(m * 60);
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
}
const dash = (v) => (v == null ? '–' : v);
const usd = (v) => (v == null ? '–' : `$${v.toFixed(2)}`);
const taskShort = (t) => RUNS.find((r) => r.task === t).short;

function tablesMd(D) {
  const L = [];
  const s = D.setup;
  L.push('# Model comparison: data tables', '');
  L.push('Generated by `make-figures.mjs` from the study\'s `results.json`, model folders and `plan.json`. Do not edit by hand.', '');
  L.push('## Setup', '');
  L.push('| Item | Value |', '|---|---|');
  for (const [t, v] of Object.entries(s.claude_versions)) L.push(`| Claude Code (${t}) | ${v} |`);
  L.push(`| Ollama | ${s.ollama_version} |`, `| Machine | ${s.machine} |`, `| Plugin | present-in-html ${s.plugin_version} (commit ${s.git_commit}) |`);
  for (const [t, v] of Object.entries(s.timeout_min)) L.push(`| Time limit (${t}) | ${v} min |`);
  L.push(`| Cloud budget cap | $${s.budget_usd} per run |`, `| Judge | ${s.judge_model} (blind) |`);
  for (const r of s.runs) L.push(`| Run ${r.task} | ${r.run_id} |`);
  L.push('');
  L.push('# Main comparison (Wireless 101 and STATS 101, no plan)', '');
  L.push('These tables cover the two main tasks only; Figs 1-5 are drawn from them. The plan experiment has its own tables below.', '');
  runTables(L, mainRows(D), '');
  L.push('## Mean criterion score per model (finished decks, main tasks only; Fig. 4)', '');
  const means = criteriaMeans(mainRows(D));
  L.push(`| Model | n | ${CRITERIA.join(' | ')} | Overall |`, `|---|---|${CRITERIA.map(() => '---').join('|')}|---|`);
  for (const m of means) L.push(`| ${m.name} | ${m.n} | ${CRITERIA.map((c) => m[c].toFixed(1)).join(' | ')} | ${m.overall.toFixed(1)} |`);
  L.push('');
  L.push('# Plan experiment (stats-101-planned): local models building from a plan written by Opus', '');
  L.push(`A separate experiment to improve local models, not compared with the runs above. Three local models built STATS 101 from the same Opus plan, with a ${D.setup.timeout_min[PLANNED]}-minute limit (Fig. 6).`, '');
  const p = D.plan;
  L.push('## Shared plan (plan experiment)', '');
  L.push('| Planner | Time | Cost | Turns | Output tokens | Size |', '|---|---|---|---|---|---|');
  L.push(`| ${p.planner} | ${fmtMin(p.wall_min)} (${p.wall_seconds} s) | ${usd(p.cost_usd)} ($${p.cost_usd}) | ${p.turns} | ${p.output_tokens} | ${p.plan_kb} KB |`);
  L.push('', `Note: ${p.patched}.`, '');
  runTables(L, plannedRows(D), ' (plan experiment)');
  L.push('Times are wall-clock. Costs are the CLI\'s API list-price figure (local runs $0 per token); the judge\'s cost is separate and not included in the model\'s cost. One run per model per task.', '');
  return L.join('\n');
}

// Runs, decks, judge scores, judge findings and partial progress for one set of rows.
function runTables(L, rows, tag) {
  const fin = rows.filter((r) => r.finished), unf = rows.filter((r) => !r.finished);
  L.push(`## Runs${tag}`, '');
  L.push('| Task | Model | Status | Wall | API | Cost | Turns | Tool calls | Output tokens |', '|---|---|---|---|---|---|---|---|---|');
  for (const r of rows) {
    L.push(`| ${taskShort(r.task)} | ${r.model_name} (\`${r.model}\`) | ${r.status} | ${fmtMin(r.wall_min)} | ${fmtMin(r.api_min)} | ${usd(r.cost_usd)} | ${dash(r.turns)} | ${dash(r.tool_calls)} | ${dash(r.output_tokens)} |`);
  }
  L.push('');
  if (fin.length) {
    L.push(`## Decks (finished runs)${tag}`, '');
    L.push('| Task | Model | Slides | Notes | Diagrams | Animated | Placeholders | Words on slides | Words in notes | Quiz | Checker |', '|---|---|---|---|---|---|---|---|---|---|---|');
    for (const r of fin) {
      L.push(`| ${taskShort(r.task)} | ${r.model_name} | ${r.slides} | ${r.notes}/${r.slides} | ${r.diagrams} | ${r.animated} | ${r.placeholders} | ${r.words_on_slides} | ${r.words_in_notes} | ${r.has_quiz ? 'yes' : 'no'} | ${r.checker_pass ? 'pass' : 'fail'} (${r.checker_issues} issues) |`);
    }
    L.push('');
    L.push(`## Judge scores (finished decks)${tag}`, '');
    L.push(`| Task | Model | ${CRITERIA.map((c) => c[0].toUpperCase() + c.slice(1)).join(' | ')} | **Overall /10** | Judge cost |`);
    L.push(`|---|---|${CRITERIA.map(() => '---').join('|')}|---|---|`);
    for (const r of fin) {
      L.push(`| ${taskShort(r.task)} | ${r.model_name} | ${CRITERIA.map((c) => r[`judge_${c}`]).join(' | ')} | **${r.judge_overall}** | ${usd(r.judge_cost_usd)} |`);
    }
    L.push('');
    L.push(`## Judge findings (finished decks)${tag}`, '');
    L.push('| Task | Model | Wrong claims (major) | Invented claims (untrue) | UI issues (major) | Major mistakes |', '|---|---|---|---|---|---|');
    for (const r of fin) {
      L.push(`| ${taskShort(r.task)} | ${r.model_name} | ${r.wrong_claims} (${r.wrong_claims_major}) | ${r.invented_claims} (${r.invented_claims_untrue}) | ${r.ui_issues} (${r.ui_issues_major}) | ${r.major_mistakes} |`);
    }
    L.push('');
  }
  if (unf.length) {
    L.push(`## Unfinished runs: partial progress${tag}`, '');
    L.push('| Task | Model | Status | Wall | Slides written in output/parts | With notes | Files | PLAN.md written | Template deck.html scored |', '|---|---|---|---|---|---|---|---|---|');
    for (const r of unf) {
      const t = r.template_deck;
      L.push(`| ${taskShort(r.task)} | ${r.model_name} | ${r.status} | ${fmtMin(r.wall_min)} | ${r.partial_slides} | ${r.partial_notes} | ${r.partial_files.join(', ') || '–'} | ${r.wrote_plan_md == null ? 'given' : r.wrote_plan_md ? 'yes' : 'no'} | ${t ? `${t.slides} slides, checker ${t.checker_pass ? 'pass' : 'fail'}, judge ${t.judge_overall}/10` : 'not judged'} |`);
    }
    L.push('');
  }
}

function criteriaMeans(rows) {
  const fin = rows.filter((r) => r.finished);
  const labels = [...new Set(fin.map((r) => r.label))].sort((a, b) => MODELS[a].order - MODELS[b].order);
  return labels.map((l) => {
    const rs = fin.filter((r) => r.label === l);
    const o = { label: l, name: MODELS[l].name, n: rs.length, tasks: rs.map((r) => r.task) };
    for (const c of CRITERIA) o[c] = rs.reduce((a, r) => a + r[`judge_${c}`], 0) / rs.length;
    o.overall = rs.reduce((a, r) => a + r.judge_overall, 0) / rs.length;
    return o;
  });
}

// ---------------------------------------------------------------- SVG helpers
const FONT = '"Times New Roman", Times, serif';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f1 = (x) => Math.round(x * 10) / 10;

const DEFS = `<defs>
  <pattern id="p-diag" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="5" height="5" fill="#fff"/><line x1="0" y1="0" x2="0" y2="5" stroke="#000" stroke-width="1.4"/></pattern>
  <pattern id="p-cross" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="5" height="5" fill="#fff"/><path d="M0 0V5M0 0H5" stroke="#000" stroke-width="0.9"/></pattern>
  <pattern id="p-horiz" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#fff"/><line x1="0" y1="2" x2="4" y2="2" stroke="#000" stroke-width="1.2"/></pattern>
  <pattern id="p-dots" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#fff"/><circle cx="2" cy="2" r="0.9" fill="#000"/></pattern>
  <pattern id="p-light" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
    <rect width="6" height="6" fill="#fff"/><line x1="0" y1="0" x2="0" y2="6" stroke="#777" stroke-width="0.8"/></pattern>
</defs>`;

// One fill per model, the same in every figure.
const MODEL_FILL = {
  opus: '#000', sonnet: '#8c8c8c', haiku: '#fff',
  'qwen-local': 'url(#p-diag)', 'qwen-moe': 'url(#p-cross)', gemma: 'url(#p-horiz)',
};

function svgDoc(w, h, title, desc, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family='${FONT}' font-size="11" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
${DEFS}
<rect width="${w}" height="${h}" fill="#fff"/>
${body}
</svg>
`;
}
const text = (x, y, s, o = {}) => {
  const a = Object.entries({ 'text-anchor': o.anchor || 'middle', 'font-size': o.size, 'font-style': o.italic ? 'italic' : null, 'font-weight': o.bold ? 'bold' : null, transform: o.rotate != null ? `rotate(${o.rotate} ${f1(x)} ${f1(y)})` : null, fill: o.fill, 'dominant-baseline': o.baseline })
    .filter(([, v]) => v != null).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<text x="${f1(x)}" y="${f1(y)}" ${a}>${esc(s)}</text>`;
};
const rect = (x, y, w, h, fill, o = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(Math.max(h, 0))}" fill="${fill}" stroke="${o.stroke || '#000'}" stroke-width="${o.sw ?? 0.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
const line = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${o.stroke || '#000'}" stroke-width="${o.sw ?? 0.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;

// Legend row of swatches: items [{fill, label, dash?}]
function legend(x, y, items, o = {}) {
  const sw = o.sw || 10, gap = o.gap || 12, size = o.size || 11, charW = size * 0.45;
  let cx = x, out = '';
  for (const it of items) {
    if (it.marker) out += it.marker(cx + sw / 2, y);
    else out += rect(cx, y - sw / 2, sw, sw, it.fill, { dash: it.dash });
    out += text(cx + sw + 3, y + size * 0.35, it.label, { anchor: 'start', size });
    cx += sw + 3 + it.label.length * charW + gap;
  }
  return { svg: out, width: cx - x - gap };
}

// ---------------------------------------------------------------- figures
const STATUS_SHORT = { 'timed out': 'timed out', 'stopped early': 'stopped early', 'API error': 'API error' };

function fig1(D) {
  const W = 340, H = 300, ml = 42, mr = 6, mt = 22, plotH = 168;
  const y0 = mt + plotH;
  const lo = 2, hi = 300;
  const Y = (v) => y0 - (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)) * plotH;
  const bw = 26, inner = 3, groupGap = 30;
  const groups = MAIN_RUNS.map((R) => D.rows.filter((r) => r.task === R.task));
  const totalW = groups.reduce((a, g) => a + g.length * bw + (g.length - 1) * inner, 0) + groupGap * (groups.length - 1);
  let x = ml + (W - ml - mr - totalW) / 2;
  let b = '';
  // grid + axis
  for (const t of [2, 5, 10, 20, 50, 100, 200]) {
    b += line(ml, Y(t), W - mr, Y(t), { stroke: '#bbb', sw: 0.5 });
    b += text(ml - 4, Y(t) + 3.5, t, { anchor: 'end', size: 10 });
  }
  b += line(ml, mt, ml, y0) + line(ml, y0, W - mr, y0);
  b += text(12, mt + plotH / 2, 'Wall-clock time (min, log scale)', { rotate: -90, size: 11 });
  groups.forEach((g, gi) => {
    const gx0 = x;
    const limit = D.setup.timeout_min[MAIN_RUNS[gi].task];
    const gw = g.length * bw + (g.length - 1) * inner;
    for (const r of g) {
      const yt = Y(r.wall_min);
      b += rect(x, yt, bw, y0 - yt, MODEL_FILL[r.label]);
      if (!r.finished) {
        // white label strip inside the bar naming why it stopped
        const lbl = `× ${STATUS_SHORT[r.status]}`;
        const lw = lbl.length * 4.6 + 6;
        const cy = Math.min(yt + 4 + lw / 2, (yt + y0) / 2 + 10);
        b += `<rect x="${f1(x + 3)}" y="${f1(cy - lw / 2)}" width="${bw - 6}" height="${f1(lw)}" fill="#fff" stroke="none"/>`;
        b += text(x + bw / 2 + 3.4, cy, lbl, { rotate: -90, size: 9.5 });
      }
      b += text(x + bw / 2, yt - 3, r.wall_min < 100 ? r.wall_min.toFixed(1) : Math.round(r.wall_min), { size: 9.5 });
      b += text(x + bw / 2 + 3.5, y0 + 5, r.model_name, { rotate: -90, anchor: 'end', size: 10 });
      x += bw + inner;
    }
    // per-task time limit
    b += line(gx0 - 3, Y(limit), gx0 + gw + 3, Y(limit), { dash: '3 2', sw: 0.9 });
    b += text(gx0 + gw / 2, Y(limit) - 14, `limit ${limit}`, { size: 9, italic: true });
    b += text(gx0 + gw / 2, H - 6, MAIN_RUNS[gi].short, { size: 11, bold: true });
    x += groupGap - inner;
  });
  return svgDoc(W, H, 'Fig. 1. Wall-clock time per run, Wireless 101 and STATS 101 (log scale)',
    'Bars give each model\'s wall-clock minutes for the two main tasks on a log axis. The dashed line marks the 120-minute time limit. Bars marked with a cross did not produce a deck (timed out).', b);
}

function fig2(D) {
  const W = 340, H = 262, ml = 50, mr = 6, mt = 14, plotH = 160;
  const y0 = mt + plotH, top = 3;
  const Y = (v) => y0 - v / top * plotH;
  const bw = 34, inner = 4, groupGap = 34;
  const groups = MAIN_RUNS.map((R) => D.rows.filter((r) => r.task === R.task && r.finished));
  const totalW = groups.reduce((a, g) => a + g.length * bw + (g.length - 1) * inner, 0) + groupGap * (groups.length - 1);
  let x = ml + (W - ml - mr - totalW) / 2;
  let b = '';
  for (let t = 0; t <= top; t += 0.5) {
    if (t) b += line(ml, Y(t), W - mr, Y(t), { stroke: '#bbb', sw: 0.5 });
    b += text(ml - 4, Y(t) + 3.5, Number.isInteger(t) ? `$${t}` : `$${t.toFixed(2)}`, { anchor: 'end', size: 10 });
  }
  b += line(ml, mt, ml, y0) + line(ml, y0, W - mr, y0);
  b += text(11, mt + plotH / 2, 'Cost per finished deck (USD)', { rotate: -90, size: 11 });
  groups.forEach((g, gi) => {
    const gx0 = x;
    const gw = g.length * bw + (g.length - 1) * inner;
    for (const r of g) {
      const yt = Y(r.cost_usd);
      b += rect(x, yt, bw, y0 - yt, MODEL_FILL[r.label]);
      b += text(x + bw / 2, yt - 3, `$${r.cost_usd.toFixed(2)}`, { size: 9.5 });
      b += text(x + bw / 2 + 3.5, y0 + 5, r.model_name, { rotate: -90, anchor: 'end', size: 10 });
      x += bw + inner;
    }
    b += text(gx0 + gw / 2, H - 6, MAIN_RUNS[gi].short, { size: 11, bold: true });
    x += groupGap - inner;
  });
  return svgDoc(W, H, 'Fig. 2. API list-price cost per finished deck, Wireless 101 and STATS 101',
    'Bars give the CLI\'s API list-price cost for each finished deck of the two main tasks. Unfinished runs (the local qwen3.8 27B, which timed out on both) are omitted.', b);
}

// Marker shapes per model
const MARK = {
  opus: (x, y, fill) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="4.6" fill="${fill}" stroke="#000" stroke-width="1"/>`,
  sonnet: (x, y, fill) => `<rect x="${f1(x - 4.2)}" y="${f1(y - 4.2)}" width="8.4" height="8.4" fill="${fill}" stroke="#000" stroke-width="1"/>`,
  haiku: (x, y, fill) => `<path d="M${f1(x)} ${f1(y - 5.4)}L${f1(x + 5)} ${f1(y + 3.6)}L${f1(x - 5)} ${f1(y + 3.6)}Z" fill="${fill}" stroke="#000" stroke-width="1"/>`,
  'qwen-moe': (x, y, fill) => `<path d="M${f1(x)} ${f1(y - 5.6)}L${f1(x + 5.6)} ${f1(y)}L${f1(x)} ${f1(y + 5.6)}L${f1(x - 5.6)} ${f1(y)}Z" fill="${fill}" stroke="#000" stroke-width="1"/>`,
};
const TASK_FILL = { 'wireless-101': '#000', 'stats-101': '#fff' };

function fig3(D) {
  const W = 340, H = 268, ml = 36, mr = 10, mt = 30, plotH = 168;
  const y0 = mt + plotH, plotW = W - ml - mr;
  const xMax = 3.2, yLo = 5, yHi = 10;
  const X = (v) => ml + 8 + v / xMax * (plotW - 8);
  const Y = (v) => y0 - (v - yLo) / (yHi - yLo) * plotH;
  let b = '';
  for (let t = yLo; t <= yHi; t++) {
    b += line(ml, Y(t), W - mr, Y(t), { stroke: '#ccc', sw: 0.5 });
    b += text(ml - 4, Y(t) + 3.5, t, { anchor: 'end', size: 10 });
  }
  for (let t = 0; t <= 3; t++) {
    b += line(X(t), y0, X(t), y0 + 3);
    b += text(X(t), y0 + 13, `$${t}`, { size: 10 });
  }
  b += line(ml, mt, ml, y0) + line(ml, y0, W - mr, y0);
  b += text(11, mt + plotH / 2, 'Judge overall score (/10)', { rotate: -90, size: 11 });
  b += text(ml + plotW / 2, y0 + 28, 'Cost per finished deck (USD, API list price)', { size: 11 });
  const pts = mainRows(D).filter((r) => r.finished);
  const ab = (t) => RUNS.find((r) => r.task === t).abbr;
  // Hand-placed labels (dx, dy from the point, anchor) so none overlap; keyed by task/label.
  const place = {
    'wireless-101/opus': [0, -10, 'middle'], 'stats-101/opus': [0, 17, 'middle'],
    'wireless-101/sonnet': [10, -10, 'start'], 'stats-101/sonnet': [8, 17, 'start'],
    'wireless-101/haiku': [8, -9, 'start'], 'stats-101/haiku': [6, 16, 'start'],
  };
  const short = { opus: 'Opus', sonnet: 'Sonnet', haiku: 'Haiku' };
  for (const r of pts) {
    const px = X(r.cost_usd), py = Y(r.judge_overall);
    b += MARK[r.label](px, py, TASK_FILL[r.task]);
    const [dx, dy, anchor] = place[`${r.task}/${r.label}`] || [8, -8, 'start'];
    b += text(px + dx, py + dy, `${short[r.label]} ${ab(r.task)} $${r.cost_usd.toFixed(2)}`, { size: 9.5, anchor });
  }
  // legends: shape = model, fill = task
  const lm = legend(ml, 9, [
    { label: 'Opus', marker: (x, y) => MARK.opus(x, y, '#fff') },
    { label: 'Sonnet', marker: (x, y) => MARK.sonnet(x, y, '#fff') },
    { label: 'Haiku', marker: (x, y) => MARK.haiku(x, y, '#fff') },
  ], { size: 10, gap: 9 });
  const lt = legend(ml, 22, [
    { label: 'W = Wireless 101', marker: (x, y) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#000" stroke="#000"/>` },
    { label: 'S = STATS 101', marker: (x, y) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#fff" stroke="#000"/>` },
  ], { size: 10, gap: 9 });
  b += lm.svg + lt.svg;
  return svgDoc(W, H, 'Fig. 3. Judge score against cost, finished decks of Wireless 101 and STATS 101',
    'Each point is one finished deck of the two main tasks: judge overall score (out of 10) against API list-price cost. Marker shape gives the model, fill gives the task (black Wireless 101, white STATS 101).', b);
}

function fig4(D) {
  const means = criteriaMeans(mainRows(D));
  const W = 720, H = 258, ml = 44, mr = 8, mt = 34, plotH = 166;
  const y0 = mt + plotH;
  const Y = (v) => y0 - v / 5 * plotH;
  const n = means.length, bw = 20, inner = 2;
  const groupW = n * bw + (n - 1) * inner;
  const cats = [...CRITERIA, 'overall'];
  const slot = (W - ml - mr) / cats.length;
  let b = '';
  for (let t = 0; t <= 5; t++) {
    if (t) b += line(ml, Y(t), W - mr, Y(t), { stroke: '#bbb', sw: 0.5 });
    b += text(ml - 5, Y(t) + 4, t, { anchor: 'end', size: 12 });
  }
  b += line(ml, mt, ml, y0) + line(ml, y0, W - mr, y0);
  b += text(14, mt + plotH / 2, 'Mean score (1–5)', { rotate: -90, size: 12 });
  // separator before the overall group (overall is /10, shown halved)
  const sepX = ml + slot * CRITERIA.length;
  b += line(sepX, mt, sepX, y0 + 18, { dash: '2 2', sw: 0.7 });
  cats.forEach((c, ci) => {
    const gx = ml + slot * ci + (slot - groupW) / 2;
    means.forEach((m, mi) => {
      const v = c === 'overall' ? m.overall / 2 : m[c];
      const x = gx + mi * (bw + inner);
      b += rect(x, Y(v), bw, y0 - Y(v), MODEL_FILL[m.label]);
      const lbl = c === 'overall' ? m.overall.toFixed(1) : (Number.isInteger(v) ? String(v) : v.toFixed(1));
      b += text(x + bw / 2, Y(v) - 3, lbl, { size: 10 });
    });
    const name = c === 'overall' ? 'Overall (/10)' : c[0].toUpperCase() + c.slice(1);
    b += text(ml + slot * ci + slot / 2, y0 + 15, name, { size: 12 });
    if (c === 'overall') b += text(ml + slot * ci + slot / 2, y0 + 29, 'drawn at half height', { size: 10.5, italic: true });
  });
  const items = means.map((m) => ({ fill: MODEL_FILL[m.label], label: `${m.name} (n=${m.n})` }));
  const lg = legend(0, 0, items, { size: 12, sw: 11, gap: 16 });
  const lx = ml + (W - ml - mr - lg.width) / 2;
  b += legend(lx, 14, items, { size: 12, sw: 11, gap: 16 }).svg;
  return svgDoc(W, H, 'Fig. 4. Judge criterion scores, mean per model across finished decks, Wireless 101 and STATS 101',
    'Grouped bars give each model\'s mean judge score on the seven criteria (1–5) and the overall score (out of 10, drawn at half height on the same axis). Opus, Sonnet and Haiku are each averaged over their two finished decks (Wireless 101 and STATS 101).', b);
}

function fig5(D) {
  const decks = mainRows(D).filter((r) => r.finished);
  const W = 720, H = 268, ml = 40, mr = 8, mt = 38, plotH = 166;
  const y0 = mt + plotH, top = 8;
  const Y = (v) => y0 - v / top * plotH;
  const metrics = [
    { key: 'wrong_claims', major: 'wrong_claims_major', fill: '#8c8c8c', label: 'Wrong claims' },
    { key: 'invented_claims', major: 'invented_claims_untrue', fill: 'url(#p-diag)', label: 'Claims not in source' },
    { key: 'ui_issues', major: 'ui_issues_major', fill: '#fff', label: 'UI issues' },
  ];
  const bw = 20, inner = 2;
  const groupW = metrics.length * bw + (metrics.length - 1) * inner;
  const slot = (W - ml - mr) / decks.length;
  let b = '';
  for (let t = 0; t <= top; t += 2) {
    if (t) b += line(ml, Y(t), W - mr, Y(t), { stroke: '#bbb', sw: 0.5 });
    b += text(ml - 5, Y(t) + 4, t, { anchor: 'end', size: 12 });
  }
  b += line(ml, mt, ml, y0) + line(ml, y0, W - mr, y0);
  b += text(14, mt + plotH / 2, 'Count per deck', { rotate: -90, size: 12 });
  decks.forEach((r, di) => {
    const gx = ml + slot * di + (slot - groupW) / 2;
    metrics.forEach((m, mi) => {
      const x = gx + mi * (bw + inner);
      const tot = r[m.key], maj = r[m.major];
      if (tot === 0) {
        b += line(x, y0, x + bw, y0, { sw: 1.6 });
        b += text(x + bw / 2, y0 - 3, '0', { size: 10.5 });
        return;
      }
      if (tot - maj > 0) b += rect(x, Y(tot), bw, Y(maj) - Y(tot), m.fill);
      if (maj > 0) {
        b += rect(x, Y(maj), bw, y0 - Y(maj), '#000');
        b += text(x + bw / 2, (Y(maj) + y0) / 2 + 4, maj, { size: 10.5, fill: '#fff', bold: true });
      }
      b += text(x + bw / 2, Y(tot) - 3, tot, { size: 10.5 });
    });
    b += text(ml + slot * di + slot / 2, y0 + 15, MODELS[r.label].name, { size: 12 });
    b += text(ml + slot * di + slot / 2, y0 + 29, RUNS.find((x) => x.task === r.task).short, { size: 11, italic: true });
  });
  const items = [...metrics.map((m) => ({ fill: m.fill, label: m.label })),
    { fill: '#000', label: 'Major (or untrue) part, count in white' }];
  const lg = legend(0, 0, items, { size: 12, sw: 11, gap: 16 });
  b += legend(ml + (W - ml - mr - lg.width) / 2, 14, items, { size: 12, sw: 11, gap: 16 }).svg;
  return svgDoc(W, H, 'Fig. 5. Judge findings per finished deck, Wireless 101 and STATS 101: wrong claims, claims not in the source and UI issues',
    'For each finished deck of the two main tasks, three bars give the number of wrong claims, claims not in the source, and UI issues found by the blind judge. The black lower part of each bar is the major findings (for claims not in the source: those the judge marked untrue); the number on top is the total.', b);
}

// Plan experiment only: the three local models that built STATS 101 from the shared Opus plan.
function fig6(D) {
  const order = ['qwen-moe', 'gemma', 'qwen-local'];
  const rows = plannedRows(D).sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
  const limit = D.setup.timeout_min[PLANNED], total = D.plan.plan_slides;
  const W = 340, ml = 84, mr = 12, mt = 10, rowH = 42, bh = 22;
  const plotH = rows.length * rowH, y0 = mt + plotH, H = y0 + 40;
  const xMax = 260;
  const X = (v) => ml + v / xMax * (W - ml - mr);
  let b = '';
  for (let t = 0; t <= 240; t += 60) {
    if (t) b += line(X(t), mt, X(t), y0, { stroke: '#ccc', sw: 0.5 });
    b += line(X(t), y0, X(t), y0 + 3);
    b += text(X(t), y0 + 13, t, { size: 10 });
  }
  b += line(ml, mt, ml, y0) + line(ml, y0, W - mr, y0);
  b += text(ml + (W - ml - mr) / 2, y0 + 30, 'Wall-clock time (min)', { size: 11 });
  b += line(X(limit), mt, X(limit), y0, { dash: '3 2', sw: 0.9 });
  b += text(X(limit) - 4, mt + 9, `limit ${limit} min`, { anchor: 'end', size: 9, italic: true });
  rows.forEach((r, i) => {
    const yc = mt + i * rowH + rowH / 2;
    b += rect(ml, yc - bh / 2, X(r.wall_min) - ml, bh, MODEL_FILL[r.label]);
    b += text(ml - 5, yc + 3.5, r.model_name, { anchor: 'end', size: 10 });
    const detail = r.finished ? `${r.slides} of ${total} slides, judge ${r.judge_overall}/10`
      : `${r.partial_slides} of ${total} slides, no deck`;
    const lx = X(r.wall_min) + 5;
    b += text(lx, yc - 2, `${r.wall_min.toFixed(1)} min: ${r.status}`, { anchor: 'start', size: 10, bold: true });
    b += text(lx, yc + 10, detail, { anchor: 'start', size: 9.5, italic: true });
  });
  return svgDoc(W, H, 'Fig. 6. Plan experiment: three local models building STATS 101 from the same Opus plan',
    `Horizontal bars give each local model's wall-clock minutes building STATS 101 from the shared plan written by Opus, against the ${limit}-minute limit (dashed line). The label beside each bar gives the outcome and how many of the plan's ${total} slides were written. Local runs cost $0 per token.`, b);
}

// ---------------------------------------------------------------- main
const D = buildData();
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(FIG_DIR, { recursive: true });
fs.writeFileSync(path.join(DATA_DIR, 'study-data.json'), JSON.stringify(D, null, 2) + '\n');
fs.writeFileSync(path.join(DATA_DIR, 'tables.md'), tablesMd(D));
const figs = { 'fig1-time.svg': fig1, 'fig2-cost.svg': fig2, 'fig3-quality-vs-cost.svg': fig3, 'fig4-criteria.svg': fig4, 'fig5-issues.svg': fig5, 'fig6-planned.svg': fig6 };
for (const [name, fn] of Object.entries(figs)) fs.writeFileSync(path.join(FIG_DIR, name), fn(D));
console.log(`wrote ${path.relative(STUDY, DATA_DIR)}/study-data.json, tables.md and ${Object.keys(figs).length} figures (${D.rows.length} rows)`);
