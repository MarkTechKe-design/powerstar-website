# 📘 Powerstar Website - Admin Content Guide
**For Marketing & Content Teams**

This guide explains how to update the website content (Prices, Offers, Products, News) without needing a developer. All content is stored in the `data/` folder.

---

## 🚀 Quick Start
**You will need:**
1.  A text editor (we recommend [Notepad++](https://notepad-plus-plus.org/) or [VS Code](https://code.visualstudio.com/)).
2.  Access to the website files folder.

**The Golden Rule:**
> Only edit text inside the quotes `" "`. Never delete the quotes themselves!

---

## 🛒 Updating Weekly Offers
*File:* `data/offers.json`

This file controls the "Weekly Specials" on the Offers page.

### 1. To Change a Price or Product
Find the product block and edit the values:
```json
{
    "product_name": "Cooking Oil 5L",       <-- Change Name
    "image": "assets/offers/offer-1.jpg",   <-- Change Image Path
    "old_price": "Ksh 1,900",               <-- Change Old Price
    "new_price": "Ksh 1,650",               <-- Change New Deal Price
    "discount_label": "-15%",               <-- Label (e.g., "HOT", "SALE")
    "branches": ["Kasarani", "Ruiru"],      <-- List where available
    "active": true                          <-- Set to false to hide it
}
```

### 2. To Add a New Offer
1.  Copy one entire `{ ... },` block (from opening brace `{` to closing brace `},`).
2.  Paste it **before** the last closing square bracket `]`.
3.  Update the text and image.

---

## 📦 Updating Products (Departments)
*File:* `data/services.json`

This controls the "Our Product Range" grid on the Products page.

### Example Block:
```json
{
    "id": "bakery",
    "title": "Fresh Bakery",                <-- Title on Card
    "image": "assets/bakery.jpg",           <-- Image File
    "description": "Cakes and bread...",    <-- Short Description
    "tags": ["Fresh", "Sweet"],             <-- Small tags below text
    "highlight_tag": "Fresh"                <-- Which tag should be Green?
}
```

---

## 📢 Updating Home Page Sliders
*File:* `data/slides.json`

This controls the big rotating banners on the Home page.

- **`title`**: The big bold text (e.g., "Back to School").
- **`subtitle`**: The smaller text above the title.
- **`image`**: The background image filename (must be in `assets/hero/`).
- **`button_text`**: What the button says (e.g., "Shop Now").
- **`button_link`**: Where the button goes (e.g., `offers.html` or `contact.html`).

---

## 🤝 Adding Partner Logos
*File:* `data/partners.json`

1.  **Prepare Logo**: Save as PNG with transparent background. Name it simply (e.g., `coca-cola.png`).
2.  **Upload**: Put it in `assets/partners/` folder.
3.  **Edit JSON**:
    ```json
    {
       "name": "Coca Cola",
       "logo": "assets/partners/coca-cola.png"
    }
    ```

---

## 🏢 Updating Branch & Contact Info
*File:* `data/site-content.json`

Use this file to update:
- Phone Numbers
- Email Addresses
- Social Media Links
- Main Hero Welcome Text
- Footer Copyright

---

## 🖼️ Image Best Practices (Read Carefully!)

**Before you upload ANY image:**
1.  **Compress It**: Go to [TinyPNG.com](https://tinypng.com/) and shrink the file size. Big images make the site slow.
2.  **Name It Clearly**: `fresh-bread.jpg` is better than `IMG_2025_Final_v2.jpg`.
3.  **Check Dimensions**:
    - **Large Banners**: 1920px wide x 800px high
    - **Product/Offer Images**: 800px x 800px (Square)
    - **Logos**: Around 200px wide (PNG)

---

## ⚠️ Troubleshooting / Help

### "I made a change and the site went blank!"
You probably broke the JSON format.
1.  Did you accidentally convert a `"` to a `”` (curly quote)? Always use straight quotes.
2.  Did you delete a comma `,` between items?
3.  Did you leave a trailing comma after the *last* item in a list? (JSON hates trailing commas).

**Fix:** Undo your change (Ctrl+Z) and try again carefully.

### "My image isn't showing up."
1.  Is the filename correct? `Bread.jpg` is essentially different from `bread.jpg`. Exact case matters!
2.  Is the extension correct? (`.jpg` vs `.png` vs `.jpeg`).
3.  Is the file actually in the folder you pointed to?

---
*For technical support, contact the IT Department.*
