#!/usr/bin/env python3
"""SYCONIA — consolidated project specification PDF builder.

Generates docs/SYCONIA-PROJECT-SPECIFICATION.pdf from the ACTUAL markdown
documentation suite (never placeholder text). Re-run after doc changes:
    python3 docs/build-pdf.py
"""
import re
from pathlib import Path
import markdown
from weasyprint import HTML

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "SYCONIA-PROJECT-SPECIFICATION.pdf"

VERSION, DATE = "1.0.1", "2026-09-03"

# (section number, PDF part title, doc path)
SECTIONS = [
    (1, "Product Requirements — Master PRD", "PRD.md"),
    (2, "Product Requirements — Advanced Specification", "PRD2.md"),
    (3, "Architecture", "ARCHITECTURE.md"),
    (4, "UX/UI System — Design System & Brand", "DESIGN-SYSTEM.md"),
    (5, "UX/UI System — Gestures & Interaction", "GESTURES.md"),
    (6, "Screen Specifications", "SCREENS.md"),
    (7, "Workflows & Navigation", "UX-FLOWS.md"),
    (8, "Database", "DATABASE.md"),
    (9, "API", "API.md"),
    (10, "Security", "SECURITY.md"),
    (11, "Performance", "PERFORMANCE.md"),
    (12, "SEO", "SEO.md"),
    (13, "Accessibility", "ACCESSIBILITY.md"),
    (14, "Testing", "TESTING.md"),
    (15, "CI/CD", "CI-CD.md"),
    (16, "Deployment", "DEPLOYMENT.md"),
    (17, "Error & Recovery States", "ERROR-STATES.md"),
    (18, "Operations — SOP", "SOP.md"),
    (19, "Pre-Release Checklist", "PRE-RELEASE.md"),
    (20, "Agent Instructions & Governance", "AGENT.md"),
    (22, "Legal & Compliance", "docs/LEGAL-COMPLIANCE.md"),
    (23, "Documentation Index & Changelog", "docs/DOCUMENTATION-INDEX.md"),
    (24, "README & Changelog", "README.md"),
]
# Part 24 appends CHANGELOG.md content after README (same section)
APPEND = {24: "CHANGELOG.md"}
ANCHOR = {Path(p).name: f"sec-{num}" for num, _, p in SECTIONS}

GLYPH_MAP = {"❌": "✗", "✅": "✔", "☐": "□", "▸": "›", "❤": "♥", "·": "·"}

def sanitize(text: str) -> str:
    for bad, good in GLYPH_MAP.items():
        text = text.replace(bad, good)
    return text

def md_to_html(md_text: str) -> str:
    html = markdown.markdown(sanitize(md_text), extensions=["tables", "fenced_code", "sane_lists"])
    # demote headings one level so section titles (h1) stay top-level
    html = re.sub(r"<h([1-5])>", lambda m: f"<h{min(int(m.group(1))+1,6)}>", html)
    html = re.sub(r"</h([1-5])>", lambda m: f"</h{min(int(m.group(1))+1,6)}>", html)
    # rewrite cross-document links to internal PDF anchors (or plain text for externals)
    def fix_href(m):
        href = m.group(1)
        base = Path(re.split(r"[#?]", href)[0]).name
        if base in ANCHOR:
            return f'href="#{ANCHOR[base]}" class="xref"'
        if href.startswith(("http://", "https://", "mailto:")):
            return m.group(0)
        return 'class="deadref"'
    html = re.sub(r'href="([^"]+)"', fix_href, html)
    return html

def exec_summary_md() -> str:
    """Extract the executive summary + scope verbatim from PRD.md."""
    prd = (ROOT / "PRD.md").read_text()
    m1 = re.search(r"(## 1\. Executive summary.*?)\n## 2\.", prd, re.S)
    m2 = re.search(r"(### 3\.1 In scope.*?### 3\.2 )", prd, re.S)
    parts = ["## Executive Summary (verbatim from PRD.md §1)", m1.group(1).strip()]
    if m2:
        parts += ["", "## Product Scope (verbatim from PRD.md §3.1)", m2.group(1).rsplit("### 3.2", 1)[0].strip()]
    parts += ["", "## Conflicts Register (verbatim from PRD.md §17)",
              re.search(r"(## 17\. Conflicts register.*?)(\n---\n|\Z)", prd, re.S).group(1).strip()]
    return "\n\n".join(parts)

