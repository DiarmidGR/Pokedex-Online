#!/usr/bin/env python3
"""
Fill the Omega Ruby / Alpha Sapphire encounter gaps in a PokeAPI-schema MySQL db
using Serebii's Hoenn pages.

  python3 oras_encounters.py scrape            # crawl Serebii -> oras_raw.csv  (cached, 1 req/sec)
  python3 oras_encounters.py scrape --pages route101 route102   # just a few pages
  python3 oras_encounters.py build             # oras_raw.csv + PokeAPI CSVs -> oras_patch.sql

Design: no new tables. Rows are written into your EXISTING tables
(encounters, encounter_slots, encounter_methods, location_areas), so your API
query keeps working untouched. Ids are resolved inside MySQL when the SQL runs
(works on MySQL 5.7+/MariaDB, no window functions).
Anything already in the db for a (version, location_area, method) is left alone
(gap-fill only), which also makes re-running the patch harmless.

Needs: pip install requests beautifulsoup4
"""
import argparse, collections, csv, re, sys, time
from pathlib import Path

POKEAPI = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/"
BASE = "https://www.serebii.net"
START = "/pokearth/hoenn/route101.shtml"
HOENN_RE = re.compile(r"^/pokearth/hoenn/([\w-]+)\.shtml$")
OR, AS, VERSION_GROUP, HOENN_REGION = 25, 26, 16, 3
UA = "Mozilla/5.0 (personal hobby DB import; contact: see github PokeAPI users)"

# heading text on Serebii -> PokeAPI encounter_methods.identifier (checked in order)
METHOD_PATTERNS = [
    (r"dexnav", "dexnav"),            # not in PokeAPI: added as a new method
    (r"horde", "horde"),
    (r"old rod", "old-rod"),
    (r"good rod", "good-rod"),
    (r"super rod", "super-rod"),
    (r"rock smash", "rock-smash"),
    (r"surf", "surf"),
    (r"walking", "walk"),
    (r"gift|egg|static|legend", "SKIP"),   # PokeAPI already covers these
]
RATE_RE = re.compile(r"^(\d+|-)\s*%$")
LEVEL_RE = re.compile(r"^(\d+)(?:\s*-\s*(\d+))?$")
RAW_COLS = ["slug", "section", "block", "version_id", "method", "slot", "species",
            "min_level", "max_level", "rarity"]


def norm(s):
    s = s.casefold().replace("♀", "f").replace("♂", "m").replace("é", "e")
    return re.sub(r"[^a-z0-9]", "", s)


def read_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def ensure_pokeapi(data_dir, names):
    import requests
    data_dir.mkdir(parents=True, exist_ok=True)
    for n in names:
        p = data_dir / n
        if not p.exists():
            print(f"downloading {n}")
            r = requests.get(POKEAPI + n, timeout=300)
            r.raise_for_status()
            p.write_bytes(r.content)


# ───────────────────────── scrape ─────────────────────────
def species_names(data_dir):
    ensure_pokeapi(data_dir, ["pokemon_species_names.csv"])
    return {norm(r["name"]): int(r["pokemon_species_id"])
            for r in read_csv(data_dir / "pokemon_species_names.csv")
            if r["local_language_id"] == "9"}


def parse_page(html, slug, species):
    """Walk every <tr> in document order as a tiny state machine."""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    out, warns = [], []
    method, versions, section, grp = None, [OR, AS], "", None
    block, seen_methods = 1, set()   # block = nth repeat of the method list on a page (e.g. north/south halves)

    def flush():
        nonlocal grp
        if not grp:
            return
        g, grp = grp, None
        if g["levels"] is None:
            warns.append(f"{slug}: names without level row {g['names']}")
            return
        if method in (None, "SKIP"):
            if method is None:
                warns.append(f"{slug}: names before any method heading {g['names']}")
            return
        for i, name in enumerate(g["names"]):
            rate = g["rates"][i] if g["rates"] else 0
            lo, hi = g["levels"][i]
            for v in versions:
                out.append(dict(slug=slug, section=section, block=block, version_id=v, method=method,
                                slot=i + 1, species=name, min_level=lo, max_level=hi,
                                rarity=rate))

    for el in soup.find_all(["h1", "h2", "h3", "h4", "tr"]):
        if el.name != "tr":
            section = el.get_text(" ", strip=True)
            continue
        cells = [c.get_text(" ", strip=True) for c in el.find_all(["td", "th"], recursive=False)]
        cells = [c for c in cells if c]
        if not cells or all(c.lower() == "level" for c in cells):
            continue
        if all(norm(c) in species for c in cells):                     # names row
            flush()
            grp = dict(names=cells, rates=None, levels=None)
        elif all(RATE_RE.match(c) for c in cells):                     # rate row
            if grp:
                grp["rates"] = [0 if c.startswith("-") else int(re.sub(r"\D", "", c)) for c in cells]
        elif all(LEVEL_RE.match(c) for c in cells):                    # level row
            if grp and len(cells) == len(grp["names"]):
                grp["levels"] = []
                for c in cells:
                    m = LEVEL_RE.match(c)
                    grp["levels"].append((int(m[1]), int(m[2] or m[1])))
                flush()
        elif len(cells) == 1 and len(cells[0]) < 80:                   # heading-ish row
            t = cells[0].lower()
            has_or, has_as = "omega ruby" in t, "alpha sapphire" in t
            if has_or or has_as:
                flush()
                versions = ([OR] if has_or else []) + ([AS] if has_as else [])
                continue
            for pat, m in METHOD_PATTERNS:
                if re.search(pat, t):
                    flush()
                    if m in seen_methods:          # method list restarted -> next block
                        block += 1
                        seen_methods = set()
                    seen_methods.add(m)
                    method, versions = m, [OR, AS]
                    break
    flush()
    return out, warns


