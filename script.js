/* ============================================================
   CONFIG
   ============================================================ */
let CONFIG = {
  github_user: '',
  github_repo: '',
  github_branch: 'main',
  projects_base_path: 'projects',
  projects: []
};

let GITHUB_TREE_CACHE = null;

/* ============================================================
   🔧 GENERIC CACHE HELPER (Naya — Caching Strategy)
   ============================================================ */
async function cachedFetch(cacheKey, url, options = {}, duration = 30 * 60 * 1000) {
  const dataKey = `cache_${cacheKey}`;
  const timeKey = `cache_${cacheKey}_time`;

  const cached = localStorage.getItem(dataKey);
  const cachedTime = localStorage.getItem(timeKey);
  const age = Date.now() - parseInt(cachedTime || '0', 10);
  const isValid = cached && age < duration;

  async function fetchFresh() {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    localStorage.setItem(dataKey, JSON.stringify(data));
    localStorage.setItem(timeKey, Date.now().toString());
    return data;
  }

  if (isValid) {
    fetchFresh().catch(() => {}); // background refresh, silent
    return JSON.parse(cached);
  }

  try {
    return await fetchFresh();
  } catch (err) {
    if (cached) {
      console.warn(`⚠️ Using expired cache for ${cacheKey}`);
      return JSON.parse(cached);
    }
    throw err;
  }
}

// Config ek hi baar load ho (race-condition FIX)
async function ensureConfigLoaded() {
  if (CONFIG.projects && CONFIG.projects.length > 0) return CONFIG;
  const configData = await cachedFetch('projects_config', 'projects.json', {}, 60 * 60 * 1000);
  CONFIG = { ...CONFIG, ...configData };
  return CONFIG;
}

/* ============================================================
   1. GITHUB API — SMART CACHE (Stale While Revalidate)
   ============================================================ */
