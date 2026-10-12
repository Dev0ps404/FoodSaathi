# 🌿 FoodRescue AI —: AI-Powered Food Rescue Network

> **"Rescue Food. Reduce Waste. Feed Communities."**
> A modern , responsive, and  full-stack web platform connecting Food Donors (Hotels, Caterers, Messes), Partner NGOs (Shelters, Food Banks), and Volunteer Couriers using explainable AI triage, route optimization, and a dynamic real-time Food Rescue Simulator.

---

## 🚀 Key Features

### 1. 🎯 Role-Based Architecture & 1-Click Instant Demo Login
- **Donor Role**: Publish surplus food batches, specify safe-consumption deadlines, and track real-time courier pickups.
- **NGO Role**: Manage daily meal absorption capacity, set dietary category preferences, and claim incoming donations.
- **Volunteer Courier Role**: Step-by-step dispatch workflow (*Assigned ➔ Accepted ➔ Picked Up ➔ Delivered*) with turn-by-turn route suggestions.
- **Admin Role**: Global oversight over metrics, network health, and simulated dispatches.
- **Instant Role Switcher**: Switch perspectives with a single click in the top navigation bar during hackathon presentations.

### 2. 🧠 Explainable AI Capabilities
- **Smart Donor–NGO Matching**: Multi-criteria weighted algorithm (Proximity 30%, Quantity fit 25%, Category match 20%, Reliability 15%, Urgency 10%) providing percentage match scores and clear human-readable factors.
- **Food Priority & Safety Triage**: Categorizes food into `Critical (<3h)`, `High (3-6h)`, `Medium (6-12h)`, and `Low (>12h)` with strict enforcement of food safety rules.
- **Smart Volunteer Dispatch**: Recommends best couriers based on distance to pickup, vehicle capacity, active load, and performance rating.
- **Duplicate Donation Shield**: Flags accidental identical submissions across donors, locations, and time windows.
- **Food Demand Forecaster**: Projects 7-day surplus vs shelter demand patterns based on historical event surges.
- **Route Optimizer (TSP Heuristic)**: Minimizes multi-stop transit distance and time for volunteer routes.

### 3. 🌟 Flagship WOW Feature: Food Rescue Simulator
- **Interactive Configuration**: Sliders for Surplus Meals (100–5,000), Partner NGOs (2–30), Volunteers (2–50), Donor Hubs (1–15), and Radius (2–30 km).
- **Multi-Stage Animated Execution**: Visual progress across 5 allocation stages.
- **Real Dynamic Calculations**: Calculates exact portion allocations, volunteer trips, baseline vs AI waste reduction, CO₂ emissions averted, and bottleneck diagnostic insights.
- **Visual Analytics**: Interactive Recharts graphs and full searchable Dispatch Ledger table.

### 4. 🗺️ Interactive Leaflet Map
- OpenStreetMap integration with custom styled SVG pins for Donors, Partner NGOs, Volunteers, and Urgent donations.
- Active route polyline visualizations and popup quick-action cards.
- Interactive filter toolbar to isolate map layers.

---

## 🛠️ Technology Stack

- **Frontend (`frontend/`)**: React.js (Vite), Tailwind CSS, React Router DOM, Axios, Recharts, Leaflet & React-Leaflet, Lucide React, Canvas Confetti.
- **Backend (`backend/`)**: Node.js & Express.js, MongoDB & Mongoose, JWT (JSON Web Tokens), bcryptjs, CORS, Dotenv.
- **Resilience**: Zero-friction hybrid architecture — full REST API backend when MongoDB is active, with seamless client-side state fallback ensuring 100% stability during live demos.

---

## 📂 Project Structure

