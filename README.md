# Powerstar Supermarkets Website

A modern, responsive website for Powerstar Supermarkets, featuring a static frontend with a "headless" PHP/MySQL admin panel for content management.

## 🚀 Key Features
- **Frontend**: HTML5, CSS3, JavaScript (Static, GitHub Pages compatible).
- **Backend (Admin)**: PHP, MySQL (For dynamic content management).
- **Integrations**:
  - **WhatsApp Order Intelligence**: Smart ordering system with unique IDs and device tracking.
  - **Google Analytics 4**: Advanced event tracking (Offers, Branch Engagement, Page Intent).
  - **Leaflet Maps**: Branch locator without Google Maps API costs.

---

## 🛠️ Local Development (Admin Panel)
To run the Admin Panel locally, you need a local server environment like XAMPP, WAMP, or MAMP.

### 1. Setup Environment available
1. Install **XAMPP** (or similar).
2. Start **Apache** and **MySQL**.
3. Move the project folder to `htdocs` (e.g., `C:\xampp\htdocs\powerstar-website`).

### 2. Database Setup
1. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Create a new database named `powerstar_db`.
3. Import the schema script: `sql/schema.sql`.
   - This creates tables: `admins`, `offers`, `sliders`, `careers`, `media`.
   - Creates default admin: **User:** `admin`, **Pass:** `admin123`.

### 3. Connection Config
Ensure `admin/config/db.php` matches your local settings:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'powerstar_db');
```

### 4. Access Admin Panel
- URL: `http://localhost/powerstar-website/admin/`
- Login with default credentials.

---

## 📦 Production Deployment
### Static Hosting (GitHub Pages / Netlify)
- The **frontend** (HTML/JS/CSS) works perfectly on static hosting.
- **Limitation**: The Admin Panel and dynamic APIs (`/admin`, `/api`) **will not work**. The site will show hardcoded static content.

### Dynamic Hosting (cPanel / VPS)
To use the Admin Panel features:
1. Upload all files to `public_html`.
2. Create a MySQL Database and User in cPanel.
3. Import `sql/schema.sql` via phpMyAdmin.
4. Update `admin/config/db.php` with production DB credentials.
5. The API endpoints (`/api/get-*.php`) will now return live JSON data.

---

## 🔌 API Integration Guide
The backend provides read-only JSON APIs. In the future, the frontend can be updated to fetch data from these endpoints instead of using hardcoded HTML.

| Endpoint | Description |
|----------|-------------|
| `/api/get-sliders.php` | Active homepage sliders (Images, Text, Links). |
| `/api/get-offers.php` | Active offers with valid dates. |
| `/api/get-careers.php` | Open job listings. |
| `/api/get-media.php` | Uploaded media files. |

### Example Integration (Future JavaScript)
```javascript
// Example: Load Offers Dynamically
async function loadOffers() {
    try {
        const response = await fetch('/api/get-offers.php');
        const result = await response.json();
        
        if (result.status === 'success') {
            const offers = result.data;
            // Render offers to DOM...
        }
    } catch (e) {
        console.warn('API unavailable, keeping static content.');
    }
}
```

---

## 📁 Directory Structure
- `/admin` - Protected Admin Panel (Login required).
- `/api` - Public JSON endpoints.
- `/sql` - Database schema scripts.
- `/js` - Frontend logic (WhatsApp, GA4, Maps).
- `/css` - Styles.
- `/uploads` - (Created automatically) Stores admin-uploaded images.

---

# Powerstar Admin Update Workflow

This guide explains how to update the website content using the new JSON-based system.

## 1. Folder Structure
The website files are organized as follows:
```
/
├── assets/             # Images
│   ├── departments/    # Department images (Bakery, Butchery, etc.)
│   ├── hero/           # Slider images
│   ├── offers/         # Promotion images
│   └── uploads/        # Admin uploaded files
├── data/               # Content Data (JSON)
│   ├── site-content.json   # Global text (Phone, Email, Hero Text)
│   ├── slides.json         # Hero Slider data
│   ├── departments.json    # Departments list
│   └── offers.json         # Weekly offers
├── admin/              # Backend
│   ├── api/            # JSON endpoints for updates
│   ├── config/         # Database config
│   └── uploads/        # (Legacy/Future)
└── index.html          # Main page
```

## 2. Updating Content (Text)
Currently, updates are done by editing the JSON files in the `data/` directory.

### Example: Updating the Hero Headline
1. Open `data/site-content.json`.
2. Locate the `"sections"` object.
3. Change `"hero_headline": "Your New Headline"`.
4. Save the file.
5. The website will automatically reflect the change on the next refresh.

### Example: Adding a New Slide
1. Open `data/slides.json`.
2. Copy an existing slide object.
3. Paste it into the array and update the values:
   ```json
   {
       "id": 4,
       "image": "assets/hero/new-image.jpg",
       "title": "New Promotion",
       "subtitle": "Great Savings",
       "button_text": "Shop Now",
       "button_link": "offers.html",
       "active": true
   }
   ```
4. Upload the image to `assets/hero/`.

## 3. Updating Images
1. **Best Practice**: Always place images in their specific folder (`assets/departments`, `assets/hero`).
2. **Naming**: Use lowercase, hyphen-separated names (e.g., `fresh-bread.jpg`).
3. **Reference**: Update the JSON file to point to the new image path.

## 4. Developer Notes (Backend)
- A PHP API is available at `admin/api/update-content.php` for programmatic updates.
- Database Connection: `admin/config/db.php` (Edit credentials here).
- Image Upload API: `admin/api/upload-image.php`.

> [!WARNING]
> Do NOT edit `index.html` text directly. It is now dynamically loaded from `data/site-content.json`. Editing HTML will break the dynamic loading or be overwritten.
