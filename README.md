# Research & Reverse Engineering

## Reverse Engineered Platforms

* Levels.fyi
* Glassdoor
* AmbitionBox
* 6figr

---

# 1. Salary Listing Pages

## Observations

* Listings are heavily **filter-driven** (company, role, location, level).
* Data is **aggregated and normalized**, not raw submissions.
* Total compensation is always the **primary ranking signal**.
* Entry-level noise is reduced via confidence scoring / verification heuristics.

## What works

* Clean hierarchical structure (Company → Role → Level → Pay)
* Strong filtering experience (fast narrowing of datasets)
* Clear compensation hierarchy visibility

## What fails

* Overwhelming data density on large datasets
* Hard to understand salary reliability without context
* Some platforms mix outdated and recent data without clarity

## Key Differences

* Levels.fyi → highly structured, engineering-focused
* Glassdoor → broader but noisy and less precise
* 6figr → more modern filtering but smaller dataset

## Gaps

* Weak explanation of data quality
* Lack of transparency in how "averages" are computed
* Poor handling of duplicate or near-duplicate entries

---

# 2. Company Pages

## Observations

* Company pages act as **aggregated intelligence dashboards**
* Focus areas:

  * Median compensation
  * Distribution by level
  * Role breakdowns
* Companies become the primary navigation unit

## What works

* Median compensation gives fast snapshot understanding
* Level distribution provides career mapping clarity
* Easy comparison across companies

## What fails

* Static aggregation (not real-time or dynamic enough)
* Limited filtering inside company view
* Poor handling of global compensation differences (currency, region)

## Key Differences

* Levels.fyi → structured engineering ladder view
* Glassdoor → review-heavy, less quantitative depth
* AmbitionBox → India-focused, weaker global normalization

## Gaps

* No standardized global compensation model
* Weak handling of multiple currencies and pay periods
* Limited decision intelligence (mostly descriptive, not actionable)

---

# 3. Submission Flows

## Observations

* Submission is the **weakest controlled surface** across all platforms
* Heavy reliance on user honesty with minimal validation
* Most platforms treat submissions as “raw input”

## What works

* Simple forms improve contribution rate
* Minimal friction increases data volume
* Optional fields allow flexible input

## What fails

* High noise from unverified submissions
* Duplicate entries across companies and roles
* Inconsistent formatting (levels, titles, currencies)

## Key Differences

* Levels.fyi → stricter structured submission model
* Glassdoor → open but noisy
* AmbitionBox → semi-structured but inconsistent

## Gaps

* No strong duplicate detection
* Weak normalization before storage
* Lack of confidence scoring at ingestion

---

# 4. Comparison Features

## Observations

* Comparison is the **highest value decision feature**
* Always reduces dataset to:

  * Base
  * Bonus
  * Stock
  * Total compensation
  * Level equivalence

## What works

* Side-by-side structured comparison improves decision clarity
* Delta-based differences (absolute + percentage) are effective
* Level normalization helps cross-company comparisons

## What fails

* Currency mismatches often ignored
* Pay period inconsistencies (monthly vs yearly)
* Weak contextual explanation of differences

## Key Differences

* Levels.fyi → strongest comparison engine (clean + structured)
* Glassdoor → weak comparison, mostly static views
* 6figr → modern UX but less depth in normalization

## Gaps

* No unified compensation standard across platforms
* Missing “decision-ready scoring layer”
* Weak handling of non-equivalent roles across companies

---

# Summary Insight

Across all platforms, the core pattern is:

> Data is **structured and queryable**, partially comparable, but not fully decision-ready.

---

#  Key System Opportunity (Your Build Direction)

The gaps across all platforms converge into 4 major problems:

1.  Weak normalization (company, level, currency, role)
2.  No strong data quality scoring
3.  Inconsistent compensation representation globally
4.  Comparison lacks decision intelligence layer

---

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