def crawl(cache, only=None, delay=1.0):
    import requests
    cache.mkdir(parents=True, exist_ok=True)
    s = requests.Session()
    s.headers["User-Agent"] = UA

    def get(slug):
        f = cache / f"{slug}.html"
        if f.exists():
            return f.read_text(encoding="utf-8", errors="replace")
        time.sleep(delay)
        r = s.get(f"{BASE}/pokearth/hoenn/{slug}.shtml", timeout=60)
        if r.status_code != 200:
            print(f"  ! {slug}: HTTP {r.status_code}")
            return None
        f.write_text(r.text, encoding="utf-8")
        return r.text

    if only:
        for slug in only:
            yield slug, get(slug)
        return
    from bs4 import BeautifulSoup
    seen, queue = set(), ["route101"]
    while queue:
        slug = queue.pop(0)
        if slug in seen or slug == "index":
            continue
        seen.add(slug)
        html = get(slug)
        if html is None:
            continue
        yield slug, html
        for a in BeautifulSoup(html, "html.parser").find_all("a", href=True):
            m = HOENN_RE.match(a["href"])
            if m and m[1] not in seen:
                queue.append(m[1])


def cmd_scrape(a):
    data = Path(a.data)
    species = species_names(data)
    rows, warns = [], []
    for slug, html in crawl(Path(a.cache), a.pages, a.delay):
        if html is None:
            continue
        r, w = parse_page(html, slug, species)
        print(f"{slug:28s} {len(r):4d} rows")
        rows += r
        warns += w
    with open(a.raw, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, RAW_COLS)
        w.writeheader()
        w.writerows(rows)
    Path("scrape_warnings.txt").write_text("\n".join(warns), encoding="utf-8")
    print(f"\n{len(rows)} rows -> {a.raw}; {len(warns)} warnings -> scrape_warnings.txt")


# ───────────────────────── build ─────────────────────────
def q(s):
    return "'" + str(s).replace("\\", "\\\\").replace("'", "''") + "'"


def match_location(slug, locs, overrides):
    if slug in overrides:
        return overrides[slug]
    m = re.fullmatch(r"route(\d+)", slug)
    if m:
        c = f"hoenn-route-{int(m[1])}"
        return c if c in locs else None
    s = norm(slug)
    for ident in locs:
        n = norm(ident)
        if s in {n, re.sub(r"(town|city)$", "", n), re.sub(r"^hoenn", "", n)}:
            return ident
    return None


