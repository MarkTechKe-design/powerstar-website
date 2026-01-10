/**
 * Powerstar Supermarkets — Unified Main JS
 * STABLE CORE (No WhatsApp ordering yet)
 * Enterprise-safe | GitHub Pages + cPanel
 */

'use strict';

/* ===============================
   GLOBAL CONFIG
================================ */
const BASE_PATH = window.location.hostname.includes('github.io')
    ? '/powerstar-website'
    : '';

const PLACEHOLDER_IMG =
    'https://placehold.co/600x400?text=Powerstar+Supermarkets';

/* ===============================
   DOM READY
================================ */
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();

    const path = window.location.pathname;

    const isHome =
        path === '/' ||
        path.endsWith('/') ||
        path.endsWith('index.html');

    if (isHome) {
        loadHomeSlider();
        initHeroSlider();
        loadOffersHome();
    }

    if (path.includes('services.html')) {
        loadDepartmentsWithProducts();
    }

    if (path.includes('careers.html')) {
        loadCareers();
    }

    if (path.includes('about.html')) {
        loadAbout();
    }
});

/* ===============================
   UTILITIES
================================ */
function parseKES(value) {
    if (!value) return '';
    if (typeof value === 'number') return value.toLocaleString();

    const num = Number(String(value).replace(/[^\d]/g, ''));
    return isNaN(num) ? '' : num.toLocaleString();
}

/* ===============================
   SERVICES — DEPARTMENTS + PRODUCTS
================================ */
async function loadDepartmentsWithProducts() {
    const tabs = document.getElementById('department-tabs');
    const grid = document.getElementById('products-grid');
    if (!tabs || !grid) return;

    try {
        const res = await fetch(`${BASE_PATH}/data/products.json`);
        if (!res.ok) throw new Error('products.json missing');

        const data = await res.json();
        const departments = data.departments || [];

        if (!departments.length) {
            grid.innerHTML = `<p>No departments available.</p>`;
            return;
        }

        tabs.innerHTML = departments.map((d, i) => `
            <button class="dept-tab ${i === 0 ? 'active' : ''}" data-id="${d.id}">
                ${d.title}
            </button>
        `).join('');

        renderDepartment(departments[0], grid);

        tabs.addEventListener('click', e => {
            if (!e.target.classList.contains('dept-tab')) return;

            tabs.querySelectorAll('.dept-tab')
                .forEach(b => b.classList.remove('active'));

            e.target.classList.add('active');

            const dept = departments.find(d => d.id === e.target.dataset.id);
            renderDepartment(dept, grid);
        });

    } catch (err) {
        console.error('[Services]', err);
        grid.innerHTML = `<p>Unable to load products.</p>`;
    }
}

function renderDepartment(dept, container) {
    if (!dept || !Array.isArray(dept.products) || !dept.products.length) {
        container.innerHTML = `<p>No products in this department.</p>`;
        return;
    }

    container.innerHTML = dept.products.map(p => `
        <div class="product-card">
            <img src="${p.image}"
                 alt="${p.name}"
                 onerror="this.src='${PLACEHOLDER_IMG}'">

            <h3>${p.name}</h3>

            <div class="price-row">
                ${
                    p.offer_price
                        ? `<span class="old-price">KES ${parseKES(p.price)}</span>`
                        : ''
                }
                <span class="new-price">KES ${parseKES(p.offer_price ?? p.price)}</span>
            </div>

            <small>${Array.isArray(p.branches) ? p.branches.join(', ') : ''}</small>

            <button class="btn btn-primary add-to-order"
    data-id="${p.id}"
    data-name="${p.name}"
    data-price="${p.offer_price ?? p.price}">
    ADD TO ORDER
</button>

        </div>
    `).join('');
}

