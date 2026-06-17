# Inventory & Order Management System

A production-ready full-stack application for managing products, customers, and orders — built with FastAPI, React, PostgreSQL, and Docker.

---

## Architecture

```
┌─────────────────┐     HTTP      ┌─────────────────┐     SQL      ┌──────────────┐
│   React Frontend│ ────────────► │  FastAPI Backend │ ──────────► │  PostgreSQL  │
│   (Vite + nginx)│               │  (Uvicorn)       │             │  Database    │
│   Port 3000     │               │  Port 8000       │             │  Port 5432   │
└─────────────────┘               └─────────────────┘             └──────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Python 3.11, FastAPI, SQLAlchemy, Pydantic v2 |
| Database | PostgreSQL 15, Alembic migrations |
| Container | Docker (multi-stage builds), Docker Compose |

---

## Features

- **Product Management** — CRUD with unique SKU enforcement and stock tracking
- **Customer Management** — CRUD with unique email validation
- **Order Management** — Multi-item orders with automatic inventory deduction and stock restoration on cancel
- **Business Logic** — Insufficient stock check, auto total calculation, price snapshot at order time
- **Dashboard** — Live stats: total products, customers, orders, and low-stock alerts
- **API Docs** — Auto-generated Swagger UI at `/docs`
- **Health Check** — `GET /health` endpoint for deployment monitoring

---

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/amod2003/-Inventory-Order-Management-System.git
cd -Inventory-Order-Management-System

# 2. Copy environment template
cp .env.example .env

# 3. Build and start all services
docker compose up --build

# 4. Open the app
#    Frontend:  http://localhost:3000
#    API docs:  http://localhost:8000/docs
#    Health:    http://localhost:8000/health
```

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

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

npm run dev   # http://localhost:5173
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/products/` | Create product |
| GET | `/products/` | List all products |
| GET | `/products/{id}` | Get product by ID |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| POST | `/customers/` | Create customer |
| GET | `/customers/` | List all customers |
| GET | `/customers/{id}` | Get customer by ID |
| DELETE | `/customers/{id}` | Delete customer |
| POST | `/orders/` | Create order (deducts stock) |
| GET | `/orders/` | List all orders |
| GET | `/orders/{id}` | Get order by ID |
| DELETE | `/orders/{id}` | Cancel order (restores stock) |

Full interactive docs: `http://localhost:8000/docs`

---

## Business Rules

- Product SKU must be unique (409 Conflict if duplicate)
- Customer email must be unique (409 Conflict if duplicate)
- Product quantity cannot be negative
- Orders are rejected if any item exceeds available stock
- Creating an order automatically reduces stock for each item
- Cancelling an order restores stock for each item
- Order total is calculated automatically by the backend
- Unit price is captured at order time (price snapshot)

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `DATABASE_URL` (from Render PostgreSQL)

### Frontend → Vercel

1. Import repository on Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`

### Docker Hub

```bash
docker build -t your-username/inventory-backend:latest ./backend
docker push your-username/inventory-backend:latest
```

---

## Git Branch Strategy

```
main          ← production only
develop       ← integration branch
  ├── feature/project-setup
  ├── feature/database-models
  ├── feature/product-api
  ├── feature/customer-api
  ├── feature/order-api
  ├── feature/frontend-setup
  ├── feature/frontend-dashboard
  ├── feature/frontend-products
  ├── feature/frontend-customers
  ├── feature/frontend-orders
  ├── docker/backend
  ├── docker/frontend
  ├── docker/compose
  └── docs/readme
```