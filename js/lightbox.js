/**
 * POWERSTAR LIGHTBOX SYSTEM
 * Vanilla JS Implementation - No Libraries
 */

document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
});

function initLightbox() {
    // 1. Create Lightbox DOM Elements if they don't exist
    if (!document.querySelector('.lightbox-overlay')) {
        const lightboxHTML = `
            <div class="lightbox-overlay" id="psLightbox">
                <div class="lightbox-content-wrapper">
                    <button class="lightbox-close" aria-label="Close">&times;</button>
                    <img src="" alt="Full View" class="lightbox-image">
                    <div class="lightbox-caption"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    const lightbox = document.getElementById('psLightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');

    // 2. define selector list
    const selectors = [
        '.slide-bg',
        '.promo-slide img',
        '.offer-image img',
        '.department-card img',
        '.team-gallery img',
        '.executive-card img',
        '.lightbox-trigger',
        '.story-image-container img'
    ];

    // 3. Attach click events
    function attachEvents() {
        const images = document.querySelectorAll(selectors.join(', '));

        images.forEach(img => {
            // Avoid double binding
            if (img.dataset.lightboxBound) return;
            img.dataset.lightboxBound = true;

            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Get Source
                // Check if it's a CSS background image (like .slide-bg might be, but usually it's an img tag with class slide-bg based on existing HTML)
                // If it is an img tag:
                let src = img.src;
                // If it captures a low-res thumb, try to find a high-res data attribute if it exists, otherwise use src
                if (img.dataset.fullSrc) {
                    src = img.dataset.fullSrc;
                }

                if (!src) return;

                lightboxImg.src = src;

                // Caption
                const caption = img.alt || img.getAttribute('title') || '';
                lightboxCaption.textContent = caption;

                openLightbox();
            });
        });
    }

    // Call initially
    attachEvents();

    // 4. MutationObserver to handle dynamically loaded content (sliders etc)
    const observer = new MutationObserver((mutations) => {
        attachEvents();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 5. Open/Close Logic
    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            lightboxImg.src = ''; // Clear src
        }, 300);
    }

    // Close on click close button
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on click outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
