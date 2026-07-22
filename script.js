// Function to handle Horizontal Streamlit-style Tabs
function openTab(evt, tabId) {
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    let tabItems = document.getElementsByClassName("tab-item");
    for (let i = 0; i < tabItems.length; i++) {
        tabItems[i].classList.remove("active");
    }

    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Fetch and load projects dynamically from projects.json
document.addEventListener("DOMContentLoaded", function () {
    fetch('projects.json')
        .then(res => res.json())
        .then(projects => {
            const projectsContainer = document.getElementById('projects-container');
            const galleryGrid = document.getElementById('gallery-grid');
            
            projects.forEach((proj, idx) => {
                // Render Project Showcase
                const projBox = document.createElement('div');
                projBox.className = 'metrics-card';
                projBox.style.marginBottom = '20px';
                projBox.innerHTML = `
                    <h3>📌 Project ${idx + 1}: ${proj.title}</h3>
                    <p><b>Business Overview:</b> ${proj.overview}</p>
                    <p><b>Tech Used:</b> ${proj.tech.map(t => `<span class="badge">${t}</span>`).join('')}</p>
                    <div>
                        ${proj.csv_data ? `<a href="${proj.csv_data}" download class="s-btn download-btn" style="display:inline-block;">💾 Download CSV/Excel</a>` : ''}
                        ${proj.powerbi_link ? `<a href="${proj.powerbi_link}" target="_blank" class="s-btn linkedin" style="display:inline-block; background:#f59e0b;">👁️ View Power BI Report (View Only)</a>` : ''}
                    </div>
                `;
                projectsContainer.appendChild(projBox);

                // Render Visualizations into 3-Column Gallery
                proj.images.forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    galleryGrid.appendChild(img);
                });
            });
        })
        .catch(err => console.log('Projects loading error:', err));
});