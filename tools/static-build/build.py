#!/usr/bin/env python3
"""
Render the PHP site to a static export in static/.

The site has no SQL dump, so pages are rendered against tools/static-build/
db-stub.php. PHP is used only at build time; nothing PHP ships in the output.
"""
import html
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import parse_qs, quote

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "static"
WORK = ROOT / ".static-build-tmp"
STUB = ROOT / "tools/static-build/db-stub.php"

# page -> (query param, values). None means a single page with no parameter.
PAGES = {
    "index.php": None,
    "About_Us.php": None,
    "Contact_Us.php": None,
    "FAQs.php": None,
    "PrivacyPolicy.php": None,
    "TermsOfService.php": None,
    "Developers.php": None,
    "Docs.php": None,
    "Maps.php": None,
    "Residentials.php": None,
    "Commercials.php": None,
    "SubmitProperty.php": None,
    "SubmitProperty2.php": ("pid", ["1"]),
    "PropertiesDetails.php": ("pid", [str(i) for i in range(1, 13)]),
    "DevelopersDetails.php": ("did", [str(i) for i in range(1, 9)]),
    "Maps_Detailed.php": ("mid", [str(i) for i in range(1, 9)]),
    "LocationWiseProperty.php": ("loc", ["1", "2", "3", "4"]),
    "Doc_Open.php": None,
    "Maps_Google.php": None,
}

# Pages that keep their query string and read it in the browser instead of
# being rendered once per value — the parameter picks a document or a map
# address, neither of which needs anything from the server.
QUERY_DRIVEN = {"Doc_Open.php", "Maps_Google.php"}

# Pages whose parameter is dropped entirely in the static build.
SINGLE = {"SubmitProperty2.php"} | QUERY_DRIVEN

# Must mirror demo_docs() in db-stub.php — paths relative to admin/assets/.
DEMO_DOCS = [
    "documents/AGREEMENTTOSELL.doc",
    "documents/LEASEDEED.doc",
    "documents/GIFTDEEDFORRELATIVE.doc",
    "documents/GPAforNRI.doc",
    "documents/Form60.doc",
    "documents/AAlok_Doc.pdf",
]


def out_name(page: str, value: str | None) -> str:
    stem = page[:-4]
    if value is None or page in SINGLE:
        return f"{stem}.html"
    return f"{stem}-{value}.html"


def prepare_workspace() -> None:
    if WORK.exists():
        shutil.rmtree(WORK)
    WORK.mkdir()
    for php in ROOT.glob("*.php"):
        shutil.copy2(php, WORK / php.name)
    shutil.copytree(ROOT / "include", WORK / "include")
    (WORK / "admin/include").mkdir(parents=True)
    shutil.copy2(ROOT / "admin/include/pagin.php", WORK / "admin/include/pagin.php")
    shutil.copy2(STUB, WORK / "admin/include/MeecroDB.php")


def render(page: str, value: str | None, param: str | None) -> tuple[str, str]:
    """Run one page through PHP and return (html, stderr)."""
    qs = f"{param}={value}" if param and value is not None else ""
    entry = WORK / "_entry.php"
    entry.write_text(
        "<?php\n"
        f"$_SERVER['REQUEST_URI'] = '/{page}';\n"
        f"$_SERVER['QUERY_STRING'] = {qs!r};\n"
        f"parse_str({qs!r}, $_GET);\n"
        f"include '{page}';\n"
    )
    proc = subprocess.run(
        ["php", "-d", "short_open_tag=1", "-d", "error_reporting=E_ERROR",
         "-d", "display_errors=0", "_entry.php"],
        cwd=WORK, capture_output=True, text=True, timeout=90,
    )
    return proc.stdout, proc.stderr


ATTR = re.compile(r'\b(href|src|action)\s*=\s*(["\'])(.*?)\2', re.S)
EXTERNAL = ("http://", "https://", "//", "#", "mailto:", "tel:", "data:", "javascript:")
PHP_URL = re.compile(r"^(?:.*/)?(\w+)\.php(?:\?(.*))?$", re.S)


def map_embed(address: str) -> str:
    """A keyless Google Maps embed.

    include/mapsAPI.php rendered the map through the Maps JavaScript API using a
    key restricted to deeprealestate.in, so it cannot work from a demo host —
    and baking a key into static HTML would publish it. The plain `output=embed`
    form needs no key and shows the same map of the same address.
    """
    return "https://www.google.com/maps?q=" + quote(address.strip(), safe="") + "&output=embed"


def rewrite_url(url: str) -> str:
    raw = html.unescape(url).strip()
    if not raw or raw.startswith(EXTERNAL):
        return url

    if "mapsAPI.php" in raw:
        qs = parse_qs(raw.split("?", 1)[1]) if "?" in raw else {}
        return html.escape(map_embed(qs.get("mapaddress", ["Gurgaon, India"])[0]), quote=False)

    if raw in ("/", ""):
        return "index.html"

    m = PHP_URL.match(raw.lstrip("/"))
    if not m:
        # anything else is an asset: only the leading slash has to go
        return url.lstrip("/")

    stem, query = m.group(1), m.group(2)
    page = f"{stem}.php"
    if page in QUERY_DRIVEN:
        return f"{stem}.html?{query}" if query else f"{stem}.html"
    if page in SINGLE or page not in PAGES:
        return f"{stem}.html"

    spec = PAGES.get(page)
    if spec:
        value = parse_qs(html.unescape(query or "")).get(spec[0], [None])[0]
        if value in spec[1]:
            return f"{stem}-{value}.html"
        # a record the demo data does not contain — e.g. the paginator's
        # hard-coded template link — falls back to the first one
        return f"{stem}-{spec[1][0]}.html"
    return f"{stem}.html"


