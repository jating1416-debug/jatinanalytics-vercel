/* ============================================================
   CONFIG — Ye values projects.json se automatically load hongi
   ============================================================ */
let CONFIG = {
  github_user: '',
  github_repo: '',
  github_branch: 'main',
  projects_base_path: 'projects',
  projects: []
};

let GITHUB_TREE_CACHE = null; // Pura repo file list yahan cache hoga

/* ============================================================
   1. GITHUB API — PURA REPO EK BAAR MEIN SCAN (Recursive)
   ============================================================ */
async function getGitHubTree() {
  // Session cache check (10 min tak reuse karo - rate limit bachane ke liye)
  const cached = sessionStorage.getItem('gh_tree_cache');
  const cachedTime = sessionStorage.getItem('gh_tree_cache_time');

  if (cached && cachedTime && (Date.now() - parseInt(cachedTime) < 10 * 60 * 1000)) {
    GITHUB_TREE_CACHE = JSON.parse(cached);
    return GITHUB_TREE_CACHE;
  }

  const url = `https://api.github.com/repos/${CONFIG.github_user}/${CONFIG.github_repo}/git/trees/${CONFIG.github_branch}?recursive=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();

    GITHUB_TREE_CACHE = data.tree || [];
    sessionStorage.setItem('gh_tree_cache', JSON.stringify(GITHUB_TREE_CACHE));
    sessionStorage.setItem('gh_tree_cache_time', Date.now().toString());

    return GITHUB_TREE_CACHE;
  } catch (err) {
    console.error('GitHub tree fetch failed:', err);
    return [];
  }
}

// Ek project folder ki SAARI files (subfolders included) nikalo
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
   3. CSV PARSING + STATS (using PapaParse)
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
    const values = dataRows
      .map(r => parseFloat(r[colIdx]))
      .filter(v => !isNaN(v));

    if (values.length > dataRows.length * 0.5) {
      numericCols.push({ name: h, values });
    }
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
   4. GITHUB LIVE STATS (Home Tab)
   ============================================================ */
async function loadGitHubStats() {
  const container = document.getElementById('github-stats-container');
  if (!container) return;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${CONFIG.github_user}`),
      fetch(`https://api.github.com/users/${CONFIG.github_user}/repos?per_page=100`)
    ]);

    if (!userRes.ok) throw new Error('API limit reached');

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const languages = [...new Set(repos.filter(r => r.language).map(r => r.language))];

    container.innerHTML = `
      <div class="github-stats-grid">
        <div class="gh-stat-card">
          <div class="gh-stat-icon">📦</div>
          <div class="gh-stat-number">${user.public_repos}</div>
          <div class="gh-stat-label">Public Repos</div>
        </div>
        <div class="gh-stat-card">
          <div class="gh-stat-icon">⭐</div>
          <div class="gh-stat-number">${totalStars}</div>
          <div class="gh-stat-label">Total Stars</div>
        </div>
        <div class="gh-stat-card">
          <div class="gh-stat-icon">👥</div>
          <div class="gh-stat-number">${user.followers}</div>
          <div class="gh-stat-label">Followers</div>
        </div>
        <div class="gh-stat-card">
          <div class="gh-stat-icon">📚</div>
          <div class="gh-stat-number">${languages.length}</div>
          <div class="gh-stat-label">Languages</div>
        </div>
      </div>
      <div class="gh-bottom">
        <span class="gh-languages">🔧 ${languages.join(', ')}</span>
        <a href="https://github.com/${CONFIG.github_user}" target="_blank" rel="noopener" class="gh-profile-link">
          View Full Profile →
        </a>
      </div>`;
  } catch (err) {
    container.innerHTML = `
      <div class="error-state">
        <p>⭐ 4+ Public Repos | 🐍 Python | 📊 SQL | 💡 Power BI</p>
        <a href="https://github.com/${CONFIG.github_user}" target="_blank" rel="noopener">View GitHub Profile →</a>
      </div>`;
  }
}

/* ============================================================
   5. PROJECTS — MAIN RENDER LOGIC
   ============================================================ */
let ALL_PROJECTS_DATA = [];

