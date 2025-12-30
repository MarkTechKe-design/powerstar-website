/**
 * Powerstar Global Lightbox System
 * Pure Vanilla JS - No Dependencies
 */

(function () {
    'use strict';

    // injected HTML structure
    const lightboxHTML = `
        <div class="lightbox-overlay" id="globalLightbox" aria-hidden="true">
            <div class="lightbox-content-wrapper">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <img src="" alt="Preview" class="lightbox-image" id="lightboxImage">
            </div>
        </div>
    `;

    // Inject styles if not present (fallback)
    // Assuming css/lightbox.css is loaded via HTML, but ensuring safety.

    document.addEventListener('DOMContentLoaded', () => {
        // 1. Inject Lightbox DOM
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        const lightbox = document.getElementById('globalLightbox');
        const lightboxImg = document.getElementById('lightboxImage');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        // 2. Event Delegation for Image Clicks
        // Targets: .slide-bg, .promo-slide img, .offer-image img
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            // Check if target is a valid preview image
            if (
                target.classList.contains('lightbox-trigger') ||
                target.matches('.offer-image img') ||
                target.matches('.dept-image-wrapper img') ||
                target.matches('.promo-slide img') ||
                target.matches('.slide-bg')
            ) {
                e.preventDefault();
                e.stopPropagation();
                openLightbox(target.src || target.currentSrc);
            }

            // Handle Hero Backgrounds if they have data-preview attribute
            // (Requires HTML update to add data-preview="true" and data-src on hero divs)
        });

        // 3. Open Logic
        function openLightbox(src) {
            if (!src) return;
            lightboxImg.src = src;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock scroll
        }

        // 4. Close Logic
        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Unlock scroll
            setTimeout(() => {
                lightboxImg.src = ''; // Clear src after fade out
            }, 300);
        }

        // Event Listeners for Close
        closeBtn.addEventListener('click', closeLightbox);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    });

})();
