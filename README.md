# Powerstar Supermarkets Website - Admin Guide

This website is built to be easily editable without touching code. All text and image settings are stored in the `data/` folder.

## 📁 Content Management (JSON Files)

Navigate to the `data/` folder to edit website content. You can open these files with any text editor (Notepad, VS Code, etc.).

### 1. `site-content.json`
**Controls:** Header, Footer, Hero Text, Contact Info.
- **Key Fields:**
    - `company_name`: Global brand name.
    - `contact`: Updates phone/email across the site.
    - `social_links`: URLs for Facebook/TikTok icons.

### 2. `slides.json` (Home Page Slider)
**Controls:** The main promo slider on the homepage.
- **To Add a Slide:** Copy an existing block `{...}` and paste it.
- **Image Size:** Recommended `1920x800` pixels.
- **Active:** Set `"active": false` to hide a slide without deleting it.

### 3. `about.json` (About Page)
**Controls:** Mission, Vision, Quality Policy, and Vision Narrative.
- **Fields:**
    - `strategic_compass`: Edit Mission/Vision text here.
    - `growth_vision`: Update the "Future Outlook" text and image path.

### 4. `executives.json`
**Controls:** Leadership Profiles on About Page.
- **Structure:**
    ```json
    {
      "name": "Jane Doe",
      "title": "Operations Manager",
      "image": "assets/team/jane.jpg",
      "bio": "...",
      "quote": "..."
    }
    ```

### 5. `partners.json`
**Controls:** Partner Logo Grid.
- **Images:** Place logos in `assets/partners/`. Ensure they are PNG or JPG (transparent background properly).

### 6. `metrics.json`
**Controls:** The animated counters (e.g., "12+ Branches").

---

## 🖼️ Image Management

All images should be uploaded to the `assets/` folder.

- **Product Images:** Use `assets/products/`. Recommend JPG, square or 4:3 ratio. White background preferred.
- **Team Images:** Use `assets/team/`. Recommend square (1:1) aspect ratio.
- **Slider Images:** Use `assets/hero/`. Wide format (16:9).

## ⚠️ Important Rules

1. **Do NOT delete keys** (the left side of `"key": "value"`). Only edit the value on the right.
2. **Watch your commas**: Every line in a list must allow a comma EXCEPT the last one.
    - ✅ Good: `{"a": 1, "b": 2}`
    - ❌ Bad: `{"a": 1, "b": 2,}`
3. **Paths**: Always use relative paths like `assets/image.jpg`, not `C:/Users/...`.

## 🚀 Deployment

The site is static HTML/JS. To deploy:
1. Upload the entire folder structure to `public_html` on your cPanel.
2. Ensure `index.html` is in the root directory.

## 🆘 Support

For script or layout changes, contact the technical lead.
