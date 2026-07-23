# TechNest

> A full‑stack e‑commerce platform for electronics and tech gadgets — built with Next.js 16, Express 5, and MongoDB.

## Overview

TechNest is a modern, responsive web application that lets users browse, search, and purchase the latest tech products. It features a dynamic product catalog, user authentication, a shopping cart, order management, and a wishlist — all wrapped in a clean, Tailwind‑powered UI.

## Tech Stack

| Layer      | Technology                                                              |
| ---------- | ----------------------------------------------------------------------- |
| **Frontend**  | Next.js 16, React 19, Tailwind CSS v4, Framer Motion                 |
| **Backend**   | Express 5, MongoDB 7, CORS, dotenv                                   |
| **Auth**      | Better Auth with MongoDB adapter                                      |

## Features

- **Product Catalog** — Browse by category, brand, or search with sorting and filtering.
- **Hero Carousel** — Animated slides highlighting promotions and banners.
- **User Authentication** — Register, login, and session management via Better Auth.
- **Shopping Cart** — Add/remove items with quantity controls; persists in localStorage.
- **Wishlist** — Save products for later.
- **Order Management** — Place orders and view order history.
- **Admin Seed** — `POST /api/seed` populates the database with sample categories, products, brands, testimonials, and features.
- **Responsive UI** — Mobile‑first layout with animated transitions and dark‑theme‑ready Tailwind tokens.

## Project Structure

```
TechNest/
├── Backend/                  # Express API server
│   ├── config/
│   ├── routes/
│   ├── server.js             # Entry point & API routes
│   ├── package.json
│   └── .env                  # MongoDB connection string
├── frontend/                 # Next.js application
│   ├── public/               # Static assets (banners, icons)
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── (account)/    # Login, register, profile, cart, wishlist, orders, dashboard
│   │   │   ├── (shop)/       # Shop, categories, product detail
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── api/auth/     # Better Auth API routes
│   │   ├── components/
│   │   │   ├── home/         # Hero, FeaturedCategories, HowItWorks, etc.
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   ├── cards/        # ProductCard, CategoryCard, BrandCard, etc.
│   │   │   └── ui/           # Button, Modal, SearchBar, etc.
│   │   └── lib/              # API client, auth client, helpers
│   ├── package.json
│   └── jsconfig.json         # Path alias @/*
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)

### 1. Clone & Install

```bash
git clone https://github.com/pollobdebnath18/TechNest.git
cd TechNest

# Install backend dependencies
cd Backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

Create `Backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/TechNest
PORT=5000
```

### 3. Seed the Database

```bash
cd Backend
curl -X POST http://localhost:5000/api/seed
```

### 4. Run the App

**Terminal 1 — Backend:**

```bash
cd Backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| GET    | `/api/health`             | Health check                    |
| GET    | `/api/products`           | List products (filter, sort)    |
| GET    | `/api/products/:slug`     | Single product by slug          |
| POST   | `/api/products`           | Create a product                |
| PUT    | `/api/products/:id`       | Update a product                |
| GET    | `/api/categories`         | List all categories             |
| GET    | `/api/categories/:slug`   | Category detail with products   |
| PUT    | `/api/categories/:id`     | Update a category               |
| GET    | `/api/brands`             | List all brands                 |
| GET    | `/api/testimonials`       | List all testimonials           |
| GET    | `/api/features`           | List all features               |
| POST   | `/api/orders`             | Create an order                 |
| GET    | `/api/orders`             | List orders (filter by userId)  |
| POST   | `/api/seed`               | Seed database with sample data  |

## Scripts

### Backend

| Script     | Command              |
| ---------- | -------------------- |
| `dev`      | `node --watch server.js` |
| `start`    | `node server.js`     |

### Frontend

| Script     | Command              |
| ---------- | -------------------- |
| `dev`      | `next dev`           |
| `build`    | `next build`         |
| `start`    | `next start`         |
| `lint`     | `eslint`             |

## License

MIT
