# Website Content Update Guide
**For Powerstar Supermarkets Staff**

This guide allows you to update text, prices, and images on the website without needing a developer. All content is stored in simple text files in the `data/` folder.

---

## 🛠️ What You Need
- A text editor (Notepad, Notepad++, or VS Code).
- Access to the website files.

---

## 📝 Task 1: Changing Phone Numbers & Emails
**File to edit:** `data/site-content.json`

1. Open `data/site-content.json`.
2. Look for the `"contact"` section:
   ```json
   "contact": {
       "phone": "+254 700 000 000",
       "email": "info@powerstar.co.ke"
   }
   ```
3. Change the number inside the quotes. 
   - ✅ Correct: `"+254 111 222 333"`
   - ❌ Incorrect: `+254 111 222 333` (Missing quotes)

---

## 🖼️ Task 2: Updating the Homepage Slider
**File to edit:** `data/slides.json`

This file contains a list of slides. Each block `{ ... }` represents one slide.

### To Change text on a slide:
1. Find the slide you want to edit (e.g., "id": 1).
2. Update the `"title"` or `"subtitle"`.

### To Change the image:
1. Rename your new photo to something simple, e.g., `new-promo.jpg`.
2. Copy the photo into the `assets/hero/` folder.
3. Update the `"image"` line in the file:
   ```json
   "image": "assets/hero/new-promo.jpg",
   ```

---

## 🏷️ Task 3: Adding a Weekly Offer
**File to edit:** `data/offers.json`

To add a new offer, copy and paste this block **inside the square brackets `[ ]`**:

```json
{
    "id": 2,
    "title": "Weekend Meat Sale",
    "description": "20% Off all beef cuts.",
    "image": "assets/promotions/beef-offer.jpg",
    "valid_until": "2025-12-31"
}
```
*Note: Make sure new photo exists in `assets/promotions/`.*

---

## ⚠️ Important Rules (Do Not Break!)
1. **Always keep the quotes `""`** around text.
2. **Don't delete commas `,`** at the end of lines.
3. **Don't delete the curly braces `{ }`**.

**If the site goes blank**, you likely deleted a comma or a quote. Undo your last change and check carefully.
