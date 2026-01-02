/**
 * Powerstar Content Loader
 * Fetches JSON content and updates the DOM.
 * Hardened for Production: Relative paths, error handling, UI fallbacks.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;

    // 1. Load Global Site Content (Header, Footer, Contact Info) - All Pages
    await loadSiteContent();

    // 2. Landing Page Specific Loading
    if (path.includes('index.html') || path.endsWith('/')) {
        await loadSlides();
        await loadDepartmentsHome();
        await loadWhatsNew();

        // Sometimes offers slider is on home too
        if (document.getElementById('weekly-offers-grid')) {
            await loadOffers(); // If reused on home
        }
    }

    // 3. Departments Page Specific Loading
    if (path.includes('services.html')) {
        await loadDepartmentsAll();
    }

    // 4. Offers Page Specific Loading
    if (path.includes('offers.html')) {
        await loadOffers();
    }

    // 5. About Page Specific Loading
    if (path.includes('about.html')) {
        await loadAboutModules();
    }

    // 6. Media/Team Page Specific Loading
    if (path.includes('media.html') || path.includes('team.html') || document.getElementById('team-gallery-grid')) {
        await loadTeamGallery();
    }
});

/* =========================================
   CORE LOADERS (With Fallbacks & Logging)
   ========================================= */

/**
 * Validates properties and updates DOM elements with matching headers/IDs
 */
async function loadSiteContent() {
    try {
        const response = await fetch('data/site-content.json?v=2025-01');
        if (!response.ok) throw new Error('Failed to load site content');
        const data = await response.json();

        // Update Text Content by ID
        updateText('hero-welcome', data.sections.hero_welcome);

        // Update Global Contact Info
        document.documentElement.style.setProperty('--phone-display', `"${data.contact.phone}"`);

    } catch (error) {
        console.error('[Powerstar] Error loading site content:', error);
        // No UI fallback needed for site-content usually, just logging.
    }
}

async function loadSlides() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    try {
        const response = await fetch('data/slides.json?v=2025-01');
        if (!response.ok) throw new Error('HTTP error ' + response.status);
        const slides = await response.json();

        if (!slides || slides.length === 0) throw new Error('No slides data found');

        track.innerHTML = ''; // Clear existing static slides

        slides.forEach((slide, index) => {
            if (!slide.active) return;

            const slideEl = document.createElement('div');
            slideEl.className = `slide slide-${index + 1} ${index === 0 ? 'active' : ''}`;
            slideEl.innerHTML = `
                <img src="${slide.image}" class="slide-bg lightbox-trigger" alt="${slide.title}">
                <div class="slide-content">
                    <span class="slide-subtitle reveal">${slide.subtitle}</span>
                    <h2 class="reveal">${slide.title}</h2>
                    <p class="reveal">${slide.subtitle}</p>
                    <a href="${slide.button_link}" class="btn btn-primary reveal">${slide.button_text}</a>
                </div>
            `;
            track.appendChild(slideEl);
        });

        if (window.initPromoSlider) window.initPromoSlider();

    } catch (error) {
        console.error('[Powerstar] Error loading slides:', error);
        // Fallback: Keep static slides if JS fails (implicit as we only clear inside try)
        // Or if we cleared and failed, show a static message
        if (track.children.length === 0) {
            track.innerHTML = '<div class="slide active"><div class="slide-content"><h2>Welcome to Powerstar</h2></div></div>';
        }
    }
}

