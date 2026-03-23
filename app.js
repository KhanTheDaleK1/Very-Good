// Router / Navigation Logic
function navigate(pageId) {
    const views = document.querySelectorAll('.page-view');
    const btns = document.querySelectorAll('.nav-btn');
    
    views.forEach(v => v.classList.remove('active'));
    btns.forEach(b => b.classList.remove('active'));

    const targetView = document.getElementById(`view-${pageId}`);
    if (targetView) {
        targetView.classList.add('active');
    } else if (pageId === 'pedals' || pageId === 'omni') {
        // Fallback for hardware/mods if specific views aren't in CRT yet
        document.getElementById('view-echo').classList.add('active');
    }

    const activeBtn = document.querySelector(`.nav-btn[data-id="${pageId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Scroll to top display
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = pageId;
}

// Dynamic Project Loading
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        const grid = document.getElementById('project-grid');
        
        if (!grid) return;
        
        grid.innerHTML = data.projects.map((project, index) => `
            <div class="hifi-card group cursor-pointer" onclick="${project.action}">
                <span class="text-[10px] text-zinc-500 mb-2 block uppercase">Module 0${index + 1}: ${project.id.toUpperCase()}</span>
                <h4 class="text-2xl mb-4" style="color: var(--${project.color.includes('cyan') ? 'trek-cyan' : project.color.includes('amber') ? 'trek-orange' : project.color.includes('emerald') ? 'phosphor-green' : 'aluminum'})">
                    ${project.name}
                </h4>
                <p class="text-sm text-zinc-400 mb-6">${project.description}</p>
                <div class="bg-black p-3 font-mono text-[10px] border border-zinc-800" 
                     style="color: var(--${project.color.includes('cyan') ? 'trek-cyan' : project.color.includes('amber') ? 'trek-orange' : 'phosphor-green'})">
                    DATA_READOUT: ${project.version.toUpperCase()} // STATUS: ${project.status.toUpperCase()}
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load projects:', err);
    }
}

// Oscilloscope Waveform Animation
function initOscilloscope() {
    const canvas = document.getElementById('oscilloscope');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    let offset = 0;
    function drawWave() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw Main Wave
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#33FF33';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#33FF33';

        for (let x = 0; x < width; x++) {
            const y = (height / 2) + 
                      Math.sin(x * 0.02 + offset) * 30 + 
                      Math.sin(x * 0.05 + offset * 2) * 10;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Second Dim Wave
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(51, 255, 51, 0.3)';
        ctx.shadowBlur = 0;
        for (let x = 0; x < width; x++) {
            const y = (height / 2) + Math.cos(x * 0.015 + offset * 0.5) * 60;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        offset += 0.05;
        requestAnimationFrame(drawWave);
    }
    drawWave();
}

// VU Meter Simulation
function animateVU() {
    const nl = document.getElementById('needle-l');
    const nr = document.getElementById('needle-r');
    if (!nl || !nr) return;
    
    const randL = 20 + Math.random() * 40;
    const randR = 20 + Math.random() * 40;
    
    nl.style.transform = `translateX(${randL}px) rotate(${randL - 30}deg)`;
    nr.style.transform = `translateX(${randR}px) rotate(${randR - 30}deg)`;
    
    setTimeout(animateVU, 100 + Math.random() * 200);
}

// Stardate Generator
function updateStardate() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const day = Math.floor(diff / (1000 * 60 * 60 * 24));
    const sd = (now.getFullYear() - 1900) * 1000 + (day * 2.73);
    const formatted = sd.toFixed(1);
    
    const el1 = document.getElementById('stardate');
    const el2 = document.getElementById('stardate-footer');
    if (el1) el1.innerText = formatted;
    if (el2) el2.innerText = formatted;
}

// Initialize
window.onload = () => {
    loadProjects();
    initOscilloscope();
    animateVU();
    setInterval(updateStardate, 10000);
    updateStardate();
    
    // Check hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        setTimeout(() => navigate(hash), 100);
    }
};
