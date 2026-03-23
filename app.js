// Router / Navigation Logic
function navigate(pageId) {
    const views = document.querySelectorAll('.page-view');
    const btns = document.querySelectorAll('.nav-btn');
    
    views.forEach(v => v.classList.remove('active'));
    btns.forEach(b => b.classList.remove('active'));

    const targetView = document.getElementById(`view-${pageId}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    const activeBtn = document.querySelector(`.nav-btn[data-id="${pageId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = pageId;
}

// NIXIE TUBE ENGINE
function createNixie(containerId, value) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    const strValue = String(value);
    
    for (let char of strValue) {
        const tube = document.createElement('div');
        tube.className = 'nixie-tube';
        
        const span = document.createElement('span');
        span.className = 'nixie-char';
        span.innerText = char === '.' ? '·' : char;
        
        const mesh = document.createElement('div');
        mesh.className = 'nixie-mesh';
        
        tube.appendChild(span);
        tube.appendChild(mesh);
        container.appendChild(tube);
    }
}

function updateNixieClocks() {
    const now = new Date();
    // Stardate calculation
    const sd = (now.getFullYear() - 1900) * 1000 + (now.getMonth() * 80) + (now.getDate() * 2.5);
    const formatted = sd.toFixed(1);
    
    createNixie('nixie-stardate', formatted);
    createNixie('footer-stardate-nixie', formatted);
}

// Dynamic Project Loading
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();
        const grid = document.getElementById('project-grid');
        
        if (!grid) return;
        
        grid.innerHTML = data.projects.map((project, index) => {
            const serialSuffix = project.id.substring(0, 3).toUpperCase();
            const glowClass = project.color.includes('amber') ? 'bg-orange-500/80' : 
                             project.color.includes('cyan') ? 'bg-cyan-500/80' : 
                             project.color.includes('emerald') ? 'bg-green-500/80' : 'bg-zinc-500/80';
            
            const shadowClass = project.color.includes('amber') ? 'shadow-[0_0_15px_#ff4400]' : 
                               project.color.includes('cyan') ? 'shadow-[0_0_15px_#00f2ff]' : 
                               project.color.includes('emerald') ? 'shadow-[0_0_15px_#44ff44]' : 'shadow-none';

            return `
                <div class="wood-texture p-1 border-4 border-zinc-950 rounded-lg">
                    <div class="bg-[#0a0a0a] p-10 h-full relative">
                        <div class="screw tl" style="--screw-rot: ${Math.random()*360}deg"></div>
                        <div class="screw tr" style="--screw-rot: ${Math.random()*360}deg"></div>
                        <div class="screw bl" style="--screw-rot: ${Math.random()*360}deg"></div>
                        <div class="screw br" style="--screw-rot: ${Math.random()*360}deg"></div>
                        
                        <div class="flex justify-between items-start mb-10">
                            <div class="w-16 h-28 bg-[#050505] border-2 border-zinc-800 rounded-t-full relative">
                                <div class="absolute inset-x-2 top-4 bottom-2 bg-orange-600/10 blur-md animate-pulse"></div>
                                <div class="absolute inset-x-7 top-4 bottom-4 ${glowClass} rounded-full ${shadowClass}"></div>
                            </div>
                            <div class="text-right">
                                <span class="text-[12px] text-zinc-600 font-bold block uppercase tracking-widest">Serial: ${index + 1}0${index + 1}-${serialSuffix}</span>
                                <div class="w-5 h-5 rounded-full mt-4 shadow-[0_0_20px_rgba(0,255,0,0.3)]" style="background: ${project.color.includes('released') ? '#44ff44' : '#ff7700'}"></div>
                            </div>
                        </div>
                        <h4 class="text-4xl text-white font-black mb-6 tracking-tighter uppercase">${project.name}</h4>
                        <p class="text-zinc-500 mb-10 text-lg leading-relaxed">${project.description}</p>
                        
                        <div class="flex gap-4 mb-8">
                            ${project.tags.map(tag => `<span class="mono text-[10px] text-zinc-600 border border-zinc-800 px-2 py-1 uppercase">${tag}</span>`).join('')}
                        </div>

                        <div class="nixie-display justify-center cursor-pointer" onclick="${project.action}">
                            ${project.version.split('').slice(0, 3).map(char => `
                                <div class="nixie-tube"><span class="nixie-char">${char}</span><div class="nixie-mesh"></div></div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
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
        
        // Grid
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(68, 255, 68, 0.04)';
        ctx.lineWidth = 1;
        for(let i=0; i<width; i+=50) { ctx.moveTo(i,0); ctx.lineTo(i,height); }
        for(let i=0; i<height; i+=50) { ctx.moveTo(0,i); ctx.lineTo(width,i); }
        ctx.stroke();

        // Core Wave
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#44ff44';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#44ff44';

        for (let x = 0; x < width; x++) {
            const y = (height / 2) + 
                      Math.sin(x * 0.01 + offset) * 50 + 
                      Math.sin(x * 0.02 + offset * 1.3) * 20;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        offset += 0.07;
        requestAnimationFrame(drawWave);
    }
    drawWave();
}

// VU DYNAMICS
function animateVU() {
    const nl = document.getElementById('needle-l');
    const nr = document.getElementById('needle-r');
    if (!nl || !nr) return;
    
    const base = Math.sin(Date.now() * 0.005) * 8;
    nl.style.transform = `rotate(${base + 45 + Math.random() * 12 - 60}deg)`;
    nr.style.transform = `rotate(${base + 45 + Math.random() * 12 - 60}deg)`;
    setTimeout(animateVU, 110);
}

// Initialize
window.onload = () => {
    loadProjects();
    updateNixieClocks();
    setInterval(updateNixieClocks, 5000);
    initOscilloscope();
    animateVU();
    
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        setTimeout(() => navigate(hash), 100);
    }
};