CSS = """
@page { size: A4; margin: 22mm 18mm 20mm 18mm;
  @top-center { content: "SYCONIA — Project Specification v%(_v)s"; font-family:'DejaVu Sans'; font-size:7.5pt; color:#8A8880; }
  @bottom-right { content: counter(page) " / " counter(pages); font-family:'DejaVu Sans'; font-size:7.5pt; color:#8A8880; }
  @bottom-left { content: "Confidential — documentation baseline %(_d)s"; font-family:'DejaVu Sans'; font-size:7pt; color:#B9B7B0; } }
@page cover { margin:0; background:#09090B; @top-center{content:none} @bottom-right{content:none} @bottom-left{content:none} }
@page part { @top-center { content: "SYCONIA — Project Specification v%(_v)s"; font-family:'DejaVu Sans'; font-size:7.5pt; color:#8A8880; }
  @bottom-right { content: counter(page) " / " counter(pages); font-family:'DejaVu Sans'; font-size:7.5pt; color:#8A8880; } }
body { font-family:'DejaVu Sans',sans-serif; font-size:8.6pt; line-height:1.55; color:#1a1a1e; }
h1 { font-family:'DejaVu Serif',serif; font-size:19pt; color:#012A21; border-bottom:2.2pt solid #C5A059; padding-bottom:5pt; margin:0 0 10pt 0; }
h2 { font-family:'DejaVu Serif',serif; font-size:13pt; color:#012A21; margin:14pt 0 5pt 0; border-bottom:.6pt solid #C5A059; padding-bottom:2pt; page-break-after:avoid; }
h3 { font-family:'DejaVu Sans',sans-serif; font-size:10pt; color:#09090B; margin:10pt 0 4pt 0; page-break-after:avoid; }
h4,h5,h6 { font-size:9pt; color:#09090B; margin:8pt 0 3pt 0; page-break-after:avoid; }
p { margin:4pt 0; } ul,ol { margin:4pt 0 4pt 14pt; padding:0; } li { margin:1.5pt 0; }
code { font-family:'DejaVu Sans Mono',monospace; font-size:7.6pt; background:#f2f0ea; padding:0 2pt; border-radius:2pt; color:#012A21; }
pre { background:#09090B; color:#E6D3A0; padding:7pt; border-radius:4pt; font-size:7.2pt; line-height:1.4; overflow:hidden; page-break-inside:avoid; }
pre code { background:none; color:#E6D3A0; }
table { border-collapse:collapse; width:100%%; margin:6pt 0; font-size:7.7pt; page-break-inside:auto; }
th { background:#012A21; color:#FAF9F6; text-align:left; padding:3.5pt 5pt; font-weight:bold; }
td { border-bottom:.5pt solid #d8d4c8; padding:3.2pt 5pt; vertical-align:top; }
tr:nth-child(even) td { background:#faf9f6; }
blockquote { border-left:2.5pt solid #C5A059; margin:6pt 0; padding:2pt 0 2pt 8pt; color:#444; }
hr { border:none; border-top:.6pt solid #C5A059; margin:10pt 0; }
a { color:#012A21; text-decoration:none; }
.xref { color:#8a6d2f; } .xref::after { content:" (see §" attr(data-sec) ")"; font-size:7pt; color:#8A8880; }
.deadref { color:#333; }
.cover { page:cover; width:210mm; height:296mm; color:#FAF9F6; text-align:center; }
.cover .mark { margin-top:52mm; }
.cover .mark img { width:56mm; }
.cover h1.sym { font-family:'DejaVu Serif',serif; letter-spacing:10pt; font-size:30pt; color:#E6D3A0; border:none; margin:12mm 0 4mm 0; }
.cover .tag { font-family:'DejaVu Serif',serif; font-style:italic; font-size:12.5pt; color:#FAF9F6; }
.cover .tag2 { font-size:8.5pt; color:#C5A059; margin-top:2mm; letter-spacing:2pt; }
.cover .rule { width:40mm; border-top:1.2pt solid #C5A059; margin:9mm auto; }
.cover .meta { margin-top:16mm; font-size:9pt; color:#B9B7B0; line-height:1.9; }
.cover .meta b { color:#E6D3A0; font-weight:normal; }
.cover .foot { position:absolute; bottom:16mm; left:0; right:0; font-size:7.5pt; color:#8A8880; }
.toc h1 { margin-bottom:14pt; }
.toc ol { list-style:none; margin:0; padding:0; }
.toc li { margin:3.2pt 0; font-size:9.3pt; }
.toc li .n { display:inline-block; width:8mm; color:#8a6d2f; font-weight:bold; }
.toc a::after { content: leader('.') " " target-counter(attr(href), page); color:#666; }
.part { page:part; page-break-before:always; }
.partbanner { background:#012A21; color:#FAF9F6; padding:10pt 12pt; border-left:5pt solid #C5A059; margin-bottom:12pt; page-break-inside:avoid; }
.partbanner .pnum { font-size:8pt; letter-spacing:2.5pt; color:#C5A059; text-transform:uppercase; }
.partbanner h1 { color:#FAF9F6; border:none; font-size:16pt; margin:2pt 0 0 0; padding:0; font-family:'DejaVu Serif',serif; }
.srcline { font-size:7.5pt; color:#8A8880; margin-bottom:8pt; }
""" % {"_v": VERSION, "_d": DATE}