async function getGitHubTree() {
  const CACHE_KEY = 'gh_tree_cache';
  const CACHE_TIME_KEY = 'gh_tree_cache_time';
  const CACHE_DURATION = 30 * 60 * 1000;

  const cached = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
  const cacheAge = Date.now() - parseInt(cachedTime || '0');
  const isCacheValid = cached && cacheAge < CACHE_DURATION;

  const headers = {};
  if (typeof GITHUB_TOKEN !== 'undefined' && GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${CONFIG.github_user}/${CONFIG.github_repo}/git/trees/${CONFIG.github_branch}?recursive=1`;

  async function fetchFreshData() {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    const tree = data.tree || [];
    localStorage.setItem(CACHE_KEY, JSON.stringify(tree));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    return tree;
  }

  if (isCacheValid) {
    GITHUB_TREE_CACHE = JSON.parse(cached);
    fetchFreshData()
      .then(tree => { GITHUB_TREE_CACHE = tree; console.log('✅ GitHub tree refreshed in background'); })
      .catch(err => console.warn('⚠️ Background refresh failed (using cache):', err.message));
    return GITHUB_TREE_CACHE;
  }

  try {
    const tree = await fetchFreshData();
    GITHUB_TREE_CACHE = tree;
    return tree;
  } catch (err) {
    console.error('GitHub tree fetch failed:', err);
    if (cached) {
      GITHUB_TREE_CACHE = JSON.parse(cached);
      return GITHUB_TREE_CACHE;
    }
    return [];
  }
}

function getFilesForFolder(tree, folderName) {
  const prefix = `${CONFIG.projects_base_path}/${folderName}/`;
  return tree
    .filter(item => item.type === 'blob' && item.path.startsWith(prefix))
    .map(item => ({
      fullPath: item.path,
      relativePath: item.path.slice(prefix.length),
      name: item.path.split('/').pop(),
      ext: item.path.split('.').pop().toLowerCase()
    }));
}

function getRawUrl(fullPath) {
  const encodedPath = fullPath.split('/').map(encodeURIComponent).join('/');
  return `https://raw.githubusercontent.com/${CONFIG.github_user}/${CONFIG.github_repo}/${CONFIG.github_branch}/${encodedPath}`;
}

function getBlobUrl(fullPath) {
  const encodedPath = fullPath.split('/').map(encodeURIComponent).join('/');
  return `https://github.com/${CONFIG.github_user}/${CONFIG.github_repo}/blob/${CONFIG.github_branch}/${encodedPath}`;
}

/* ============================================================
   2. FILE CATEGORIZATION
   ============================================================ */
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
const CSV_EXTS = ['csv'];
const CODE_CATEGORIES = {
  'Python 🐍': ['py', 'ipynb'],
  'SQL Database 💾': ['sql'],
  'Excel / Data 📊': ['xlsx', 'xls', 'csv'],
  'Power BI Report 📈': ['pbix']
};

function categorizeFiles(files) {
  const images = files.filter(f => IMAGE_EXTS.includes(f.ext));
  const csvFiles = files.filter(f => CSV_EXTS.includes(f.ext));
  const pbixFiles = files.filter(f => f.ext === 'pbix');
  const infoFile = files.find(f => f.name.toLowerCase() === 'project_info.json');
  const readmeFile = files.find(f => f.name.toLowerCase() === 'readme.md');

  const techUsed = [];
  const downloadFiles = { 'Python 🐍': [], 'SQL Database 💾': [], 'Excel / Data 📊': [] };

  files.forEach(f => {
    for (const [category, exts] of Object.entries(CODE_CATEGORIES)) {
      if (exts.includes(f.ext)) {
        if (!techUsed.includes(category)) techUsed.push(category);
        if (downloadFiles[category]) downloadFiles[category].push(f);
      }
    }
  });

  return { images, csvFiles, pbixFiles, infoFile, readmeFile, techUsed, downloadFiles };
}

/* ============================================================
   3. CSV PARSING + STATS
   ============================================================ */
async function fetchAndParseCSV(fileUrl) {
  try {
    const res = await fetch(fileUrl);
    const text = await res.text();
    const parsed = Papa.parse(text, { header: false, skipEmptyLines: true });
    const rows = parsed.data;
    const headers = rows[0] || [];
    const dataRows = rows.slice(1);
    return { headers, dataRows, totalRows: dataRows.length, totalCols: headers.length };
  } catch (err) {
    console.error('CSV parse failed:', err);
    return null;
  }
}

function computeStats(headers, dataRows) {
  const numericCols = [];

  headers.forEach((h, colIdx) => {
    const values = dataRows.map(r => parseFloat(r[colIdx])).filter(v => !isNaN(v));
    if (values.length > dataRows.length * 0.5) numericCols.push({ name: h, values });
  });

  if (numericCols.length === 0) return null;

  const statLabels = ['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max'];
  const statsData = statLabels.map(label => {
    const row = [label];
    numericCols.forEach(col => {
      const sorted = [...col.values].sort((a, b) => a - b);
      const n = sorted.length;
      let val;
      switch (label) {
        case 'count': val = n; break;
        case 'mean': val = (sorted.reduce((a, b) => a + b, 0) / n).toFixed(2); break;
        case 'std': {
          const mean = sorted.reduce((a, b) => a + b, 0) / n;
          const variance = sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
          val = Math.sqrt(variance).toFixed(2);
          break;
        }
        case 'min': val = sorted[0]?.toFixed(2); break;
        case 'max': val = sorted[n - 1]?.toFixed(2); break;
        case '25%': val = sorted[Math.floor(n * 0.25)]?.toFixed(2); break;
        case '50%': val = sorted[Math.floor(n * 0.5)]?.toFixed(2); break;
        case '75%': val = sorted[Math.floor(n * 0.75)]?.toFixed(2); break;
      }
      row.push(val);
    });
    return row;
  });

  return { headers: ['Metric', ...numericCols.map(c => c.name)], data: statsData };
}

/* ============================================================
   5. PROJECTS — MAIN RENDER LOGIC
   ============================================================ */
let ALL_PROJECTS_DATA = [];

async function loadProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    await ensureConfigLoaded();
    const tree = await getGitHubTree();

    ALL_PROJECTS_DATA = [];
    for (const proj of CONFIG.projects) {
      const files = getFilesForFolder(tree, proj.folder);
      const categorized = categorizeFiles(files);
      ALL_PROJECTS_DATA.push({
        id: proj.folder.replace(/\s+/g, '-').toLowerCase(),
        folder: proj.folder,
        files,
        ...categorized,
        info: null,
        loaded: false
      });
    }

    renderProjectsList(ALL_PROJECTS_DATA);
  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <div class="error-state">
        <h3>⚠️ Could not load projects</h3>
        <p>${err.message}</p>
      </div>`;
  }
}

// Naya helper — Search Highlight ke liye
function highlightMatch(text, query) {
  const safe = escapeHtml(text);
  if (!query) return safe;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'ig');
  return safe.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function renderProjectsList(projects, searchQuery = '', activeTag = 'All') {
  const container = document.getElementById('projects-container');

  const filtered = projects.filter(p => {
    const matchesSearch = searchQuery === '' ||
      p.folder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.techUsed || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = activeTag === 'All' || (p.tags || []).includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const countEl = document.getElementById('results-count');
  if (countEl) countEl.textContent = `Showing ${filtered.length} of ${projects.length} projects`;

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `<div class="error-state"><h3>😔 No projects found</h3></div>`;
    return;
  }

  filtered.forEach((proj, idx) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.innerHTML = `
      <button class="accordion-header" onclick="toggleProjectAccordion(this, '${proj.id}', ${idx})">
        <span class="accordion-arrow">▶</span>
        <span class="proj-number">Project ${idx + 1}</span>
        <span class="proj-title">${highlightMatch(proj.folder, searchQuery)}</span>
      </button>
      <div class="accordion-content" id="content-${proj.id}">
        <div class="accordion-body">
          <p class="loading-text">Click to load project details...</p>
        </div>
      </div>`;
    container.appendChild(item);
  });
}

/* ============================================================
   6. PROJECT ACCORDION — LAZY LOAD ON OPEN
   ============================================================ */
async function toggleProjectAccordion(header, projId, idx) {
  const isOpen = header.classList.contains('open');
  const content = header.nextElementSibling;

  document.querySelectorAll('.accordion-header.open').forEach(h => {
    if (h !== header) {
      h.classList.remove('open');
      h.nextElementSibling.style.maxHeight = null;
    }
  });

  header.classList.toggle('open', !isOpen);

  if (!isOpen) {
    const proj = ALL_PROJECTS_DATA[idx];
    if (!proj.loaded) {
      await loadProjectDetails(proj, content);
      proj.loaded = true;
    }
    content.style.maxHeight = content.scrollHeight + 'px';
    setTimeout(() => {
      if (header.classList.contains('open')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    }, 300);
  } else {
    content.style.maxHeight = null;
  }
}

async function loadProjectDetails(proj, contentEl) {
  const body = contentEl.querySelector('.accordion-body');
  body.innerHTML = `<div class="skeleton-list">
    <div class="skeleton-line wide"></div>
    <div class="skeleton-line medium"></div>
    <div class="skeleton-line wide"></div>
  </div>`;

  let overview = '', objectives = [], keyInsights = [], tech = [], tags = [], powerbiEmbed = '';
  let debugInfo = [];

  try {
    if (proj.infoFile) {
      const infoUrl = getRawUrl(proj.infoFile.fullPath);
      debugInfo.push(`Fetching: ${infoUrl}`);
      const res = await fetch(infoUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status} - File not found at this URL`);
      const rawText = await res.text();

      let info;
      try {
        info = JSON.parse(rawText);
      } catch (jsonErr) {
        throw new Error(`Invalid JSON syntax: ${jsonErr.message}`);
      }

      overview = info.overview || '';
      objectives = info.objectives || [];
      keyInsights = info.key_insights || [];
      tech = info.tech || [];
      tags = info.tags || [];
      powerbiEmbed = info.powerbi_embed_url || '';
      proj.tags = tags;
      debugInfo.push('✅ project_info.json loaded successfully');
    } else if (proj.readmeFile) {
      const res = await fetch(getRawUrl(proj.readmeFile.fullPath));
      overview = await res.text();
      debugInfo.push('✅ README.md loaded (no project_info.json found)');
    } else {
      debugInfo.push('⚠️ Neither project_info.json nor README.md found');
    }
  } catch (err) {
    console.error(`[${proj.folder}] Overview load failed:`, err);
    debugInfo.push(`❌ ERROR: ${err.message}`);
    overview = `⚠️ Could not load project details: ${err.message}`;
  }

  if (tech.length === 0) tech = proj.techUsed;

  let csvPreviewData = [];
  try {
    const csvPromises = proj.csvFiles.map(csvFile =>
      fetchAndParseCSV(getRawUrl(csvFile.fullPath)).then(parsed => {
        if (!parsed) return null;
        return {
          name: csvFile.name,
          headers: parsed.headers,
          preview: parsed.dataRows.slice(0, 10),
          totalRows: parsed.totalRows,
          totalCols: parsed.totalCols,
          stats: computeStats(parsed.headers, parsed.dataRows)
        };
      }).catch(err => {
        console.error(`CSV load failed: ${csvFile.name}`, err);
        return null;
      })
    );
    const csvResults = await Promise.all(csvPromises);
    csvPreviewData = csvResults.filter(r => r !== null);
  } catch (err) {
    console.error(`[${proj.folder}] CSV loading failed:`, err);
  }

  try {
    body.innerHTML = buildProjectHTML(proj, { overview, objectives, keyInsights, tech, powerbiEmbed, csvPreviewData });
  } catch (err) {
    console.error(`[${proj.folder}] Render failed:`, err);
    body.innerHTML = `
      <div class="error-state">
        <h3>⚠️ Error Loading This Project</h3>
        <p><strong>Error:</strong> ${err.message}</p>
        <details style="margin-top:10px; text-align:left; font-size:0.8rem;">
          <summary>Debug Info (click to expand)</summary>
          <pre>${debugInfo.join('\n')}</pre>
        </details>
      </div>`;
  }
}

