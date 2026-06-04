/* ==========================================================================
   APPLE-STYLE TABBED PORTFOLIO ENGINE - CORE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Vector Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Theme Toggle System
    initThemeToggle();

    // 3. Mobile Menu Toggles
    initMobileNav();

    // 4. Tab Routing System (Central Content Panel Swapper)
    initTabRouter();

    // 5. Contact Form Handler
    initContactForm();

    // 6. Interactive Tech Background Graphics Engine
    initTechCanvas();
});

/* ==========================================================================
   THEME TOGGLE ENGINE (APPLE LIGHT VS FERRARI SPORT DARK)
   ========================================================================== */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Load saved preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'apple';
    
    if (savedTheme === 'sport') {
        document.body.classList.remove('apple-theme');
        document.body.classList.add('sport-theme');
        updateToggleIcon(true);
    } else {
        document.body.classList.remove('sport-theme');
        document.body.classList.add('apple-theme');
        updateToggleIcon(false);
    }

    toggleBtn.addEventListener('click', () => {
        const isSport = document.body.classList.contains('sport-theme');
        if (isSport) {
            document.body.classList.remove('sport-theme');
            document.body.classList.add('apple-theme');
            localStorage.setItem('portfolio-theme', 'apple');
            updateToggleIcon(false);
        } else {
            document.body.classList.remove('apple-theme');
            document.body.classList.add('sport-theme');
            localStorage.setItem('portfolio-theme', 'sport');
            updateToggleIcon(true);
        }
    });

    function updateToggleIcon(isSport) {
        toggleBtn.innerHTML = '';
        const icon = document.createElement('i');
        // Dark mode (sport) shows sun to switch to light; Light mode shows zap to switch to sport.
        icon.setAttribute('data-lucide', isSport ? 'sun' : 'zap');
        toggleBtn.appendChild(icon);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

/* ==========================================================================
   MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileNav() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-nav-overlay');

    if (!menuBtn || !overlay) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        overlay.classList.toggle('open');
        
        // Lock body scrolling when overlay is active
        if (overlay.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

/* ==========================================================================
   TAB ROUTING PARADIGM
   ========================================================================== */
function initTabRouter() {
    const triggers = document.querySelectorAll('.tab-trigger');
    const navLinks = document.querySelectorAll('.nav-link');
    const panels = document.querySelectorAll('.tab-panel');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-nav-overlay');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const target = trigger.getAttribute('data-target');

            // 1. Sync header active classes
            navLinks.forEach(link => {
                if (link.getAttribute('data-target') === target) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // 2. Swap content panels inside content frame
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${target}`) {
                    void panel.offsetWidth; // Force DOM reflow to restart entry animations
                    panel.classList.add('active');
                }
            });

            // 3. Close mobile nav if open
            if (overlay && overlay.classList.contains('open')) {
                menuBtn.classList.remove('active');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }

            // 4. Scroll page to top to ensure focus
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // 5. Update URL Hash silently
            history.replaceState(null, null, `#${target}`);
        });
    });

    // Check URL Hash on first load
    const hash = window.location.hash.substring(1);
    if (hash) {
        const matchingTrigger = document.querySelector(`.nav-link[data-target="${hash}"]`);
        if (matchingTrigger) {
            matchingTrigger.click();
        }
    }
}

/* ==========================================================================
   CONTACT FORM DISPATCHER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const resultMsg = document.getElementById('form-result');

    if (!form || !resultMsg) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;

        // Visual loading feedback
        resultMsg.classList.remove('hidden', 'success', 'error');
        resultMsg.textContent = 'Sending message...';
        resultMsg.classList.add('success');

        // Simulate network processing packet delay
        setTimeout(() => {
            resultMsg.textContent = `Thank you, ${name}. Your message has been sent successfully. Yanshaj will connect shortly at ${email}.`;
            form.reset();
        }, 1200);
    });
}

/* ==========================================================================
   INTERACTIVE TECH BACKGROUND GRAPHICS ENGINE
   ========================================================================== */