def cmd_build(a):
    """Emit SQL that resolves every id inside MySQL, so it works whatever state lego_db is in
    and is safe to run twice (anything already present for a version+area+method is skipped)."""
    data = Path(a.data)
    ensure_pokeapi(data, ["location_areas.csv", "locations.csv", "pokemon.csv",
                          "pokemon_species_names.csv"])
    raw = read_csv(a.raw)
    locs = {r["identifier"]: int(r["id"]) for r in read_csv(data / "locations.csv")
            if r["region_id"] == str(HOENN_REGION)}
    areas = collections.defaultdict(list)
    for r in read_csv(data / "location_areas.csv"):
        areas[int(r["location_id"])].append((int(r["id"]), r["identifier"]))
    sp = species_names(data)
    default_poke = {int(r["species_id"]): int(r["id"]) for r in read_csv(data / "pokemon.csv")
                    if r["is_default"] == "1"}
    overrides = {}
    if Path(a.slug_map).exists():
        overrides = {r["slug"]: r["location_identifier"] for r in read_csv(a.slug_map)}

    area_map = {}
    if Path(a.area_map).exists():
        area_map = {(r["slug"], r["block"]): r["area_identifier"] for r in read_csv(a.area_map)
                    if r["area_identifier"] is not None and r.get("area_identifier_set", "1") != "0"
                    and r["area_identifier"] != "?"}
    stage, review, unmatched, seen = [], [], set(), set()
    for r in raw:
        ident = match_location(r["slug"], locs, overrides)
        if not ident:
            unmatched.add(r["slug"])
            continue
        cand = areas.get(locs[ident], [])
        area_ident = None                       # None = "the location's only/first area"
        bkey = (r["slug"], str(r.get("block") or "1"))
        if bkey in area_map:
            area_ident = area_map[bkey]
            if area_ident not in [ai for _, ai in cand]:
                sys.exit(f"area_map: {bkey} -> {area_ident!r} is not one of {[c[1] for c in cand]}")
        elif len(cand) > 1:
            toks = set(re.findall(r"[a-z0-9]+", r["section"].lower()))
            hit = [ai for _, ai in cand
                   if (suf := set(ai.removeprefix(ident).strip("-").split("-")) - {""}) and suf <= toks]
            if len(hit) != 1:
                review.append({**r, "location": ident, "candidates": [c[1] for c in cand]})
                continue
            area_ident = hit[0]
        poke = default_poke[sp[norm(r["species"])]]
        row = (int(r["version_id"]), ident, area_ident, r["method"], int(r["slot"]),
               int(r["rarity"]), poke, int(r["min_level"]), int(r["max_level"]))
        if row not in seen:
            seen.add(row)
            stage.append(row)

    def lit(x):
        return "NULL" if x is None else (q(x) if isinstance(x, str) else str(x))

    methods = sorted({s[3] for s in stage})
    L = ["-- generated by oras_encounters.py; ids are resolved in-database, safe to re-run",
         "START TRANSACTION;",
         # what ORAS data already exists (snapshot BEFORE we insert anything)
         "CREATE TEMPORARY TABLE oras_have AS SELECT DISTINCT e.version_id, e.location_area_id, "
         "es.encounter_method_id FROM encounters e JOIN encounter_slots es ON es.id = e.encounter_slot_id "
         f"WHERE e.version_id IN ({OR}, {AS});",
         "CREATE TEMPORARY TABLE oras_stage (version_id INT, location_identifier VARCHAR(100), "
         "area_identifier VARCHAR(100) NULL, method_identifier VARCHAR(100), slot INT, rarity INT, "
         "pokemon_id INT, min_level INT, max_level INT);"]
    for i in range(0, len(stage), 500):
        vals = ",\n  ".join("(" + ", ".join(lit(x) for x in s) + ")" for s in stage[i:i + 500])
        L.append("INSERT INTO oras_stage VALUES\n  " + vals + ";")
    # 1. missing methods (e.g. dexnav)
    L.append("SET @base := (SELECT COALESCE(MAX(id),0) FROM encounter_methods), "
             "@base_ord := (SELECT COALESCE(MAX(`order`),0) FROM encounter_methods), @n := 0;")
    L.append("INSERT INTO encounter_methods (id, identifier, `order`) "
             "SELECT @base + (@n := @n + 1), m.identifier, @base_ord + @n "
             "FROM (SELECT DISTINCT method_identifier AS identifier FROM oras_stage) m "
             "WHERE NOT EXISTS (SELECT 1 FROM encounter_methods x WHERE x.identifier = m.identifier);")
    # 2. locations that have no area at all
    L.append("SET @base := (SELECT COALESCE(MAX(id),0) FROM location_areas), @n := 0;")
    L.append("INSERT INTO location_areas (id, location_id, game_index, identifier) "
             "SELECT @base + (@n := @n + 1), l.id, 0, '' FROM locations l WHERE l.identifier IN "
             "(SELECT DISTINCT location_identifier FROM oras_stage) "
             "AND NOT EXISTS (SELECT 1 FROM location_areas la WHERE la.location_id = l.id);")
    # 2b. named areas (e.g. route 104 north-oras/south-oras) missing from this db
    L.append("SET @base := (SELECT COALESCE(MAX(id),0) FROM location_areas), @n := 0;")
    L.append("INSERT INTO location_areas (id, location_id, game_index, identifier) "
             "SELECT @base + (@n := @n + 1), x.location_id, 0, x.area_identifier FROM "
             "(SELECT DISTINCT l.id AS location_id, s.area_identifier FROM oras_stage s "
             "JOIN locations l ON l.identifier = s.location_identifier "
             "WHERE s.area_identifier IS NOT NULL AND NOT EXISTS (SELECT 1 FROM location_areas la "
             "WHERE la.location_id = l.id AND la.identifier = s.area_identifier)) x;")
    L.append("SELECT ROW_COUNT() AS new_areas_created;")
    # 3. missing slots (matched by values, never by id)
    L.append("SET @base := (SELECT COALESCE(MAX(id),0) FROM encounter_slots), @n := 0;")
    L.append("INSERT INTO encounter_slots (id, version_group_id, encounter_method_id, slot, rarity) "
             "SELECT @base + (@n := @n + 1), "
             f"{VERSION_GROUP}, n.mid, n.slot, n.rarity FROM "
             "(SELECT DISTINCT em.id AS mid, s.slot, s.rarity FROM oras_stage s "
             "JOIN encounter_methods em ON em.identifier = s.method_identifier) n "
             f"WHERE NOT EXISTS (SELECT 1 FROM encounter_slots x WHERE x.version_group_id = {VERSION_GROUP} "
             "AND x.encounter_method_id = n.mid AND x.slot = n.slot AND x.rarity = n.rarity);")
    # 4. the encounters themselves
    L.append("SELECT COUNT(*) AS stage_rows, SUM((SELECT COUNT(*) FROM location_areas la "
             "JOIN locations l ON l.id = la.location_id WHERE l.identifier = s.location_identifier "
             "AND (s.area_identifier IS NULL OR la.identifier = s.area_identifier)) = 0) "
             "AS rows_with_no_matching_area FROM oras_stage s;")
    L.append("SET @base := (SELECT COALESCE(MAX(id),0) FROM encounters), @n := 0;")
    L.append("INSERT INTO encounters (id, version_id, location_area_id, encounter_slot_id, pokemon_id, min_level, max_level) "
             "SELECT @base + (@n := @n + 1), "
             "r.version_id, r.area_id, r.slot_id, r.pokemon_id, r.min_level, r.max_level FROM ("
             "SELECT DISTINCT s.version_id, "
             "CASE WHEN s.area_identifier IS NULL THEN (SELECT MIN(la.id) FROM location_areas la WHERE la.location_id = l.id) "
             "ELSE (SELECT MIN(la.id) FROM location_areas la WHERE la.location_id = l.id AND la.identifier = s.area_identifier) END AS area_id, "
             "(SELECT MIN(es.id) FROM encounter_slots es WHERE es.version_group_id = "
             f"{VERSION_GROUP} AND es.encounter_method_id = em.id AND es.slot = s.slot AND es.rarity = s.rarity) AS slot_id, "
             "em.id AS method_id, s.pokemon_id, s.min_level, s.max_level "
             "FROM oras_stage s JOIN locations l ON l.identifier = s.location_identifier "
             "JOIN encounter_methods em ON em.identifier = s.method_identifier) r "
             "WHERE r.area_id IS NOT NULL AND r.slot_id IS NOT NULL AND NOT EXISTS "
             "(SELECT 1 FROM oras_have h WHERE h.version_id = r.version_id "
             "AND h.location_area_id = r.area_id AND h.encounter_method_id = r.method_id);")
    L.append("SELECT ROW_COUNT() AS encounters_inserted;")
    L.append("COMMIT;")
    Path(a.sql).write_text("\n".join(L) + "\n", encoding="utf-8")

    if review:
        with open("needs_area_review.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, list(review[0].keys()))
            w.writeheader()
            w.writerows(review)
    if review:
        groups = collections.OrderedDict()
        for r in review:
            groups.setdefault((r["slug"], str(r.get("block") or "1")), []).append(r)
        with open("area_map_template.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["slug", "block", "area_identifier", "candidates", "preview"])
            for (slug, blk), rs in groups.items():
                prev = "; ".join(sorted({f"{x['method']}:{x['species']}" for x in rs})[:6])
                w.writerow([slug, blk, "?", " | ".join(repr(c) for c in rs[0]["candidates"]), prev])
    Path("unmatched_pages.txt").write_text("\n".join(sorted(unmatched)), encoding="utf-8")
    print(f"{len(stage)} candidate rows for {len(methods)} methods ({', '.join(methods)}) -> {a.sql}")
    print("rows whose version+area+method already exist in your DB are skipped when the SQL runs")
    print(f"{len(review)} rows need an area choice -> needs_area_review.csv; "
          f"fill in area_map_template.csv, save it as {a.area_map}, re-run build")
    print(f"{len(unmatched)} Serebii pages with no location match -> unmatched_pages.txt "
          f"(map them in {a.slug_map}: slug,location_identifier)")


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    for name, fn in (("scrape", cmd_scrape), ("build", cmd_build)):
        s = sub.add_parser(name)
        s.set_defaults(fn=fn)
        s.add_argument("--data", default="pokeapi_csv")
        s.add_argument("--raw", default="oras_raw.csv")
        if name == "scrape":
            s.add_argument("--cache", default="serebii_cache")
            s.add_argument("--pages", nargs="*")
            s.add_argument("--delay", type=float, default=1.0)
        else:
            s.add_argument("--sql", default="oras_patch.sql")
            s.add_argument("--slug-map", default="slug_map.csv")
            s.add_argument("--area-map", default="area_map.csv")
    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
