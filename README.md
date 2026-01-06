# 🛒 Powerstar Supermarkets Website

> **Status:** ✅ Production Ready  
> **Last Update:** January 2026

Welcome to the Powerstar Supermarkets digital storefront. This documentation is designed to help technical teams and store managers navigate the codebase.

---

## 🗺️ Key Folders Map (Where things live)

### 1. `📂 public_html /` (The Live Site)
This is the root folder. All `.html` files (Home, About, Offers) live here.
*   ⚠️ **Warning:** Do not edit these unless you are a developer. Use the `data/` folder for content updates.

### 2. `📂 data/` (The Brain 🧠)
This is where the content lives. Edit these files to update text, prices, and news *without* touching code.
*   `offers.json`: Control the Weekly Offers page.
*   `media.json`: Update the News & Events page.
*   `status.json`: Toggle "Maintenance Mode" on/off.
*   `metrics.json`: Update branch counts and employee numbers.

### 3. `📂 assets/` (The Storage 📦)
Put all your images here.
*   `assets/offers/`: Weekly offer images.
*   `assets/media/`: News and event photos.
*   `assets/team/`: Staff profiles.

---

## 🆘 Emergency Support

**If the website goes offline or behaves strangely:**

1.  **Check Maintenance Mode:** Open `data/status.json` and set `"maintenance_mode": true`. This will put up a "We'll be back soon" screen to buy you time.
2.  **Contact Support:**
    *   **Lead Developer:** [Insert Contact Info]
    *   **Hosting Provider:** [Insert details]

---

*internal use only - property of Powerstar Supermarkets*
