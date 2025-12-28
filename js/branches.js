/**
 * Powerstar Branch Locator
 * Using Leaflet.js for interactive mapping
 */

'use strict';

document.addEventListener('DOMContentLoaded', initMap);

let map;
let markers = [];

function initMap() {
    // 1. Initialize Map centered on approximate center of branches (Nairobi area + surrounds)
    // Coords roughly between Nai, Naivasha, Kitengela, Kangari
    // Center: -1.100, 36.800, Zoom: 9
    map = L.map('map').setView([-1.100, 36.800], 9);

    // 2. Add OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3. Parse Branch Items
    const branchItems = document.querySelectorAll('.branch-item');

    // Custom Icon (Default Leaflet for now)
    const psIcon = L.icon({
        iconUrl: 'assets/logo.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    branchItems.forEach(item => {
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);
        const name = item.dataset.name;
        const phone = item.dataset.phone;
        const whatsapp = item.dataset.whatsapp;
        const hours = item.dataset.hours;

        if (lat && lng) {
            // Create Marker
            const marker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`
                    <div style="text-align:center;">
                        <h4 style="margin:0 0 5px 0; color: #005528;">${name}</h4>
                        <p style="margin:0 0 5px 0; font-size:0.9rem;">${hours}</p>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" style="color: #005528; font-weight:bold; margin-right:10px;">Get Directions</a>
                        <a href="https://wa.me/${whatsapp}" target="_blank" style="color: #25D366; font-weight:bold;">WhatsApp</a>
                    </div>
                `);

            // Add click listener to highlight list item
            marker.on('click', () => {
                highlightListItem(item);
                // Also scroll into view
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            markers.push({
                marker: marker,
                element: item,
                name: name.toLowerCase()
            });

            // "View Map" Button Logic
            const locateBtn = item.querySelector('[data-action="locate"]');
            if (locateBtn) {
                locateBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent bubbling if we add row click later
                    map.setView([lat, lng], 14);
                    marker.openPopup();
                    highlightListItem(item);

                    // Scroll to map on mobile
                    if (window.innerWidth < 991) {
                        document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    });

    // Search Functionality
    const searchInput = document.getElementById('branchSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            branchItems.forEach(item => {
                const name = item.dataset.name.toLowerCase();
                if (name.includes(term)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

function highlightListItem(activeItem) {
    // Remove active class from all
    document.querySelectorAll('.branch-item').forEach(item => item.classList.remove('active'));
    // Add to current
    activeItem.classList.add('active');
}

// Global function (optional backup)
window.focusOnBranch = function (lat, lng) {
    if (map) {
        map.setView([lat, lng], 14);
    }
};