def rewrite(markup: str) -> str:
    # PHP routes -> static files, keeping per-record pages addressable, and
    # root-absolute asset paths -> relative (a demo host is not a domain root)
    def attr_sub(m):
        name, quote_ch, url = m.group(1), m.group(2), m.group(3)
        return f'{name}={quote_ch}{rewrite_url(url)}{quote_ch}'

    markup = ATTR.sub(attr_sub, markup)

    # The footer's inline jQuery posts to PHP endpoints that no longer exist,
    # and Doc_Open ships its own. Both are replaced wholesale by the demo layer.
    def script_sub(m):
        body = m.group(0)
        if "function_do.php" in body or "docs.google.com/viewer" in body:
            return '<script src="assets/js/demo-forms.js"></script>'
        return body

    markup = re.sub(r"<script\b[^>]*>.*?</script>", script_sub, markup, flags=re.S)

    # Anything left pointing at a .php page from inside JS
    for page in PAGES:
        markup = markup.replace(f"'{page}", f"'{page[:-4]}.html")
        markup = markup.replace(f'"{page}', f'"{page[:-4]}.html')
    return markup


def finalise(page: str, markup: str) -> str:
    """Per-page touches that only make sense once the markup is rendered."""
    if page in QUERY_DRIVEN:
        tag = page[:-4]
        markup = re.sub(r"<body\b", f'<body data-demo-page="{tag}"', markup, count=1)

    if page == "Doc_Open.php":
        # hooks for the demo layer, which fills these from the query string
        markup = markup.replace("<h1></h1>", '<h1 id="docTitle"></h1>', 1)
        markup = markup.replace(
            '<iframe style="width:80%;height:1042px;"',
            '<iframe id="docViewer" style="width:80%;height:1042px;"',
            1,
        )
    return markup


ASSET_RE = re.compile(r'(?:src|href)="((?!https?:|//|#|mailto:|tel:|data:)[^"]+)"')


def copy_assets(pages: list[str]) -> tuple[int, list[str]]:
    # assets/ is the front-end's own bundle (css, js, fonts, template images) and
    # is pulled in wholesale because its stylesheets reference files by url()
    shutil.copytree(ROOT / "assets", OUT / "assets", dirs_exist_ok=True)
    shutil.copy2(ROOT / "tools/static-build/demo-forms.js", OUT / "assets/js/demo-forms.js")

    sweet = ROOT / "admin/assets/libs/sweetalert2"
    if sweet.exists():
        shutil.copytree(sweet, OUT / "admin/assets/libs/sweetalert2", dirs_exist_ok=True)

    # the property sidebar's agent photo has no counterpart in the demo data
    ph = OUT / "admin/assets/images/agent-placeholder.jpg"
    ph.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / "assets/images/property-single-page-agent.jpg", ph)

    # the Docs page hands these to the browser at runtime, so the reference
    # scan below cannot see them
    docs_out = OUT / "admin/assets/documents"
    docs_out.mkdir(parents=True, exist_ok=True)
    for doc in DEMO_DOCS:
        src = ROOT / "admin/assets" / doc
        if src.is_file():
            shutil.copy2(src, docs_out / src.name)

    wanted, missing = set(), []
    for name in pages:
        for ref in ASSET_RE.findall((OUT / name).read_text(errors="replace")):
            ref = ref.split("?")[0].split("#")[0]
            if ref.endswith(".html") or not ref:
                continue
            wanted.add(ref)

    copied = 0
    for ref in sorted(wanted):
        src = ROOT / ref
        dst = OUT / ref
        if src.is_file():
            dst.parent.mkdir(parents=True, exist_ok=True)
            if not dst.exists():
                shutil.copy2(src, dst)
                copied += 1
        elif not dst.exists():
            missing.append(ref)
    return copied, missing


def main() -> int:
    prepare_workspace()
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()

    written, problems = [], []
    for page, spec in PAGES.items():
        param, values = (spec if spec else (None, [None]))
        for value in values:
            markup, err = render(page, value, param)
            if not markup.strip():
                problems.append(f"{page}?{param}={value}: EMPTY OUTPUT :: {err.strip()[:160]}")
                continue
            if "Fatal error" in markup or "Parse error" in markup:
                problems.append(f"{page}?{param}={value}: PHP FATAL")
            name = out_name(page, value)
            (OUT / name).write_text(finalise(page, rewrite(markup)))
            if name not in written:
                written.append(name)

    copied, missing = copy_assets(written)

    print(f"pages written : {len(written)}")
    print(f"assets copied : {copied}")
    if missing:
        print(f"MISSING ASSETS ({len(missing)}):")
        for m in missing[:15]:
            print("   ", m)
    if problems:
        print(f"PROBLEMS ({len(problems)}):")
        for p in problems[:15]:
            print("   ", p)
    shutil.rmtree(WORK, ignore_errors=True)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