def build():
    toc_items, body_parts = [], []
    toc_items.append('<li><span class="n">ES</span><a href="#sec-exec">Executive Summary (from PRD.md)</a></li>')
    exec_html = md_to_html(exec_summary_md())
    body_parts.append(f'<section class="part" id="sec-exec"><div class="partbanner">'
                      f'<div class="pnum">Executive Summary</div><h1>Executive Summary &amp; Product Scope</h1></div>'
                      f'<div class="srcline">Source: PRD.md §1, §3.1, §17 — verbatim extraction</div>{exec_html}</section>')
    for num, title, path in SECTIONS:
        src = ROOT / path
        aid = f"sec-{num}"
        toc_items.append(f'<li><span class="n">{num}</span><a href="#{aid}">{title}</a></li>')
        doc_html = md_to_html(src.read_text())
        if num in APPEND:
            extra = ROOT / APPEND[num]
            doc_html += md_to_html(extra.read_text())
        body_parts.append(
            f'<section class="part" id="{aid}"><div class="partbanner">'
            f'<div class="pnum">Part {num:02d}</div><h1>{title}</h1></div>'
            f'<div class="srcline">Source document: {path} · v{VERSION} · {DATE}</div>{doc_html}</section>')
    cover = f"""
    <div class="cover">
      <div class="mark"><img src="{(ROOT/'branding'/'syconia-primary-logo.png').as_uri()}"/></div>
      <h1 class="sym">SYCONIA</h1>
      <div class="tag">The Beauty of the Inward Experience.</div>
      <div class="tag2">PREMIUM ADULT MEDIA DISCOVERY PLATFORM — PROJECT SPECIFICATION</div>
      <div class="rule"></div>
      <div class="meta">
        <b>Consolidated Project Specification</b><br/>
        Version {VERSION} — Documentation Baseline<br/>
        Date {DATE} · Owner / Developer credit: Roshan<br/>
        Compiled verbatim from the 24-document specification suite
      </div>
      <div class="foot">CONFIDENTIAL — contains design, security, and operational specifications.<br/>
      Content platform for adults 18+. Compliance frame: docs/LEGAL-COMPLIANCE.md.</div>
    </div>"""
    toc = f'<section class="toc"><h1>Table of Contents</h1><ol>{"".join(toc_items)}</ol></section>'
    html = f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cover}{toc}{''.join(body_parts)}</body></html>"
    HTML(string=html, base_url=str(ROOT)).write_pdf(str(OUT))
    print(f"PDF written: {OUT} ({OUT.stat().st_size/1024:.0f} KB)")

if __name__ == "__main__":
    build()
