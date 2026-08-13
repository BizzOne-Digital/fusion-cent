# FusionScent — Full MERN E-Commerce Project

> Luxury mini refillable perfumes — complete e-commerce platform with customer frontend, admin panel, and Node.js backend.

---

## 📁 Project Structure

```
fusionscent/
├── backend/          ← Node.js + Express + MongoDB API
├── frontend/         ← React app: customer store AND admin panel in one
│   └── src/admin/    ← Admin panel routes, mounted at /admin
```

The admin panel is **not a separate app** — it's routes inside the same React app as the store, mounted at `/admin`. One `npm start`, one build, one deploy.

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev          # http://localhost:5000
```

### 2. Frontend + Admin Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
npm start            # http://localhost:3000 (store)
                     # http://localhost:3000/admin (admin panel)
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/fusionscent
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🌐 Create Admin Account

Run the seed script (creates an admin login + sample categories/products):
```bash
cd backend
npm run seed
```
Default admin login: `admin@fusionscent.com` / `Admin@12345` (override via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars). Log in at `http://localhost:3000/admin`.

---

## ✨ Features

### Customer Frontend
- 🏠 Home page — hero, categories, featured products, promo banner, testimonials
- 🛍️ Shop with filters (category, gender, collection, search, sort)
- 📦 Product detail — image gallery, fragrance notes, reviews
- 🛒 Cart — persistent (localStorage), qty controls, free shipping indicator
- 💳 Checkout — multi-step: shipping → payment → review, coupon codes
- 👤 Auth — register/login, profile management, order history
- 📱 Fully responsive — mobile-first design

### Admin Panel
- 📊 Dashboard — revenue stats, order chart, recent orders
- 📦 Products — full CRUD, Cloudinary image upload, badges
- 🏷️ Categories — manage with images
- 🛒 Orders — status management, filter by status
- ⭐ Reviews — approval system
- 👥 Users — list all users
- ⚙️ Settings — hero text, contact info, offers, FAQ, SEO

### Backend API
- JWT Authentication + role-based access
- MongoDB + Mongoose with full schema validation
- Cloudinary image management (upload, delete)
- Text search on products
- Order stats + analytics endpoint
- Review approval workflow

---

## 🎨 Design

- **Color:** Purple luxury theme (`#6b21a8` primary, `#3b0764` deep)
- **Font:** Playfair Display (headings) + Inter (body)
- **Style:** Warm & approachable, premium feel
- **Inspiration:** Scentbird, ScentSplit, DecantX

---

## 🚀 Deployment (Vercel — 2 projects)

### 1. Backend API — Root Directory: `backend`
1. New Vercel project → Root Directory: `backend`
2. Framework Preset: **Other** (uses `backend/vercel.json` to run as a serverless function)
3. Add env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `STRIPE_SECRET_KEY`, `CLIENT_URL`
4. Deploy → note the URL, e.g. `https://fusionscent-api.vercel.app`

### 2. Frontend (store + admin) — Root Directory: `frontend`
1. New Vercel project → Root Directory: `frontend`
2. Framework Preset: **Create React App** (auto-detected)
3. Env var: `REACT_APP_API_URL=https://fusionscent-api.vercel.app/api`
4. Deploy → note the URL, e.g. `https://fusionscent.vercel.app`
   - Store: `https://fusionscent.vercel.app`
   - Admin: `https://fusionscent.vercel.app/admin`

### 3. Finish CORS wiring
Go back to the **backend** project's env vars and set:
```
CLIENT_URL=https://fusionscent.vercel.app
```
Redeploy the backend so CORS allows the frontend.

> Note: MongoDB Atlas — under Network Access, allow `0.0.0.0/0` (or Vercel's IPs) since serverless functions don't have a fixed outbound IP.

### Local dev
- Backend: `cd backend && npm run dev` → `localhost:5000`
- Frontend + Admin: `cd frontend && npm start` → `localhost:3000` (store) / `localhost:3000/admin` (admin)

---

Built for **FusionScent** by **BizzOne Digital**