function buildProjectHTML(proj, data) {
  const { overview, objectives, keyInsights, tech, powerbiEmbed, csvPreviewData } = data;

  const overviewHTML = overview
    ? `<p class="overview-text">${escapeHtml(overview).replace(/\n/g, '<br>')}</p>`
    : `<p class="no-content">No overview added yet. Add project_info.json to this folder.</p>`;

  const objectivesHTML = objectives.length ? `
    <h4>🎯 Objectives</h4>
    <ul>${objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}</ul>` : '';

  const insightsHTML = keyInsights.length ? `
    <div class="key-insights-box">
      <h4>💡 Key Insights</h4>
      <ul>${keyInsights.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
    </div>` : '';

  const techHTML = tech.map(t => `<span class="badge">${t}</span>`).join('');

  let filesHTML = '';
  Object.entries(proj.downloadFiles).forEach(([category, files]) => {
    if (files.length > 0) {
      filesHTML += files.map(f => `
        <a href="${getRawUrl(f.fullPath)}" download="${f.name}" class="file-card-btn" title="Download ${f.name}">
          📄 ${f.name}
        </a>`).join('');
    }
  });

  let pbixHTML = '';
  if (proj.pbixFiles.length > 0) {
    if (powerbiEmbed) {
      pbixHTML = `
        <div class="section-block">
          <h3>📊 Power BI Dashboard (Live View)</h3>
          <div class="pbi-embed-wrapper">
            <iframe src="${powerbiEmbed}" title="Power BI Dashboard" allowFullScreen></iframe>
          </div>
          <a href="${powerbiEmbed}" target="_blank" rel="noopener" class="pbi-fullscreen-link">
            🔗 Open Full Dashboard in New Tab (View Only)
          </a>
        </div>`;
    } else {
      pbixHTML = `
        <div class="section-block">
          <h3>📊 Power BI Dashboard</h3>
          <div class="pbi-no-embed">
            🔒 <strong>${proj.pbixFiles[0].name}</strong><br>
            <span style="font-size:0.85rem;">Live preview available soon. This file is view-only and not downloadable.</span>
          </div>
        </div>`;
    }
  }

  let dsTabsHTML = '', dsTablesHTML = '';
  if (csvPreviewData.length > 0) {
    dsTabsHTML = csvPreviewData.map((ds, i) =>
      `<button class="dataset-tab ${i === 0 ? 'active' : ''}" onclick="switchDatasetTab(event, '${proj.id}', ${i})">${ds.name}</button>`
    ).join('');

    dsTablesHTML = csvPreviewData.map((ds, i) => `
      <div id="table-${proj.id}-${i}" class="dataset-table-view" style="display:${i === 0 ? 'block' : 'none'};">
        <p class="shape-info"><b>${ds.name}</b> — Shape: <code>${ds.totalRows.toLocaleString()} rows × ${ds.totalCols} columns</code></p>
        <div class="table-scroll">${generateHTMLTable(ds.headers, ds.preview)}</div>
        ${ds.stats ? `
          <details class="stats-dropdown">
            <summary>📈 Data Statistics</summary>
            <div class="table-scroll">${generateHTMLTable(ds.stats.headers, ds.stats.data)}</div>
          </details>` : ''}
      </div>`).join('');
  }

  const imagesHTML = proj.images.length > 0
    ? proj.images.map((img, i) => `
        <div class="dash-img-item" onclick="openLightbox('${getRawUrl(img.fullPath)}', '${proj.folder} - ${img.name}')">
          <img src="${getRawUrl(img.fullPath)}" 
               alt="${proj.folder} Dashboard Screenshot ${i + 1}" 
               loading="lazy"
               onload="this.classList.add('img-loaded')"
               onerror="this.parentElement.style.display='none'">
        </div>`).join('')
    : '<p class="no-content">No screenshots added yet</p>';

  return `
    <div class="section-block">
      <h3>🎯 Project Overview & Business Impact</h3>
      ${overviewHTML}
      ${objectivesHTML}
      ${insightsHTML}
    </div>

    <div class="section-block">
      <h3>🛠️ Technologies Used</h3>
      <div class="tech-tags">${techHTML || '<span class="no-content">No tech detected</span>'}</div>
    </div>

    <div class="section-block">
      <h3>📁 Project Files & Code</h3>
      <div class="files-grid">${filesHTML || '<p class="no-content">No downloadable files</p>'}</div>
    </div>

    ${pbixHTML}

    <div class="section-block">
      <h3>📊 Dataset Preview</h3>
      ${csvPreviewData.length ? `
        <div class="dataset-tabs-bar">${dsTabsHTML}</div>
        ${dsTablesHTML}` : '<p class="no-content">No CSV files found</p>'}
    </div>

    <div class="section-block">
      <h3>🖼️ Dashboard Screenshots & Visualizations</h3>
      <div class="dash-images-grid">${imagesHTML}</div>
    </div>`;
}

