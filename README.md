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

## Deployment

Below are step-by-step instructions to deploy the feedback server and the static site to three popular providers. The repository already contains `server.js` (Express), a `Procfile` for Heroku, and a serverless function in `api/feedback.js` for Vercel.

### 1) Render (recommended)
- Push your project to GitHub (example):
```bash
git init
git add .
git commit -m "deploy ready"
gh repo create your-repo-name --public --source=. --push
```
- On Render (https://render.com): Create a new **Web Service**.
  - Connect your GitHub repo.
  - Build command: `npm install`
  - Start command: `npm start`
  - Set an environment variable `ADMIN_PASSWORD` to a secure password.
- Render will build and expose your Node server. The site static files can be served by Render if you configure a static site, or host static files elsewhere and point client-side fetches to the Render server.

### 2) Heroku
- Ensure you have the Heroku CLI and are logged in.
```bash
heroku login
heroku create
git push heroku main
heroku config:set ADMIN_PASSWORD=yourSecret
```
- The `Procfile` contains `web: node server.js` so Heroku will run the Express server. The feedback endpoint will be available at `https://<your-heroku-app>.herokuapp.com/api/feedback`.

### 3) Vercel (serverless)
- Vercel supports serverless functions in the `api/` folder. This repo includes `api/feedback.js` which will run as a serverless function.
- Note: serverless functions do not guarantee persistent disk storage. `api/feedback.js` writes to `/tmp/server-feedbacks.json` which is ephemeral and may be cleared. For reliable storage use a database (Supabase, Firebase, or a hosted Postgres).
- To deploy:
```bash
npm i -g vercel
vercel login
vercel --prod
```
- Set `ADMIN_PASSWORD` in the Vercel dashboard or via `vercel env add`.

### Admin access
- The admin endpoint for server versions is `/api/admin/feedbacks` and expects the admin password either in query `?pw=...` or header `x-admin-pw`.

### Local testing
- To run server locally:
```bash
npm install
ADMIN_PASSWORD=yourSecret node server.js
# open http://localhost:3000 (or your static via Python server on 8000)
```

### Notes
- For a production-ready setup use a proper database and HTTPS.
- If you want, I can:
  - Create the GitHub repo and push the code for you (requires your permission),
  - Auto-deploy to Render via their API (requires API key), or
  - Convert serverless functions to use a hosted DB (Supabase) for persistent storage.
