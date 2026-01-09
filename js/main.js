/**
 * Powerstar Supermarkets — Unified Main JS
 * STABLE CORE (No WhatsApp ordering yet)
 * Safe for GitHub Pages + cPanel
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
    initScrollReveal();

    const path = window.location.pathname;

    if (path === '/' || path.endsWith('/') || path.endsWith('index.html')) {
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

            document.querySelectorAll('.dept-tab')
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

    container.innerHTML = dept.products.map(p => {
        const price = Number(p.offer_price ?? p.price);

        return `
            <div class="product-card reveal">
                <img src="${p.image}"
                     alt="${p.name}"
                     onerror="this.src='${PLACEHOLDER_IMG}'">

                <h3>${p.name}</h3>

                <div class="price-row">
                    ${
                        p.offer_price
                            ? `<span class="old-price">KES ${Number(p.price).toLocaleString()}</span>`
                            : ''
                    }
                    <span class="new-price">KES ${price.toLocaleString()}</span>
                </div>

                <small>${Array.isArray(p.branches) ? p.branches.join(', ') : ''}</small>

                <button class="btn btn-primary" disabled>
                    Ordering Coming Soon
                </button>
            </div>
        `;
    }).join('');

    initScrollReveal();
}

/* ===============================
   HOME — OFFERS ONLY
================================ */
async function loadOffersHome() {
    const grid = document.getElementById('weekly-offers-grid');
    if (!grid) return;

    try {
        const res = await fetch(`${BASE_PATH}/data/offers.json`);
        if (!res.ok) throw new Error('offers.json missing');

        const data = await res.json();
        const offers = data.offers || [];

        grid.innerHTML = offers
            .filter(o => o.active)
            .slice(0, 6)
            .map(o => `
                <div class="offer-card">
                    <img src="${o.image}"
                         alt="${o.product_name}"
                         onerror="this.src='${PLACEHOLDER_IMG}'">
                    <h3>${o.product_name}</h3>
                    <span class="new-price">
                        KES ${Number(o.new_price).toLocaleString()}
                    </span>
                </div>
            `).join('');

    } catch (err) {
        console.warn('[Offers]', err);
        grid.innerHTML = `<p>Unable to load offers.</p>`;
    }
}

/* ===============================
   CAREERS — PROFESSIONAL ROLES (CMS)
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

function initScrollReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
            el.classList.add('active');
        }
    });
}