function initTechCanvas() {
    const canvas = document.getElementById('tech-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // High DPI / Retina Support
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic Variables
    let currentScrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    let scrollVelocity = 0;
    let smoothedVelocity = 0;

    // Track scroll events
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
        
        // Calculate velocity
        const delta = Math.abs(targetScrollY - lastScrollY);
        scrollVelocity = Math.min(delta, 100); // cap max velocity impact
        lastScrollY = targetScrollY;
    }, { passive: true });

    // Node Constellation Setup
    const nodes = [];
    const nodeCount = 38;
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 1,
            // Offset for parallax scroll
            parallaxFactor: Math.random() * 0.3 + 0.1
        });
    }

    // Circuit board path tracks setup
    const circuits = [];
    const circuitCount = 6;
    
    function generateCircuit(yPos) {
        const points = [];
        let curX = -50;
        let curY = yPos;
        points.push({x: curX, y: curY});
        
        while (curX < width + 50) {
            // Draw a horizontal segment, then angle up/down, then horizontal
            const segmentLen = Math.random() * 200 + 100;
            curX += segmentLen;
            points.push({x: curX, y: curY});
            
            if (Math.random() > 0.4) {
                const angleOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 30 + 30);
                curX += Math.abs(angleOffset);
                curY += angleOffset;
                points.push({x: curX, y: curY});
            }
        }
        
        return {
            points: points,
            packetPos: Math.random() * 0.5,
            packetSpeed: Math.random() * 0.0008 + 0.0005,
            packetSize: Math.random() * 3 + 2
        };
    }

    for (let i = 0; i < circuitCount; i++) {
        circuits.push(generateCircuit((height / (circuitCount + 1)) * (i + 1)));
    }

    // Floating UI Code Snippets Setup
    const codeSnippets = [];
    const codeSnippetsCount = 8;
    const snippetTexts = [
        'const dev = "Yanshaj";',
        'import { React } from "MERN";',
        'git commit -m "feat"',
        'C++',
        'CSS.sport-theme { ... }',
        'document.scroll()',
        'Array.prototype.map()',
        '<html>',
        'margin: 0 auto;',
        'zap() => {}'
    ];

    for (let i = 0; i < codeSnippetsCount; i++) {
        codeSnippets.push({
            x: Math.random() * (width - 150) + 50,
            y: Math.random() * height,
            vy: -(Math.random() * 0.2 + 0.1),
            text: snippetTexts[i % snippetTexts.length],
            font: `${Math.floor(Math.random() * 3) + 10}px monospace`,
            parallaxFactor: Math.random() * 0.4 + 0.2,
            opacity: Math.random() * 0.4 + 0.1
        });
    }

    // Master Animation Loop
    function animate(timestamp) {
        // Theme identification
        const isSport = document.body.classList.contains('sport-theme');
        
        // Dynamic colors setup based on active theme
        const gridColor = isSport ? 'rgba(255, 40, 0, 0.025)' : 'rgba(0, 0, 0, 0.015)';
        const gridLineColor = isSport ? 'rgba(255, 40, 0, 0.06)' : 'rgba(0, 80, 200, 0.03)';
        const nodeColor = isSport ? 'rgba(255, 213, 0, 0.25)' : 'rgba(0, 80, 200, 0.15)';
        const lineColor = isSport ? 'rgba(255, 40, 0, 0.12)' : 'rgba(0, 80, 200, 0.06)';
        const packetColor = isSport ? '#ff2800' : '#0050c8';
        const packetGlowColor = isSport ? 'rgba(255, 40, 0, 0.7)' : 'rgba(0, 80, 200, 0.5)';
        const snippetColor = isSport ? 'rgba(255, 213, 0, 0.3)' : 'rgba(12, 12, 13, 0.25)';

        // Clear Canvas
        ctx.clearRect(0, 0, width, height);

        // Smooth scroll variables
        currentScrollY += (targetScrollY - currentScrollY) * 0.08;
        
        // Decay scroll velocity quickly
        scrollVelocity *= 0.95;
        smoothedVelocity += (scrollVelocity - smoothedVelocity) * 0.1;

        // Draw Blueprint Grid lines
        drawGrid(gridLineColor, isSport);

        // Draw Constellation Nodes & Connecting Lines
        drawConstellation(nodeColor, lineColor, isSport);

        // Draw Circuit Board Tracks & Flying Packets
        drawCircuits(packetColor, packetGlowColor, isSport);

        // Draw Floating Code Telemetry Snippets
        drawCodeSnippets(snippetColor);

        // Request next frame
        requestAnimationFrame(animate);
    }

    // Draw grid overlay
    function drawGrid(lineColor, isSport) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        const gridSpacing = 60;
        
        // Scroll translation (parallax grid offset)
        const offsetY = (currentScrollY * 0.15) % gridSpacing;
        
        // Draw horizontal grid lines
        for (let y = -offsetY; y < height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw vertical grid lines
        for (let x = 0; x < width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Draw modern crosshair ticks at intersection points (very tech-y)
        ctx.fillStyle = isSport ? 'rgba(255, 213, 0, 0.15)' : 'rgba(0, 80, 200, 0.1)';
        for (let x = gridSpacing; x < width; x += gridSpacing * 2) {
            for (let y = -offsetY + gridSpacing; y < height; y += gridSpacing * 2) {
                if (Math.random() > 0.85) {
                    ctx.fillRect(x - 2, y - 2, 4, 4);
                }
            }
        }
    }

    // Draw connected dots constellation
    function drawConstellation(nodeColor, lineColor, isSport) {
        const maxDist = 180;
        const speedMultiplier = 1 + (smoothedVelocity * 0.15);
        
        // Update & Draw Nodes
        nodes.forEach(node => {
            // Apply drift speed and scroll-driven velocity boost
            node.x += node.vx * speedMultiplier;
            // Scroll displacement gives parallax effect
            const scrollDisplacementY = currentScrollY * node.parallaxFactor;
            const absoluteY = (node.y + scrollDisplacementY) % height;
            
            // Loop coordinate space bounds
            if (node.x < 0) node.x = width;
            if (node.x > width) node.x = 0;
            
            const renderY = absoluteY < 0 ? height + absoluteY : absoluteY;

            // Draw connection lines to other nodes
            nodes.forEach(otherNode => {
                const otherAbsoluteY = (otherNode.y + currentScrollY * otherNode.parallaxFactor) % height;
                const otherRenderY = otherAbsoluteY < 0 ? height + otherAbsoluteY : otherAbsoluteY;
                
                const dx = node.x - otherNode.x;
                const dy = renderY - otherRenderY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * (isSport ? 0.35 : 0.2);
                    ctx.strokeStyle = lineColor.replace(')', `, ${alpha})`).replace('rgba', 'rgba');
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(node.x, renderY);
                    ctx.lineTo(otherNode.x, otherRenderY);
                    ctx.stroke();
                }
            });

            // Draw Node Particle
            ctx.beginPath();
            ctx.arc(node.x, renderY, node.size + (smoothedVelocity * 0.1), 0, Math.PI * 2);
            ctx.fillStyle = nodeColor;
            ctx.fill();
        });
    }

    // Draw Circuits and Data Packets
    function drawCircuits(packetColor, packetGlowColor, isSport) {
        // Boost packet speeds dynamically when scrolling
        const speedMultiplier = 1 + (smoothedVelocity * 0.22);
        
        circuits.forEach(circuit => {
            // Re-generate if bounds changed
            if (circuit.points.length === 0) return;
            
            // Draw circuit lines
            ctx.strokeStyle = isSport ? 'rgba(255, 40, 0, 0.05)' : 'rgba(0, 80, 200, 0.035)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(circuit.points[0].x, circuit.points[0].y);
            
            for (let p = 1; p < circuit.points.length; p++) {
                ctx.lineTo(circuit.points[p].x, circuit.points[p].y);
            }
            ctx.stroke();

            // Progress packet position
            circuit.packetPos += circuit.packetSpeed * speedMultiplier;
            if (circuit.packetPos >= 1.0) {
                circuit.packetPos = 0;
            }

            // Find point coordinates based on current progress percentage
            const packetCoord = getPointOnPath(circuit.points, circuit.packetPos);
            if (packetCoord) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(packetCoord.x, packetCoord.y, circuit.packetSize + (smoothedVelocity * 0.15), 0, Math.PI * 2);
                
                // Glowing aesthetics
                ctx.shadowBlur = 10 + (smoothedVelocity * 0.5);
                ctx.shadowColor = packetGlowColor;
                ctx.fillStyle = packetColor;
                ctx.fill();
                ctx.restore();
            }
        });
    }

    // Draw code telemetry phrases floating in parallax
    function drawCodeSnippets(snippetColor) {
        ctx.fillStyle = snippetColor;
        
        codeSnippets.forEach(snippet => {
            // Apply drift and parallax offset
            const scrollDisplacementY = currentScrollY * snippet.parallaxFactor;
            const renderY = (snippet.y + scrollDisplacementY) % height;
            const finalY = renderY < 0 ? height + renderY : renderY;

            ctx.font = snippet.font;
            ctx.fillText(snippet.text, snippet.x, finalY);

            // Subtle drift
            snippet.y += snippet.vy;
        });
    }

    // Helper to calculate exact coordinates on multi-segment path
    function getPointOnPath(points, progress) {
        if (points.length < 2) return null;
        
        // Calculate total path distance
        const segmentLengths = [];
        let totalLen = 0;
        
        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i+1].x - points[i].x;
            const dy = points[i+1].y - points[i].y;
            const len = Math.sqrt(dx * dx + dy * dy);
            segmentLengths.push(len);
            totalLen += len;
        }

        const targetLen = progress * totalLen;
        let runningLen = 0;
        
        for (let i = 0; i < points.length - 1; i++) {
            const currentSegLen = segmentLengths[i];
            if (runningLen + currentSegLen >= targetLen) {
                const segmentProgress = (targetLen - runningLen) / currentSegLen;
                const pStart = points[i];
                const pEnd = points[i+1];
                return {
                    x: pStart.x + (pEnd.x - pStart.x) * segmentProgress,
                    y: pStart.y + (pEnd.y - pStart.y) * segmentProgress
                };
            }
            runningLen += currentSegLen;
        }
        
        return points[points.length - 1];
    }

    // Start background simulation loops
    requestAnimationFrame(animate);
}
