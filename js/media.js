/**
 * Powerstar Supermarkets - Media Page Logic
 * Handles Gallery Filtering and Lightbox Functionality
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Lightbox is global, initialized once
    initLightbox();
});

// ===========================================
// 1. FILTERING LOGIC (Exported for HTML onclick)
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
                item.classList.remove('hide');

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
                item.classList.add('hide');
            }
        });
    });
};

// ===========================================
// 2. LIGHTBOX MODULE
// ===========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Global function for HTML onclick
window.openLightbox = function (element) {
    const img = element.querySelector('img');
    if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
};

window.closeLightbox = function () {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    }
};

function initLightbox() {
    if (!lightbox) return;

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
