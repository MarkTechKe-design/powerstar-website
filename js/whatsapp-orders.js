/* ======================================================
   POWERSTAR WHATSAPP ORDER ENGINE — v3 (PRODUCTION)
   ====================================================== */

const ORDER_KEY = "powerstar_order";

/* ===============================
   STORAGE
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

/* ===============================
   FORMATTERS
================================ */
function formatKES(amount) {
    return "KES " + Number(amount).toLocaleString();
}

/* ===============================
   ADD TO ORDER (FROM DEPARTMENTS)
================================ */
window.addToOrder = function (name, price, qty = 1) {
    const order = getOrder();
    const existing = order.items.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        order.items.push({
            name,
            price,
            qty
        });
    }

    saveOrder(order);
    updateOrderBadge();
};

/* ===============================
   UPDATE QUANTITY (ORDER PAGE)
================================ */
window.updateQty = function (name, delta) {
    const order = getOrder();
    const item = order.items.find(i => i.name === name);
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        order.items = order.items.filter(i => i.name !== name);
    }

    saveOrder(order);
    renderOrderSummary();
    updateOrderBadge();
};

/* ===============================
   RENDER ORDER (order.html)
================================ */
function renderOrderSummary() {
    const container = document.getElementById("order-summary");
    if (!container) return;

    const order = getOrder();

    if (!order.items.length) {
        container.innerHTML = `
            <p style="text-align:center;color:#777;">
                No items added yet.
            </p>
        `;
        return;
    }

    let total = 0;

    const rows = order.items.map(item => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;

        return `
            <li class="order-row">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${formatKES(item.price)} each</small>
                </div>

                <div class="qty-controls">
                    <button onclick="updateQty('${item.name}', -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty('${item.name}', 1)">+</button>
                </div>

                <div class="line-total">
                    ${formatKES(lineTotal)}
                </div>
            </li>
        `;
    }).join("");

    container.innerHTML = `
        <div class="receipt-box">
            <h3>Your Order</h3>

            <ul class="order-list">
                ${rows}
            </ul>

            <hr>

            <p class="order-total">
                <strong>TOTAL:</strong> ${formatKES(total)}
            </p>

            <label>
                Your Name
                <input
                    id="customer-name"
                    placeholder="Enter your name"
                    value="${order.customer || ''}"
                />
            </label>
        </div>
    `;
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
        alert("Please add items before ordering.");
        return;
    }

    let total = 0;

    let message = `NEW ORDER – Powerstar Supermarkets\n`;
    message += `--------------------------------\n`;
    message += `Branch: ${branch}\n\n`;
    message += `Items:\n`;

    order.items.forEach(item => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        message += `• ${item.name} × ${item.qty} @ KES ${item.price} = KES ${lineTotal}\n`;
    });

    message += `\nTOTAL: KES ${total.toLocaleString()}\n\n`;
    message += `Customer: ${order.customer || "Not provided"}\n`;
    message += `Source: ${order.source}\n`;
    message += `--------------------------------`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
});

/* ===============================
   VIEW ORDER BADGE (OPTIONAL)
================================ */
function updateOrderBadge() {
    const order = getOrder();
    const count = order.items.reduce((sum, i) => sum + i.qty, 0);

    const badge = document.getElementById("order-count");
    const btn = document.getElementById("view-order-btn");

    if (!badge || !btn) return;

    if (count > 0) {
        badge.textContent = count;
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
    renderOrderSummary();
    updateOrderBadge();
});
