# 📘 Powerstar Store Manager's Manual: Updating the Website

**Target Audience:** Marketing Team & Store Managers  
**Goal:** Update Weekly Offers & News without breaking the site.

---

## ⚠️ A. The Golden Rules (READ THIS FIRST)

1.  **NEVER** touch files ending in `.js`, `.css`, or `.html`. These are code files. If you break them, the site breaks.
2.  **ALWAYS** use a [JSON Validator](https://jsonlint.com) before saving your changes.
    *   *Why?* The website reads data from specific text files called JSON. If you miss a single comma, the whole page will turn white.
3.  **BACKUP** the file you are editing before you start. Copy `offers.json` and name it `offers_backup.json` just in case.

---

## 📸 B. Image Requirements (Visual Guide)

To make the site look professional, all offer images must follow these strict rules:

1.  **Shape:** Images MUST be **Square (1:1 Ratio)**.
    *   *Good:* 800x800 pixels.
    *   *Bad:* Landscape or Portrait phone photos.
2.  **Format:** JPG (preferred) or PNG.
3.  **Naming Convention:**
    *   ✅ `offer-1.jpg`, `offer-2.jpg`, `offer-3.jpg`
    *   ❌ `IMG_2024.jpg` (No random numbers)
    *   ❌ `Coca Cola Offer.jpg` (No spaces)
    *   ❌ `Offer-1.JPG` (Keep extensions lowercase)
4.  **Where to Put Them:**
    *   Open the folder: `📂 assets/offers/`
    *   Drag and drop your new images here to replace the old ones.

---

## 📝 C. Updating Prices & Text (The JSON Guide)

All the text and prices are stored in the **Brain Folder** (`📂 data/`).

### Step-by-Step: Updating Weekly Offers

1.  Open the file: `📂 data/offers.json` using a text editor (Notepad, VS Code).
2.  You will see a list of items surrounded by `{ }`.
3.  Edit the fields inside the quote marks `""`.

#### What Each Field Means:

| Field | Example | Instructions |
| :--- | :--- | :--- |
| `"product_name"` | `"Jogoo Maize Meal 2kg"` | The main title of the product. |
| `"image"` | `"assets/offers/offer-1.jpg"` | **DO NOT CHANGE** the path. Just match your image filename to this. |
| `"old_price"` | `"Ksh 180"` | The previous price (crossed out). |
| `"new_price"` | `"Ksh 150"` | The current promo price (big and red). |
| `"discount_label"`| `"-15%"` | The red badge on the corner. |
| `"branches"` | `["All Branches"]` | Where is this valid? |
| `"active"` | `true` | Set to `true` to show, `false` to hide. |

#### Example of ONE Item:
```json
{
    "id": "offer-1",
    "product_name": "Premium Basmati Rice",
    "image": "assets/offers/offer-1.jpg",
    "old_price": "Ksh 1,200",
    "new_price": "Ksh 950",
    "discount_label": "SAVE 250",
    "branches": ["Nairobi Region"],
    "active": true
}
```

---

## 🔧 D. Troubleshooting

### "Help! The Offers Page is completely white!"
*   **Cause:** You likely broke the JSON format.
*   **Fix:**
    1.  Undo your last save.
    2.  Copy your entire text into [JSONLint.com](https://jsonlint.com).
    3.  Click "Validate JSON". It will tell you exactly where the missing comma is.

### "My image isn't showing!"
*   **Cause:** The filename in the folder doesn't match the filename in the text `data/offers.json`.
*   **Fix:** Check for spelling, spaces, or `.jpg` vs `.png`.

---
