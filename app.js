/**
 * YANSHAJ PORTFOLIO - CORE ENGINE
 * Inspired by yutaabe.com
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start Intro Loader
    initIntroLoader();

    // 2. Initialize Timezone Clock
    initClock();

    // 3. Initialize Client Router (4 Tabs: about, skills, projects, contact)
    initRouter();

    // 4. Initialize Infinite Loop Scroll & Project Hover Modals
    initInfiniteProjectsScroll();

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
   3. CLIENT ROUTER (4 TAB CHANNELS)
   ========================================================================== */
function initRouter() {
    const links = document.querySelectorAll('[data-route]');
    const panels = document.querySelectorAll('.tab-panel');
    const routeIndicator = document.getElementById('route-indicator-top');

    function navigate(route) {
        // Fallback default is 'about' as first section
        if (!route) route = 'about';
        
        document.body.setAttribute('data-page', route);

        // Sync header links active state
        links.forEach(link => {
            if (link.getAttribute('data-route') === route) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Toggle panel visibility
        panels.forEach(panel => {
            panel.classList.remove('active');
            panel.classList.remove('reveal-active');
            if (panel.id === `panel-${route}`) {
                panel.classList.add('active');
                void panel.offsetWidth; 
                panel.classList.add('reveal-active');
            }
        });

        // Update indicator text
        if (routeIndicator) {
            routeIndicator.textContent = route.toUpperCase();
        }

        // Close project overlay if open
        const overlay = document.getElementById('project-detail-overlay');
        if (overlay) overlay.classList.add('hidden');

        window.scrollTo({ top: 0, behavior: 'instant' });
        handleScrollReveal();
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            window.location.hash = `#/${route}`;
        });
    });

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(2);
        navigate(hash);
    });

    // Initial load route check
    const initialHash = window.location.hash.substring(2);
    navigate(initialHash || 'about');
}

