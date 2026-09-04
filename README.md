# Jatin Kumar — Portfolio V2

Modern, single-page analytics portfolio. Everything is generated from the data blocks at the top
of `script.js`, so you rarely need to touch `index.html`.

**No file-name rules to remember.** Whatever files you already have in each project folder on
GitHub are used as-is — card images, data previews, code/SQL/Power BI files, everything.

## What V2 includes

- **Projects** — 7 cards with a **search box + tool filters** (Power BI / SQL / Python / DAX).
  Each card has three actions:
  - **View details** → full project dialog: overview, objectives, key insights, tech stack,
    automatic source-file list, **live data preview** (first rows of the real CSVs + quick
    statistics), all dashboard visuals, and a **Copy project link** button.
  - **Live dashboard** → embedded Power BI report in a dialog.
  - **Source** → the GitHub project folder.
- **Deep links** — `https://jatinanalytics.co.in/#project=<id>` (e.g. `#project=supply-chain`)
  opens that project's details dialog automatically; `#case=<id>` opens a dataset case study.
  Share these with recruiters for a project straight to the point.
- **Datasets** — 3 Kaggle dataset cards with cover images. **View case study** opens the full
  engineering case study (problem statement, architecture, generation rules, constraints,
  structure table, Python snippet, challenges, insights).
- **Portfolio assistant** — intent-based answers on projects, details, dashboards, datasets,
  case studies, skills, resume, certificate, process and contact.
- **Resume / education / certificate card** (with Udemy verify link), contact form (Web3Forms).

## How images & files are picked up (important)

The site reads your GitHub repository (`projects/<Project Folder>/`) automatically:

1. **Card image** — the first image file (`.png / .jpg / .jpeg / .webp / .gif`, **any name**)
   inside that project's folder. Add a new screenshot? It shows up automatically.
2. **View details** — every file in the folder is listed automatically, grouped as:
   - **Code & analysis** → `.py`, `.ipynb`, `.sql`, `.txt`
   - **Data files** → `.csv`, `.xlsx`, `.xls`
   - **Power BI reports** → `.pbix`
   - **Other files** → anything else
3. **Data preview** — the first 3 CSVs are previewed (first rows + quick statistics).
4. **Dashboard visuals** — every image in the folder appears in the details gallery.

So the workflow is simply: **drop files into the project folder → push to GitHub → done.**
No naming, no editing `script.js` for files or images.

Notes:

- The GitHub file list is cached in the visitor's browser for **30 minutes**. A new file you push
  appears on the next refresh after that. (To see it instantly in your own browser: DevTools →
  Application → Local Storage → delete the `v2_gh_tree` key, then refresh.)
- If GitHub cannot be reached, cards fall back to the last known screenshot
  (`fallbackImage` in `script.js`) and the details dialog still shows the static project info.
- Images are shown **in full (not cropped)** — landscape dashboard screenshots fit best.

## Run the website locally

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`. Use a local server instead of opening `index.html` directly.

## Add your profile photo

Put one approved photo inside an `assets` folder using **one** exact filename (this is the only
file in the whole site that uses a fixed name):

```text
assets/profile-photo.webp   ← recommended
assets/profile-photo.png
assets/profile-photo.jpg
assets/profile-photo.jpeg
```

## Add a new portfolio project

1. Open `script.js`, find `const PROJECTS = [`.
2. Copy a project object and paste it before the final `];`.
3. Fill in the fields:

```js
{
  id: 'my-new-project',          // unique, lowercase, hyphenated
  title: 'My New Analytics Project',
  label: 'BUSINESS ANALYTICS',
  summary: 'One or two clear sentences explaining the business problem and outcome.',
  metric: 'Example: 50K records · sales performance analysis',
  tags: ['Power BI', 'SQL', 'Python'],
  alt: 'Short description of the dashboard preview image',
  dashboard: 'https://app.powerbi.com/view?r=YOUR_PUBLISHED_REPORT_LINK',
  source: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/My-New-Project',
  folder: 'My-New-Project',      // ← the exact folder name inside projects/ on GitHub
  fallbackImage: 'https://raw.githubusercontent.com/.../any-known-screenshot.png',
  info: {
    tagline: 'One-line tagline shown inside the details dialog.',
    overview: '2–4 sentence project overview.',
    objectives: ['Objective one', 'Objective two'],
    insights: ['Insight one', 'Insight two'],
    tech: ['Python', 'Power BI', 'SQL']
  }
}
```

- `folder` is what makes **View details** work — images, files and CSV previews are all read from
  that folder automatically.
- `fallbackImage` is only used if GitHub is unreachable — any screenshot URL works.

## Add a new Kaggle dataset (+ case study)

1. In `script.js`, add an object to `const DATASETS = [` (fields: `id`, `type`, `title`,
   `summary`, `scale`, `structure`, `url`, `cover`).
2. For the case study, add a matching key to `const CASE_STUDIES = {` with fields
   `problem`, `architecture`, `rules`, `constraints`, `structure`, `snippet`,
   `challenges`, `insights`, `kaggle`, `github`.
3. For the cover, push a `.webp` image to `images/` using the filename you set in `cover`
   (recommended: `ecommerce-dataset-cover.webp`, `fraud-dataset-cover.webp`,
   `hospital-dataset-cover.webp` — compressed versions are included in this package).
   The `.png` versions are used automatically as fallback, so the old files can stay.

## Display order

Move objects up/down inside `PROJECTS` / `DATASETS` in `script.js` — the page renders them in
list order.

## Files you normally edit

| File | Use |
|------|-----|
| `script.js` | Projects, datasets, case studies, assistant answers. |
| `index.html` | Page text, headings, contact details, links. |
| `style.css` | Colors, layout, fonts, spacing. |
| GitHub `projects/<folder>/` | All your data, code, SQL, PBIX, screenshots — any names. |
| `assets/profile-photo.*` | Your profile photo. |
| `certificate.pdf` | Replace with the same filename to update the certificate. |
| `resume.pdf` | Replace with the same filename to update the resume. |

`projects.json` and `case_studies.json` are legacy source records; the V2 page no longer needs
them (the data now lives in `script.js`).

## Deploy (Vercel)

This repo is connected to Vercel. To publish, replace the three site files at the repo root
(`index.html`, `style.css`, `script.js`), push to `main` — Vercel redeploys automatically.