```
Mini project/
├── frontend/                   # React Frontend (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Sidebar, Modal, Badge, FreshnessTimer, ToastContainer
│   │   │   ├── landing/        # Hero, StatsSection, HowItWorks, FeaturesSection, ImpactSection, Testimonials, Footer
│   │   │   ├── donations/      # DonationCard, DonationFormModal, DuplicateWarningModal, DonationDetailModal
│   │   │   ├── ai/             # MatchingModal, VolunteerAssignModal
│   │   │   ├── map/            # InteractiveRescueMap (Leaflet)
│   │   │   └── simulator/      # SimulatorEngine (Interactive Sliders, Recharts, Ledger Table)
│   │   ├── context/            # AuthContext, DataContext, ToastContext
│   │   ├── pages/              # Landing, Dashboard, Donations, NGOs, Volunteers, Deliveries, AIMatching, Simulator, MapView, Analytics, Settings, Login, Register
│   │   ├── services/           # api.js, mockData.js
│   │   ├── utils/              # aiAlgorithms.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Express REST Backend
│   ├── config/                 # db.js (Mongoose connection & fallback)
│   ├── controllers/            # auth, donation, ngo, volunteer, delivery, analytics, simulator
│   ├── middleware/             # authMiddleware, errorHandler
│   ├── models/                 # User, Donation, NGOProfile, VolunteerProfile, Delivery
│   ├── routes/                 # Express API routes
│   ├── seed/                   # seedData.js, seedRunner.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root project orchestration
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- (Optional) MongoDB local service running on port `27017`

### 1. Install All Dependencies
```bash
npm run install:all
```
*Or install separately:*
```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. (Optional) Seed the Database
If you have local MongoDB installed and running:
```bash
npm run seed
```

### 3. Start the Development Servers
From the root directory:
```bash
# Starts both Backend (Port 5000) and Frontend (Port 5173) concurrently
npm run dev
```

Or run them in separate terminals:
- **Frontend**: `cd frontend && npm run dev` ➔ [http://localhost:5173](http://localhost:5173)
- **Backend**: `cd backend && npm run dev` ➔ [http://localhost:5000](http://localhost:5000)

---

## 👥 Demo Accounts (1-Click Login)

| Role | Name / Organization | Email | Password |
|---|---|---|---|
| **Donor** | Green Feast Caterers | `donor@foodrescue.ai` | `password123` |
| **NGO** | Hope Food Shelter | `ngo@foodrescue.ai` | `password123` |
| **Volunteer** | Alex Rivera | `volunteer@foodrescue.ai` | `password123` |
| **Admin** | System Administrator | `admin@foodrescue.ai` | `password123` |

*Note: You can also switch roles anytime directly from the top navigation bar without logging out!*

---

## 📡 REST API Summary

- `POST /api/auth/register` — Register user with specified role.
- `POST /api/auth/login` — Authenticate & receive JWT
- `GET /api/donations` — List all donations with category/urgency/status filters.
- `POST /api/donations` — Create new food surplus batch (AI priority triage)
- `GET /api/donations/:id/matches` — Compute top-3 AI matched NGOs
- `GET /api/ngos` — List partner NGOs and receiving capacity
- `POST /api/ngos/requirements` — Update NGO food demands & radius
- `GET /api/volunteers` — Volunteer fleet roster with availability
- `PUT /api/volunteers/availability` — Toggle volunteer online/offline
- `GET /api/deliveries` — List rescue missions
- `POST /api/deliveries/assign` — Dispatch courier to rescue mission
- `PUT /api/deliveries/:id/status` — Advance status (`Accepted` ➔ `Picked Up` ➔ `Delivered`)
- `POST /api/simulator/run` — Execute dynamic parametric food rescue simulation
- `GET /api/analytics/summary` — Community impact and carbon savings audit

---

## 🤝 Contributing to FoodSaathi

We welcome contributions that help improve FoodSaathi.

### Contribution Process
1. Create a separate branch for your changes.
2. Make your changes and test them.
3. Write a clear commit message.
4. Submit a Pull Request for review.

### Best Practices
- Keep code clean and readable.
- Test changes before submitting them.
- Never commit API keys or secrets.