/* ==========================================================================
   4. INFINITE LOOP SCROLLING PROJECTS LIST & EVENT BINDINGS
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

function initInfiniteProjectsScroll() {
    const menu = document.getElementById('infinite-menu');
    const wrap = document.querySelector('.p-menu-wrap');
    const thumbnailWrap = document.getElementById('infinite-thumbs');
    const thumbItems = document.querySelectorAll('#infinite-thumbs li');

    if (!menu || !wrap || !thumbnailWrap) return;

    // 1. Clone Menu Items to create 3 sets for infinite wrapping
    const originalItems = Array.from(menu.children);
    menu.innerHTML = '';
    
    // Create three sets (total 15 elements: Set 0, Set 1, Set 2)
    for (let s = 0; s < 3; s++) {
        originalItems.forEach((item, index) => {
            const clone = item.cloneNode(true);
            clone.querySelector('.project-link').setAttribute('data-index', index);
            menu.appendChild(clone);
        });
    }

    // Bind hover and click events to all cloned links
    const newLinks = menu.querySelectorAll('.project-link');
    bindProjectEvents(newLinks, thumbnailWrap, thumbItems);

    // 2. Infinite Scroll Physics
    let targetY = 0;
    let currentY = 0;
    const lerpFactor = 0.08;
    
    let singleSetHeight = 0;
    let isDragging = false;
    let startTouchY = 0;
    let startTargetY = 0;

    function updateMetrics() {
        const childList = Array.from(menu.children);
        if (childList.length === 0) return;
        
        singleSetHeight = 0;
        // Height of one set of 5 items
        for (let i = 0; i < originalItems.length; i++) {
            singleSetHeight += childList[i].offsetHeight;
        }
    }

    // Set initial heights
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    
    // Position middle set initially
    targetY = -singleSetHeight;
    currentY = -singleSetHeight;

    // Capture Wheel scroll
    wrap.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetY -= e.deltaY * 0.7;
    }, { passive: false });

    // Touch support for mobile dragging
    wrap.addEventListener('touchstart', (e) => {
        isDragging = true;
        startTouchY = e.touches[0].clientY;
        startTargetY = targetY;
    });

    wrap.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const delta = e.touches[0].clientY - startTouchY;
        targetY = startTargetY + delta * 1.5;
    }, { passive: false });

    wrap.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Tick Animation Loop for translation and loop wrapping
    function scrollTick() {
        if (singleSetHeight === 0) {
            updateMetrics();
            requestAnimationFrame(scrollTick);
            return;
        }

        // Apply Lerp
        currentY += (targetY - currentY) * lerpFactor;

        // Loop wrapping bounds check
        // The middle set is active in the range [-2 * singleSetHeight, -1 * singleSetHeight]
        if (currentY > -singleSetHeight) {
            currentY -= singleSetHeight;
            targetY -= singleSetHeight;
        } else if (currentY < -2 * singleSetHeight) {
            currentY += singleSetHeight;
            targetY += singleSetHeight;
        }

        // Translate the list container
        menu.style.transform = `translate3d(0, ${currentY}px, 0)`;

        requestAnimationFrame(scrollTick);
    }
    scrollTick();

    // 3. Hover Floating Thumbnail Follow Cursor Logic
    let mouseX = 0, mouseY = 0;
    let thumbX = 0, thumbY = 0;

    wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        mouseX = e.clientX - rect.left - (thumbnailWrap.offsetWidth / 2);
        mouseY = e.clientY - rect.top - (thumbnailWrap.offsetHeight / 2);
    });

    function updateThumbnailTick() {
        thumbX += (mouseX - thumbX) * 0.1;
        thumbY += (mouseY - thumbY) * 0.1;
        
        thumbnailWrap.style.transform = `translate3d(${thumbX}px, ${thumbY}px, 0)`;
        requestAnimationFrame(updateThumbnailTick);
    }
    updateThumbnailTick();
}

function bindProjectEvents(links, thumbnailWrap, thumbItems) {
    const overlay = document.getElementById('project-detail-overlay');
    const closeBtn = document.querySelector('.overlay-close-btn');

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const index = parseInt(link.getAttribute('data-index'), 10);
            
            // Clear other active thumbs
            thumbItems.forEach(item => item.classList.remove('active'));
            
            // Activate target thumb visual
            if (thumbItems[index]) {
                thumbItems[index].classList.add('active');
            }
            thumbnailWrap.classList.add('active');
        });

        link.addEventListener('mouseleave', () => {
            thumbnailWrap.classList.remove('active');
        });

        // Click opens detailed overlay
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(link.getAttribute('data-index'), 10);
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
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        });
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
let reactionState = 'idle';
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

    switcher.addEventListener('click', () => toggleLightsout());

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
            e.preventDefault();
            if (lightsoutActive) {
                handleReactionTrigger();
            } else {
                toggleLightsout(true);
            }
        }
    });

    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            toggleLightsout(false);
        });
    }

    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            toggleLightsout(true);
        });
    }

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

        const delay = Math.random() * 3000 + 2000;
        reactionTimeout = setTimeout(() => {
            reactionState = 'flash';
            hud.style.backgroundColor = "var(--col-blue)";
            promptText.textContent = "NOW! PRESS SHIFT / CLICK THE SCREEN!";
            startTime = performance.now();
        }, delay);
    }

    function handleReactionTrigger() {
        if (reactionState === 'waiting') {
            clearTimeout(reactionTimeout);
            reactionState = 'result';
            hud.style.backgroundColor = "#cc2000";
            promptText.textContent = "TOO EARLY!";
            timeText.textContent = "FAIL";
            labelText.textContent = "RE-ENGAGE IN 3 SECONDS";
            setTimeout(startReactionGame, 3000);
        } else if (reactionState === 'flash') {
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

    // 3D vertices of a stylized geometric Iron Man helmet centered at (0, 0, 0)
    const ironManVertices = [
        { x: 0,   y: 45,  z: 40 },  // 0: Brow Center
        { x: -35, y: 45,  z: 35 },  // 1: Brow Left
        { x: 35,  y: 45,  z: 35 },  // 2: Brow Right
        { x: 0,   y: 100, z: 0 },   // 3: Forehead Top Center
        { x: -60, y: 85,  z: -20 }, // 4: Forehead Top Left
        { x: 60,  y: 85,  z: -20 }, // 5: Forehead Top Right
        { x: -35, y: 28,  z: 38 },  // 6: Left Eye Top Inner
        { x: -65, y: 30,  z: 32 },  // 7: Left Eye Top Outer
        { x: -62, y: 22,  z: 32 },  // 8: Left Eye Bottom Outer
        { x: -35, y: 20,  z: 38 },  // 9: Left Eye Bottom Inner
        { x: 35,  y: 28,  z: 38 },  // 10: Right Eye Top Inner
        { x: 65,  y: 30,  z: 32 },  // 11: Right Eye Top Outer
        { x: 62,  y: 22,  z: 32 },  // 12: Right Eye Bottom Outer
        { x: 35,  y: 20,  z: 38 },  // 13: Right Eye Bottom Inner
        { x: 0,   y: 5,   z: 45 },  // 14: Nose bridge / Faceplate mid
        { x: -40, y: -15, z: 35 },  // 15: Left Cheek Inner Corner
        { x: 40,  y: -15, z: 35 },  // 16: Right Cheek Inner Corner
        { x: -30, y: -42, z: 32 },  // 17: Mouth Left
        { x: 30,  y: -42, z: 32 },  // 18: Mouth Right
        { x: 0,   y: -55, z: 35 },  // 19: Mouth / Chin Top Center
        { x: -25, y: -95, z: 20 },  // 20: Chin Bottom Left
        { x: 25,  y: -95, z: 20 },  // 21: Chin Bottom Right
        { x: -80, y: -35, z: -15 }, // 22: Jaw Left Outer
        { x: 80,  y: -35, z: -15 }, // 23: Jaw Right Outer
        { x: -85, y: 15,  z: -10 }, // 24: Cheekbone Left Outer
        { x: 85,  y: 15,  z: -10 }, // 25: Cheekbone Right Outer
        { x: -90, y: 25,  z: -35 }, // 26: Ear Left Center
        { x: 90,  y: 25,  z: -35 }  // 27: Ear Right Center
    ];

    // Edges connecting the vertices
    const ironManEdges = [
        // Left Eye Slit Loop
        { a: 6, b: 7 }, { a: 7, b: 8 }, { a: 8, b: 9 }, { a: 9, b: 6 },
        
        // Right Eye Slit Loop
        { a: 10, b: 11 }, { a: 11, b: 12 }, { a: 12, b: 13 }, { a: 13, b: 10 },
        
        // Outer Helmet Perimeter
        { a: 3, b: 4 }, { a: 4, b: 24 }, { a: 24, b: 22 }, { a: 22, b: 20 },
        { a: 20, b: 21 }, { a: 21, b: 23 }, { a: 23, b: 25 }, { a: 25, b: 5 }, { a: 5, b: 3 },
        
        // Forehead plates
        { a: 3, b: 0 }, { a: 4, b: 1 }, { a: 5, b: 2 },
        
        // Faceplate Brow & Nose details
        { a: 0, b: 1 }, { a: 1, b: 6 }, { a: 6, b: 14 }, { a: 14, b: 10 }, { a: 10, b: 2 }, { a: 2, b: 0 },
        { a: 1, b: 7 }, { a: 2, b: 11 },
        
        // Nose plate / Mouth contour
        { a: 14, b: 15 }, { a: 15, b: 17 }, { a: 17, b: 19 }, { a: 19, b: 18 }, { a: 18, b: 16 }, { a: 16, b: 14 },
        { a: 14, b: 19 },
        
        // Cheekbone contours
        { a: 7, b: 24 }, { a: 8, b: 15 }, { a: 15, b: 22 },
        { a: 11, b: 25 }, { a: 12, b: 16 }, { a: 16, b: 23 },
        
        // Chin guard
        { a: 17, b: 20 }, { a: 18, b: 21 },
        
        // Ear disc anchors
        { a: 24, b: 26 }, { a: 26, b: 22 },
        { a: 25, b: 27 }, { a: 27, b: 23 }
    ];

    let rotX = 0, rotY = 0;
    let targetRotX = 0, targetRotY = 0;

    window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        targetRotY = nx * 0.45; // Yaw looking range
        targetRotX = -ny * 0.35; // Pitch looking range
    });

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

    const dustTriggerBtn = document.getElementById('btn-trigger-physics');
    if (dustTriggerBtn) {
        dustTriggerBtn.addEventListener('click', () => {
            physicsDustActive = true;
            dustPoints = [];
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

    // Eye shut/blink state variables
    let blinkValue = 1;
    let nextBlinkTime = Date.now() + Math.random() * 5000 + 3000;
    let blinkEndTime = 0;

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Subtle tech grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
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

            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            ctx.fill();
        });

        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 180) {
                    const alpha = (1 - dist / 180) * 0.06;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // 1. ANIMATION METRICS (floating & breathing & blinking)
        const time = performance.now() * 0.0015;
        const floatY = Math.sin(time) * 15; // Vertical floating wave
        const scalePulse = 1.0 + Math.cos(time * 0.8) * 0.04; // Breathing scale pulse
        
        // Idle swaying drift when mouse is still
        const idleX = Math.sin(time * 0.5) * 0.08;
        const idleY = Math.cos(time * 0.4) * 0.08;
        rotY += (targetRotY + idleY - rotY) * 0.08;
        rotX += (targetRotX + idleX - rotX) * 0.08;

        // Blinking (Reboot eye compression)
        if (Date.now() > nextBlinkTime) {
            blinkValue = 0.05; // eye slit shut
            blinkEndTime = Date.now() + 180;
            nextBlinkTime = Date.now() + Math.random() * 6000 + 4000;
        }
        if (blinkEndTime > 0 && Date.now() > blinkEndTime) {
            blinkValue = 1;
            blinkEndTime = 0;
        }

        const sizeMultiplier = Math.min(width, height) * 0.0035;
        const cx = width / 2;
        const cy = height / 2;
        const d = 400; // Focal camera depth

        // Rotate & Project vertices
        const projected = [];
        ironManVertices.forEach((v, index) => {
            let rawY = v.y;
            // Compress eye vertices on blink (left: 6-9, right: 10-13) relative to eye center Y=25
            if (index >= 6 && index <= 13) {
                rawY = 25 + (v.y - 25) * blinkValue;
            }

            // Apply breathe scale
            const xVal = v.x * scalePulse;
            const yVal = rawY * scalePulse;
            const zVal = v.z * scalePulse;

            // Rotation X
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const y1 = yVal * cosX - zVal * sinX;
            const z1 = yVal * sinX + zVal * cosX;
            
            // Rotation Y
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const x2 = xVal * cosY + z1 * sinY;
            const z2 = -xVal * sinY + z1 * cosY;

            // Perspective Projection
            const scale = d / (d + z2);

            projected.push({
                x: cx + x2 * scale * sizeMultiplier,
                y: cy - (y1 + floatY) * scale * sizeMultiplier
            });
        });

        // 2. STYLING PARAMETERS (Highly visible White neon style)
        const isLightsout = document.body.classList.contains('is-lightsout');
        
        ctx.save();
        ctx.lineWidth = isLightsout ? 3.0 : 1.8;
        ctx.strokeStyle = isLightsout ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.38)';
        
        // Add neon/glow blur shadows
        ctx.shadowBlur = isLightsout ? 14 : 6;
        ctx.shadowColor = isLightsout ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)';

        // Draw edges
        ironManEdges.forEach(edge => {
            const p1 = projected[edge.a];
            const p2 = projected[edge.b];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });
        
        ctx.restore();

        // 3. RENDER GLOWING EYE SLIT POLYGONS
        // Left Eye: 6 -> 7 -> 8 -> 9
        ctx.beginPath();
        ctx.moveTo(projected[6].x, projected[6].y);
        ctx.lineTo(projected[7].x, projected[7].y);
        ctx.lineTo(projected[8].x, projected[8].y);
        ctx.lineTo(projected[9].x, projected[9].y);
        ctx.closePath();
        ctx.fillStyle = isLightsout ? 'rgba(255, 213, 0, 0.85)' : 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        // Right Eye: 10 -> 11 -> 12 -> 13
        ctx.beginPath();
        ctx.moveTo(projected[10].x, projected[10].y);
        ctx.lineTo(projected[11].x, projected[11].y);
        ctx.lineTo(projected[12].x, projected[12].y);
        ctx.lineTo(projected[13].x, projected[13].y);
        ctx.closePath();
        ctx.fillStyle = isLightsout ? 'rgba(255, 213, 0, 0.85)' : 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        // Draw physics dust gravity particles
        if (physicsDustActive && dustPoints.length > 0) {
            dustPoints.forEach((dust, dIndex) => {
                dust.x += dust.vx;
                dust.y += dust.vy;
                dust.vy += 0.05;
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
