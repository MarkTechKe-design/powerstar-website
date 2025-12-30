/**
 * Powerstar Supermarkets - Homepage Core Logic
 * 
 * RESPONSIBILITIES:
 * 1. Mobile Menu Toggle
 * 2. Scroll Reveal Animations (Throttled)
 * 3. Hero Promo Slider (Touch-enabled)
 * 
 * AUTHOR: Senior Frontend Engineer
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollReveal();
    // initPromoSlider(); // Moved to be called by content-loader after data load, or if element exists static
    if (document.getElementById('sliderTrack') && document.querySelectorAll('.slide').length > 0) {
        initPromoSlider();
    }
    initOffersSystem();
    // initLightbox(); // Handled by js/lightbox.js
    initStatsCounter();
});

// ===========================================
// 4. OFFERS SYSTEM (ASSET-DRIVEN)
// ===========================================
function initOffersSystem() {
    const offerImages = document.querySelectorAll('.offer-image[data-image]');

    if (offerImages.length === 0) return;

    offerImages.forEach(container => {
        const imageUrl = container.getAttribute('data-image');

        // Create Image Object to test loading
        const img = new Image();
        img.src = imageUrl;
        img.alt = "Special Offer"; // ideally we grab this from a data-alt if available, or generic

        img.onload = () => {
            // Image exists, append it
            container.appendChild(img);
            // Remove initial placeholder bg if needed, but styling handles z-index or coverage
        };

        img.onerror = () => {
            // Image failed, show fallback
            container.classList.add('missing-img');
            // Ensure no broken image icon shows
            img.remove();
        };
    });
}

// ===========================================
// LIGHTBOX MODULE
// ===========================================
// ===========================================
// LIGHTBOX MODULE
// ===========================================
// Note: Lightbox logic has been moved to js/lightbox.js for strict modularity.
// This block is intentionally left empty/commented to prevent conflicts.

// ===========================================
// 1. MOBILE MENU MODULE
// ===========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    // Defensive check
    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Toggle Active State
        const isActive = navMenu.classList.toggle('active');

        // Update Icon (Hamburger <-> Times)
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('class', isActive ? 'fas fa-times' : 'fas fa-bars');
        }

        // Accessibility
        menuBtn.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.setAttribute('class', 'fas fa-bars');
        }
    });
}

// ===========================================
// 2. SCROLL REVEAL MODULE (PERFORMANCE OPTIMIZED)
// ===========================================
function initScrollReveal() {
    // Select all elements to animate
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length === 0) return;

    // Cache window height to avoid layout thrashing in loop
    let windowHeight = window.innerHeight;

    // Update window height on resize
    window.addEventListener('resize', () => {
        windowHeight = window.innerHeight;
    }, { passive: true });

    const checkReveal = () => {
        const elementVisible = 100; // Trigger when 100px into view

        for (let i = 0; i < reveals.length; i++) {
            const reveal = reveals[i];

            // Skip already active elements to save calc time
            if (reveal.classList.contains('active')) continue;

            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("active");
            }
        }
    };

    // RAF Throttle pattern
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkReveal();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // Passive listener for scroll performance

    // Initial check on load
    checkReveal();
}

// ===========================================
// 3. PROMO SLIDER MODULE
// ===========================================
// ===========================================
// 3. HERO PROMO SLIDER (TRUE CAROUSEL)
// ===========================================
// ===========================================
// 3. HERO PROMO SLIDER (TRUE CAROUSEL)
// ===========================================
window.initPromoSlider = function () {
    const sliderContainer = document.getElementById('promoSlider');
    if (!sliderContainer) return;

    const track = document.getElementById('sliderTrack');
    const slides = Array.from(track.getElementsByClassName('slide'));
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;
    const AUTOPLAY_DELAY = 5000;

    // Cleanup previous instance
    if (window.promoSliderInterval) {
        clearInterval(window.promoSliderInterval);
    }
    if (sliderContainer._stopFn) {
        sliderContainer.removeEventListener('mouseenter', sliderContainer._stopFn);
    }
    if (sliderContainer._startFn) {
        sliderContainer.removeEventListener('mouseleave', sliderContainer._startFn);
    }
    // Note: Touch events are harder to remove if anonymous, but the interval is the main issue.
    // We will use named handlers for touch too.


    // Helper: Update Active Classes
    const showSlide = (index) => {
        // Wrap around
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - 1;

        currentSlideIndex = index;

        // Update Slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlideIndex);
        });

        // Update Indicators
        if (indicators.length > 0) {
            indicators.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlideIndex);
            });
        }
    };

    // Public Controls
    window.moveSlide = (n) => {
        stopAutoScroll();
        showSlide(currentSlideIndex + n);
        startAutoScroll();
    };

    window.currentSlide = (n) => {
        stopAutoScroll();
        showSlide(n - 1); // 1-based to 0-based
        startAutoScroll();
    };

    // --- Autoplay ---
    const startAutoScroll = () => {
        if (window.promoSliderInterval) clearInterval(window.promoSliderInterval);
        window.promoSliderInterval = setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, AUTOPLAY_DELAY);
    };

    const stopAutoScroll = () => {
        if (window.promoSliderInterval) clearInterval(window.promoSliderInterval);
    };

    // Store references for cleanup
    sliderContainer._startFn = startAutoScroll;
    sliderContainer._stopFn = stopAutoScroll;

    // Start
    startAutoScroll();
    showSlide(0); // Ensure init state

    // Pause on Hover
    sliderContainer.addEventListener('mouseenter', stopAutoScroll);
    sliderContainer.addEventListener('mouseleave', startAutoScroll);

    // --- Touch Swipe Support ---
    let touchStartX = 0;
    let touchEndX = 0;

    const onTouchStart = (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    };

    const onTouchEnd = (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoScroll();
    };

    // Remove old touch listeners if present
    if (sliderContainer._touchStartFn) sliderContainer.removeEventListener('touchstart', sliderContainer._touchStartFn);
    if (sliderContainer._touchEndFn) sliderContainer.removeEventListener('touchend', sliderContainer._touchEndFn);

    sliderContainer.addEventListener('touchstart', onTouchStart, { passive: true });
    sliderContainer.addEventListener('touchend', onTouchEnd, { passive: true });

    // Store new references
    sliderContainer._touchStartFn = onTouchStart;
    sliderContainer._touchEndFn = onTouchEnd;

    const handleSwipe = () => {
        const SWIPE_THRESHOLD = 50;
        if (touchStartX - touchEndX > SWIPE_THRESHOLD) showSlide(currentSlideIndex + 1);
        if (touchEndX - touchStartX > SWIPE_THRESHOLD) showSlide(currentSlideIndex - 1);
    };
}

// ===========================================
// 4. OFFERS PAGE SLIDER (Simple Fade)
// ===========================================
function initOffersSlider() {
    const slides = document.querySelectorAll('.promo-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (slides.length === 0) return;

    let index = 0;
    const INTERVAL = 5000;

    const showSlide = (n) => {
        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));

        // Wrap
        if (n >= slides.length) index = 0;
        else if (n < 0) index = slides.length - 1;
        else index = n;

        slides[index].classList.add('active');
        if (indicators[index]) indicators[index].classList.add('active');
    };

    const nextSlide = () => showSlide(index + 1);

    // Autoplay
    let timer = setInterval(nextSlide, INTERVAL);

    // Manual Indicators
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
            clearInterval(timer);
            showSlide(i);
            timer = setInterval(nextSlide, INTERVAL);
        });
    });
}
// Add to init list


/* ===========================================
   6. IMPACT STATS ANIMATION (FINAL)
   =========================================== */
function initStatsCounter() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    let animated = false;

    const animateCounters = () => {
        if (animated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10);
            const suffix = counter.dataset.suffix || "";
            if (isNaN(target)) return;

            let current = 0;
            // Determine step size based on target magnitude for consistent duration
            const step = Math.ceil(target / 60); // approx 1 second animation @ 60fps

            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = current.toLocaleString() + suffix;
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString() + suffix;
                }
            };

            update();
        });

        animated = true;
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 });

    const statsSection = document.querySelector(".impact-stats");
    if (statsSection) observer.observe(statsSection);
}

// Ensure it runs

