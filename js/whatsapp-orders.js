/* ======================================================
   POWERSTAR WHATSAPP ORDERING – v1.1 (STABLE)
   Receipt-based WhatsApp Ordering
   ====================================================== */

'use strict';

const ORDER_KEY = "powerstar_order";

/* ===============================
   STORAGE UTILITIES
================================ */
function getOrder() {
    return JSON.parse(localStorage.getItem(ORDER_KEY)) || {
        customer: "",
        source: "Website",
        items: []
    };
}

function saveOrder(order) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function formatKES(amount) {
    return "KES " + Number(amount).toLocaleString();
}

/* ===============================
   ADD ITEM (CALLED FROM PRODUCT PAGES)
================================ */
window.addToOrder = function (name, price, qty = 1) {
    const order = getOrder();
    const existing = order.items.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        order.items.push({
            name,
            price: Number(price),
            qty: Number(qty)
        });
    }

    saveOrder(order);
};

/* ===============================
   RENDER ORDER SUMMARY (order.html)
================================ */
function renderOrderSummary() {
    const container = document.getElementById("order-summary");
    if (!container) return;

    const order = getOrder();

    if (!order.items.length) {
        container.innerHTML = `
            <p style="text-align:center;color:#666;">
                No items selected yet. Please add products before ordering.
            </p>
        `;
        return;
    }

    let total = 0;

    const rows = order.items.map(item => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;

        return `
            <li>
                ${item.name} × ${item.qty} @ ${formatKES(item.price)}
                <strong style="float:right;">${formatKES(lineTotal)}</strong>
            </li>
        `;
    }).join("");

    container.innerHTML = `
        <div class="receipt-box">
            <h3>Your Order</h3>

            <ul class="receipt-items">
                ${rows}
            </ul>

            <hr>

            <p class="receipt-total">
                <strong>TOTAL:</strong> ${formatKES(total)}
            </p>

            <label class="receipt-customer">
                Your Name
                <input
                    type="text"
                    id="customer-name"
                    placeholder="Enter your name"
                    value="${order.customer || ""}"
                >
            </label>
        </div>
    `;
}

/* ===============================
   BUILD WHATSAPP RECEIPT MESSAGE
================================ */
function buildWhatsAppMessage(branch) {
    const order = getOrder();
    let total = 0;

    const itemsText = order.items.map(item => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        return `• ${item.name} × ${item.qty} @ KES ${item.price.toLocaleString()} = KES ${lineTotal.toLocaleString()}`;
    }).join('\n');

    return `
NEW ORDER – Powerstar Supermarkets
--------------------------------
Branch: ${branch}

Items:
${itemsText}

TOTAL: KES ${total.toLocaleString()}

Customer: ${order.customer || "Not provided"}
Source: ${order.source}
--------------------------------
`.trim();
}

/* ===============================
   WHATSAPP HANDOFF (BRANCH CLICK)
================================ */
document.addEventListener("click", function (e) {
    const btn = e.target.closest(".whatsapp-order");
    if (!btn) return;

    e.preventDefault();

    const branch = btn.dataset.branch;
    const phone = btn.dataset.phone;

    const order = getOrder();
    const nameInput = document.getElementById("customer-name");

    if (nameInput && nameInput.value.trim()) {
        order.customer = nameInput.value.trim();
        saveOrder(order);
    }

    if (!order.items.length) {
        alert("Please add items to your order first.");
        return;
    }

    const message = buildWhatsAppMessage(branch);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
});

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", renderOrderSummary);
