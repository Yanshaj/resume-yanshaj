/**
 * YANSHAJ PORTFOLIO - CORE ENGINE
 * Inspired by yutaabe.com
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start Intro Loader
    initIntroLoader();

    // 2. Initialize Timezone Clock
    initClock();

    // 3. Initialize Client Router
    initRouter();

    // 4. Initialize Project Hover Thumbnails & Detail Modal
    initProjectHoverAndModal();

    // 5. Initialize Lightsout Signal Mode & Reaction Mini-game
    initLightsoutGame();

    // 6. Initialize Background Particle blueprint Grid Canvas
    initTechCanvas();

    // 7. Initialize About Copy button & Scroll Reveal triggers
    initAboutPolish();
});

/* ==========================================================================
   1. INTRO LOADER
   ========================================================================== */
function initIntroLoader() {
    const loaderText = document.getElementById('nyan-loader');
    const counterNum = document.getElementById('intro-counter__num');
    const counterWrap = document.getElementById('intro-counter');

    if (!counterNum) return;

    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 4) + 1;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
            
            // Fade out loader & Slide down counter
            setTimeout(() => {
                if (loaderText) loaderText.classList.add('hidden');
                if (counterWrap) counterWrap.classList.add('is-exiting');
                document.body.classList.add('is-loaded');
            }, 600);
        }
        
        // Pad count to 3 digits (e.g. 005, 042, 100)
        counterNum.textContent = String(count).padStart(3, '0');
    }, 30);
}

/* ==========================================================================
   2. TIMEZONE CLOCK
   ========================================================================== */
function initClock() {
    const timeEl = document.getElementById('live-time');
    if (!timeEl) return;

    function updateTime() {
        const now = new Date();
        
        // Yamunanagar Time (India Standard Time - UTC +5:30)
        // Since we are running in the user's local context or standard clock:
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        
        const formatter = new Intl.DateTimeFormat('en-US', options);
        timeEl.textContent = formatter.format(now);
    }

    updateTime();
    setInterval(updateTime, 1000);
}

/* ==========================================================================
   3. CLIENT ROUTER
   ========================================================================== */
function initRouter() {
    const links = document.querySelectorAll('[data-route]');
    const panels = document.querySelectorAll('.tab-panel');
    const routeIndicator = document.getElementById('route-indicator-top');

    function navigate(route) {
        if (!route) route = 'projects';
        
        // Update body data attribute
        document.body.setAttribute('data-page', route);

        // Sync header links active state
        links.forEach(link => {
            if (link.getAttribute('data-route') === route) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Toggle panel visibility with a smooth transition
        panels.forEach(panel => {
            panel.classList.remove('active');
            panel.classList.remove('reveal-active');
            if (panel.id === `panel-${route}`) {
                panel.classList.add('active');
                // Trigger reflow to restart entrance animations
                void panel.offsetWidth; 
                panel.classList.add('reveal-active');
            }
        });

        // Update top-right indicator text
        if (routeIndicator) {
            routeIndicator.textContent = route.toUpperCase();
        }

        // Close overlay if open
        const overlay = document.getElementById('project-detail-overlay');
        if (overlay) overlay.classList.add('hidden');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Trigger scroll reveals manually
        handleScrollReveal();
    }

    // Bind route link click events
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            window.location.hash = `#/${route}`;
        });
    });

    // Listen to hash changes for robust routing support
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(2); // Remove '#/'
        navigate(hash);
    });

    // Initial load route check
    const initialHash = window.location.hash.substring(2);
    navigate(initialHash || 'projects');
}

/* ==========================================================================
   4. HOVER THUMBNAILS & PROJECT DETAIL MODAL
   ========================================================================== */
