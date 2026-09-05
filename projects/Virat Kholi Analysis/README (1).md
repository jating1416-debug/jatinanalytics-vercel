# VIRAT KOHLI · PLAYER 360 — Power BI Dataset (v2, fresh set)

Ek page ka 2250×1200 dashboard. MODE slicer (SOLO / PARTNER / TOUR) charts switch
karta hai, FORMAT slicer (TEST / ODI / T20I / IPL) poora page filter karta hai
— KPIs, charts, aur **jersey photo bhi auto-change** hoti hai.

---------------------------------------------------------------------
## 1. SAARI FILES (10 CSV) — ye hi pura dataset hai
---------------------------------------------------------------------

| File | Rows | Kya hai |
|---|---|---|
| `fact_innings.csv` | 868 | Har innings (sirf jisme Kohli ne bating ki): date, format, opponent, venue, runs, balls, 4s/6s, dismissal, tour, away, season, match_ref |
| `dim_dates.csv` | — | Calendar table (power query se bhi ban sakti hai) |
| `dim_formats.csv` | 4 | TEST / ODI / T20I / IPL — **global format slicer isi se chalta hai** |
| `dim_modes.csv` | 3 | SOLO / PARTNER / TOUR — mode slicer isi se |
| `dim_tours.csv` | 128 | Tour-wise KPIs (season, opponent, host, runs, avg...) — TOUR view. `matches` = **Kohli ne us tour mein kheli matches** (fact se verified) |
| `dim_partners.csv` | 20 | **Har format ka TOP 5 partner** (Test/ODI/T20I/IPL): partnerships, total_runs, highest, avg, image_url |
| `dim_centuries.csv` | 94 | Saare 94 centuries (score, balls, 4s/6s, SR, venue) — CENTURY WALL |
| `dim_opponents.csv` | 35 | Har opponent+format: matches, runs, HS, avg — opponents table |
| `dim_kits.csv` | 7 | **PHOTO LINKS** — 4 jersey (TEST/ODI/T20I/IPL) + 3 tour (TOUR_TEST/ODI/T20I) |
| `README.md` | — | Ye file |
| `PHOTO-LIST.md` | — | **27 photos dhoondhne ki list** (23 unique) — kya search karna, link kahan paste |

Plus: `DAX-MEASURES.txt` (saare measures, paste-ready).

---------------------------------------------------------------------
## 2. LOAD KARNE KE 4 STEPS
---------------------------------------------------------------------

**Step 1 — Import:** Home → Get Data → Text/CSV → 9 saari CSV files import karo.
(No Transform Needed → Load.)

**Step 2 — Relationships (Model view) — sirf 4:**
```
dim_dates[date]   → fact_innings[date]        (1:*)
dim_formats[Format] → fact_innings[format]    (1:*)
dim_tours[tour_id]  → fact_innings[tour_id]   (1:*)
dim_formats[Format] → dim_partners[competition] (1:*)
```
`dim_kits`, `dim_centuries`, `dim_opponents`, `dim_modes` pe **koi relationship NAHI**
(khali rehne do — measures inhe FILTER se use karte hain).

**Step 3 — Measures:** `DAX-MEASURES.txt` mein saare measures hain — Home →
New Measure → naam + formula paste karo. Table/field names exactly waise hi hain
jaise CSV ke headers mein (Power BI wahi naam dega).

**Step 4 — Jersey photo (format-wise image) — SIRF ITNA KARNA HAI:**
1. `dim_kits.csv` import kar lena (Step 1 mein hi ho jayega)
2. `[Jersey URL]` measure banao (DAX-MEASURES.txt §0 mein hai — ye dim_kits se
   link kheenchta hai, tumhe kuch paste nahi karna)
3. **Table visual** banao → andar sirf `[Jersey URL]` field daalo
4. Field select karke → Format = **Image URL** → Visual formatting mein
   **borders OFF**, row height adjust

Bas. Format slicer pe TEST/ODI/T20I/IPL click karoge toh photo apne aap badal jayegi.

---------------------------------------------------------------------
## 3. PHOTOS (dim_kits.csv + dim_partners.csv)
---------------------------------------------------------------------

**Total 27 image slots = 4 jersey + 20 partner (top-5/format) + 3 tour.**
Rohit/Raina/Dhawan ek hi photo 2-3 jagah reuse hoti hai → **actual downloads = 23**.
Har photo ka search query + link kahan paste karna hai → **`PHOTO-LIST.md` padho**
(woh ekdum ready list hai). Sab photos WebP mein ~1MB mein fit aa jayengi.