async function loadProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    // Step 1: Config load karo
    const configRes = await fetch('projects.json');
    const configData = await configRes.json();
    CONFIG = { ...CONFIG, ...configData };

    // Step 2: Pura GitHub repo tree ek baar fetch karo
    const tree = await getGitHubTree();

    // Step 3: Har project ke liye data build karo
    ALL_PROJECTS_DATA = [];

    for (const proj of CONFIG.projects) {
      const files = getFilesForFolder(tree, proj.folder);
      const categorized = categorizeFiles(files);
      ALL_PROJECTS_DATA.push({
        id: proj.folder.replace(/\s+/g, '-').toLowerCase(),
        folder: proj.folder,
        files,
        ...categorized,
        info: null,   // Lazy load hoga jab accordion open ho
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
        <span class="proj-title">${proj.folder}</span>
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

  // Close other open accordions
  document.querySelectorAll('.accordion-header.open').forEach(h => {
    if (h !== header) {
      h.classList.remove('open');
      h.nextElementSibling.style.maxHeight = null;
    }
  });

  header.classList.toggle('open', !isOpen);

  if (!isOpen) {
    const proj = ALL_PROJECTS_DATA[idx];

    // Pehli baar open ho raha hai to data load karo
    if (!proj.loaded) {
      await loadProjectDetails(proj, content);
      proj.loaded = true;
    }

    content.style.maxHeight = content.scrollHeight + 'px';

    // Thoda delay dekar recalculate karo (images load hone ke baad height badalti hai)
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

  // ---- Overview load karo (project_info.json ya README.md) ----
  let overview = '', objectives = [], keyInsights = [], tech = [], tags = [], powerbiEmbed = '';

  if (proj.infoFile) {
    try {
      const res = await fetch(getRawUrl(proj.infoFile.fullPath));
      const info = await res.json();
      overview = info.overview || '';
      objectives = info.objectives || [];
      keyInsights = info.key_insights || [];
      tech = info.tech || [];
      tags = info.tags || [];
      powerbiEmbed = info.powerbi_embed_url || '';
      proj.tags = tags; // filter ke liye save karo
    } catch (e) { console.warn('project_info.json parse error', e); }
  } else if (proj.readmeFile) {
    try {
      const res = await fetch(getRawUrl(proj.readmeFile.fullPath));
      overview = await res.text();
    } catch (e) { console.warn('README fetch error', e); }
  }

  if (tech.length === 0) tech = proj.techUsed;

  // ---- CSV Files preview data load karo ----
  const csvPreviewData = [];
  for (const csvFile of proj.csvFiles) {
    const parsed = await fetchAndParseCSV(getRawUrl(csvFile.fullPath));
    if (parsed) {
      csvPreviewData.push({
        name: csvFile.name,
        headers: parsed.headers,
        preview: parsed.dataRows.slice(0, 10),
        totalRows: parsed.totalRows,
        totalCols: parsed.totalCols,
        stats: computeStats(parsed.headers, parsed.dataRows)
      });
    }
  }

  // ---- HTML Build ----
  body.innerHTML = buildProjectHTML(proj, {
    overview, objectives, keyInsights, tech, powerbiEmbed, csvPreviewData
  });
}

function buildProjectHTML(proj, data) {
  const { overview, objectives, keyInsights, tech, powerbiEmbed, csvPreviewData } = data;

  // Overview section
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

  // Tech badges
  const techHTML = tech.map(t => `<span class="badge">${t}</span>`).join('');

  // Files section (Python/SQL/Excel - downloadable)
  let filesHTML = '';
  Object.entries(proj.downloadFiles).forEach(([category, files]) => {
    if (files.length > 0) {
      filesHTML += files.map(f => `
        <a href="${getRawUrl(f.fullPath)}" download="${f.name}" class="file-card-btn" title="Download ${f.name}">
          📄 ${f.name}
        </a>`).join('');
    }
  });

  // PBIX Section — VIEW ONLY, NO DOWNLOAD
  let pbixHTML = '';
  if (proj.pbixFiles.length > 0) {
    if (powerbiEmbed) {
      pbixHTML = `
        <div class="section-block">
          <h3>📊 Power BI Dashboard (Live View)</h3>
          <div class="pbi-embed-wrapper">
            <iframe src="${powerbiEmbed}" title="Power BI Dashboard" allowFullScreen></iframe>
          </div>
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

  // Dataset preview tabs
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

  // Images grid
  const imagesHTML = proj.images.length > 0
    ? proj.images.map((img, i) => `
        <div class="dash-img-item" onclick="openLightbox('${getRawUrl(img.fullPath)}', '${proj.folder} - ${img.name}')">
          <img src="${getRawUrl(img.fullPath)}" 
               alt="${proj.folder} Dashboard Screenshot ${i + 1}" 
               loading="lazy"
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

  // Accordion height recalculate
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
   7. SEARCH + TAG FILTER
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
   8. GALLERY
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
   9. KAGGLE TAB
   ============================================================ */
async function loadKaggleDatasets() {
  const container = document.getElementById('kaggle-datasets-container');
  if (!container) return;

  try {
    const res = await fetch('kaggle_datasets.json');
    const datasets = await res.json();

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
   11. TAB NAVIGATION
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
}

// Direct URL hash support
window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#', '');
  const validTabs = ['tab-home','tab-projects','tab-gallery','tab-kaggle','tab-tool','tab-resume','tab-contact'];
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
   12. CONTACT FORM (EmailJS)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = form.querySelector('.form-submit-btn');
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
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

    try {
      // NOTE: Apni EmailJS keys yahan daalo (emailjs.com se free milengi)
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name: name, from_email: email, subject, message,
        to_email: 'jatin@jatinanalytics.co.in'
      });

      statusEl.innerHTML = `<div class="form-msg-success">✅ Message sent! I'll reply within 24 hours.</div>`;
      form.reset();
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
   14. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadGitHubStats();
  loadProjects();
  loadKaggleDatasets();
  initProjectFilters();
  initContactForm();
  loadVisitorCount();
});