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
