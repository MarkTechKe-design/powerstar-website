/**
 * Powerstar Content Loader
 * Fetches JSON content and updates the DOM.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Global Site Content
    await loadSiteContent();

    // 2. Load Slides (if slider exists)
    if (document.getElementById('sliderTrack')) {
        await loadSlides();
    }

    // 3. Load Departments (if grid exists)
    if (document.querySelector('.department-grid')) {
        // await loadDepartments(); // Implementation pending
    }

    // 4. Load About Page Modules (if on About page)
    if (document.querySelector('.about-hero')) {
        await loadAboutModules();
    }

    // 5. Load Team Gallery (if container exists - New check)
    if (document.getElementById('team-gallery-grid')) {
        await loadTeamGallery();
    }

});

/**
 * Validates properties and updates DOM elements with matching headers/IDs
 */
async function loadSiteContent() {
    try {
        const response = await fetch('data/site-content.json');
        if (!response.ok) throw new Error('Failed to load site content');
        const data = await response.json();

        // Update Text Content by ID
        updateText('hero-welcome', data.sections.hero_welcome);
        // updateText('hero-headline', data.sections.hero_headline); // Only if ID exists

        // Update Global Contact Info
        document.documentElement.style.setProperty('--phone-display', `"${data.contact.phone}"`);

        console.log('Site content loaded');
    } catch (error) {
        console.error('Error loading site content:', error);
    }
}

async function loadSlides() {
    try {
        const response = await fetch('data/slides.json');
        if (!response.ok) throw new Error('Failed to load slides');
        const slides = await response.json();

        const track = document.getElementById('sliderTrack');
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

        // Re-initialize slider logic from main.js if needed (or ensure main.js handles dynamic slides)
        // Since main.js might bind events to existing slides, we might need to trigger a re-init.
        if (window.initPromoSlider) window.initPromoSlider();

    } catch (error) {
        console.error('Error loading slides:', error);
    }
}

function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

/**
 * Loads specific modules for the About Page
 */
async function loadAboutModules() {
    console.log('Loading About Modules...');

    // A. Load About Content (Narrative, Quality, Vision)
    try {
        const response = await fetch('data/about.json');
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

            // Narrative
            if (data.intro_narrative) {
                // Assuming intro narrative container isn't explicitly ID'd yet, but we have content ready.
                // If there's a generic intro text block, we can target it.
            }

            // Vision
            if (data.growth_vision) {
                updateText('vision-title', data.growth_vision.title);
                updateText('vision-content', data.growth_vision.content);
                if (data.growth_vision.image) {
                    const img = document.getElementById('vision-image');
                    if (img) img.src = data.growth_vision.image;
                }
            }
        }
    } catch (e) {
        console.warn('Error loading about.json', e);
    }

    // B. Load Metrics
    try {
        const response = await fetch('data/metrics.json');
        if (response.ok) {
            const metrics = await response.json();
            const container = document.querySelector('.impact-stats');
            if (container) {
                container.innerHTML = metrics.map(m => `
                    <div class="stat-item">
                        <span class="counter" data-target="${m.value}" data-suffix="${m.suffix || ''}">0</span>
                        <span class="stat-label">${m.label}</span>
                    </div>
                `).join('');
                // Re-trigger stats animation if needed
                if (window.initStatsCounter) window.initStatsCounter();
            }
        }
    } catch (e) {
        console.warn('Error loading metrics.json', e);
    }

    // C. Load Executives
    try {
        const response = await fetch('data/executives.json');
        if (response.ok) {
            const execs = await response.json();
            const container = document.getElementById('executives-grid');
            if (container) {
                container.innerHTML = execs.executives.map(exec => `
                    <div class="team-card">
                        <img src="${exec.image}" alt="${exec.name}" class="lightbox-trigger" onerror="this.src='https://placehold.co/300x300/eee/999?text=${exec.name}'">
                        <h3>${exec.name}</h3>
                        <span class="role-badge">${exec.title}</span>
                        <p>${exec.bio}</p>
                        ${exec.quote ? `<p class="quote-modal">"${exec.quote}"</p>` : ''}
                    </div>
                `).join('');
            }
        }
    } catch (e) {
        console.warn('Error loading executives.json', e);
    }

    // D. Load Partners
    try {
        const response = await fetch('data/partners.json');
        if (response.ok) {
            const partners = await response.json();
            const container = document.getElementById('partners-grid');
            if (container) {
                container.innerHTML = partners.partners.map(p => `
                    <div class="partner-logo" style="width: 120px; text-align: center;">
                         <img src="${p.logo}" alt="${p.name}" style="max-width: 100%; opacity: 0.7; filter: grayscale(100%); transition: 0.3s;" onmouseover="this.style.filter='none'; this.style.opacity='1'" onmouseout="this.style.filter='grayscale(100%)'; this.style.opacity='0.7'" onerror="this.style.display='none'">
                    </div>
                `).join('');
            }
        }
    } catch (e) {
        console.warn('Error loading partners.json', e);
    }
}

async function loadTeamGallery() {
    try {
        const response = await fetch('data/team.json');
        if (response.ok) {
            const team = await response.json();
            const container = document.getElementById('team-gallery-grid');
            if (container && team.members) {
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
        }
    } catch (e) {
        console.warn('Error loading team.json', e);
    }
}
