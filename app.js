// Star Background Engine
function createStars() {
    const container = document.getElementById('global-stars');
    if (!container) return;
    
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.5 + 0.2;
        
        // Animation
        star.animate([
            { opacity: star.style.opacity },
            { opacity: 1 },
            { opacity: star.style.opacity }
        ], {
            duration: Math.random() * 3000 + 2000,
            iterations: Infinity
        });
        
        container.appendChild(star);
    }
}

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
                <div class="flex justify-between items-start mb-12">
                    <div>
                        <span class="status-badge ${project.statusClass} mb-3 inline-block">${project.status}</span>
                        <h2 class="text-3xl text-${project.color}">${project.name}</h2>
                    </div>
                    <span class="mono text-[10px] text-zinc-600">${project.version}</span>
                </div>
                <p class="text-zinc-400 mb-8">${project.description}</p>
                <div class="flex gap-4">
                    ${project.tags.map(tag => `<span class="mono text-[10px] text-zinc-500">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load projects:', err);
    }
}

// Initialize
window.onload = () => {
    createStars();
    loadProjects();
    
    // Check hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        // Delay navigation slightly to ensure views are ready
        setTimeout(() => navigate(hash), 100);
    }
};

// Scroll Parallax for stars
window.addEventListener('scroll', () => {
    const stars = document.getElementById('global-stars');
    if (stars) {
        const scrolled = window.pageYOffset;
        stars.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});
