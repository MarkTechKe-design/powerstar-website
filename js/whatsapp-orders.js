/* ======================================================
   POWERSTAR WHATSAPP ORDERING – v2 (QUANTITY ENABLED)
   ====================================================== */

const ORDER_KEY = "powerstar_order";

/* ---------- STORAGE ---------- */
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

/* ---------- FORMAT ---------- */
function formatKES(amount) {
    return "KES " + amount.toLocaleString();
}

/* ---------- ADD ITEM (from departments later) ---------- */
window.addToOrder = function (name, price, qty = 1) {
    const order = getOrder();
    const item = order.items.find(i => i.name === name);

    if (item) {
        item.qty += qty;
    } else {
        order.items.push({ name, price, qty });
    }

    saveOrder(order);
};

/* ---------- UPDATE QTY ---------- */
function updateQty(name, delta) {
    const order = getOrder();
    const item = order.items.find(i => i.name === name);
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        order.items = order.items.filter(i => i.name !== name);
    }

    saveOrder(order);
    renderOrderSummary();
}

/* ---------- RENDER ORDER ---------- */
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
            <ul class="order-list">${rows}</ul>
            <hr>
            <p class="order-total"><strong>TOTAL:</strong> ${formatKES(total)}</p>

            <label>
                Your Name
                <input id="customer-name" placeholder="Enter your name" />
            </label>
        </div>
    `;
}

/* ---------- WHATSAPP SEND ---------- */
document.addEventListener("click", function (e) {
    const btn = e.target.closest(".whatsapp-order");
    if (!btn) return;

    e.preventDefault();

    const branch = btn.dataset.branch;
    const phone = btn.dataset.phone;
    const order = getOrder();

    const nameInput = document.getElementById("customer-name");
    if (nameInput?.value.trim()) {
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
    message += `Branch: ${branch}\n\nItems:\n`;

    order.items.forEach(item => {
        const lineTotal = item.price * item.qty;
        total += lineTotal;
        message += `• ${item.name} × ${item.qty} @ KES ${item.price} = KES ${lineTotal}\n`;
    });

    message += `\nTOTAL: KES ${total.toLocaleString()}\n\n`;
    message += `Customer: ${order.customer || "Not provided"}\n`;
    message += `Source: ${order.source}\n`;
    message += `--------------------------------`;

    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
});

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderOrderSummary);