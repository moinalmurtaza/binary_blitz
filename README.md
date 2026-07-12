<div align="center">

<img src="https://img.shields.io/badge/Binary-Blitz-A41034?style=for-the-badge" alt="Binary Blitz" />

# Binary Blitz — Competitive Programming Platform

**A production-grade Competitive Programming training platform**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-GitHub%20Pages-A41034?style=for-the-badge)](https://moinalmurtaza.github.io/binary_blitz/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.16-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-010101?style=flat-square&logo=socket.io)](https://socket.io)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis)](https://redis.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com)

</div>

---

## 📖 Table of Contents

- [Live Demo](#-live-demo)
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Start Infrastructure (Docker)](#2-start-infrastructure-docker)
  - [3. Setup Backend](#3-setup-backend)
  - [4. Setup Frontend](#4-setup-frontend)
- [Environment Variables](#-environment-variables)
- [Demo Accounts](#-demo-accounts)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Live Demo

> **Frontend (GitHub Pages):** [https://moinalmurtaza.github.io/binary_blitz/](https://moinalmurtaza.github.io/binary_blitz/)

> ⚠️ The live demo uses a **mock authentication layer** — no backend is required to explore the UI. Click any demo account button on the Login page to log in instantly.

### Quick Access (Demo)

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 🔴 **Admin** | `admin@binaryblitz.dev` | `password123` | Full access — Admin Panel + all features |
| 🟡 **Trainer** | `trainer@binaryblitz.dev` | `password123` | Manage Schedule, view all content |
| 🟢 **Student** | `student1@binaryblitz.dev` | `password123` | Problem tracking, contests, roadmap |

---

## 🎯 Overview

**Binary Blitz** is a competitive programming training platform. It provides an end-to-end ecosystem for algorithmic training, contest management, and academic progress tracking — inspired by the pedagogical approach of Harvard's CS50 and modeled after Codeforces contest systems.

The platform supports **3 user roles** (Admin, Trainer, Student), a **17-week structured curriculum**, ICPC-style rated contests, a real-time chat system, and an interactive learning hub.

---

## ✨ Features

### 🏠 Dashboard
- Personalized welcome with rating tier badge
- Interactive rating history chart (Recharts)
- Topic strengths bar chart
- GitHub-style activity heatmap (364-day)
- Live contest list & mini leaderboard
- CP Roadmap progress widget

### 📚 Course Roadmap
- 3-phase, 17-week curriculum (C → C++ STL → DSA)
- 34 lectures with full topic breakdowns
- Weekly & phase-end contests
- Grand Final event with ICPC-style format

### 🗺️ Schedule Tracker
- Phase → Week → Day accordion tree
- Per-day resource links (Slides, PDF, YouTube, Drive, etc.)
- Day completion toggle with backend persistence
- Filters by day type (Theory, Problem Set, Contest, etc.)
- Today's sessions highlighted widget

### 📝 Problem Sets — DSA Sheet
- 34-topic, 130+ problem curated sheet
- Per-problem solved tracking (localStorage)
- Progress bar per topic and overall
- Direct LeetCode links with difficulty badges

### 🏆 Contests
- Live / Upcoming / Past tabs
- ICPC-style contest detail page
- Scoreboard with frozen standings support
- Duration, creator, problem count at a glance

### 🥇 Leaderboard
- Top-3 podium visualization
- Full 50-user table with Codeforces-style rating tiers:
  - Newbie → Pupil → Specialist → Expert → Candidate Master → Master → Grandmaster → Legendary GM

### 📖 Learning Hub
- Book, Slides, Lecture Notes, Video, Template, Algorithm cards
- Search + type filter
- Download counter + author attribution

### 💬 Real-time Chat
- Socket.IO multi-room chat
- Channels: `#general`, `#contest-chat`, `#algorithms-study`, `#random`
- Optimistic UI updates

### 📅 Event Calendar
- Monthly grid calendar with event dots
- Contest / Lecture / Meeting event types
- Side-panel upcoming events list with Google Meet links

### 👥 Club Directory (Community)
- Member cards with Codeforces handles
- Role / category badges

### 🛡️ Admin Control Panel
- User management (CRUD)
- Problem management
- Contest management
- Resource management
- Audit log viewer

### 👨‍🏫 Instructor Schedule Manager
- Create / edit Phases, Weeks, Days
- Attach resources (links) to each day
- Publish / lock day status

### 🔐 Authentication
- JWT-based auth with role-based access control
- Supabase Auth integration (optional)
- Demo accounts with instant mock login

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.3 | Build tool & dev server |
| TailwindCSS | 3.4 | Utility-first styling |
| Framer Motion | 11.2 | Animations & transitions |
| React Router | 6.23 | Client-side routing |
| TanStack Query | 5.45 | Server state management & caching |
| Recharts | 2.12 | Data visualization charts |
| Socket.IO Client | 4.8 | Real-time chat |
| Lucide React | 0.395 | Icon library |
| EB Garamond + Inter + JetBrains Mono | — | Typography |
| Monaco Editor | 4.6 | Code editor (problem submissions) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime |
| Express | 4.19 | HTTP framework |
| TypeScript | 5.5 | Type safety |
| Prisma | 5.16 | ORM & database migrations |
| PostgreSQL | 15 | Primary database |
| Redis | 7 | Caching & job queue |
| BullMQ | 5.8 | Background job processing (submissions) |
| Socket.IO | 4.7 | Real-time WebSocket server |
| JWT | 9.0 | Authentication tokens |
| Supabase | 2.108 | Auth & storage provider |
| Helmet | 7.1 | HTTP security headers |
| Zod | 3.23 | Request validation |
| bcryptjs | 2.4 | Password hashing |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker Compose | Local PostgreSQL + Redis |
| GitHub Pages | Frontend hosting (live demo) |
| Supabase | Auth + managed PostgreSQL (production option) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│   React + Vite + TailwindCSS + Framer Motion                │
│   TanStack Query (REST) + Socket.IO Client (WS)             │
└────────────────────┬──────────────────────┬─────────────────┘
                     │ HTTP/REST             │ WebSocket
                     ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express API Server                         │
│   ├── /api/auth          — JWT Auth (login/register/me)     │
│   ├── /api/problems      — Problem CRUD & submission judge  │
│   ├── /api/contests      — Contest management & scoreboard  │
│   ├── /api/leaderboard   — Rating-based ranking             │
│   ├── /api/resources     — Learning hub resources           │
│   ├── /api/schedule      — Phase/Week/Day/Progress tracking │
│   ├── /api/admin         — Admin management endpoints       │
│   └── Socket.IO          — Real-time chat rooms             │
└───────┬──────────────────┬──────────────────────────────────┘
        │                  │
        ▼                  ▼
┌───────────────┐  ┌──────────────────────────────────────────┐
│  PostgreSQL   │  │  Redis                                    │
│  (Prisma ORM) │  │  ├── BullMQ — Code submission job queue  │
│               │  │  └── Session cache                        │
└───────────────┘  └──────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

The Prisma schema defines **15 models** across the entire platform:

```
Profile          — Users (Student / Trainer / Admin / Alumni / Guest)
  ├── TrainerProfile    — Extended trainer fields
  └── AlumniProfile     — Alumni company & mentorship info

Problem          — Problem statements with test cases
Contest          — ICPC-style contests
  └── ContestProblem    — Problem-contest mapping with aliases

Submission       — Code submissions with verdict & runtime
RatingHistory    — Per-contest rating delta tracking
Clarification    — Contest Q&A clarifications
Resource         — Learning hub files (Books, Slides, Videos...)
Announcement     — Global & contest-scoped announcements
Event            — Calendar events (Contests, Lectures, Meetings)
ChatMessage      — Real-time chat room messages
Notification     — Per-user notification inbox
AuditLog         — Admin action audit trail

Phase            — Curriculum phase (e.g. "C Programming")
  └── Week             — Weekly block within a phase
      └── Day          — Individual sessions (Theory/Problem Set/Contest)
          └── DayResource   — Attached links (PDF, YouTube, Slide...)
StudentProgress  — Per-user day completion tracking
```

**Enums:** `Role`, `Category`, `SubmissionStatus`, `ResourceType`, `ContestStatus`, `DayType`

---

## 📸 Screenshots

> Visit the [Live Demo](https://moinalmurtaza.github.io/binary_blitz/) to see the full interactive experience.

| Page | Description |
|---|---|
| **Home** | Hero landing page with stats, news grid, and feature showcase |
| **Login** | Glassmorphism auth card with demo account quick-fill |
| **Dashboard** | Rating charts, heatmap, contests, leaderboard, quick access |
| **Schedule Tracker** | Phase/Week/Day accordion with progress tracking |
| **Course Roadmap** | 3-phase, 17-week curriculum with lecture topics |
| **Problem Sets** | 34-topic DSA sheet with 130+ LeetCode problems |
| **Contests** | Live / Upcoming / Ended tabs with ICPC-style detail |
| **Leaderboard** | Top-3 podium + full rating tier table |
| **Learning Hub** | Resource cards with type filters and download counts |
| **Chat** | Multi-room real-time chat with Socket.IO |
| **Calendar** | Monthly grid + upcoming events panel |
| **Admin Panel** | Full management dashboard for admins |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org)
- **Docker** & **Docker Compose** — [Download](https://www.docker.com)
- **npm** v9+

### 1. Clone the Repository

```bash
git clone https://github.com/moinalmurtaza/binary_blitz.git
cd binary_blitz
```

### 2. Start Infrastructure (Docker)

This starts PostgreSQL (port 5432) and Redis (port 6379):

```bash
docker-compose up -d
```

Verify containers are running:

```bash
docker ps
# Should show: ps_postgres, ps_redis
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and fill in your values
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, etc.

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with demo data
npm run prisma:seed

# Start the backend dev server (port 5000)
npm run dev
```

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your VITE_API_URL and Supabase keys

# Start the Vite dev server (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Both Simultaneously (from root)

```bash
# From the PS/ root directory
npm install         # Installs root workspace deps
npm run dev         # Starts both backend (5000) and frontend (5173) concurrently
```

---

## 🔧 Environment Variables

### Backend — `backend/.env`

```env
# Database
DATABASE_URL="postgresql://postgres:postgres_password@localhost:5432/ps_db"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Supabase (optional — for Supabase Auth)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### Frontend — `frontend/.env.local`

```env
# Backend API
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"

# Supabase (optional — for Supabase Auth)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

> ⚠️ **Never commit `.env` files with real secrets.** The `.gitignore` already excludes them.

---

## 👤 Demo Accounts

These accounts are seeded into the database by `npm run prisma:seed`:

| Role | Email | Password | Capabilities |
|------|-------|----------|--------------|
| 🔴 **Admin** | `admin@binaryblitz.dev` | `password123` | All features + Admin Panel |
| 🟡 **Trainer** | `trainer@binaryblitz.dev` | `password123` | Manage Schedule, upload resources |
| 🟢 **Student (ICPC)** | `student1@binaryblitz.dev` | `password123` | Standard student access |
| 🟢 **Student (Beginner)** | `student2@binaryblitz.dev` | `password123` | Standard student access |

> The frontend's **Login page has one-click demo account buttons** to auto-fill credentials.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login & receive JWT | Public |
| `GET` | `/auth/me` | Get current user profile | 🔒 JWT |
| `POST` | `/auth/logout` | Logout (clears token) | 🔒 JWT |

### Problems
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/problems` | List problems (filter, search, paginate) | 🔒 JWT |
| `GET` | `/problems/:id` | Get problem detail + test cases | 🔒 JWT |
| `POST` | `/problems` | Create problem | 🔒 Admin/Trainer |
| `PUT` | `/problems/:id` | Update problem | 🔒 Admin/Trainer |
| `DELETE` | `/problems/:id` | Delete problem | 🔒 Admin |
| `POST` | `/problems/:id/submit` | Submit solution (queued via BullMQ) | 🔒 JWT |

### Contests
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/contests` | List all contests | 🔒 JWT |
| `GET` | `/contests/:id` | Contest detail + scoreboard | 🔒 JWT |
| `POST` | `/contests` | Create contest | 🔒 Admin/Trainer |
| `PUT` | `/contests/:id` | Update contest | 🔒 Admin/Trainer |

### Schedule / Roadmap
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/schedule/phases` | Get full roadmap (phases → weeks → days) | 🔒 JWT |
| `GET` | `/schedule/progress/summary` | Get student progress summary | 🔒 JWT |
| `POST` | `/schedule/progress/toggle` | Toggle day completion | 🔒 JWT |
| `POST` | `/schedule/phases` | Create phase | 🔒 Admin/Trainer |
| `POST` | `/schedule/weeks` | Create week | 🔒 Admin/Trainer |
| `POST` | `/schedule/days` | Create day | 🔒 Admin/Trainer |
| `POST` | `/schedule/resources` | Add resource to day | 🔒 Admin/Trainer |

### Leaderboard & Resources
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/leaderboard` | Top users by rating (`?limit=N`) | 🔒 JWT |
| `GET` | `/resources` | Learning hub resources | 🔒 JWT |
| `POST` | `/resources` | Upload resource | 🔒 Admin/Trainer |

---

## 📁 Project Structure

```
PS/
├── 📄 README.md
├── 📄 docker-compose.yml          # PostgreSQL + Redis services
├── 📄 package.json                # Monorepo root (npm workspaces)
├── 📄 setup-db.sh                 # DB setup helper script
│
├── 🖥️ frontend/                   # React SPA
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── App.tsx                # Router + protected routes
│       ├── main.tsx
│       ├── index.css              # Global styles + CSS variables
│       ├── features/
│       │   ├── auth/              # Login, Register, AuthContext
│       │   ├── dashboard/         # DashboardPage
│       │   ├── problems/          # ProblemsPage, ProblemDetailPage
│       │   ├── contests/          # ContestsPage, ContestDetailPage
│       │   ├── leaderboard/       # LeaderboardPage
│       │   ├── learning/          # LearningPage (Learning Hub)
│       │   ├── chat/              # ChatPage (Socket.IO)
│       │   ├── calendar/          # CalendarPage
│       │   ├── community/         # CommunityPage (Club Directory)
│       │   ├── admin/             # AdminPage
│       │   ├── schedule/          # ScheduleTrackerPage, InstructorSchedulePage
│       │   └── roadmap/           # CourseRoadmapPage
│       ├── layouts/
│       │   ├── DashboardLayout.tsx  # Sidebar + header + footer wrapper
│       │   └── Sidebar.tsx
│       ├── pages/
│       │   └── HomePage.tsx       # Public landing page
│       └── services/
│           ├── api.ts             # Axios instance
│           └── supabase.ts        # Supabase client
│
└── ⚙️ backend/                    # Express API
    ├── package.json
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma          # 15 models, 6 enums
    │   └── seed.ts                # Database seeding script
    └── src/
        ├── app.ts                 # Server entry + Socket.IO setup
        ├── config/
        │   ├── db.ts              # Prisma client
        │   ├── redis.ts           # Redis/ioredis client
        │   └── supabase.ts        # Supabase admin client
        ├── middleware/
        │   └── auth.ts            # JWT + role middleware
        ├── routes/
        │   ├── authRoutes.ts
        │   ├── problemRoutes.ts
        │   ├── contestRoutes.ts
        │   ├── leaderboardRoutes.ts
        │   ├── resourceRoutes.ts
        │   ├── scheduleRoutes.ts
        │   └── adminRoutes.ts
        ├── controllers/
        │   ├── authController.ts
        │   ├── problemController.ts
        │   ├── contestController.ts
        │   ├── leaderboardController.ts
        │   ├── resourceController.ts
        │   ├── scheduleController.ts
        │   └── adminController.ts
        └── jobs/
            └── submissionWorker.ts  # BullMQ code judge worker
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     A new feature
fix:      A bug fix
docs:     Documentation changes only
style:    Formatting, missing semicolons, etc.
refactor: Code change that neither fixes a bug nor adds a feature
perf:     Performance improvements
test:     Adding or updating tests
chore:    Build process or tooling changes
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Binary Blitz**

[![GitHub](https://img.shields.io/badge/GitHub-moinalmurtaza-181717?style=flat-square&logo=github)](https://github.com/moinalmurtaza/binary_blitz)

</div>
