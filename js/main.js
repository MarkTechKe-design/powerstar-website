/**
 * Powerstar Supermarkets — Unified Main JS
 * Single Source of Truth
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

    /* HOME PAGE */
    if (
        path === '/' ||
        path.endsWith('index.html') ||
        path.endsWith('/')
    ) {
        await loadSlides();
        await loadDepartmentsHome();
        await loadWhatsNew();
        await loadOffersHome();
    }

    /* DEPARTMENTS PAGE */
    if (path.includes('services.html')) {
        await loadDepartmentsAll();
    }

    /* OFFERS PAGE */
    if (path.includes('offers.html')) {
        await loadOffersAll();
    }

    /* CAREERS PAGE */
    if (path.includes('careers.html')) {
        await loadCareers();
    }

    /* ABOUT PAGE */
    if (path.includes('about.html')) {
        await loadAbout();
    }
});

/* ===============================
   SLIDER
================================ */
async function loadSlides() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    try {
        const r = await fetch(`${BASE_PATH}/data/slides.json?v=${Date.now()}`);
        const slides = await r.json();

        track.innerHTML = '';

        slides
            .filter(s => s.active)
            .forEach((slide, i) => {
                track.insertAdjacentHTML(
                    'beforeend',
                    `
                <div class="slide ${i === 0 ? 'active' : ''}">
                    <img src="${slide.image}" alt="${slide.title}"
                         onerror="this.src='${PLACEHOLDER_IMG}'">
                    <div class="slide-content">
                        <span>${slide.subtitle || ''}</span>
                        <h2>${slide.title}</h2>
                        <a href="${slide.button_link || '#'}"
                           class="btn btn-primary">
                           ${slide.button_text || 'Learn More'}
                        </a>
                    </div>
                </div>
                `
                );
            });

        initPromoSlider();
    } catch (e) {
        console.warn('Slides failed:', e);
    }
}

/* ===============================
   DEPARTMENTS — HOME
================================ */
async function loadDepartmentsHome() {
    const container = document.getElementById('landing-departments-grid');
    if (!container) return;

    try {
        const r = await fetch(`${BASE_PATH}/data/departments.json`);
        const depts = await r.json();

        const featured = depts.filter(
            d => d.visible && d.onLanding
        );

        container.innerHTML = featured
            .slice(0, 6)
            .map(
                d => `
            <a href="services.html" class="quick-card">
                <div class="quick-icon">
                    <i class="fas ${d.icon || 'fa-store'}"></i>
                </div>
                <span>${d.title}</span>
            </a>`
            )
            .join('');
    } catch (e) {
        console.warn('Home departments error:', e);
    }
}

/* ===============================
   DEPARTMENTS — ALL
================================ */
async function loadDepartmentsAll() {
    const container = document.getElementById('departments-grid');
    if (!container) return;

    try {
        const r = await fetch(`${BASE_PATH}/data/departments.json`);
        const depts = await r.json();

        container.innerHTML = depts
            .filter(d => d.visible)
            .map(
                d => `
            <div class="dept-card reveal">
                <img src="${d.image}" alt="${d.title}"
                     onerror="this.src='${PLACEHOLDER_IMG}'">
                <div class="card-content">
                    <h3>${d.title}</h3>
                    <p>${d.description}</p>
                    ${d.note ? `<small>${d.note}</small>` : ''}
                    <a href="order.html" class="dept-btn">
                        Order on WhatsApp
                    </a>
                </div>
            </div>`
            )
            .join('');
    } catch (e) {
        console.warn('Departments error:', e);
    }
}

/* ===============================
   OFFERS — HOME
================================ */
async function loadOffersHome() {
    const grid = document.getElementById('weekly-offers-grid');
    if (!grid) return;

    try {
        const r = await fetch(`${BASE_PATH}/data/offers.json`);
        const data = await r.json();

        const offers = data.offers.filter(o => o.active);

        grid.innerHTML = offers
            .slice(0, 8)
            .map(createOfferCard)
            .join('');
    } catch (e) {
        console.warn('Home offers error:', e);
    }
}

/* ===============================
   OFFERS — ALL
================================ */
async function loadOffersAll() {
    const grid = document.getElementById('all-offers-grid');
    if (!grid) return;

    try {
        const r = await fetch(`${BASE_PATH}/data/offers.json`);
        const data = await r.json();

        grid.innerHTML = data.offers
            .filter(o => o.active)
            .map(createOfferCard)
            .join('');
    } catch (e) {
        console.warn('Offers page error:', e);
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
        <small>${o.branches}</small>
        <a href="order.html" class="btn btn-primary btn-block">
            Order Now
        </a>
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

        grid.innerHTML = data.professional_roles
            .map(
                job => `
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
            </div>`
            )
            .join('');
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
    const reveal = () =>
        els.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });

    window.addEventListener('scroll', reveal);
    reveal();
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
