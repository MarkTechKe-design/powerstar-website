/**
 * Powerstar Supermarkets — Unified Main JS
 * Departments + Products Architecture
 * STABLE & ERROR-SAFE
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
document.addEventListener('DOMContentLoaded', async () => {
    initMobileMenu();
    initScrollReveal();

    const path = window.location.pathname;

    if (path.includes('services.html')) {
        await loadDepartmentsWithProducts();
    }

    if (path.includes('careers.html')) {
        await loadCareers();
    }

    if (path.includes('about.html')) {
        await loadAbout();
    }

    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        await loadOffersHome();
    }
});

/* ===============================
   DEPARTMENTS + PRODUCTS
================================ */
async function loadDepartmentsWithProducts() {
    const tabsContainer = document.getElementById('department-tabs');
    const productsContainer = document.getElementById('products-grid');

    if (!tabsContainer || !productsContainer) return;

    try {
        const res = await fetch(`${BASE_PATH}/data/products.json`);
        const data = await res.json();
        const departments = data.departments || [];

        if (!departments.length) {
            productsContainer.innerHTML = `<p>No products available.</p>`;
            return;
        }

        tabsContainer.innerHTML = departments.map((d, i) => `
            <button class="dept-tab ${i === 0 ? 'active' : ''}" data-id="${d.id}">
                ${d.title}
            </button>
        `).join('');

        renderDepartmentProducts(departments[0], productsContainer);

        tabsContainer.onclick = e => {
            if (!e.target.classList.contains('dept-tab')) return;
            document.querySelectorAll('.dept-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const dept = departments.find(d => d.id === e.target.dataset.id);
            renderDepartmentProducts(dept, productsContainer);
        };

    } catch (err) {
        console.error(err);
        productsContainer.innerHTML = `<p>Failed to load products.</p>`;
    }
}

function renderDepartmentProducts(dept, container) {
    if (!dept || !dept.products?.length) {
        container.innerHTML = `<p>No products in this department.</p>`;
        return;
    }

    container.innerHTML = dept.products.map(p => {
        const price = Number(p.offer_price ?? p.price);

        return `
            <div class="product-card reveal">
                <img src="${p.image}" alt="${p.name}"
                     onerror="this.src='${PLACEHOLDER_IMG}'">

                <h3>${p.name}</h3>

                <div class="price-row">
                    ${p.offer_price ? `<span class="old-price">KES ${Number(p.price).toLocaleString()}</span>` : ''}
                    <span class="new-price">KES ${price.toLocaleString()}</span>
                </div>

                <small>${(p.branches || []).join(', ')}</small>

                <button class="btn btn-primary">Add to Order</button>
            </div>
        `;
    }).join('');

    initScrollReveal();
}

/* ===============================
   OFFERS — HOME ONLY
================================ */
async function loadOffersHome() {
    const grid = document.getElementById('weekly-offers-grid');
    if (!grid) return;

    try {
        const r = await fetch(`${BASE_PATH}/data/offers.json`);
        const data = await r.json();

        grid.innerHTML = (data.offers || [])
            .filter(o => o.active)
            .slice(0, 6)
            .map(o => `
                <div class="offer-card">
                    <img src="${o.image}" alt="${o.product_name}"
                         onerror="this.src='${PLACEHOLDER_IMG}'">
                    <h3>${o.product_name}</h3>
                    <span class="new-price">KES ${Number(o.new_price).toLocaleString()}</span>
                </div>
            `)
            .join('');
    } catch (e) {
        console.warn('Offers failed', e);
    }
}

/* ===============================
   CAREERS
================================ */
async function loadCareers() {
    const grid = document.querySelector('.department-grid');
    if (!grid) return;

    try {
        const r = await fetch(`${BASE_PATH}/data/careers.json`);
        const data = await r.json();
        const roles = data.professional_roles || data.professional || [];

        grid.innerHTML = roles.map(job => `
            <div class="dept-card ${job.status === 'filled' ? 'filled' : ''}">
                <span class="dept-label">${job.department || 'General'}</span>
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                ${
                    job.status === 'filled'
                        ? '<span class="btn-filled">Filled</span>'
                        : `<a href="mailto:${job.application_email}" class="btn-job-apply">Apply</a>`
                }
            </div>
        `).join('');
    } catch (e) {
        console.warn('Careers error', e);
    }
}

/* ===============================
   ABOUT
================================ */
async function loadAbout() {
    try {
        const r = await fetch(`${BASE_PATH}/data/about.json`);
        const d = await r.json();

        setText('mission-title', d?.strategic_compass?.mission?.title);
        setText('mission-content', d?.strategic_compass?.mission?.content);
        setText('vision-title', d?.strategic_compass?.vision?.title);
        setText('vision-content', d?.strategic_compass?.vision?.content);
        setText('quality-title', d?.quality_policy?.title);
        setText('quality-desc', d?.quality_policy?.content);

    } catch (e) {
        console.warn('About error', e);
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
}

/* ===============================
   UI HELPERS
================================ */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav-menu');
    if (!btn || !nav) return;
    btn.onclick = () => nav.classList.toggle('active');
}

function initScrollReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('active');
        }
    });
}