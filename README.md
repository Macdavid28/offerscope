# OfferScope: Compensation Intelligence System

OfferScope is a production-grade, full-stack platform designed to provide transparency into the modern workforce's compensation. It allows users to anonymously share, explore, and compare salary data with high-fidelity normalization and intelligence.

## 🚀 Key Features

- **Intelligence Dashboard**: A high-performance table with filtering, pagination, and sorting by Total Compensation.
- **Side-by-Side Comparison**: Select any two records to see a detailed delta analysis with "Best Offer" highlighting.
- **Smart Ingestion**: A validation-heavy form that normalizes company names and levels server-side.
- **Confidence Scoring**: A logic-based system that ranks data reliability based on completeness.
- **Company Deep-Dives**: Aggregated stats (medians, leveling distribution) for specific organizations.
- **Premium UI**: Built with a "dark-mode first" aesthetic using Tailwind CSS, featuring glassmorphism and smooth micro-animations.

---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Yup
- **Data Fetching**: Axios
- **Icons**: Lucide React

### Backend (Server)
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: Cookie-based (Middleware ready)

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL instance

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in `/server` with:
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/offerscope"
  PORT=5000
  ```
- Initialize Database:
  ```bash
  npx prisma db push
  npx prisma generate
  ```
- Start Server:
  ```bash
  npm run server
  ```

### 3. Frontend Setup
```bash
cd client
npm install
```
- Create a `.env.local` file in `/client` with:
  ```env
  NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
  ```
- Start Client:
  ```bash
  npm run dev
  ```

---

## 🛣 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/compensations/ingest-salary` | Anonymously submit compensation data |
| `GET` | `/compensations/salaries` | Fetch paginated & filtered salary feed |
| `GET` | `/compensations/compare` | Side-by-side analysis of two IDs |
| `GET` | `/compensations/stats/:company` | Get medians and distribution for a company |

---

## 📐 Architecture & Logic

### Data Normalization
The system ensures that "Google", "Google Inc.", and "google" are treated as a single entity using a server-side normalization utility. Similarly, raw levels like "L4" or "SDE II" are mapped to a standardized internal leveling system (Junior, Mid, Senior, Staff).

### Confidence Scoring
Each record is assigned a score based on data richness:
- **Full Package** (Base + Bonus + Stock + Experience) → **100% Confidence**
- **Base Only** → **40% Confidence**

### UI/UX Philosophy
- **Zero-Redirect Comparison**: Use the floating "Intelligence Pool" bar on the dashboard to collect records before initiating a comparison.
- **Responsive Tables**: Custom-built HTML/Tailwind tables designed for performance and mobile responsiveness.

---

## 📄 License
MIT
