# 77bunk-rock E-commerce Website

A simple clothing e-commerce website for 77bunk-rock.

## Features

- Homepage with animated background
- Company name in header
- Navigation: Support, About Us, Shop, Shopping Cart
- Product grid with clothing items
- Product detail pages with price, sizes (S-XXL), add to cart, and comments

## How to Run

1. Ensure you have a local web server. For example:
   - Install Python and run `python -m http.server 8000` in the project directory.
   - Or use the Live Server extension in VS Code.

2. Open `index.html` in your browser.

## Notes

- Product images are placeholders. Replace the `image` field in `data/products.json` with actual image URLs or paths.
- Cart is stored locally in browser storage.
- Navigation buttons for Support and About Us show alerts; expand as needed.
- Shopping Cart button shows item count in an alert; can be expanded to a full cart page.

## Structure

- `index.html`: Homepage
- `product.html`: Product detail page
- `css/style.css`: Styles with animated background
- `js/script.js`: Main JavaScript for loading products and navigation
- `js/cart.js`: Cart functionality
- `data/products.json`: Product data