const projectData = [
    {
        title: "Madimap",
        desc: "Designed and conceptualized Madimap, a digital connectivity platform aimed at bridging spatial barriers between specialized doctors and remote patients. Incorporates geospatial lookups, consult scheduling, and patient-matching algorithms to optimize healthcare coordination.",
        role: "Lead Designer / Architect",
        stack: "React, Node.js, Express, MongoDB, Google Maps API",
        type: "Concept & Prototyping",
        image: "img/projects/madimap.png"
    },
    {
        title: "Road Safety Platform",
        desc: "Built an end-to-end real-time road safety defect tracking platform that monitors physical damage like potholes and cracks. The system automatically coordinates text message alerts to municipal repair crews when severe damage is flagged. Developed a vehicle diagnostic simulator to mock telemetry streams along with a responsive citizen portal for reporting defects with GPS positioning.",
        role: "Full Stack Engineer",
        stack: "Vanilla JS, Socket.io, Leaflet.js, Twilio API, HTML5 Canvas",
        type: "IoT & Web Engineering",
        image: "img/projects/road_safety.png"
    },
    {
        title: "Eureka Pitch 2024",
        desc: "Secured 3rd position in the prestigious Eureka! Pitching Competition 2024. Researched and presented a comprehensive technical startup project that links civil telemetry networks with street repair infrastructure to reduce vehicle repair costs and response delays.",
        role: "Co-Founder / Presenter",
        stack: "Business Modeling, Infrastructure Analysis, Presentation Strategy",
        type: "Academic Startup Competition",
        image: "img/projects/pitch.png"
    },
    {
        title: "Travel Vlogs Channel",
        desc: "Launched and managed a YouTube travel vlog channel, directing all storytelling pipelines, post-production audio/video editing, and platform search optimization. Tracks equipment telemetry, drone footage coordination, and cinematic vlogging layouts.",
        role: "Video Director & Editor",
        stack: "Adobe Premiere Pro, Camera Telemetry, YouTube Analytics",
        type: "Content Creation / Video Production",
        image: "img/projects/travel.png"
    },
    {
        title: "MERN Developer Pack",
        desc: "Completed an immersive 4-week full-stack training regimen at TCIL IT. Engineered robust RESTful APIs, relational schema models, and secure session management. Delivered several responsive web projects testing scalability parameters.",
        role: "Graduate Trainee",
        stack: "MongoDB, Express.js, React, Node.js, GitHub",
        type: "Professional Certification Trainee",
        image: "img/projects/mern.png"
    }
];

function initProjectHoverAndModal() {
    const links = document.querySelectorAll('.project-link');
    const thumbnailWrap = document.querySelector('.p-thumbnail');
    const thumbItems = document.querySelectorAll('.p-thumbnail li');
    const menuWrap = document.querySelector('.p-menu-wrap');

    const overlay = document.getElementById('project-detail-overlay');
    const closeBtn = document.querySelector('.overlay-close-btn');

    if (!thumbnailWrap || links.length === 0) return;

    // --- Hover Follow-Cursor Logic ---
    let mouseX = 0, mouseY = 0;
    let thumbX = 0, thumbY = 0;
    const lerpFactor = 0.1; // Smooth movement interpolation

    menuWrap.addEventListener('mousemove', (e) => {
        // Calculate relative coordinates inside menu container
        const rect = menuWrap.getBoundingClientRect();
        mouseX = e.clientX - rect.left - (thumbnailWrap.offsetWidth / 2);
        mouseY = e.clientY - rect.top - (thumbnailWrap.offsetHeight / 2);
    });

    // Dynamic position updater loop
    function updateThumbnailPosition() {
        // Lerp position values
        thumbX += (mouseX - thumbX) * lerpFactor;
        thumbY += (mouseY - thumbY) * lerpFactor;
        
        thumbnailWrap.style.transform = `translate3d(${thumbX}px, ${thumbY}px, 0)`;
        requestAnimationFrame(updateThumbnailPosition);
    }
    updateThumbnailPosition();

    // Trigger hover visibility
    links.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            const index = link.getAttribute('data-index');
            
            // Clear other active thumbs
            thumbItems.forEach(item => item.classList.remove('active'));
            
            // Set active thumb item
            if (thumbItems[index]) {
                thumbItems[index].classList.add('active');
            }
            
            thumbnailWrap.classList.add('active');
        });

        link.addEventListener('mouseleave', () => {
            thumbnailWrap.classList.remove('active');
        });

        // Click handler to open Details Overlay Modal
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(link.getAttribute('data-index'), 10);
            openProjectDetails(index);
        });
    });

    // Detail Modal Actions
    function openProjectDetails(index) {
        const data = projectData[index];
        if (!data || !overlay) return;

        document.getElementById('overlay-proj-index').textContent = `0${index + 1} / FEATURED PROJECT`;
        document.getElementById('overlay-proj-title').textContent = data.title;
        document.getElementById('overlay-proj-desc').textContent = data.desc;
        document.getElementById('overlay-proj-role').textContent = data.role;
        document.getElementById('overlay-proj-stack').textContent = data.stack;
        document.getElementById('overlay-proj-type').textContent = data.type;
        document.getElementById('overlay-proj-img').src = data.image;

        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        });
        
        // Close on background overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }
}