function switchDatasetTab(evt, projId, fileIndex) {
  const parent = evt.currentTarget.closest('.accordion-body');
  parent.querySelectorAll('.dataset-tab').forEach(t => t.classList.remove('active'));
  parent.querySelectorAll('.dataset-table-view').forEach(t => t.style.display = 'none');

  evt.currentTarget.classList.add('active');
  const table = document.getElementById(`table-${projId}-${fileIndex}`);
  if (table) table.style.display = 'block';

  const accContent = parent.closest('.accordion-content');
  if (accContent) accContent.style.maxHeight = accContent.scrollHeight + 'px';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function generateHTMLTable(headers, rows) {
  if (!headers || !rows) return '<p class="no-content">No data</p>';
  const thead = headers.map(h => `<th>${escapeHtml(String(h))}</th>`).join('');
  const tbody = rows.map(r =>
    `<tr>${r.map(cell => `<td>${escapeHtml(String(cell ?? '—'))}</td>`).join('')}</tr>`
  ).join('');
  return `<table class="custom-table"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`;
}

/* ============================================================
   7. SEARCH + TAG FILTER (Debounced — already tha)
   ============================================================ */
function initProjectFilters() {
  const searchInput = document.getElementById('project-search');
  let searchTimer;

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        renderProjectsList(ALL_PROJECTS_DATA, e.target.value, window._activeTag || 'All');
      }, 300);
    });
  }
}

window._activeTag = 'All';
window.filterByTag = function (tag) {
  window._activeTag = tag;
  const query = document.getElementById('project-search')?.value || '';
  renderProjectsList(ALL_PROJECTS_DATA, query, tag);
};

/* ============================================================
   8. GALLERY (Lazy Load Fade-in Added)
   ============================================================ */
async function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid || grid.dataset.loaded) return;

  if (ALL_PROJECTS_DATA.length === 0) {
    grid.innerHTML = '<p class="loading-text">Please visit Projects tab first...</p>';
    return;
  }

  const allImages = [];
  ALL_PROJECTS_DATA.forEach(proj => {
    proj.images.forEach(img => {
      allImages.push({ src: getRawUrl(img.fullPath), project: proj.folder, name: img.name });
    });
  });

  const filterSelect = document.getElementById('gallery-project-filter');
  if (filterSelect && filterSelect.options.length <= 1) {
    const uniqueProjects = [...new Set(allImages.map(i => i.project))];
    uniqueProjects.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      filterSelect.appendChild(opt);
    });
  }

  window._galleryImages = allImages;
  renderGallery(allImages);
  grid.dataset.loaded = 'true';
}

function renderGallery(images) {
  const grid = document.getElementById('gallery-grid');
  const countEl = document.getElementById('gallery-count');
  if (countEl) countEl.textContent = `${images.length} images`;

  if (images.length === 0) {
    grid.innerHTML = '<p class="loading-text">No images found. Add screenshots to project folders.</p>';
    return;
  }

  grid.innerHTML = images.map(img => `
    <div class="gallery-item" onclick="openLightbox('${img.src}', '${img.project}')">
      <img src="${img.src}" alt="${img.project} - ${img.name}" loading="lazy"
           onload="this.classList.add('img-loaded')"
           onerror="this.parentElement.style.display='none'">
      <div class="gallery-overlay">${img.project}</div>
    </div>`).join('');
}

window.filterGalleryImages = function () {
  const val = document.getElementById('gallery-project-filter')?.value;
  const images = window._galleryImages || [];
  renderGallery(val === 'all' ? images : images.filter(i => i.project === val));
};

/* ============================================================
   9. KAGGLE TAB (Cached)
   ============================================================ */
async function loadKaggleDatasets() {
  const container = document.getElementById('kaggle-datasets-container');
  if (!container) return;

  try {
    const datasets = await cachedFetch('kaggle_datasets', 'kaggle_datasets.json', {}, 60 * 60 * 1000);

    if (datasets.length === 0) {
      container.innerHTML = '<p class="no-content">No datasets added yet</p>';
      return;
    }

    container.innerHTML = datasets.map((ds, idx) => `
      <div class="kaggle-dataset-card">
        <button class="kaggle-card-header" onclick="toggleKaggleCard(this)">
          <div class="kaggle-header-left">
            <span class="kaggle-emoji">${ds.category.split(' ')[0]}</span>
            <span class="kaggle-header-title">${ds.category.split(' ').slice(1).join(' ')} | ${ds.name}</span>
          </div>
          <span class="kaggle-header-arrow">▶</span>
        </button>
        <div class="kaggle-card-body">
          <div class="kaggle-card-content">
            <p class="kaggle-desc">${ds.description}</p>
            <div class="kaggle-tags">
              ${ds.tags.map(t => `<span class="kaggle-badge">${t}</span>`).join('')}
            </div>
            <a href="${ds.link}" target="_blank" rel="noopener" class="btn-kaggle">
              <i class="fab fa-kaggle"></i> View on Kaggle
            </a>
          </div>
        </div>
      </div>`).join('');
  } catch (err) {
    container.innerHTML = '<p class="error-state">Could not load datasets</p>';
  }
}

