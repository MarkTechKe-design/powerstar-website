# Powerstar Website - Admin & Handover Guide

> **STOP! READ THIS BEFORE EDITING ANY FILES.**
> This website is built to be robust, but it requires careful handling.

## 🛑 Safety First: The Golden Rules

1.  **Backup Before You Touch**: Before making *any* changes, copy the file you are about to edit and name it `filename-backup.html` (e.g., `index-backup.html`). If things break, just delete your broken file and rename the backup to the original name.
2.  **Don't Touch the Code Logic**: Stick to editing text and images. Do not change class names (e.g., `class="btn-primary"`), `<div>` tags, or script links.
3.  **Test Locally (If Possible)**: If you can, open the HTML file in your browser to check your changes before uploading to the live server.

---

## 🥪 The "Sandwich Rule" (How to Edit Text)

HTML code is like a sandwich. The "tags" (like `<p>` and `</p>`) are the bread, and your text is the filling.

**You must ONLY edit the filling.**

*   **✅ SAFE**:
    *   Original: `<h1>Welcome to Powerstar</h1>`
    *   Edit: `<h1>Welcome to Our New Shop</h1>`
*   **❌ DANGEROUS**:
    *   Broken: `<h1Welcome to Powerstar</h1>` (Missing bracket)
    *   Broken: `<h1>Welcome to Powerstar` (Missing closing tag)

**Tip:** Look for the **black text** between the purple/blue tags in your editor. That's the only thing you should change.

---

## 🖼️ How to Update Images (The "Same Name Swap")

The easiest way to update banners or product images without touching any code is to **replace the file** rather than changing the code.

1.  **Identify the Image**: Right-click the image on the website and choose "Open Image in New Tab". Look at the URL structure (e.g., `.../assets/hero/hero-1.jpg`).
2.  **Prepare Your New Image**:
    *   Make sure your new image is high quality.
    *   **Crucial**: Rename your new image to match the *exact* name of the old one (e.g., `hero-1.jpg`).
    *   **Crucial**: Ensure the file extension matches (if the original is `.jpg`, yours must be `.jpg`, not `.png`).
3.  **Upload & Overwrite**:
    *   Go to your cPanel File Manager.
    *   Navigate to the folder (e.g., `public_html/assets/hero/`).
    *   Upload your new `hero-1.jpg`.
    *   Select "Overwrite existing file" when prompted.
4.  **Clear Cache**: Refresh your website. You might need to do a "Hard Refresh" (Ctrl + F5) or clear your browser cache to see the new image.

---

## 🔧 Developer Notes (Tech Specs)

*   **Server Type**: Apache / Linux (cPanel Standard)
*   **Root Directory**: `/public_html`
*   **Entry Point**: `index.html`
*   **Case Sensitivity**: **HIGH**. `Image.jpg` is NOT the same as `image.jpg`. Always use lowercase filenames.
*   **Cache Busting**: The site uses a `?v=2025-01` query string on assets. If you make major CSS/JS changes, update this string in `task.md` or the HTML files to force users to download the new version.

---

## 📂 File Structure Overview

*   **`index.html`**: The Homepage.
*   **`data/`**: JSON files containing easy-to-edit content for Sliders, Team, and About sections.
    *   `slides.json`: Homepage slider images and text.
    *   `offers.json`: Weekly offers data.
*   **`assets/`**: Images and icons.
*   **`css/`**: Styling files (`style.css` is the main one).
*   **`js/`**: JavaScript logic files.

---

## 🆘 Troubleshooting

*   **"My image isn't showing!"**: Check the filename capitalization. `Hero.jpg` vs `hero.jpg`.
*   **"The layout is broken!"**: You likely deleted a closing `</div>` tag. Restore your backup file and try again.
