/**
 * Powerstar Supermarkets - Media Page Logic
 * Handles Gallery Filtering and Lightbox Functionality
 */

'use strict';

const MEDIA_JSON_PATH = 'data/media.json';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Dynamic Content
    loadMediaContent();

    // 2. Initialize Lightbox
    initLightbox();
});

// ===========================================
// 1. DATA LOADER & SMART RENDERER
// ===========================================
async function loadMediaContent() {
    const grid = document.getElementById('media-grid');
    if (!grid) return;

    try {
        const response = await fetch(`${BASE_PATH}/${MEDIA_JSON_PATH}?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Failed to load media.json');

        const data = await response.json();

        // A. Update Hero Text (Optional)
        if (data.hero) {
            updateText('hero-welcome', data.hero.welcome);
            updateText('hero-headline', data.hero.headline);
            updateText('hero-text', data.hero.subheadline);
        }

        // B. Render Posts
        if (data.posts && data.posts.length > 0) {
            const activePosts = data.posts.filter(p => p.active !== false);
            grid.innerHTML = activePosts.map(post => createMediaCard(post)).join('');

            // Trigger Reveal Animation
            setTimeout(() => {
                const cards = grid.querySelectorAll('.blog-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('active'); // Ensure reveal class works
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }, 100);
        } else {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No updates available at the moment.</p>';
        }

    } catch (error) {
        console.error('[Powerstar] Media Load Error:', error);
        grid.innerHTML = '<p class="text-center" style="color:red; grid-column: 1/-1;">Unable to load news. Please try again later.</p>';
    }
}

function createMediaCard(post) {
    // Smart Linking Logic
    let actionButton = '';

    if (post.external_link && post.platform) {
        // SCENARIO A: External Social Link
        const platformClass = post.platform.toLowerCase();
        const iconClass = getPlatformIcon(platformClass);

        actionButton = `
            <a href="${post.external_link}" target="_blank" class="btn-social ${platformClass}">
                <i class="${iconClass}"></i> Read on ${post.platform}
            </a>
        `;
    } else {
        // SCENARIO B: Internal or No Link
        // If internal link exists (like 'link' property from old schema) or just generic
        if (post.category === 'promos') {
            actionButton = `<span class="read-more" style="cursor:default; color:#999; text-decoration: none;">View in Store</span>`;
        } else {
            actionButton = `<span class="read-more" style="cursor:default; opacity:0;">&nbsp;</span>`; // Spacer
        }
    }

    // Date Formatting
    const dateDisplay = post.date ? `<span class="card-date"><i class="far fa-calendar-alt"></i> ${post.date}</span>` : '';

    return `
        <article class="blog-card reveal" data-category="${post.category}">
            <div class="dept-image-wrapper" onclick="openLightbox(this)">
                <img src="${post.image}" alt="${post.title}" loading="lazy"
                    onerror="this.src='https://placehold.co/600x400?text=Powerstar+News'">
                <span class="category-tag">${post.category.toUpperCase()}</span>
                <div class="zoom-hint"><i class="fas fa-search-plus"></i> Zoom</div>
            </div>
            <div class="card-content">
                ${dateDisplay}
                <h3 class="dept-title">${post.title}</h3>
                <p class="dept-desc">${post.summary}</p>
                <div style="margin-top: auto; padding-top: 15px;">
                    ${actionButton}
                </div>
            </div>
        </article>
    `;
}

function getPlatformIcon(platform) {
    switch (platform) {
        case 'facebook': return 'fab fa-facebook-f';
        case 'linkedin': return 'fab fa-linkedin-in';
        case 'instagram': return 'fab fa-instagram';
        case 'twitter': return 'fab fa-twitter';
        case 'website': return 'fas fa-globe';
        default: return 'fas fa-external-link-alt';
    }
}

// Helper for text updates (safe check)
function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// ===========================================
// 2. FILTERING LOGIC (Exported for HTML onclick)
// ===========================================
window.filterGallery = function (category, btn) {
    if (!btn) return;

    // 1. Update Buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2. Filter Items
    const items = document.querySelectorAll('.blog-card');

    // Batch DOM updates for performance
    requestAnimationFrame(() => {
        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all' || itemCategory === category) {
                // Show Item
                item.style.display = 'flex'; // Restore display

                // Trigger smooth fade-in
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';

                // Allow reflow before animating in
                setTimeout(() => {
                    item.style.transition = "all 0.4s ease-out";
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);

            } else {
                // Hide Item
                item.style.display = 'none';
            }
        });
    });
};

// ===========================================
// 3. LIGHTBOX MODULE
// ===========================================
// ... (Kept existing Lightbox logic below or ensuring global initLightbox calls it)
// NOTE: Since lightbox is global and initialized, we just need the references here if not in main.js
// But based on previous file, it was here. Let's keep it embedded.

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

window.openLightbox = function (element) {
    const img = element.querySelector('img');
    if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeLightbox = function () {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

function initLightbox() {
    if (!lightbox) return;

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
