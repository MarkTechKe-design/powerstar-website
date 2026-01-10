/* ======================================================
   POWERSTAR WHATSAPP ORDERING – v1 (STABLE)
   ====================================================== */

const ORDER_KEY = "powerstar_order";

/* ---------- UTILITIES ---------- */
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
    return "KES " + amount.toLocaleString();
}

/* ---------- ADD ITEM (USED BY OTHER PAGES LATER) ---------- */
window.addToOrder = function (name, price, qty = 1) {
    const order = getOrder();
    const existing = order.items.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        order.items.push({ name, price, qty });
    }

    saveOrder(order);
};

/* ---------- RENDER RECEIPT ON order.html ---------- */
function renderOrderSummary() {
    const container = document.getElementById("order-summary");
    if (!container) return;

    const order = getOrder();

    if (!order.items.length) {
        container.innerHTML = `
            <p style="color:#666;text-align:center;">
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
            <ul>${rows}</ul>
            <hr>
            <p><strong>TOTAL:</strong> ${formatKES(total)}</p>

            <label style="display:block;margin-top:10px;">
                Your Name
                <input type="text" id="customer-name"
                       placeholder="Enter your name"
                       style="width:100%;padding:10px;margin-top:5px;">
            </label>
        </div>
    `;
}

/* ---------- WHATSAPP HANDOFF ---------- */
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

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", renderOrderSummary);