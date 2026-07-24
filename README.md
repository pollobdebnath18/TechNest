# TechNest

> A full-stack e-commerce platform for electronics and tech gadgets — built with **Next.js 16**, **Express 5**, **MongoDB**, and **JavaScript (ES6+)**.

<p align="center">
  <a href="https://tech-nest-kappa.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
  <a href="https://github.com/pollobdebnath18/TechNest" target="_blank">
    <img src="https://img.shields.io/badge/Source%20Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://technest-ij5g.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/API%20Server-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="API Server">
  </a>
</p>

## Live Links

| Service  | URL                                       | Platform   |
| -------- | ----------------------------------------- | ---------- |
| Client   | [tech-nest-kappa.vercel.app](https://tech-nest-kappa.vercel.app) | Vercel     |
| API      | [technest-ij5g.onrender.com](https://technest-ij5g.onrender.com) | Render     |
| Database | MongoDB Atlas (cloud)                     | MongoDB    |

## Overview

TechNest is a modern, responsive e-commerce web application that lets users browse, search, and purchase the latest tech products. It features a dynamic product catalog, Google OAuth authentication, shopping cart, order management, and a wishlist — all wrapped in a clean, Tailwind CSS-powered UI.

## Tech Stack

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| **Frontend**    | Next.js 16, React 19, Tailwind CSS v4, Framer Motion |
| **Backend**     | Express 5, MongoDB 7, CORS, dotenv                   |
| **Auth**        | Better Auth with Google OAuth & MongoDB adapter       |
| **Language**    | JavaScript (ES6+)                                     |
| **Deployment**  | Vercel (Frontend), Render (Backend), MongoDB Atlas   |

## Features

- **Product Catalog** — Browse by category, brand, or search with sorting and filtering.
- **Hero Carousel** — Animated slides highlighting promotions and banners.
- **User Authentication** — Email/password login, Google OAuth sign-in, and session management via Better Auth.
- **Shopping Cart** — Add/remove items with quantity controls; API-backed persistence.
- **Wishlist** — Save products for later; API-backed persistence.
- **Order Management** — Place orders and view order history.
- **Profile Management** — View and edit profile with avatar display.
- **Admin Seed** — `POST /api/seed` populates the database with sample categories, products, brands, testimonials, and features.
- **Responsive UI** — Mobile-first layout with animated transitions and smooth hover effects.
- **Form Validation** — Client-side validation with eye toggle for password visibility.
- **Product Cards** — Polished card design with hover zoom, slide-in actions, and backdrop blur effects.

## Project Structure

```
TechNest/
├── Backend/                    # Express API server
│   ├── server.js               # Entry point & all API routes
│   ├── package.json
│   └── .env                    # Environment variables
├── frontend/                   # Next.js application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (account)/      # Login, register, profile, cart, wishlist, orders, dashboard
│   │   │   ├── (shop)/         # Shop, categories, product detail
│   │   │   ├── (items)/        # Add & manage items
│   │   │   ├── about/          # About page
│   │   │   ├── contact/        # Contact page
│   │   │   └── api/auth/       # Better Auth catch-all route
│   │   ├── components/
│   │   │   ├── home/           # Hero, FeaturedProducts, BestDeals, etc.
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── cards/          # ProductCard, CategoryCard, BrandCard
│   │   │   └── ui/             # Reusable UI components
│   │   └── lib/                # API client, auth config, contexts
│   ├── package.json
│   └── jsconfig.json           # Path alias @/*
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js 20+**
- **MongoDB Atlas** account (or local instance)

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

Create `.env` files in both `Backend/` and `frontend/` directories. See the `.env.example` files or set the following variables:

**Backend** — `Backend/.env`

| Variable       | Description                          |
| -------------- | ------------------------------------ |
| `MONGODB_URI`  | MongoDB connection string            |
| `PORT`         | Server port (default: `5000`)        |
| `FRONTEND_URL` | Comma-separated allowed origins      |

**Frontend** — `frontend/.env`

| Variable                  | Description                          |
| ------------------------- | ------------------------------------ |
| `MONGODB_URI`             | MongoDB connection string            |
| `BETTER_AUTH_SECRET`      | Random secret for session signing    |
| `BETTER_AUTH_URL`         | Auth base URL                        |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Public auth URL                 |
| `NEXT_PUBLIC_API_URL`     | Backend API URL                      |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret           |

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

Base URL: `https://technest-ij5g.onrender.com/api`

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| GET    | `/`                    | API status check                |
| GET    | `/health`              | Health check                    |
| GET    | `/products`            | List products (filter, sort)    |
| GET    | `/products/:slug`      | Single product by slug          |
| POST   | `/products`            | Create a product                |
| PUT    | `/products/:id`        | Update a product                |
| GET    | `/categories`          | List all categories             |
| GET    | `/categories/:slug`    | Category detail with products   |
| PUT    | `/categories/:id`      | Update a category               |
| GET    | `/brands`              | List all brands                 |
| GET    | `/testimonials`        | List all testimonials           |
| GET    | `/features`            | List all features               |
| POST   | `/orders`              | Create an order                 |
| GET    | `/orders`              | List orders (filter by userId)  |
| POST   | `/seed`                | Seed database with sample data  |

### Auth Endpoints (Better Auth)

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/api/auth/sign-in/email`   | Email/password sign-in   |
| POST   | `/api/auth/sign-up/email`   | Email/password sign-up   |
| POST   | `/api/auth/sign-in/social`  | Google OAuth sign-in     |
| POST   | `/api/auth/sign-out`        | Sign out                 |
| GET    | `/api/auth/get-session`     | Get current session      |

## Scripts

### Backend

| Script   | Command                  |
| -------- | ------------------------ |
| `dev`    | `node --watch server.js` |
| `start`  | `node server.js`         |

### Frontend

| Script   | Command         |
| -------- | --------------- |
| `dev`    | `next dev`      |
| `build`  | `next build`    |
| `start`  | `next start`    |
| `lint`   | `eslint`        |

## Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel.
2. Set environment variables in Vercel dashboard.
3. Deploy — auto-deploys on every push to `main`.

### Render (Backend)

1. Connect your GitHub repository to Render.
2. Set environment variables in Render dashboard.
3. Deploy as a **Web Service** with `node server.js` as start command.

> **Note:** Never commit `.env` files. All sensitive keys are managed via platform dashboards (Vercel / Render).

## License

MIT
