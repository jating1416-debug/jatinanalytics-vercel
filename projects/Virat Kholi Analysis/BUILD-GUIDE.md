# PLAYER 360 — Power BI Build Guide (Step by Step)

Ek page, 3 views (SOLO / PARTNER / TOUR) — slicer se charts khud switch honge.

## STEP 0 — Files ready karo

`kohli-pb` folder mein ye files hain:
- `fact_innings.csv` — 868 innings (Test+ODI+T20I+IPL combined, sirf asli bating innings)
- `dim_dates.csv` — date table 2008-2026
- `dim_formats.csv` — Test / ODI / T20I / IPL
- `dim_modes.csv` — SOLO / PARTNER / TOUR
- `dim_tours.csv` — 128 tours (2014-2026, fact se verified; matches = Kohli kheli matches)
- `dim_partners.csv` — 20 partners (har format ka TOP 5) — `competition` column format slicer se judta hai; `image_url` mein partner photo links daalne hain
- `dim_centuries.csv` — 94 centuries (30 Test / 54 ODI / 1 T20I / 9 IPL) — Century Wall table ke liye
- `dim_opponents.csv` — 35 rows: opponent × format summary (runs, HS, avg, SR)
- `dim_kits.csv` — 7 photo links (4 jersey + 3 tour) — `Jersey URL` / `Tour Image` measures isse links kheenchte hain. Links `PHOTO-LIST.md` se daalo

## STEP 1 — Import (2 min)

1. Power BI Desktop kholo → **Get Data → Text/CSV** → `fact_innings.csv` load karo
2. Baaki 5 dim files bhi load karo (Home → Transform Data se ek hi Power Query mein add ho jayengi, ya alag Get Data se)
3. `runs`, `balls`, `fours`, `sixes`, `total_runs`, `highest`, `partnerships`, `avg` columns ka type = **Decimal Number** karo
4. `date`, `start_date`, `end_date` ka type = **Date** karo
5. Close & Apply

## STEP 2 — Model (Relationships)

**Model view** mein jaao (left panel):
1. `dim_dates[date]` → `fact_innings[date]` (drag karo, single direction)
2. `dim_formats[Format]` → `fact_innings[format]`
3. `dim_tours[tour_id]` → `fact_innings[tour_id]`
4. `dim_formats[Format]` → `dim_partners[competition]` (single direction) — **isse partner view format-aware hota hai**: ODI select karo toh sirf ODI partners (Rohit/Dhawan/Raina...), IPL pe ABD/Gayle
5. `dim_dates` table select karo → **Table tools → Mark as date table** → column = date
6. `dim_modes` se **koi relationship MAT banao** (sirf slicer hai — DAX uska value padh leta hai)

## STEP 3 — DAX Measures paste karo

`DAX-MEASURES.txt` file kholo — sab measures wahan hain, section-wise:
1. **Section 0**: `Selected Format`, `Jersey URL`, `Page Title` ← **jersey URLs yahan daalo**
2. **Section 1**: `Show Solo`, `Show Partner`, `Show Tour` ← mode switching ka magic
3. **Section 2**: saare Kohli KPIs
4. **Section 3**: Partner measures
5. **Section 4**: Tour measures

Har measure: Home → **New Measure** → naam type karo → formula paste → Enter.

## STEP 4 — Image visual (jersey)

1. Naya **Table visual** banao
2. Usme sirf `Jersey URL` measure daalo
3. Power Query mein: `fact_innings` nahi — kisi ek table (e.g. `dim_formats`) mein ek blank column banao ya directly: `Jersey URL` measure select karke **Format → Data Category nahi** mil raha measure pe, isliye:
   - Alternative (easy): `dim_formats` table mein ek column `img` banao (Test/ODI/T20I/IPL ke 4 URLs), us column pe **Data Category = Image URL** karo
   - Table visual mein wahi column daalo
4. Table visual ka format: **View → Table borders = None**, **Background = Transparent**, Title OFF, Row headers OFF

## STEP 5 — Visuals banao (layout-mockup.html dekho)

`layout-mockup.html` file browser mein kholo — exact layout wahi hai jo Power BI mein banana hai.
**Pehle page size set karo: View → Report settings → Size → Custom → Width 2250, Height 1200.**