function toggleKaggleCard(header) {
  const isOpen = header.classList.contains('open');
  const body = header.nextElementSibling;

  document.querySelectorAll('.kaggle-card-header.open').forEach(h => {
    if (h !== header) {
      h.classList.remove('open');
      h.nextElementSibling.style.maxHeight = null;
    }
  });

  header.classList.toggle('open', !isOpen);
  body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
}
/* ============================================================
   9.5. DATASET OVERVIEW (CASE STUDY) TAB — NAYA
   ============================================================ */
let ALL_CASE_STUDIES = [];

async function loadCaseStudies() {
  const container = document.getElementById('case-studies-container');
  const introEl = document.getElementById('case-study-intro');
  if (!container) return;

  // Ek baar load hone ke baad dubara fetch/render na ho
  if (container.dataset.loaded) return;

  try {
    const data = await cachedFetch('case_studies', 'case_studies.json', {}, 60 * 60 * 1000);
    if (introEl) introEl.textContent = data.intro || '';

    ALL_CASE_STUDIES = (data.datasets || []).map((ds, i) => ({
      ...ds,
      uid: ds.id || `cs-${i}`,
      loaded: false
    }));

    renderCaseStudiesList();
    container.dataset.loaded = 'true';
  } catch (err) {
    console.error('Case studies load failed:', err);
    container.innerHTML = `
      <div class="error-state">
        <h3>⚠️ Could not load case studies</h3>
        <p>${err.message}</p>
      </div>`;
  }
}

function buildCaseStudyHTML(ds) {
  const coverHTML = ds.cover_image
    ? `<div class="case-study-cover">
         <img src="${ds.cover_image}" alt="${escapeHtml(ds.name)} cover" loading="lazy"
              onload="this.classList.add('img-loaded')"
              onerror="this.parentElement.style.display='none'">
       </div>`
    : '';

  const tagsHTML = (ds.tags && ds.tags.length)
    ? `<div class="tech-tags" style="margin-bottom:18px;">${ds.tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  const problemHTML = ds.problem_statement
    ? `<p class="overview-text">${escapeHtml(ds.problem_statement).replace(/\n/g, '<br>')}</p>`
    : '<p class="no-content">No problem statement added</p>';

  let structureHTML = '<p class="no-content">No dataset structure added</p>';
  if (ds.dataset_structure && ds.dataset_structure.length) {
    const headers = ['Table / File', 'Rows', 'Description'];
    const rows = ds.dataset_structure.map(t => [t.table, t.rows, t.desc]);
    structureHTML = `<div class="table-scroll">${generateHTMLTable(headers, rows)}</div>`;
  }

  const codeHTML = ds.python_snippet
    ? `<pre class="code-snippet-block"><code>${escapeHtml(ds.python_snippet)}</code></pre>`
    : '<p class="no-content">No code snippet added</p>';

  const challengesHTML = (ds.challenges && ds.challenges.length)
    ? `<ul>${ds.challenges.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`
    : '<p class="no-content">No challenges listed</p>';

  const insightsHTML = (ds.insights && ds.insights.length)
    ? `<div class="key-insights-box"><ul>${ds.insights.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul></div>`
    : '<p class="no-content">No insights added</p>';

  const btnsHTML = `
    <div class="cs-btn-row">
      ${ds.kaggle_link ? `<a href="${ds.kaggle_link}" target="_blank" rel="noopener" class="btn-kaggle"><i class="fab fa-kaggle"></i> View on Kaggle</a>` : ''}
      ${ds.github_link ? `<a href="${ds.github_link}" target="_blank" rel="noopener" class="s-btn github"><i class="fab fa-github"></i> View on GitHub</a>` : ''}
    </div>`;

  return `
    ${coverHTML}
    ${tagsHTML}
    <div class="section-block">
      <h3>🎯 Problem Statement</h3>
      ${problemHTML}
    </div>
    <div class="section-block">
      <h3>📊 Dataset Structure</h3>
      ${structureHTML}
    </div>
    <div class="section-block">
      <h3>🐍 Python Code Snippet</h3>
      ${codeHTML}
    </div>
    <div class="section-block">
      <h3>⚠️ Challenges Faced</h3>
      ${challengesHTML}
    </div>
    <div class="section-block">
      <h3>💡 Business Insights</h3>
      ${insightsHTML}
    </div>
    <div class="section-block">
      ${btnsHTML}
    </div>`;
}

async function toggleCaseStudyAccordion(header, idx) {
  const isOpen = header.classList.contains('open');
  const content = header.nextElementSibling;

  document.querySelectorAll('#case-studies-container .accordion-header.open').forEach(h => {
    if (h !== header) {
      h.classList.remove('open');
      h.nextElementSibling.style.maxHeight = null;
    }
  });

  header.classList.toggle('open', !isOpen);

  if (!isOpen) {
    const ds = ALL_CASE_STUDIES[idx];
    if (!ds.loaded) {
      const body = content.querySelector('.accordion-body');
      body.innerHTML = buildCaseStudyHTML(ds);
      ds.loaded = true;
    }
    content.style.maxHeight = content.scrollHeight + 'px';
    setTimeout(() => {
      if (header.classList.contains('open')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    }, 300);
  } else {
    content.style.maxHeight = null;
  }
}

function buildCaseStudyHTML(ds) {
  const coverHTML = ds.cover_image
    ? `<div class="case-study-cover">
         <img src="${ds.cover_image}" alt="${escapeHtml(ds.title)} cover" loading="lazy"
              onload="this.classList.add('img-loaded')"
              onerror="this.parentElement.style.display='none'">
       </div>`
    : '';

  const problemHTML = ds.problem_statement
    ? `<p class="overview-text">${escapeHtml(ds.problem_statement).replace(/\n/g, '<br>')}</p>`
    : '<p class="no-content">No problem statement added</p>';

  let structureHTML = '<p class="no-content">No dataset structure added</p>';
  if (ds.dataset_structure) {
    const { rows, columns, tables } = ds.dataset_structure;
    const shapeLine = (rows || columns)
      ? `<p class="shape-info">Shape: <code>${(rows || 0).toLocaleString()} rows × ${columns || 0} columns</code></p>`
      : '';
    const tablesHTML = (tables || []).map(t => `
      <h4 style="margin-top:15px;">${escapeHtml(t.table_name || 'Sample Data')}</h4>
      <div class="table-scroll">${generateHTMLTable(t.headers, t.rows)}</div>
    `).join('');
    structureHTML = shapeLine + tablesHTML;
  }

  const codeHTML = ds.python_code
    ? `<pre class="code-snippet-block"><code>${escapeHtml(ds.python_code)}</code></pre>`
    : '<p class="no-content">No code snippet added</p>';

  const challengesHTML = (ds.challenges && ds.challenges.length)
    ? `<ul>${ds.challenges.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`
    : '<p class="no-content">No challenges listed</p>';

  const insightsHTML = (ds.business_insights && ds.business_insights.length)
    ? `<div class="key-insights-box"><ul>${ds.business_insights.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul></div>`
    : '<p class="no-content">No insights added</p>';

  const btnsHTML = `
    <div class="cs-btn-row">
      ${ds.kaggle_link ? `<a href="${ds.kaggle_link}" target="_blank" rel="noopener" class="btn-kaggle"><i class="fab fa-kaggle"></i> View on Kaggle</a>` : ''}
      ${ds.github_link ? `<a href="${ds.github_link}" target="_blank" rel="noopener" class="s-btn github"><i class="fab fa-github"></i> View on GitHub</a>` : ''}
    </div>`;

  return `
    ${coverHTML}
    <div class="section-block">
      <h3>🎯 Problem Statement</h3>
      ${problemHTML}
    </div>
    <div class="section-block">
      <h3>📊 Dataset Structure</h3>
      ${structureHTML}
    </div>
    <div class="section-block">
      <h3>🐍 Python Code Snippet</h3>
      ${codeHTML}
    </div>
    <div class="section-block">
      <h3>⚠️ Challenges Faced</h3>
      ${challengesHTML}
    </div>
    <div class="section-block">
      <h3>💡 Business Insights</h3>
      ${insightsHTML}
    </div>
    <div class="section-block">
      ${btnsHTML}
    </div>`;
}

/* ============================================================
   10. LIGHTBOX
   ============================================================ */
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ============================================================
   11. TAB NAVIGATION (+ Keyboard Accessibility)
   ============================================================ */
function openTab(evt, tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-item').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });

  document.getElementById(tabId).classList.add('active');
  evt.currentTarget.classList.add('active');
  evt.currentTarget.setAttribute('aria-selected', 'true');

  history.replaceState(null, null, `#${tabId}`);

    if (tabId === 'tab-gallery') initGallery();
  if (tabId === 'tab-casestudy') loadCaseStudies();
  setTimeout(initReveal, 100);
}

// Naya — keyboard se tabs use karne ke liye
function handleTabKeydown(e, el) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    el.click();
  }
}

window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#', '');
  const validTabs = ['tab-home','tab-projects','tab-gallery','tab-kaggle','tab-casestudy','tab-tool','tab-resume','tab-contact'];
  if (hash && validTabs.includes(hash)) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    document.getElementById(hash).classList.add('active');
    document.querySelectorAll('.tab-item').forEach(item => {
      if (item.getAttribute('onclick')?.includes(hash)) item.classList.add('active');
    });
  }
});

