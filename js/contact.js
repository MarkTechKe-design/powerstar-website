/**
 * Powerstar Supermarkets - Contact Page Logic
 * Handles WhatsApp Redirection for Customer and Vendor forms.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initContactForms();
});

function initContactForms() {
    // --- Configuration ---
    const CONTACTS = {
        HEAD_OFFICE: "254790680038", // Default Fallback
        SALES_TEAM: "254706246939",   // For Vendors
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

    /**
     * Helper to open WhatsApp
     * @param {string} phone - The recipient number
     * @param {string} text - The message body
     */
    const openWhatsApp = (phone, text) => {
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // --- 1. Customer Feedback Handler ---
    const custForm = document.getElementById('customerForm');
    if (custForm) {
        custForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect Data
            const branch = document.getElementById('custBranch').value;
            const name = document.getElementById('custName').value.trim();
            const message = document.getElementById('custMessage').value.trim();

            if (!name || !message) {
                alert("Please fill in all fields.");
                return;
            }

            // Determine Number
            const targetNumber = CONTACTS.BRANCHES[branch] || CONTACTS.HEAD_OFFICE;

            // Build Message
            const msg = `*Customer Feedback*\n` +
                `----------------\n` +
                `Branch: ${branch}\n` +
                `Name: ${name}\n` +
                `Message: ${message}`;

            openWhatsApp(targetNumber, msg);
        });
    }

    // --- 2. Vendor Inquiry Handler ---
    const vendForm = document.getElementById('vendorForm');
    if (vendForm) {
        vendForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect Data
            const company = document.getElementById('vendCompany').value.trim();
            const type = document.getElementById('vendType').value;
            const message = document.getElementById('vendMessage').value.trim();

            if (!company || !message) {
                alert("Please fill in all fields.");
                return;
            }

            // Build Message
            const msg = `*Supplier Inquiry*\n` +
                `----------------\n` +
                `Company: ${company}\n` +
                `Type: ${type}\n` +
                `Details: ${message}`;

            openWhatsApp(CONTACTS.SALES_TEAM, msg);
        });
    }
}
