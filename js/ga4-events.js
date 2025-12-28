/**
 * Powerstar GA4 Advanced Event Tracking
 * Handles Branch Engagement, Offer Impressions, and Page Intent
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // 1. SAFE GTAG WRAPPER
    const safeGtag = (eventName, params) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        } else {
            // Silently fail or debug if needed
            // console.debug('GA4 Event:', eventName, params);
        }
    };

    // 2. PAGE INTENT TRACKING
    // Trigger: 15s dwell time OR 50% scroll
    let intentFired = false;
    const pageName = document.title;

    const fireIntent = () => {
        if (!intentFired) {
            safeGtag('page_intent_view', {
                page_name: pageName
            });
            intentFired = true;
        }
    };

    // Timer (15s)
    setTimeout(fireIntent, 15000);

    // Scroll (50%)
    window.addEventListener('scroll', () => {
        if (intentFired) return;
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        if (scrollPercent > 0.5) {
            fireIntent();
        }
    }, { passive: true });


    // 3. BRANCH ENGAGEMENT
    // Context: branches.html
    if (window.location.pathname.includes('branches.html') || document.querySelector('.locator-wrapper')) {

        // A. Search
        const searchInput = document.getElementById('branchSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length > 2) {
                        safeGtag('branch_engagement', {
                            action_type: 'search',
                            branch_name: 'global', // Search is global
                            search_term: e.target.value
                        });
                    }
                }, 1000); // Debounce 1s
            });
        }

        // B. List Click & C. Map View
        // We delegate to the list container if possible, or bind to items
        const branchList = document.getElementById('branchList');
        if (branchList) {
            branchList.addEventListener('click', (e) => {
                // Check for "View Map" button
                const btn = e.target.closest('[data-action="locate"]');
                if (btn) {
                    const item = btn.closest('.branch-item');
                    const branchName = item ? item.dataset.name : 'unknown';
                    safeGtag('branch_engagement', {
                        action_type: 'map_view',
                        branch_name: branchName
                    });
                    return;
                }

                // Check for generic Item click (if we track that)
                // The current UI might not have a distinct item click other than map/contact
                // But we can track if they click the item to expand or highlight?
                // branches.js highlights on map marker click, but list item click...
                // branches.js: "item.addEventListener('click', () => { highlightListItem(item); ... })"
                // So yes, row click exists.
                /*
                const item = e.target.closest('.branch-item');
                if (item && !btn) {
                     // logic for list_click
                     // To avoid spamming, maybe only if it changes active state?
                }
                */
            });
        }
    }


    // 4. OFFER ANALYTICS (Impressions)
    // Context: index.html (slider), offers.html
    const offerValues = document.querySelectorAll('.slide, .offer-card, .promo-banner');

    if (offerValues.length > 0 && 'IntersectionObserver' in window) {
        const offerObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Identify Offer Name
                    let offerName = 'Unknown Offer';

                    // Try data attribute first
                    if (el.dataset.offer) {
                        offerName = el.dataset.offer;
                    }
                    // Try heading inside
                    else if (el.querySelector('h2')) {
                        offerName = el.querySelector('h2').innerText;
                    }
                    else if (el.querySelector('h3')) {
                        offerName = el.querySelector('h3').innerText;
                    }
                    else if (el.dataset.name) {
                        offerName = el.dataset.name;
                    }

                    // Fire Event
                    safeGtag('offer_impression', {
                        offer_name: offerName,
                        page_name: pageName
                    });

                    // Stop observing this element (fire once per session/page-load)
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 }); // 50% visible

        offerValues.forEach(el => offerObserver.observe(el));
    }

});