/* ============================================================
   12. CONTACT FORM (Web3Forms — SIRF EK HANDLER, FIXED)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = form.querySelector('.form-submit-btn');
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const statusEl = document.getElementById('form-status');

    if (!name || !email || !message) {
      statusEl.innerHTML = `<div class="form-msg-error">⚠️ Please fill all required fields</div>`;
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      statusEl.innerHTML = `<div class="form-msg-error">⚠️ Enter a valid email</div>`;
      return;
    }

    btn.disabled = true;
    btn.textContent = '📤 Sending...';
    statusEl.innerHTML = '';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (result.success) {
        statusEl.innerHTML = `<div class="form-msg-success">✅ Message sent! I'll reply within 24 hours.</div>`;
        form.reset();
      } else {
        statusEl.innerHTML = `<div class="form-msg-error">❌ ${result.message || 'Something went wrong'}</div>`;
      }
    } catch (err) {
      statusEl.innerHTML = `<div class="form-msg-error">❌ Failed. Email directly: jatin@jatinanalytics.co.in</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = '📤 Send Message';
    }
  });
}

/* ============================================================
   13. VISITOR COUNTER
   ============================================================ */
async function loadVisitorCount() {
  const el = document.getElementById('visitor-count');
  if (!el) return;
  try {
    const res = await fetch('https://api.countapi.xyz/hit/jatinanalytics.co.in/visits');
    const data = await res.json();
    el.textContent = data.value?.toLocaleString() || '1,000+';
  } catch {
    el.textContent = '1,000+';
  }
}

/* ============================================================
   14. DARK MODE TOGGLE (Naya)
   ============================================================ */
function toggleDarkMode() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const btn = document.getElementById('dark-mode-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

/* ============================================================
   15. TYPING ANIMATION (Naya)
   ============================================================ */
function initTypingAnimation() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = ['Data Analyst', 'Problem Solver', 'Insight Generator', 'Power BI Developer', 'Turning Data into Insights'];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
}

/* ============================================================
   16. ANIMATED COUNTERS (Naya)
   ============================================================ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10) || 0;
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

function initCounters() {
  document.querySelectorAll('.counter:not([data-counter-bound])').forEach(el => {
    el.setAttribute('data-counter-bound', 'true');
    counterObserver.observe(el);
  });
}

/* ============================================================
   17. SCROLL PROGRESS BAR (Naya)
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  });
}

/* ============================================================
   18. SCROLL REVEAL ANIMATIONS
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function initReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));
}

/* ============================================================
   19. CACHE CLEAR + SECRET SHORTCUT
   ============================================================ */
window.clearCacheManually = function () {
  const btn = document.getElementById('cache-clear-btn');
  btn.textContent = '⏳ Clearing...';
  btn.classList.add('clearing');
  btn.disabled = true;

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('cache_') || key.startsWith('gh_tree_cache')) {
      localStorage.removeItem(key);
    }
  });
  sessionStorage.clear();

  setTimeout(() => {
    btn.textContent = '✅ Done! Reloading...';
    setTimeout(() => window.location.reload(), 800);
  }, 500);
};

