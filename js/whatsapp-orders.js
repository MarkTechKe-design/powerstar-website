/**
 * WhatsApp Order Intelligence v2
 * centralized handling for all "Order on WhatsApp" buttons.
 * Generates Order ID, captures device info, and formats professional messages.
 * Optional integration with GA4 (if present).
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons with the specific class
    const whatsappButtons = document.querySelectorAll('.whatsapp-order');

    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Capture Base Data from Attributes
            const branch = button.dataset.branch || 'Unknown Branch';
            const phone = button.dataset.phone;
            // Use data-page if set, otherwise fallback to document title, then 'Website'
            const page = button.dataset.page || document.title || 'Website';
            const offer = button.dataset.offer || null;

            if (!phone) {
                console.error('WhatsApp phone number missing on element:', button);
                return; // Graceful exit
            }

            // 2. Generate Intelligence Data
            const orderId = 'PS-ORD-' + Math.floor(10000 + Math.random() * 90000); // 5-digit random ID
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const deviceType = isMobile ? 'Mobile' : 'Desktop';
            const timestamp = new Date().toLocaleString('en-KE', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            });

            // 3. Construct Professional WhatsApp Message
            // Using *Bold* wrapper for WhatsApp formatting
            let message = `*NEW ORDER INQUIRY* %0A`;
            message += `--------------------------------%0A`;
            message += `*Branch:* ${branch}%0A`;
            message += `*Order Ref:* ${orderId}%0A`;
            message += `*Time:* ${timestamp}%0A`;
            message += `*Source:* Website (${deviceType})%0A`;
            if (offer) {
                message += `*Offer:* ${offer}%0A`;
            }
            message += `--------------------------------%0A%0A`;
            message += `Hello, I would like to place an order.`;

            // 4. Build Final URL
            const whatsappURL = `https://wa.me/${phone}?text=${message}`;

            // 5. Analytics (Optional / Safe)
            // Works even if GA4 is blocked or missing
            if (typeof gtag === 'function') {
                const isDebug = localStorage.getItem('debug_mode') === 'true';

                const eventParams = {
                    branch_name: branch,
                    page_name: page,
                    offer_name: offer || 'none',
                    order_id: orderId,
                    device_type: deviceType,
                    transport_type: 'beacon'
                };

                // Inject debug scope if needed
                if (isDebug) {
                    eventParams.debug_mode = true;
                    console.log('[GA4 Debug] whatsapp_order_click:', eventParams);
                }

                gtag('event', 'whatsapp_order_click', eventParams);
            }

            // 6. Execute Redirect
            window.open(whatsappURL, '_blank');
        });
    });
});
