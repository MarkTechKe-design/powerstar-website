/**
 * Powerstar Supermarkets — Unified Main JS
 * Departments + Products Architecture
 * Stable for VS Code + cPanel
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

    if (path === '/' || path.endsWith('index.html') || path.endsWith('/')) {
        await loadSlides();
        await loadDepartmentsHome();
        await loadWhatsNew();
        await loadOffersHome();
    }

    if (path.includes('services.html')) {
        await loadDepartmentsWithProducts();
    }

    if (path.includes('careers.html')) {
        await loadCareers();
    }

    if (path.includes('about.html')) {
        await loadAbout();
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
        const [deptRes, prodRes] = await Promise.all([
            fetch(`${BASE_PATH}/data/departments.json`),
            fetch(`${BASE_PATH}/data/products.json`)
        ]);

        const departments = await deptRes.json();
        const productsData = await prodRes.json();
        const products = productsData.products || [];

        const visibleDepts = departments.filter(d => d.visible);

        /* Render department tabs */
        tabsContainer.innerHTML = visibleDepts.map((d, i) => `
            <button class="dept-tab ${i === 0 ? 'active' : ''}"
                    data-dept="${d.title}">
                ${d.title}
            </button>
        `).join('');

        /* Render initial products */
        renderProducts(visibleDepts[0].title, products, productsContainer);

        /* Tab click handler */
        tabsContainer.addEventListener('click', e => {
            if (!e.target.classList.contains('dept-tab')) return;

            document.querySelectorAll('.dept-tab')
                .forEach(btn => btn.classList.remove('active'));

            e.target.classList.add('active');
            renderProducts(e.target.dataset.dept, products, productsContainer);
        });

    } catch (e) {
        console.error('Departments/products load error:', e);
        productsContainer.innerHTML =
            '<p style="text-align:center;">Unable to load products.</p>';
    }
}

