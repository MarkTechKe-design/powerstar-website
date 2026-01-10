'use strict';

/* ===============================
   POWERSTAR ORDER ENGINE
================================ */
const ORDER_KEY = 'ps_order';

function getOrder() {
    return JSON.parse(localStorage.getItem(ORDER_KEY)) || {
        items: [],
        customer: ''
    };
}

function saveOrder(order) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

/* ===============================
   ADD ITEM
================================ */
document.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-order');
    if (!btn) return;

    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);

    const order = getOrder();
    const existing = order.items.find(i => i.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        order.items.push({
            id,
            name,
            price,
            qty: 1
        });
    }

    saveOrder(order);
    btn.textContent = 'ADDED ✓';
    btn.disabled = true;
});