Abhi dim_kits mein 3 free-licensed links fallback ke liye hain:

| Format | Photo | License |
|---|---|---|
| TEST | Kohli, Test whites — Narendra Modi Stadium, 4th Test v AUS (9 Mar 2023) | PMO official (GODL-India, free) |
| ODI | Kohli, blue ODI kit — 2015 World Cup v UAE | CC BY-SA (free) |
| T20I | **KHALI — apna link daalo** (neeche how-to) | — |
| IPL | Kohli, RCB kit — 2015 IPL opening ceremony | CC (free) |

**Links (dim_kits.csv mein hi hain):**

```
TEST  https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg
ODI   https://upload.wikimedia.org/wikipedia/commons/e/e7/2015_CWC_I_v_UAE_02-28_Kohli_%2812%29_%28cropped%29.JPG
T20I  (khali — apna link)
IPL   https://upload.wikimedia.org/wikipedia/commons/6/67/Virat_Kohli_at_the_2015_IPL_opening_ceremony.jpg
```

**Zaroori baat (copyright):** Latest matches (2024-25) ki saari match photos ICC/BCCI/
news agencies ki copyright hain — free/public mein nahi hoti. Isliye yahan sirf
free-licensed (government/CC) photos hain. T20I (green kit) ki koi free public photo
hi nahi mil rahi.

**T20I ke liye apna link daalne ka tareeka (2 min):**
1. Koi bhi recent T20I photo apni pasand ki save karo (2024 T20 WC wali best lagegi)
2. GitHub pe apna koi bhi repo kholo → "Add file" → "Upload files" → photo upload
3. File pe click → **Raw** button → copy the raw URL
   (shape: `https://raw.githubusercontent.com/<tum>/repo/branch/photo.jpg`)
4. `dim_kits.csv` mein T20I row ki `image_url` mein wo URL paste karo → done.
   (Ye personal dashboard ke liye hai — public/non-commercial use.)

**Photo badalni ho?** CSV mein sirf URL cell change karo → Power BI mein refresh.

**Credit (optional):** TEST photo — PMO India (GODL); ODI/IPL — Wikimedia Commons
(CC-licensed).

**Partner image:** `dim_partners[image_url]` mein top-5 partners ke links daalo
(PHOTO-LIST.md se). `[Partner Image URL]` measure khaali link pe "" return karta hai
→ koi tooti hui icon nahi, sab blank dikhega jab tak links na daalo.

**Tour image:** `dim_kits.csv` ke `TOUR_TEST/TOUR_ODI/TOUR_T20I` rows ke links
`[Tour Image]` measure se tour cards pe lagte hain (DAX-MEASURES §4).

---------------------------------------------------------------------
## 4. PAGE KAAM KARTA KAISE
---------------------------------------------------------------------

- **MODE slicer** (dim_modes): SOLO → 6 KPIs + 5 charts (runs trend, format split,
  distribution, 4s/6s, top-10 innings) + CENTURY WALL. PARTNER → partner charts.
  TOUR → tour KPIs + trend. (Visibility filters DAX-MEASURES §1-§3 se aati hain.)
- **FORMAT slicer** (dim_formats): page ke saare visuals + jersey photo + partner
  dropdown (sirf us format ke partners) filter ho jata hai.
- **Century Wall:** `dim_centuries` — card (COUNTROWS = 94) + top-10 table
  (254* SA Pune 2019, 243 SL 2017, 235 ENG 2016...).
- **Opponents table (optional):** `dim_opponents` direct.

---------------------------------------------------------------------
## 5. DATA SOURCE / NOTES
---------------------------------------------------------------------

- Source: Cricsheet (cricsheet.org, current through Sep 2026) + Cricinfo
  Statsguru verification. Kohli cricinfo ID 253802.
- Verified career: Test 210 in/9230r/254*; ODI 302/14941/183; T20I 117/4188/122*;
  IPL 239/8628/113. 94 international+IPL centuries (30T · 54ODI · 1T20I · 9IPL).
- **Tour data fix (v2):** `dim_tours` ab `fact_innings` se directly recompute hota
  hai. `matches` = **Kohli ne us tour mein kheli matches** (distinct match_ref),
  `innings/runs/avg/SR` bhi fact se. Pehle 12 tours ke innings galat the (29
  "no-bat" ghost rows fact mein thi — hata di gayi, fact ab 868 rows hai).
- Chhota gap: Cricsheet Afghanistan matches withhold karta hai (ODI −2, T20I −4
  innings) — isliye ODI/T20I totals canon se ~2-5% kam dikhte hain.
- Batting avg = runs / (innings − not_out). `*` = not out.
