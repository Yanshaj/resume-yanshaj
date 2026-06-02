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