function renderProducts(department, products, container) {
    const filtered = products.filter(p => p.department === department);

    if (filtered.length === 0) {
        container.innerHTML =
            '<p style="text-align:center;">No products available.</p>';
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-card reveal">
            <img src="${p.image}" alt="${p.name}"
                 onerror="this.src='${PLACEHOLDER_IMG}'">
            <h3>${p.name}</h3>
            <p class="price">KSh ${p.price.toLocaleString()}</p>
            <small>${(p.branches || []).join(', ')}</small>
            <button class="btn btn-primary">
                Add to Order
            </button>
        </div>
    `).join('');

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

        grid.innerHTML = data.offers
            .filter(o => o.active)
            .slice(0, 8)
            .map(createOfferCard)
            .join('');
    } catch (e) {
        console.warn('Offers error:', e);
    }
}

function createOfferCard(o) {
    return `
    <div class="offer-card">
        <img src="${o.image}" alt="${o.product_name}"
             onerror="this.src='${PLACEHOLDER_IMG}'">
        ${o.discount_label ? `<span class="discount-badge">${o.discount_label}</span>` : ''}
        <h3>${o.product_name}</h3>
        <div class="price-row">
            ${o.old_price ? `<span class="old-price">${o.old_price}</span>` : ''}
            <span class="new-price">${o.new_price}</span>
        </div>
    </div>`;
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

        grid.innerHTML = data.professional_roles.map(job => `
            <div class="dept-card ${job.status === 'filled' ? 'filled' : ''}">
                <span class="dept-label">${job.department}</span>
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                ${
                    job.status === 'filled'
                        ? '<span class="btn-filled">Filled</span>'
                        : `<a href="mailto:${job.application_email}"
                              class="btn-job-apply">Apply</a>`
                }
            </div>
        `).join('');
    } catch (e) {
        console.warn('Careers error:', e);
    }
}

/* ===============================
   ABOUT
================================ */
async function loadAbout() {
    try {
        const r = await fetch(`${BASE_PATH}/data/about.json`);
        const d = await r.json();

        setText('mission-title', d.strategic_compass.mission.title);
        setText('mission-content', d.strategic_compass.mission.content);
        setText('vision-title', d.strategic_compass.vision.title);
        setText('vision-content', d.strategic_compass.vision.content);
    } catch (e) {
        console.warn('About error:', e);
    }
}

function setText(id, txt) {
    const el = document.getElementById(id);
    if (el && txt) el.textContent = txt;
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
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('active');
        }
    });
}

function initPromoSlider() {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    let i = 0;
    setInterval(() => {
        slides.forEach(s => s.classList.remove('active'));
        slides[i].classList.add('active');
        i = (i + 1) % slides.length;
    }, 5000);
}
/* =========================================================
   PRODUCTS & DEPARTMENTS SYSTEM (CORE ENGINE)
   ========================================================= */

/**
 * Loads all departments with products on services.html
 */
async function loadDepartmentProducts() {
    const container = document.getElementById('departments-grid');
    if (!container) return;

    try {
        const res = await fetch(`${BASE_PATH}/data/products.json?v=${Date.now()}`);
        if (!res.ok) throw new Error('products.json not found');

        const data = await res.json();
        const departments = data.departments || [];

        if (departments.length === 0) {
            container.innerHTML = `<p>No departments available.</p>`;
            return;
        }

        container.innerHTML = departments.map(renderDepartmentBlock).join('');

        initCartButtons();

    } catch (err) {
        console.error('[Products]', err);
        container.innerHTML = `<p>Unable to load products.</p>`;
    }
}

/**
 * Render one department section
 */
function renderDepartmentBlock(dept) {
    return `
        <section class="department-section reveal" data-dept="${dept.id}">
            <h2 class="department-title">${dept.title}</h2>

            <div class="products-grid">
                ${
                    dept.products && dept.products.length
                        ? dept.products.map(renderProductCard).join('')
                        : `<p class="muted">No products listed.</p>`
                }
            </div>
        </section>
    `;
}

/**
 * Render individual product card
 */
function renderProductCard(p) {
    const price = p.offer_price ?? p.price;
    const hasOffer = p.offer_price !== null;

    return `
        <div class="product-card" data-id="${p.id}">
            ${p.tag ? `<span class="product-tag ${p.tag.toLowerCase()}">${p.tag}</span>` : ''}

            <img src="${p.image}" alt="${p.name}"
                 onerror="this.src='${PLACEHOLDER_IMG}'">

            <h3>${p.name}</h3>

            <div class="price-row">
                ${hasOffer ? `<span class="old-price">KES ${p.price}</span>` : ''}
                <span class="new-price">KES ${price}</span>
            </div>

            <small class="branch-note">
                Available: ${Array.isArray(p.branches) ? p.branches.join(', ') : p.branches}
            </small>

            <div class="qty-row">
                <button class="qty-btn minus">−</button>
                <input type="number" value="1" min="1" max="${p.max_qty || 99}">
                <button class="qty-btn plus">+</button>
            </div>

            <button class="btn btn-primary add-to-cart"
                data-name="${p.name}"
                data-price="${price}">
                Add to Order
            </button>
        </div>
    `;
}
/* =========================================================
   CART & WHATSAPP ORDER SYSTEM
   ========================================================= */

let cart = [];

function initCartButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
        const minus = card.querySelector('.minus');
        const plus = card.querySelector('.plus');
        const input = card.querySelector('input');
        const btn = card.querySelector('.add-to-cart');

        minus.onclick = () => input.value = Math.max(1, input.value - 1);
        plus.onclick = () => input.value = +input.value + 1;

        btn.onclick = () => {
            addToCart(
                btn.dataset.name,
                +btn.dataset.price,
                +input.value
            );
        };
    });
}

function addToCart(name, price, qty) {
    const existing = cart.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    alert(`${name} added to order`);
}

/**
 * Generates WhatsApp message
 */
function generateWhatsAppMessage(branch) {
    let total = 0;

    const items = cart.map(item => {
        const sub = item.qty * item.price;
        total += sub;
        return `• ${item.name} × ${item.qty} @ KES ${item.price} = KES ${sub}`;
    }).join('\n');

    return `
NEW ORDER – Powerstar Supermarkets
--------------------------------
Branch: ${branch}

Items:
${items}

TOTAL: KES ${total}

Source: Website
--------------------------------
    `;
}