/* ===============================
   HOME — OFFERS GRID
================================ */
async function loadOffersHome() {
    const grid = document.getElementById('weekly-offers-grid');
    if (!grid) return;

    try {
        const res = await fetch(`${BASE_PATH}/data/offers.json`);
        if (!res.ok) throw new Error('offers.json missing');

        const data = await res.json();
        const offers = (data.offers || []).filter(o => o.active).slice(0, 6);

        grid.innerHTML = offers.map(o => `
            <div class="offer-card">
                <div class="offer-image">
                    ${
                        o.discount_label
                            ? `<span class="discount-badge">${o.discount_label}</span>`
                            : ''
                    }
                    <img src="${o.image}"
                         alt="${o.product_name}"
                         onerror="this.src='${PLACEHOLDER_IMG}'">
                </div>

                <div class="offer-details">
                    <h3>${o.product_name}</h3>

                    <div class="price-row">
                        ${
                            o.old_price
                                ? `<span class="old-price">KES ${parseKES(o.old_price)}</span>`
                                : ''
                        }
                        <span class="new-price">KES ${parseKES(o.new_price)}</span>
                    </div>

                    <span class="branch-label">
                        ${Array.isArray(o.branches) ? o.branches.join(', ') : ''}
                    </span>

                    <button class="btn" disabled>Order Coming Soon</button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.warn('[Offers]', err);
        grid.innerHTML = `<p>Unable to load offers.</p>`;
    }
}

/* ===============================
   HOME HERO SLIDER (STATIC DATA)
================================ */
function loadHomeSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const slides = [
        {
            image: 'assets/hero/slide-1.jpg',
            tag: 'Weekly Deal',
            title: 'Fresh Groceries, Better Prices',
            text: 'Quality essentials sourced daily for your family.'
        },
        {
            image: 'assets/hero/slide-2.jpg',
            tag: 'Hot Offer',
            title: 'Unbeatable Household Deals',
            text: 'Save more on everyday home essentials.'
        },
        {
            image: 'assets/hero/slide-3.jpg',
            tag: 'Limited Time',
            title: 'Bakery & Fresh Produce',
            text: 'Freshly baked and carefully selected produce.'
        },
        {
            image: 'assets/hero/slide-4.jpg',
            tag: 'Powerstar Value',
            title: 'Smart Shopping Starts Here',
            text: 'Trusted by families across our branches.'
        }
    ];

    track.innerHTML = slides.map((s, i) => `
        <div class="slide ${i === 0 ? 'active' : ''}">
            <img class="slide-bg" src="${s.image}" alt="${s.title}">
            <div class="slide-content">
                <span class="offer-tag">${s.tag}</span>
                <h2>${s.title}</h2>
                <p>${s.text}</p>
            </div>
        </div>
    `).join('');
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length < 2) return;

    let index = 0;

    setInterval(() => {
        slides[index].classList.remove('active');
        index = (index + 1) % slides.length;
        slides[index].classList.add('active');
    }, 6000);
}

/* ===============================
   CAREERS — CMS ROLES
================================ */
async function loadCareers() {
    const grid = document.querySelector('.department-grid');
    if (!grid) return;

    try {
        const res = await fetch(`${BASE_PATH}/data/careers.json`);
        if (!res.ok) throw new Error('careers.json missing');

        const data = await res.json();
        const roles = data.professional_roles || [];

        if (!roles.length) {
            grid.innerHTML = `<p>No professional roles available.</p>`;
            return;
        }

        grid.innerHTML = roles.map(job => `
            <div class="dept-card ${job.status === 'filled' ? 'filled' : ''}">
                <span class="dept-label">${job.department || 'General'}</span>
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                ${
                    job.status === 'filled'
                        ? `<span class="btn-filled">Filled</span>`
                        : `<a href="mailto:${job.application_email}" class="btn-job-apply">Apply</a>`
                }
            </div>
        `).join('');

    } catch (err) {
        console.warn('[Careers]', err);
        grid.innerHTML = `<p>Unable to load roles.</p>`;
    }
}

/* ===============================
   ABOUT — CMS CONTENT
================================ */
async function loadAbout() {
    try {
        const res = await fetch(`${BASE_PATH}/data/about.json`);
        if (!res.ok) throw new Error('about.json missing');

        const d = await res.json();

        setText('mission-title', d?.strategic_compass?.mission?.title);
        setText('mission-content', d?.strategic_compass?.mission?.content);
        setText('vision-title', d?.strategic_compass?.vision?.title);
        setText('vision-content', d?.strategic_compass?.vision?.content);
        setText('quality-title', d?.quality_policy?.title);
        setText('quality-desc', d?.quality_policy?.content);

    } catch (err) {
        console.warn('[About]', err);
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
}

/* ===============================
   UI HELPERS
================================ */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav-menu');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}
/* ===============================
   HERO SLIDER INTERACTION
================================ */
function enableHeroSliderClick() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    track.style.cursor = 'pointer';
    track.addEventListener('click', () => {
        window.location.href = 'offers.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    enableHeroSliderClick();
});