/* ============================================================
   20. AI CHATBOT — ADVANCED (Best-match + Memory + Follow-ups)
   ============================================================ */
const CHATBOT_KNOWLEDGE = {
  greetings: ['hi', 'hello', 'hey', 'namaste', 'hii'],

  answers: {
    projects: {
      keywords: ['project', 'built', 'made', 'work', 'portfolio', 'kaam'],
      response: `📊 <b>Jatin has built 4+ projects:</b><br><br>
        🏦 <b>Bank Analytics</b> - Banking intelligence dashboard with fraud detection using Power BI & SQL<br><br>
        🛒 <b>Ecommerce Sales Analysis</b> - Sales trends and customer behavior analysis<br><br>
        👥 <b>HR Analytics</b> - Employee performance and attrition analysis<br><br>
        🍕 <b>Zomato Analytics</b> - Food delivery data analysis and insights<br><br>
        Click the <b>Projects tab</b> to explore each one in detail!`,
      followUps: [
        { label: '🏦 Bank Project', query: 'Tell me about Bank Analytics project' },
        { label: '🛠️ Skills', query: 'What are Jatin skills?' },
        { label: '📬 Contact', query: 'How to contact Jatin?' }
      ]
    },
    skills: {
      keywords: ['skill', 'know', 'technology', 'tech', 'expertise', 'languages'],
      response: `🛠️ <b>Jatin's Technical Skills:</b><br><br>
        🐍 <b>Python</b> - Pandas, NumPy, Matplotlib, Seaborn, Plotly<br>
        🗄️ <b>SQL</b> - MySQL, Data Querying, Joins<br>
        📊 <b>Power BI</b> - DAX, Data Modeling, Interactive Dashboards<br>
        📋 <b>Excel</b> - Advanced formulas, Pivot Tables<br>
        🤖 <b>Machine Learning</b> - Basics, Fraud Detection<br>
        ☁️ <b>Tools</b> - GitHub, Streamlit, Vercel`,
      followUps: [
        { label: '⚙️ Tools', query: 'What tools does Jatin use?' },
        { label: '🎓 Education', query: 'Tell me about Jatin education' },
        { label: '📊 Projects', query: 'What projects has Jatin built?' }
      ]
    },
    contact: {
      keywords: ['contact', 'reach', 'email', 'connect', 'hire', 'touch'],
      response: `📬 <b>Contact Jatin:</b><br><br>
        📧 <b>Email:</b> jatin@jatinanalytics.co.in<br>
        💼 <b>LinkedIn:</b> linkedin.com/in/jatin-kumar-5a46a720a<br>
        🐙 <b>GitHub:</b> github.com/jating1416-debug<br>
        🏆 <b>Kaggle:</b> kaggle.com/jatinkhandelwal112<br><br>
        Or use the <b>Contact tab</b> to send a direct message!`,
      followUps: [
        { label: '💼 Availability', query: 'Is Jatin available for work?' },
        { label: '📊 Projects', query: 'What projects has Jatin built?' }
      ]
    },
    bank: {
      keywords: ['bank', 'banking', 'financial', 'loan', 'transaction'],
      response: `🏦 <b>Bank Analytics Project:</b><br><br>
        Built an interactive <b>Digital Banking Intelligence Dashboard</b> using Power BI.<br><br>
        📌 <b>Key Features:</b><br>
        • 75K+ customers analyzed<br>
        • $3bn loan portfolio tracked<br>
        • Transaction fraud patterns detected<br>
        • City-wise customer distribution<br><br>
        🛠️ <b>Tools:</b> Power BI, DAX, SQL, Excel<br><br>
        Open the Projects tab to see the live dashboard!`,
      followUps: [
        { label: '📊 All Projects', query: 'What projects has Jatin built?' },
        { label: '⚙️ Tools Used', query: 'What tools does Jatin use?' }
      ]
    },
    tools: {
      keywords: ['tool', 'software', 'use', 'powerbi', 'python', 'sql'],
      response: `⚙️ <b>Tools Jatin Uses:</b><br><br>
        📊 Power BI + DAX<br>
        🐍 Python (Pandas, NumPy, Plotly)<br>
        🗄️ MySQL<br>
        📋 Excel (Advanced)<br>
        📓 Jupyter Notebook<br>
        🐙 GitHub<br>
        🌐 Streamlit + Vercel<br><br>
        Total: <b>6+ tools mastered</b> with 500+ hours of practice!`,
      followUps: [
        { label: '🛠️ Skills', query: 'What are Jatin skills?' },
        { label: '📊 Projects', query: 'What projects has Jatin built?' }
      ]
    },
    availability: {
      keywords: ['available', 'job', 'hire', 'work', 'opportunity', 'fresher', 'open'],
      response: `💼 <b>Availability:</b><br><br>
        ✅ <b>Currently Open to Opportunities!</b><br><br>
        🎯 Looking for:<br>
        • Data Analyst roles<br>
        • Business Intelligence Analyst<br>
        • Power BI Developer<br><br>
        📍 Open to: Full-time, Internship, Remote/WFH<br>
        ⏰ Response time: Within 24 hours<br><br>
        📧 Reach out: jatin@jatinanalytics.co.in`,
      followUps: [
        { label: '📬 Contact', query: 'How to contact Jatin?' },
        { label: '🎓 Education', query: 'Tell me about Jatin education' }
      ]
    },
    education: {
      keywords: ['education', 'degree', 'study', 'college', 'university', 'mba', 'bca'],
      response: `🎓 <b>Jatin's Education:</b><br><br>
        📚 <b>MBA</b> - Operation Management<br>
        Vivekananda Global University (Pursuing)<br><br>
        💻 <b>BCA</b> - Bachelor of Computer Application<br>
        Sikkim Alpine University (2022-2025)<br><br>
        💊 <b>D.Pharm</b> - Diploma in Pharmacy<br>
        Apeejay Stya University (2020-2022)<br><br>
        Self-taught in Data Analytics through 500+ hours of practical projects!`,
      followUps: [
        { label: '🛠️ Skills', query: 'What are Jatin skills?' },
        { label: '📊 Projects', query: 'What projects has Jatin built?' }
      ]
    },
    kaggle: {
      keywords: ['kaggle', 'dataset', 'data', 'published'],
      response: `🏆 <b>Kaggle Contributions:</b><br><br>
        📦 <b>Indian Financial Fraud Dataset</b><br>
        Comprehensive dataset with 50,000+ fraud cases from Indian banking sector.<br><br>
        🏷️ Tags: Finance, Fraud Detection, Python, ML<br><br>
        Visit the <b>Kaggle tab</b> for direct links, or go to:<br>
        kaggle.com/jatinkhandelwal112`,
      followUps: [
        { label: '📊 Projects', query: 'What projects has Jatin built?' },
        { label: '⚙️ Tools', query: 'What tools does Jatin use?' }
      ]
    }
  },

  fallback: `🤔 I didn't quite understand that. Here's what I can help with:<br><br>
    • 📊 <b>Projects</b> - Ask about any specific project<br>
    • 🛠️ <b>Skills</b> - Python, SQL, Power BI expertise<br>
    • 📬 <b>Contact</b> - How to reach Jatin<br>
    • 🎓 <b>Education</b> - Academic background<br>
    • 💼 <b>Availability</b> - Job opportunities<br>
    • 🏆 <b>Kaggle</b> - Published datasets<br><br>
    Try asking: "<i>What projects has Jatin built?</i>"`
};

