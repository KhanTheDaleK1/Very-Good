// Router / Navigation Logic
function navigate(pageId) {
    const views = document.querySelectorAll('.page-view');
    const targetId = `view-${pageId}`;
    
    // Handle construction page content
    if (pageId === 'pedals' || pageId === 'omni') {
        const title = pageId === 'pedals' ? 'PHYSICAL HARDWARE' : 'OMNICHORD MODS';
        const desc = pageId === 'pedals' 
            ? 'Bespoke guitar effects and signal processors. Analog souls with digital precision. We are currently finalizing enclosure designs and PCB layouts.'
            : 'Expanding the sonic range of the OM-84 and OM-36. We are currently testing the MIDI expansion board and custom filter stacks.';
        
        document.getElementById('construction-title').innerText = title;
        document.getElementById('construction-desc').innerText = desc;
        
        // Route to the generic construction view
        views.forEach(v => v.classList.remove('active'));
        document.getElementById('view-under-construction').classList.add('active');
    } else {
        // Route to actual page
        views.forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById(targetId);
        if (targetView) targetView.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL hash (optional)
    window.location.hash = pageId;
}

// Dynamic Project Loading
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        const grid = document.getElementById('project-grid');
        
        if (!grid) return;
        
        grid.innerHTML = data.projects.map(project => `
            <div class="product-card cursor-pointer" onclick="${project.action}">
                <div class="screw screw-tl"></div>
                <div class="screw screw-tr"></div>
                <div class="screw screw-bl"></div>
                <div class="screw screw-br"></div>
                
                <div class="flex justify-between items-start mb-4">
                    <span class="status-badge ${project.statusClass}">${project.status}</span>
                    <span class="mono text-[10px] text-zinc-500 tracking-widest uppercase">${project.version}</span>
                </div>
                
                <h2 class="card-title" style="color: var(--${project.color.includes('cyan') ? 'phosphor-cyan' : project.color.includes('amber') ? 'amber-lamp' : 'aluminum'})">
                    ${project.name}
                </h2>
                
                <div class="card-readout">
                    <span class="mono">> STATUS: ONLINE</span><br>
                    <span class="mono">> ${project.description}</span>
                </div>
                
                <div class="flex gap-4">
                    ${project.tags.map(tag => `
                        <span class="mono text-[9px] border border-zinc-700 px-2 py-1 bg-black/50">
                            ${tag}
                        </span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load projects:', err);
    }
}

// Initialize
window.onload = () => {
    loadProjects();
    
    // Check hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        setTimeout(() => navigate(hash), 100);
    }
};

// Subtle Scanline Glitch Effect (Random)
setInterval(() => {
    const overlay = document.querySelector('.crt-overlay');
    if (overlay && Math.random() > 0.95) {
        overlay.style.opacity = '0.3';
        setTimeout(() => overlay.style.opacity = '0.15', 50);
    }
}, 100);
