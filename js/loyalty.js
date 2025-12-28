/**
 * Powerstar Supermarkets - Loyalty Page Logic
 * Handles WhatsApp Registration for Loyalty Program
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initLoyaltyForm();
});

function initLoyaltyForm() {
    const loyaltyForm = document.getElementById('loyaltyForm');
    if (!loyaltyForm) return;

    // --- Configuration ---
    const CONTACTS = {
        HEAD_OFFICE: "254790680038",
        BRANCHES: {
            "Kasarani HQ": "254790680038",
            "Joska": "254791047850",
            "Kangari": "254710976254",
            "Naivasha": "254768016429",
            "Kitengela": "254704121122",
            "Kikuyu": "254741251973",
            "Kinoo": "254795459026",
            "Ruiru Mini": "254724588900",
            "Ruiru Jambo": "254728020018",
            "Zimmerman Base": "254707881200",
            "Zimmerman Express": "254701231370"
        }
    };

    loyaltyForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Gather Data
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const nationalId = document.getElementById('nationalId').value.trim();
        const dob = document.getElementById('dob').value;
        const branchKey = document.getElementById('branch').value;
        const status = document.getElementById('loyaltyStatus');

        // 2. Validation
        if (!fullName || !phone || !nationalId || !branchKey) {
            alert('Please fill in all required fields.');
            return;
        }

        // 3. Determine Recipient
        const targetNumber = CONTACTS.BRANCHES[branchKey] || CONTACTS.HEAD_OFFICE;

        // 4. Build WhatsApp Message
        const msg = `*New Loyalty Registration*\n` +
            `------------------\n` +
            `Name: ${fullName}\n` +
            `Phone: ${phone}\n` +
            `ID No: ${nationalId}\n` +
            `DOB: ${dob}\n` +
            `Preferred Branch: ${branchKey}`;

        const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`;

        // 5. Visual Feedback & Redirect
        if (status) {
            status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            status.style.display = 'block';
            status.style.color = 'var(--ps-green)';
        }

        setTimeout(() => {
            window.open(url, '_blank');
            if (status) {
                status.innerHTML = '<i class="fas fa-check-circle"></i> Opening WhatsApp...';
                // Optional: Clear form after delay
                // loyaltyForm.reset(); 
            }
        }, 1000);
    });
}