/* ==========================================================================
   5. LIGHTSOUT SIGNAL MODE & REACTION SPEED GAME
   ========================================================================== */
let lightsoutActive = false;
let reactionState = 'idle'; // idle, waiting, flash, result
let reactionTimeout = null;
let startTime = 0;

function initLightsoutGame() {
    const switcher = document.getElementById('js-lights-btn');
    const hud = document.getElementById('reaction-hud');
    const exitBtn = document.getElementById('reaction-exit-btn');
    const promptText = document.getElementById('reaction-prompt');
    const timeText = document.getElementById('reaction-time');
    const labelText = document.getElementById('reaction-label');
    const triggerBtn = document.getElementById('btn-trigger-reaction');

    if (!switcher) return;

    // Trigger state changes
    function toggleLightsout(forceState) {
        lightsoutActive = typeof forceState === 'boolean' ? forceState : !lightsoutActive;
        
        if (lightsoutActive) {
            document.body.classList.add('is-lightsout');
            switcher.classList.add('is-active');
            hud.classList.remove('hidden');
            startReactionGame();
        } else {
            document.body.classList.remove('is-lightsout');
            switcher.classList.remove('is-active');
            hud.classList.add('hidden');
            resetReactionGame();
        }
    }

    // Switch click
    switcher.addEventListener('click', () => toggleLightsout());

    // Physical Shift key code binder
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
            e.preventDefault();
            // If already playing, register action
            if (lightsoutActive) {
                handleReactionTrigger();
            } else {
                toggleLightsout(true);
            }
        }
    });

    // Exit Game button
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            toggleLightsout(false);
        });
    }

    // Engage game from Playground page option card
    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            toggleLightsout(true);
        });
    }

    // Clicking the screen in game triggers action
    hud.addEventListener('mousedown', (e) => {
        if (e.target !== exitBtn && e.target !== reactionTimeout) {
            handleReactionTrigger();
        }
    });

    function startReactionGame() {
        reactionState = 'waiting';
        promptText.textContent = "PREPARE... WAIT FOR BLUE SIGNAL";
        timeText.textContent = "000";
        labelText.textContent = "STANDBY";
        hud.style.backgroundColor = "#000000";

        const delay = Math.random() * 3000 + 2000; // 2 to 5 seconds
        reactionTimeout = setTimeout(() => {
            reactionState = 'flash';
            hud.style.backgroundColor = "var(--col-blue)";
            promptText.textContent = "NOW! PRESS SHIFT / CLICK THE SCREEN!";
            startTime = performance.now();
        }, delay);
    }

    function handleReactionTrigger() {
        if (reactionState === 'waiting') {
            // Early hit fail
            clearTimeout(reactionTimeout);
            reactionState = 'result';
            hud.style.backgroundColor = "#cc2000";
            promptText.textContent = "TOO EARLY!";
            timeText.textContent = "FAIL";
            labelText.textContent = "RE-ENGAGE IN 3 SECONDS";
            
            setTimeout(startReactionGame, 3000);
        } else if (reactionState === 'flash') {
            // Success hit
            const endTime = performance.now();
            const elapsed = Math.round(endTime - startTime);
            reactionState = 'result';
            hud.style.backgroundColor = "#0f0f11";
            
            promptText.textContent = "TRANSMISSION COMPLETE";
            timeText.textContent = `${elapsed}ms`;
            
            let rating = "GODSPEED (EXTREME REFLEXES)!";
            if (elapsed > 180 && elapsed <= 280) rating = "FAST (GOOD REFLEXES)!";
            else if (elapsed > 280 && elapsed <= 400) rating = "AVERAGE (NORMAL REFLEX)";
            else if (elapsed > 400) rating = "SLUGGISH SIGNAL RESPONSE";
            labelText.textContent = rating;

            setTimeout(startReactionGame, 4000);
        }
    }

    function resetReactionGame() {
        clearTimeout(reactionTimeout);
        reactionState = 'idle';
    }
}

