# SureService — Trust-Scored Peer-to-Peer Service Marketplace

A peer-to-peer service marketplace built with the MERN stack (MongoDB, Express, React 19, Node.js + TypeScript). SureService connects customers with skilled local professionals—such as electricians, plumbers, tutors, and cleaners—ranking providers using an objective **Trust Score (0–100)** calculated from verified job completions, client retention, and audited credentials rather than easily manipulated star ratings.

## Features

- **Behavior-Based Trust Score Engine (0–100)** — A deterministic rating system structured across 5 core evaluation pillars with diminishing returns and reliability deductions.
- **Customer-Only Completion Authority** — Providers cannot mark their own jobs completed; only the customer who booked the service can confirm completion.
- **Gated Contact Details** — Direct phone and email are revealed only after a booking is accepted to protect privacy and prevent spam.
- **Admin Verification Queue** — Platform administrators audit government IDs and professional licenses, awarding verified badges and Trust Score boosts.
- **Provider Cancellation Penalty** — Provider cancellations after accepting a booking incur automated score penalties (-10 pts), protecting customer reliability.
- **Role-Based Portals** — Dedicated dashboards for **Customers**, **Service Providers**, and **Admins** with 1-click interactive demo logins.

## Tech Stack

| Layer    | Tech                                    |
| -------- | --------------------------------------- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, Radix UI |
| Backend  | Express, TypeScript, MongoDB (Mongoose) |
| Auth     | JWT (HttpOnly cookie access + refresh token rotation), bcryptjs |

## The 5 Pillars of the Trust Score Model

| Pillar | Weight | Description |
| :--- | :---: | :--- |
| **Confirmed Completed Jobs** | ~35% (Max 35 pts) | Confirmed only by authentic clients upon service delivery with non-linear diminishing returns. |
| **Identity & License Verification** | ~25% (Max 25 pts) | Admin-audited government ID or professional trade license. |
| **Client Retention & Repeat Service** | ~15% (Max 15 pts) | Unique repeat clients who booked and confirmed multiple jobs. |
| **Profile Completeness & Location** | ~15% (Max 15 pts) | Verified phone, experience, trade categories, hourly rate, and service area. |
| **Reliability Deductions** | Penalty | $-10$ pts deduction for each job cancelled by the provider after accepting. |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB instance (Local or MongoDB Atlas)

### Installation

```bash
npm install
```

### Environment Configuration

#### 1. Server Environment (`server/.env`)
Copy `server/.env.example` to `server/.env`:

```env
PORT=9000
MONGODB_URI=mongodb://127.0.0.1:27017/sureservice
ACCESS_TOKEN_SECRET=your_jwt_access_secret_key_minimum_32_characters
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key_minimum_32_characters
ACCESS_TOKEN_EXPIRESIN=900
REFRESH_TOKEN_EXPIRESIN=604800
SALT_ROUNDS=10
CLIENT_URL=http://localhost:5173
DEMO_USER_PASSWORD=DemoPassword123!
```

#### 2. Client Environment (`client/.env`)
Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:9000
```

#### 3. Production Deployment (Vercel)
When deploying to Vercel via the root `vercel.json` configuration, configure these environment variables directly in the **Vercel Project Dashboard** (`Settings → Environment Variables`).


### Seed Database with Sample Data

```bash
npm run seed
```

Seeds sample service providers across multiple trade categories and cities, active bookings, and qualitative reviews.

### Run Development Servers

```bash
npm run dev:server   # Express on http://localhost:9000
npm run dev:client   # Vite on http://localhost:5173
```

## Demo Credentials

| Role | Email | Password | Account Details |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@sureservice.com` | `DemoPassword123!` | Bethlehem Girma (Books & completes jobs) |
| **Provider** | `provider@sureservice.com` | `DemoPassword123!` | Abebe Kebede (Master Electrician, 96 Trust Score) |
| **Admin** | `admin@sureservice.com` | `DemoPassword123!` | Dawit Haile (Audits ID verification queue) |

## API Overview

### Authentication (`/api/auth`)
- `POST /auth/signup` — Register as customer or service provider
- `POST /auth/login` — Sign in and receive HttpOnly session cookies
- `POST /auth/demo-login` — 1-click login for `customer`, `provider`, or `admin`
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Invalidate refresh token session
- `GET /auth/me` — Get current authenticated user profile

### Service Providers (`/api/providers`)
- `GET /providers` — Search and filter providers by category, city, sub-city, minScore, and verified status
- `GET /providers/categories` — Distinct service trade categories
- `GET /providers/:id` — Provider profile with Trust Score breakdown and gated contact details
- `PUT /providers/profile` — Update rates, bio, skills, and location
- `POST /providers/verification` — Submit trade license / national ID for review

### Bookings (`/api/bookings`)
- `POST /bookings` — Create a service request (customer only)
- `GET /bookings` — List bookings for current user
- `GET /bookings/:id` — View booking details (reveals contact details once accepted)
- `PATCH /bookings/:id/accept` — Accept job request (provider only)
- `PATCH /bookings/:id/decline` — Decline job request (provider only)
- `PATCH /bookings/:id/complete` — Confirm job completion (**customer only**, updates provider trust score)
- `PATCH /bookings/:id/cancel` — Cancel booking (provider cancellation incurs -10 penalty)

### Admin Operations (`/api/admin`)
- `GET /admin/stats` — Platform health and marketplace metrics
- `GET /admin/verifications` — Pending provider verification queue
- `PATCH /admin/verifications/:id/approve` — Approve document (+25 Trust Score, Verified Badge)
- `PATCH /admin/verifications/:id/reject` — Reject document with feedback reason