async function loadDepartmentsAll() {
    const container = document.getElementById('departments-grid');
    if (!container) return;

    try {
        const response = await fetch('data/departments.json?v=2025-01');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const departments = await response.json();

        if (!departments || departments.length === 0) {
            renderFallback(container, "Departments will be displayed here once available.");
            console.warn('[Powerstar] No active departments to display');
            return;
        }

        container.innerHTML = departments.filter(d => d.visible).map(dept => `
            <div class="dept-card reveal">
                <div class="dept-image-wrapper">
                    <img src="${dept.image}" alt="${dept.title}" loading="lazy" class="lightbox-trigger"
                        onerror="this.src='https://placehold.co/600x400/eee/999?text=${dept.title}'">
                </div>
                <div class="card-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <h3 class="dept-title" style="margin:0;">${dept.title}</h3>
                        <i class="fas ${dept.icon}" style="color:var(--ps-gold); font-size:1.2rem;"></i>
                    </div>
                    <p class="dept-desc">${dept.description}</p>
                    ${dept.note ? `<small style="display:block; color:var(--ps-red); margin-bottom:10px; font-weight:600;">${dept.note}</small>` : ''}
                    
                    <a href="order.html" class="dept-btn btn-outline"><i class="fab fa-whatsapp"></i> Order on WhatsApp</a>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error('[Powerstar] Error loading departments.json', e);
        renderFallback(container, "Unable to load departments. Please try again later.");
    }
}

async function loadDepartmentsHome() {
    const container = document.getElementById('landing-departments-grid');
    if (!container) return;

    try {
        const response = await fetch('data/departments.json?v=2025-01');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const departments = await response.json();

        const landingDepts = departments.filter(d => d.visible && d.landing_display);

        if (landingDepts.length === 0) {
            renderFallback(container, "Featured departments coming soon.");
            return;
        }

        container.innerHTML = landingDepts.map(dept => `
            <a href="services.html" class="quick-card">
                <div class="quick-icon"><i class="fas ${dept.icon}"></i></div>
                <span class="quick-label">${dept.title}</span>
            </a>
        `).join('');

    } catch (e) {
        console.error('[Powerstar] Error loading departments for landing page', e);
        renderFallback(container, "Unable to load featured departments.");
    }
}

async function loadWhatsNew() {
    const container = document.getElementById('whats-new-grid');
    if (!container) return;

    try {
        const response = await fetch('data/whats-new.json?v=2025-01');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const newsItems = await response.json();

        const activeItems = newsItems.filter(item => item.active);

        if (activeItems.length === 0) {
            renderFallback(container, "Stay tuned for the latest updates from Powerstar.");
            console.warn('[Powerstar] No active news items found');
            return;
        }

        container.innerHTML = activeItems.map(item => `
            <article class="news-card reveal">
                <div class="news-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy"
                            onerror="this.src='https://placehold.co/600x400/eee/999?text=${item.title}'">
                    <span class="news-tag">${item.tag}</span>
                </div>
                <div class="news-content">
                    <h3>${item.title}</h3>
                    <a href="${item.link}" class="btn-text">${item.link_text} <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `).join('');

    } catch (e) {
        console.error('[Powerstar] Error loading whats-new.json', e);
        renderFallback(container, "Updates currently unavailable.");
    }
}

async function loadOffers() {
    const container = document.getElementById('weekly-offers-grid');
    if (!container) return;

    try {
        const response = await fetch('data/offers.json?v=2025-01');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();

        // Optional: Update Headers if present
        if (data.hero) {
            updateText('offers-hero-welcome', data.hero.welcome);
            updateText('offers-hero-headline', data.hero.headline);
            updateText('offers-hero-text', data.hero.subheadline);
        }
        if (data.header) {
            updateText('offers-subtitle', data.header.subtitle);
            updateText('offers-title', data.header.title);
        }

        if (!data.offers || data.offers.length === 0) {
            renderFallback(container, "New deals coming soon. Check back shortly.");
            return;
        }

        container.innerHTML = data.offers.map(offer => {
            if (!offer.active) return '';
            const branches = Array.isArray(offer.branches) ? offer.branches.join(', ') : offer.branches;

            return `
            <div class="offer-card">
                <div class="offer-image">
                    <img src="${offer.image}" alt="${offer.product_name}" class="lightbox-trigger" onerror="this.src='https://placehold.co/600x600/eee/999?text=Offer'">
                    ${offer.discount_label ? `<span class="discount-badge">${offer.discount_label}</span>` : ''}
                </div>
                <div class="offer-details">
                    <h3>${offer.product_name}</h3>
                    <div class="price-row">
                        <span class="old-price">${offer.old_price}</span>
                        <span class="new-price">${offer.new_price}</span>
                    </div>
                    <small class="branch-label">Available at: <strong>${branches}</strong></small>
                    <a href="order.html" class="btn btn-primary btn-block">Order Now</a>
                </div>
            </div>
        `}).join('');

    } catch (e) {
        console.error('[Powerstar] Failed to load offers.json', e);
        renderFallback(container, "Unable to load offers. Please verify connection.");
    }
}

async function loadAboutModules() {
    console.log('[Powerstar] Loading About Modules...');

    // A. Load About Content
    try {
        const response = await fetch('data/about.json?v=2025-01');
        if (response.ok) {
            const data = await response.json();
            // Strategic Compass
            if (data.strategic_compass) {
                if (data.strategic_compass.mission) {
                    updateText('mission-title', data.strategic_compass.mission.title);
                    updateText('mission-content', data.strategic_compass.mission.content);
                }
                if (data.strategic_compass.vision) {
                    updateText('vision-title', data.strategic_compass.vision.title);
                    updateText('vision-content', data.strategic_compass.vision.content);
                }
                if (data.strategic_compass.quality_policy) {
                    updateText('quality-title', data.strategic_compass.quality_policy.title);
                    updateText('quality-desc', data.strategic_compass.quality_policy.content);
                }
            }
            // Vision Image
            if (data.growth_vision && data.growth_vision.image) {
                const img = document.getElementById('vision-image');
                if (img) img.src = data.growth_vision.image;
            }
        }
    } catch (e) {
        console.warn('[Powerstar] Error loading about.json', e);
    }

    // B. Load Metrics
    const metricsContainer = document.querySelector('.impact-stats');
    if (metricsContainer) {
        try {
            const response = await fetch('data/metrics.json?v=2025-01');
            if (response.ok) {
                const metrics = await response.json();
                metricsContainer.innerHTML = metrics.map(m => `
                    <div class="stat-item">
                        <span class="counter" data-target="${m.value}" data-suffix="${m.suffix || ''}">0</span>
                        <span class="stat-label">${m.label}</span>
                    </div>
                `).join('');
                if (window.initStatsCounter) window.initStatsCounter();
            }
        } catch (e) { console.warn('Metrics load failed', e); }
    }

    // C. Load Executives
    const execContainer = document.getElementById('executives-grid');
    if (execContainer) {
        try {
            const response = await fetch('data/executives.json?v=2025-01');
            if (response.ok) {
                const execs = await response.json();
                execContainer.innerHTML = execs.executives.map(exec => `
                    <div class="team-card">
                        <img src="${exec.image}" alt="${exec.name}" class="lightbox-trigger" onerror="this.src='https://placehold.co/300x300/eee/999?text=${exec.name}'">
                        <h3>${exec.name}</h3>
                        <span class="role-badge">${exec.title}</span>
                        <p>${exec.bio}</p>
                        ${exec.quote ? `<p class="quote-modal">"${exec.quote}"</p>` : ''}
                    </div>
                `).join('');
            }
        } catch (e) { console.warn('Executives load failed', e); }
    }

    // D. Load Partners
    const partnerTrack = document.getElementById('partners-track');
    if (partnerTrack) {
        try {
            const response = await fetch('data/partners.json?v=2025-01');
            if (response.ok) {
                const data = await response.json();
                if (data.headline) updateText('partners-headline', data.headline);
                if (data.intro) updateText('partners-intro', data.intro);

                if (data.partners) {
                    const logoList = [...data.partners, ...data.partners];
                    partnerTrack.innerHTML = logoList.map(p => `
                        <div class="partner-logo-item">
                                <img src="${p.logo}" alt="${p.name} - Trusted Partner" loading="lazy" onerror="this.style.opacity='0.1'">
                        </div>
                    `).join('');
                }
            }
        } catch (e) { console.warn('Partners load failed', e); }
    }
}

async function loadTeamGallery() {
    const container = document.getElementById('team-gallery-grid');
    if (!container) return;

    try {
        const response = await fetch('data/team.json?v=2025-01');
        if (response.ok) {
            const team = await response.json();
            container.innerHTML = team.members.map(member => `
                <div class="gallery-item">
                    <img src="${member.image}" alt="${member.name}" class="lightbox-trigger" onerror="this.src='https://placehold.co/600x800/333/fff?text=${member.role}'">
                    <div class="gallery-overlay">
                        <h4>${member.name}</h4>
                        <span>${member.role}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) {
        console.warn('Error loading team.json', e);
    }
}

/* =========================================
   UTILITIES
   ========================================= */

function updateText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
}

function renderFallback(container, message) {
    if (!container) return;
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>${message}</p>
        </div>
    `;
}
