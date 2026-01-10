/**
 * Powerstar Supermarkets — Unified Main JS
 * STABLE CORE
 * Corporate-grade | GitHub Pages + cPanel safe
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
        enableHeroSliderClick();
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
const deptQtyState = {};

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

    container.innerHTML = dept.products.map(p => {
        const key = p.id || p.name;

        if (!deptQtyState[key]) {
            deptQtyState[key] = 1;
        }

        return `
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
                    <span class="new-price">
                        KES ${parseKES(p.offer_price ?? p.price)}
                    </span>
                </div>

                <small>${Array.isArray(p.branches) ? p.branches.join(', ') : ''}</small>

                <!-- INLINE QTY -->
                <div class="qty-inline">
                    <button onclick="changeDeptQty('${key}', -1)">−</button>
                    <span id="qty-${key}">${deptQtyState[key]}</span>
                    <button onclick="changeDeptQty('${key}', 1)">+</button>
                </div>

                <button class="btn btn-primary"
                    onclick="addDeptProduct('${p.name}', ${Number(p.offer_price ?? p.price)}, '${key}')">
                    Add to Order
                </button>
            </div>
        `;
    }).join('');
}

/* ===============================
   INLINE QTY HANDLERS
================================ */
window.changeDeptQty = function (key, delta) {
    deptQtyState[key] = Math.max(1, (deptQtyState[key] || 1) + delta);
    const el = document.getElementById(`qty-${key}`);
    if (el) el.textContent = deptQtyState[key];
};

window.addDeptProduct = function (name, price, key) {
    const qty = deptQtyState[key] || 1;

    if (typeof window.addToOrder === 'function') {
        window.addToOrder(name, price, qty);
    }

    deptQtyState[key] = 1;
    const el = document.getElementById(`qty-${key}`);
    if (el) el.textContent = 1;

    alert(`${name} added to order (${qty})`);
};

/* ===============================
   HOME — OFFERS GRID (DISPLAY ONLY)
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

                    <button class="btn" disabled>Order from Departments</button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.warn('[Offers]', err);
        grid.innerHTML = `<p>Unable to load offers.</p>`;
    }
}

/* ===============================
   HOME HERO SLIDER
================================ */
function loadHomeSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const slides = [
        { image: 'assets/hero/slide-1.jpg', tag: 'Weekly Deal', title: 'Fresh Groceries, Better Prices', text: 'Quality essentials sourced daily.' },
        { image: 'assets/hero/slide-2.jpg', tag: 'Hot Offer', title: 'Unbeatable Household Deals', text: 'Save more on essentials.' },
        { image: 'assets/hero/slide-3.jpg', tag: 'Limited Time', title: 'Bakery & Fresh Produce', text: 'Freshly baked and selected.' },
        { image: 'assets/hero/slide-4.jpg', tag: 'Powerstar Value', title: 'Smart Shopping Starts Here', text: 'Trusted across our branches.' }
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

function enableHeroSliderClick() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    track.style.cursor = 'pointer';
    track.addEventListener('click', () => {
        window.location.href = 'offers.html';
    });
}

/* ===============================
   CAREERS / ABOUT / UI
================================ */
async function loadCareers() { /* unchanged */ }
async function loadAbout() { /* unchanged */ }

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav-menu');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => nav.classList.toggle('active'));
}