/* ==========================================================================
   6. BACKGROUND PARTICLES BLUEPRINT GRID CANVAS
   ========================================================================== */
let physicsDustActive = false;
let dustPoints = [];

function initTechCanvas() {
    const canvas = document.getElementById('tech-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    // Setup base lines and packets
    const nodeCount = 28;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 1.5 + 0.8
        });
    }

    // Physics Dust Array trigger
    const dustTriggerBtn = document.getElementById('btn-trigger-physics');
    if (dustTriggerBtn) {
        dustTriggerBtn.addEventListener('click', () => {
            physicsDustActive = true;
            dustPoints = [];
            // Spawn 150 explosion particles
            for (let i = 0; i < 120; i++) {
                dustPoints.push({
                    x: width / 2 + (Math.random() - 0.5) * 100,
                    y: height / 2 + (Math.random() - 0.5) * 100,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    life: 1.0,
                    decay: Math.random() * 0.02 + 0.015
                });
            }
            dustTriggerBtn.querySelector('.pg-card__action').textContent = "DUST ENGAGED";
            setTimeout(() => {
                dustTriggerBtn.querySelector('.pg-card__action').textContent = "ACTIVATE DUST";
            }, 2000);
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw blueprint grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
        ctx.lineWidth = 1;
        const gridSpacing = 80;
        for (let x = 0; x < width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw Nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Boundaries
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            ctx.fill();
        });

        // Draw connecting node links
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 180) {
                    const alpha = (1 - dist / 180) * 0.08;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw physics dust gravity particles on request
        if (physicsDustActive && dustPoints.length > 0) {
            dustPoints.forEach((dust, dIndex) => {
                dust.x += dust.vx;
                dust.y += dust.vy;
                dust.vy += 0.05; // Gravity pull
                dust.life -= dust.decay;

                if (dust.life <= 0) {
                    dustPoints.splice(dIndex, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(dust.x, dust.y, 2 * dust.life, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(48, 184, 255, ${dust.life * 0.8})`;
                    ctx.fill();
                }
            });
        }

        requestAnimationFrame(draw);
    }

    draw();
}

/* ==========================================================================
   7. ABOUT COPY BUTTON & SCROLL REVEAL TRIGGERS
   ========================================================================== */
function initAboutPolish() {
    // Copy email address to clipboard
    const copyBtn = document.querySelector('.js-footer-copy-btn');
    const toast = document.getElementById('copy-toast');

    if (copyBtn && toast) {
        copyBtn.addEventListener('click', () => {
            const email = copyBtn.getAttribute('data-clipboard');
            navigator.clipboard.writeText(email).then(() => {
                toast.classList.add('is-visible');
                setTimeout(() => {
                    toast.classList.remove('is-visible');
                }, 2000);
            });
        });
    }

    // Scroll listener to activate reveal effects
    window.addEventListener('scroll', handleScrollReveal);
}

function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-item');
    const triggerHeight = window.innerHeight * 0.88;

    reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerHeight) {
            el.classList.add('visible');
        }
    });
}