function generateChatResponse(text) {
  if (CHATBOT_KNOWLEDGE.greetings.some(g => text.includes(g))) {
    return {
      html: `👋 Hello! Great to meet you!<br><br>I'm Jatin's Portfolio AI. I can tell you about his <b>projects, skills, experience, and how to contact him</b>.<br><br>What would you like to know?`,
      followUps: [
        { label: '📊 Projects', query: 'What projects has Jatin built?' },
        { label: '🛠️ Skills', query: 'What are Jatin skills?' },
        { label: '📬 Contact', query: 'How to contact Jatin?' }
      ]
    };
  }

  // Best-match scoring (naya — ab sabse relevant answer milega)
  let bestKey = null, bestScore = 0;
  for (const [key, data] of Object.entries(CHATBOT_KNOWLEDGE.answers)) {
    const score = data.keywords.filter(kw => text.includes(kw)).length;
    if (score > bestScore) { bestScore = score; bestKey = key; }
  }

  if (bestKey) {
    const match = CHATBOT_KNOWLEDGE.answers[bestKey];
    return { html: match.response, followUps: match.followUps || [] };
  }

  return {
    html: CHATBOT_KNOWLEDGE.fallback,
    followUps: [
      { label: '📊 Projects', query: 'What projects has Jatin built?' },
      { label: '🛠️ Skills', query: 'What are Jatin skills?' },
      { label: '🎓 Education', query: 'Tell me about Jatin education' }
    ]
  };
}

function saveChatHistory() {
  const messages = document.getElementById('chatbot-messages');
  if (messages) localStorage.setItem('chatbot_history', messages.innerHTML);
}

function loadChatHistory() {
  const saved = localStorage.getItem('chatbot_history');
  const messages = document.getElementById('chatbot-messages');
  if (saved && messages) messages.innerHTML = saved;
}

let chatHistoryLoaded = false;

window.toggleChatbot = function () {
  const box = document.getElementById('chatbot-box');
  box.classList.toggle('chatbot-hidden');

  if (!box.classList.contains('chatbot-hidden')) {
    if (!chatHistoryLoaded) {
      loadChatHistory();
      chatHistoryLoaded = true;
    }
    localStorage.setItem('chatbot_opened_once', 'true');
    const notify = document.getElementById('chatbot-notify');
    if (notify) notify.style.display = 'none';
    document.getElementById('chatbot-input')?.focus();
  }
};

window.askQuestion = function (question) {
  document.getElementById('chatbot-input').value = question;
  sendChatMessage();
};

window.sendChatMessage = function () {
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const text = input.value.trim();
  if (!text) return;

  const userDiv = document.createElement('div');
  userDiv.className = 'user-msg';
  userDiv.textContent = text;
  messages.appendChild(userDiv);
  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const result = generateChatResponse(text.toLowerCase());

    const botDiv = document.createElement('div');
    botDiv.className = 'bot-msg';
    botDiv.innerHTML = result.html;
    messages.appendChild(botDiv);

    if (result.followUps && result.followUps.length) {
      const followDiv = document.createElement('div');
      followDiv.className = 'followup-questions';
      followDiv.innerHTML = result.followUps.map(f =>
        `<button onclick="askQuestion('${f.query.replace(/'/g, "\\'")}')">${f.label}</button>`
      ).join('');
      messages.appendChild(followDiv);
    }

    messages.scrollTop = messages.scrollHeight;
    saveChatHistory();
  }, 900);

  saveChatHistory();
};

/* ============================================================
   21. MASTER INIT — SIRF EK DOMContentLoaded (Duplicates hataye)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // Page Loader hide
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 400);
    }, 1300);
  }

  // Dark mode icon set (page load pe already saved theme dikhana)
  const savedTheme = localStorage.getItem('theme') || 'light';
  const darkBtn = document.getElementById('dark-mode-toggle');
  if (darkBtn) darkBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  // Core data loads
  loadProjects();
  loadKaggleDatasets();
  initProjectFilters();
  initContactForm();
  loadVisitorCount();

  // New features
  initTypingAnimation();
  initScrollProgress();
  initCounters();
  initReveal();

  // Chatbot notify dot (8 sec baad, agar kabhi khola nahi)
  setTimeout(() => {
    if (!localStorage.getItem('chatbot_opened_once')) {
      const notify = document.getElementById('chatbot-notify');
      if (notify) notify.style.display = 'block';
    }
  }, 8000);

  // Secret Developer Shortcut: Ctrl + Shift + R
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_') || key.startsWith('gh_tree_cache')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
      console.log('🔄 Cache cleared! Reloading...');
      window.location.reload();
    }
  });
});