### Header
- Title text: `Page Title` measure (dynamic — format ke saath badlega)
- **Format slicer**: `dim_formats[Format]` — style = Tiles, single select OFF (matlab multiple select kar sakte ho; clear = All)
- **Mode slicer**: `dim_modes[Mode]` — style = Tiles, **Single select ON**

### Left rail
- Jersey image (STEP 4 wala table visual)
- 4 mini KPI cards: `KPI Runs`, `KPI HS`, `KPI 100s`... (card visuals, text measures)

### SOLO zone
- 6 KPI cards: Runs / Matches / HS / Avg / SR / 100s-50s
- Line chart: Year (from dim_dates) × Total Runs — visual filter: **Show Solo = 1**
- Bar chart: Opponent × Total Runs (top 8, descending) — visual filter: **Show Solo = 1**
- Dismissal donut + score distribution + 4s vs 6s (mockup dekho) — visual filter: **Show Solo = 1**
- **TOP 10 INNINGS** table: date, opponent, venue, runs, balls, fours, sixes, dismissal — **Top N = 10 by runs** — visual filter: **Show Solo = 1**
- **CENTURY WALL** (naya): `dim_centuries.csv` se — badi "94" number card (card visual, text = `COUNTROWS(dim_centuries)`) + top 10 table (score, format, opponent, date — Top N = 10 by score_num) — visual filter: **Show Solo = 1**
- (Optional) **Opponent table**: `dim_opponents.csv` — opponent × format, runs/HS/avg/SR

### PARTNER zone (same position, overlay)
- Partner image: table visual with `dim_partners[image_url]` (Data Category = Image URL)
- 4 KPI cards: `KPI P Count`, `KPI P Total`, `KPI P Highest`, `KPI P Avg`
- Bar: `dim_partners[partner]` × `total_runs` (all partners ranking)
- Bar: `dim_partners[partner]` × `highest`
- **Partner slicer**: `dim_partners[partner]` — single select
- Saare inke visuals pe: **visual filter Show Partner = 1**

### TOUR zone (same position, overlay)
- **Tour slicer**: `dim_tours[tour]` — dropdown style, single select
- 5 KPI cards: Matches, Runs, HS, Avg, SR (same Section-2 measures — tour slicer filter karega)
- Line chart: date × runs (tour ke andar)
- Table: innings of selected tour
- Saare pe: **visual filter Show Tour = 1**

## STEP 6 — Inactive zones ko invisible karna

Har visual ka **Format → Effects → Background → Transparency = 100%** — taaki mode off ho toh chart ki frame bhi na dikhe. (Zone ke cards/containers bhi transparent rakhna.)

## STEP 7 — Theme (design) — LIGHT

- **Palette (page/visuals pe manually set karo):** page `#f8fafc`, cards `#ffffff` border `#e4e7ec`, text `#101828`/`#667085`/`#98a2b3`, blue `#2563eb`, teal `#0f9f8f`, violet `#7c3aed`
- Font: Segoe UI

## STEP 8 — Test

1. Mode = SOLO, Format = All → career totals dikhne chahiye (36,987 runs)
2. Format = ODI → KPIs 14,941 runs / 314 matches / HS 183
3. Mode = PARTNER, Format = All → Rohit Sharma top (169 partnerships / 8,081 runs)
4. Mode = PARTNER, Format = ODI → Rohit 5,743 / Dhawan 3,430 / Raina 2,238
5. Mode = PARTNER, Format = IPL → ABD 3,134 / Gayle 2,802
6. Partner slicer = Shikhar Dhawan (ODI mode) → 60 partnerships / 3,430 runs / HS 212
7. Mode = TOUR → England 2018 select → 894 runs, HS 149

## ⚠️ Known gotchas

1. **Measure naam exact** rakhna jo DAX file mein hai
2. `dim_modes` pe agar SELECTEDVALUE BLANK de toh → mode slicer ON karo (single select)
3. Image URLs **https** ke hone chahiye + publicly accessible
4. Agar partnership chart mein total_runs blank dikhe → column type Decimal karo
5. Tour slicer mein tournament tours (World Cup/Asia Cup) ka naam multiple rows pe hoga — select karo toh saari series ek saath filter hongi (ye intended hai)
