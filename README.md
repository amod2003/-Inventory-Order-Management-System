# Inventory & Order Management System

![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![Sentry](https://img.shields.io/badge/Sentry-Monitored-362D59?style=flat-square&logo=sentry)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A **production-ready**, containerized full-stack application for managing products, customers, and orders — built with FastAPI, React, PostgreSQL, and Docker.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://inventory-order-management-system-omega-gray.vercel.app |
| Backend API (Render) | https://inventory-backend-edxb.onrender.com |
| Swagger API Docs | https://inventory-backend-edxb.onrender.com/docs |
| Docker Hub Image | https://hub.docker.com/r/amod123/inventory-backend |

> **Demo credentials:** `admin@inventory.com` / `admin123`
>
> Note: The free Render instance may take ~30 seconds to wake up on first request.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│              React Frontend (Vite + Nginx)                      │
│  • React Router v6    • Axios (API client)                      │
│  • Context API        • Sentry (error monitoring)               │
│  Deployed on: Vercel                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API (JSON)
┌──────────────────────────▼──────────────────────────────────────┐
│              FastAPI Backend (Python 3.11)                      │
│  • Pydantic v2 (validation)   • SQLAlchemy ORM                  │
│  • Alembic (migrations)       • Sentry (error monitoring)       │
│  • Auto Swagger/OpenAPI docs  • CORS middleware                 │
│  Deployed on: Render (Free)                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ SQL (psycopg2)
┌──────────────────────────▼──────────────────────────────────────┐
│              PostgreSQL 15 Database                             │
│  • Managed by Render         • Named volumes (Docker)           │
│  Deployed on: Render Managed PostgreSQL                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | SPA with fast HMR in development |
| **Routing** | React Router v6 | Client-side navigation + auth guard |
| **HTTP Client** | Axios | API calls with base URL config |
| **Backend** | FastAPI (Python 3.11) | Async REST API with auto-generated docs |
| **Validation** | Pydantic v2 | Request/response schema validation |
| **ORM** | SQLAlchemy 2.0 | Database models and query builder |
| **Migrations** | Alembic | Versioned, reversible database schema changes |
| **Database** | PostgreSQL 15 | Relational data with FK constraints |
| **Containers** | Docker + Docker Compose | Multi-stage builds, service orchestration |
| **Web Server** | Nginx (Alpine) | Serves React build, handles SPA routing |
| **Monitoring** | Sentry | Error tracking on both frontend and backend |
| **Deployment** | Render + Vercel | Backend + Frontend hosted separately |

---

## Features

### Core Functionality
- **Product Management** — Full CRUD with unique SKU enforcement, price, and stock quantity tracking
- **Customer Management** — Full CRUD with unique email validation
- **Order Management** — Multi-item orders with real-time inventory deduction on create and full stock restoration on cancel
- **Dashboard** — Live stats (total products, customers, revenue) + low-stock alert widget (< 10 units)

### Production Engineering
- **Alembic Migrations** — Schema changes are versioned and reversible (`alembic upgrade head` / `alembic downgrade`)
- **FK Constraint Safety** — Deleting a product referenced in an order returns 409 Conflict with a clear message instead of a 500 crash
- **Stock Validation** — Orders are rejected at API level if any item exceeds available stock
- **Price Snapshot** — `unit_price` is stored on each `order_item` at creation time, so changing a product's price never corrupts historical orders
- **Auto Total Calculation** — `total_amount` on orders is always computed server-side, never trusted from client
- **Swagger UI** — Full interactive API documentation auto-generated at `/docs`
- **Health Endpoint** — `GET /health` for uptime monitoring and Docker health checks
- **Sentry Integration** — Real-time error tracking with FastAPI + SQLAlchemy integration on backend; browser tracing + session replay on frontend
- **Multi-stage Docker Builds** — Separate builder and runtime stages keep images lean

---

## Database Schema

```
┌─────────────┐         ┌──────────────┐         ┌──────────────────┐
│  products   │         │   orders     │         │   order_items    │
│─────────────│         │──────────────│         │──────────────────│
│ id (PK)     │◄────────│ id (PK)      │◄────────│ id (PK)          │
│ name        │         │ customer_id  │         │ order_id (FK)    │
│ sku UNIQUE  │         │ total_amount │         │ product_id (FK)  │
│ price       │         │ status       │         │ quantity         │
│ quantity    │         │ created_at   │         │ unit_price       │
│ created_at  │         └──────────────┘         └──────────────────┘
└─────────────┘                 │
                                │
                        ┌───────┴──────┐
                        │  customers   │
                        │──────────────│
                        │ id (PK)      │
                        │ name         │
                        │ email UNIQUE │
                        │ phone        │
                        │ created_at   │
                        └──────────────┘
```

**Order status values:** `pending` | `confirmed` | `cancelled`

---

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/amod2003/-Inventory-Order-Management-System.git
cd -Inventory-Order-Management-System

# 2. Copy environment template
cp .env.example .env

# 3. Start all services (db → backend → frontend)
docker compose up --build

# 4. Open in browser
#    Frontend:   http://localhost:3000
#    API Docs:   http://localhost:8000/docs
#    Health:     http://localhost:8000/health
```

All three services start automatically. The backend waits for the database to be healthy before running migrations.

---

## Local Development (Without Docker)

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev   # http://localhost:5173
```

---

## API Reference

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products/` | List all products |
| `POST` | `/products/` | Create a product |
| `GET` | `/products/{id}` | Get product by ID |
| `PUT` | `/products/{id}` | Update product |
| `DELETE` | `/products/{id}` | Delete product (409 if in orders) |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/customers/` | List all customers |
| `POST` | `/customers/` | Create a customer |
| `GET` | `/customers/{id}` | Get customer by ID |
| `DELETE` | `/customers/{id}` | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/orders/` | List all orders |
| `POST` | `/orders/` | Create order (deducts stock) |
| `GET` | `/orders/{id}` | Get order with all items |
| `DELETE` | `/orders/{id}` | Cancel order (restores stock) |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check — returns `{"status": "ok"}` |
| `GET` | `/docs` | Interactive Swagger UI |

---

## Business Rules

- **SKU uniqueness** — duplicate SKU returns `409 Conflict`
- **Email uniqueness** — duplicate email returns `409 Conflict`
- **Stock validation** — order creation fails with `400` if any item exceeds available stock
- **Auto stock deduction** — placing an order reduces each product's quantity atomically
- **Stock restoration** — cancelling an order restores stock for every line item
- **Price snapshot** — `unit_price` locked at order time; future price edits don't affect history
- **Server-side total** — `total_amount` always calculated by backend (`qty × unit_price`)
- **FK protection** — products referenced in orders cannot be deleted (returns `409`)

---

## Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@host:5432/inventory_db
SENTRY_DSN=https://...@sentry.io/...
ENVIRONMENT=production
```

### Frontend (`.env.local`)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SENTRY_DSN=https://...@sentry.io/...
```

See `.env.example` for a full template.

---

## Deployment

### Backend → Render
1. Create a **PostgreSQL** database on Render (free tier)
2. Create a **Web Service**, connect this repo
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add env vars: `DATABASE_URL`, `SENTRY_DSN`, `ENVIRONMENT`, `PYTHON_VERSION=3.11.0`

### Frontend → Vercel
1. Import this repo on Vercel
2. Set **Root Directory**: `frontend`
3. Add env vars: `VITE_API_URL`, `VITE_SENTRY_DSN`
4. Deploy — Vercel auto-detects Vite

### Docker Hub
```bash
docker build -t amod123/inventory-backend:latest ./backend
docker push amod123/inventory-backend:latest

# Pull and run anywhere
docker pull amod123/inventory-backend:latest
```

---

## Git Branch Strategy

This project follows **Git Flow**:

```
main          ← production only (merged from develop via PR)
develop       ← integration branch
  ├── feature/project-setup       — scaffolding, .gitignore
  ├── feature/database-models     — SQLAlchemy models + Alembic
  ├── feature/product-api         — /products CRUD
  ├── feature/customer-api        — /customers CRUD
  ├── feature/order-api           — /orders + business logic
  ├── feature/frontend-setup      — React Router, Axios, Layout
  ├── feature/frontend-dashboard  — Dashboard + stat cards
  ├── feature/frontend-products   — Products page CRUD UI
  ├── feature/frontend-customers  — Customers page CRUD UI
  ├── feature/frontend-orders     — Orders + OrderDetail UI
  ├── docker/backend              — Backend Dockerfile
  ├── docker/frontend             — Frontend Dockerfile + nginx
  └── docker/compose              — docker-compose.yml
```

**Rules followed:**
- No direct commits to `main` or `develop`
- Each feature branch merged to `develop` after completion
- `develop` merged to `main` only after full end-to-end testing

---

## Project Structure

```
/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, Sentry init
│   │   ├── database.py          # SQLAlchemy engine + SessionLocal
│   │   ├── models/              # Product, Customer, Order, OrderItem
│   │   ├── schemas/             # Pydantic v2 request/response schemas
│   │   └── routers/             # products, customers, orders, health
│   ├── alembic/versions/        # Migration files
│   ├── Dockerfile               # Multi-stage: builder + slim runtime
│   ├── runtime.txt              # Python 3.11 for Render
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Layout, sidebar, forms
│   │   ├── pages/               # Dashboard, Products, Customers, Orders, Login
│   │   ├── services/api.js      # Axios base config + all API calls
│   │   └── context/             # NotificationContext (global toasts)
│   ├── public/icon.svg          # Custom SVG favicon
│   ├── nginx.conf               # Nginx config for SPA routing
│   └── Dockerfile               # Multi-stage: node build + nginx serve
├── docker-compose.yml           # db + backend + frontend + healthcheck
├── .env.example                 # Environment variable template
└── README.md
```

---

## Author

**Amod Kumar**
- GitHub: [@amod2003](https://github.com/amod2003)
- Email: amodchauhan9835@gmail.com
