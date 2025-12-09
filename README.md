# Cirrus Trading Cards – Web Programming Group Project

## Team Members
- Rayne Mowatt (2409070)
- Jonelle Allen (1306395)
- Rushane Campbell (2405389)
- Amelia Brown (2304412)
- Twayne Campbell (2405399)

---

## Project Overview
Cirrus Trading Cards is a web-based trading card store built using HTML, CSS, and JavaScript.  
The application features user registration and login, product browsing, shopping cart functionality, checkout and invoice generation, as well as a dashboard with user statistics and invoice history.

All user, cart, and invoice data is stored locally using the browser’s LocalStorage.

----

## Technologies Used
- HTML5  
- CSS3  
- JavaScript (ES6)  
- LocalStorage / SessionStorage  
- Google Fonts (Bungee Spice, Playwrite NZ Guides)

Tested in: **Google Chrome**

---

## Key Features Completed

### 1. JavaScript System Overhaul
- Rebuilt all JavaScript into a single script.js file.
- Implemented complete logic for:
  - Login  
  - Registration  
  - Product catalog and search  
  - Add to cart  
  - Cart item updates  
  - Checkout calculations  
  - Invoice generation  
  - Dashboard statistics  
- Fixed product ID mismatches and ensured correct loading of product images.
- Synchronized all user data with LocalStorage (cart, invoices, login session).
- Added dynamic dashboard visibility when logged in.

### 2. Product Catalog
- Auto-rendered products from a product list.
- Search and category filtering.
- Add-to-cart validation (requires login).
- Dashboard link appears only for logged-in users.

### 3. Shopping Cart System
- Editable quantity fields.
- Automatic recalculation of subtotal, discount, tax, total.
- Remove item functionality.
- Clear Cart function.
- Added missing Proceed to Checkout button.

### 4. Checkout Page
- Shipping form with validation.
- Amount Paid → Change Returned auto-calculation.
- Live order summary display.
- Totals stored in SessionStorage for invoice handoff.
- Confirm Order creates invoice and clears cart.

### 5. Invoice Generation
- Restored invoice formatting to closely match original assignment structure.
- Dynamic population of:
  - Items purchased  
  - Subtotals  
  - Taxes  
  - Discounts  
  - Payment info  
- Print-friendly layout.
- Continue Shopping button redirects to main catalog.

### 6. Dashboard System
- Displays logged-in user's name and email.
- Gender and age-group frequency charts.
- Full invoice list display.
- Invoice search by TRN.

### 7. Styling & HTML Fixes
- Restored login and registration pages to match original structure.
- Re-added missing Google Fonts.
- Corrected styling for form links, secondary buttons, and layout spacing.
- Applied correct `checkout-box` wrappers to fix checkout layout.
- Restored original invoice styling and layout.
- Ensured visual consistency across all pages.

### 8. Image & Path Fixes
- Corrected product image paths to use Assets/image1.jpg through image18.jpg.
- Ensured all logos and icons load correctly on every page.

---

## Project Structure
/
├── index.html               (Login)  
├── Registration.html        (Registration)  
├── products.html            (Product Catalog)  
├── Cart.html                (Shopping Cart)  
├── checkout.html            (Checkout Page)  
├── invoice.html             (Invoice)  
├── dashboard.html           (Dashboard)  
├── styles.css               (CSS Styling)  
├── script.js                (JavaScript Logic)  
└── Assets/                  (Images and Media Files)  

---

## Testing
The entire application was tested in:  
✔ Google Chrome  

Testing included:
- Full user flow (Register → Login → Products → Cart → Checkout → Invoice)  
- Input validation  
- Navigation checks  
- LocalStorage behavior  
- Responsive layout checks  

---

## Running the Project
1. Download or clone the repository.
2. Open index.html or products.html in a web browser.
3. No server is required; everything runs directly in the browser.

---

## Notes
- TRN format must follow: 000-000-000.
- LocalStorage should be cleared between major tests.
- Products load automatically on first launch and remain stored.

