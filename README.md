# IPL T20 Live Dashboard

This project is a mobile-first IPL T20 dashboard that displays live match info, upcoming matches, points table, and full match schedule. Built with Next.js, TypeScript, Tailwind CSS, and Node.js API routes.

## 🚀 Live Demo

**Production URL:** https://ipl-livestream.netlify.app/

**GitHub Repository:** https://github.com/OptimizationGuru/ipl_dashboard

Experience the full application with real-time match simulation, live score updates, and comprehensive IPL data management.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Component Architecture](#component-architecture)
* [Data Sources & APIs](#data-sources--apis)
* [Rendering Strategies](#rendering-strategies)
* [Setup & Installation](#setup--installation)
* [API Endpoints](#api-endpoints)
* [Pages & Routes](#pages--routes)
* [Development](#development)
* [Deployment](#deployment)

---

## Overview

The IPL T20 Live Dashboard is a comprehensive cricket application featuring:

* **Real-time live match simulation** with ball-by-ball updates
* **Dynamic team management** with playing XI details  
* **Comprehensive points table** with team standings
* **Complete match schedule** with venue and timing information
* **Mobile-first responsive design** optimized for all devices
* **Advanced match simulation engine** with realistic cricket statistics

---

## Features

### 🏏 Live Match Features
- **Real-time score updates** every 30 seconds
- **Ball-by-ball commentary** with detailed match events
- **Dynamic team switching** with random team generation
- **Match simulation engine** with realistic cricket statistics
- **Live commentary history** for last 3 overs
- **Batsman and bowler statistics** with real-time updates
- **Over-by-over progress tracking**

### 📊 Data Management
- **ESPN Cricinfo integration** for live data scraping
- **Fallback dummy data** when external APIs fail
- **Dynamic data generation** for match simulation
- **Team consistency management** across updates

### 🎨 User Interface
- **Mobile-first responsive design**
- **Smooth animations and transitions**
- **Interactive match controls**
- **Real-time countdown timers**
- **Confetti effects** for match completions

---

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19** - Latest React with concurrent features

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime environment

### Data & Scraping
- **Axios** - HTTP client for API requests
- **Cheerio** - Server-side jQuery implementation for web scraping
- **Puppeteer** - Headless Chrome automation for complex scraping

### Development Tools
- **ESLint** - Code linting and formatting
- **Turbopack** - Fast bundler for development
- **TypeScript** - Static type checking

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   Cache Layer   │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (Redis)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Services      │    │   Data Sources  │
│   (React)       │    │   (Business)    │    │   (ESPN/Scrapers│
└─────────────────┘    └─────────────────┘    │   /Dynamic Gen) │
         │                       │            └─────────────────┘
         ▼                       ▼                       │
┌─────────────────┐    ┌─────────────────┐               │
│   Hooks         │    │   Match         │               │
│   (useLiveScore)│    │   Simulator     │◄──────────────┘
└─────────────────┘    └─────────────────┘
```

### Key Architectural Patterns

- **Container-Presenter Pattern** - Separation of logic and presentation
- **Service Layer Pattern** - Business logic abstraction
- **Singleton Pattern** - Shared service instances (DynamicDataService)
- **Observer Pattern** - Real-time updates and state management

---

## Component Architecture

### Component Hierarchy

```
App (Root)
├── Layout
│   ├── Header
│   ├── HeaderWrapper
│   └── Footer
├── Pages
│   ├── Home (Dashboard)
│   │   ├── MatchesList
│   │   ├── StatsGrid
│   │   └── MatchTabs
│   │       ├── LiveScoreWidget
│   │       │   ├── MatchHeader
│   │       │   ├── ControlButtons
│   │       │   ├── TeamScoreDisplay
│   │       │   ├── BatsmanStats
│   │       │   ├── BallByBallDisplay
│   │       │   ├── LiveCommentary
│   │       │   ├── CurrentBowler
│   │       │   ├── LastWicket
│   │       │   ├── RunRatesAndProgress
│   │       │   └── MatchResultDisplay
│   │       └── PlayingXI
│   │           ├── TeamHeader
│   │           ├── TeamTabs
│   │           ├── TeamDetails
│   │           └── PlayerCard
│   ├── PointsTable
│   │   ├── PointsTableContainer
│   │   ├── PointsTableHeader
│   │   ├── PointsTableLayout
│   │   ├── PointsTableStats
│   │   ├── PointsTableYearSelector
│   │   └── PointsTableRow
│   └── Schedule
│       ├── ScheduleContainer
│       ├── ScheduleHeader
│       ├── ScheduleTable
│       ├── ScheduleTableHeader
│       ├── ScheduleTableRow
│       ├── ScheduleYearSelector
│       ├── SeasonInfo
│       └── YearSelector
└── UI Components
    ├── Loader
    ├── ErrorDisplay
    ├── EmptyState
    ├── Skeleton
    └── ConfettiEffect
```

### Container-Presenter Pattern Implementation

```typescript
// Container Component (Logic)
const MatchTabsContainer = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [match, setMatch] = useState(null);
  
  return (
    <MatchTabsPresenter 
      activeTab={activeTab}
      onTabChange={setActiveTab}
      match={match}
    />
  );
};

// Presenter Component (UI)
const MatchTabsPresenter = ({ activeTab, onTabChange, match }) => {
  return (
    <div>
      {/* UI Logic Only */}
    </div>
  );
};
```

---

## Data Sources & APIs

### ESPN Cricinfo Integration

The application integrates with ESPN Cricinfo for live cricket data:

#### Scraping Classes
- **`ScheduleScraper`** - Complete match fixtures
- **`ESPNApiClient`** - Points table data from ESPN API
- **`DynamicDataGenerator`** - Fallback data generation

#### Match Simulation Engine

#### DynamicDataGenerator Class
- **Real-time match simulation** with ball-by-ball updates
- **Cricket statistics calculation** (run rates, strike rates, economy)
- **Team management** with player rotations
- **Match state management** (innings, overs, wickets)

#### Key Features
- **Realistic cricket events** (boundaries, wickets, extras)
- **Dynamic team selection** with random team generation
- **Live commentary generation** for match events
- **Statistics tracking** for batsmen and bowlers

---

## Rendering Strategies

### Static Site Generation (SSG)
- **Schedule Page** - Rarely changes, perfect for SSG
- **Team Information** - Static data, pre-rendered at build time

### Server-Side Rendering (SSR)
- **Points Table** - Updates occasionally, good for SSR
- **Match List** - Dynamic content, rendered on each request

### Client-Side Rendering (CSR)
- **Live Score Widget** - Real-time updates, requires CSR
- **Interactive Components** - User interactions, client-side state

### Rendering Strategy Table

| Component | Strategy | Reason | Update Frequency |
|-----------|----------|---------|------------------|
| Schedule | SSG | Static data | Build time |
| Points Table | SSR | Periodic updates | On request |
| Live Matches | CSR | Real-time updates | 30 seconds |
| Match Details | SSR | Dynamic content | On request |

---

## Requirements

* Scrape IPL data for live/upcoming matches, points table, schedule
* Use **dummy data** if scraping fails
* Update data periodically
* Mobile-first UI, clean and intuitive
* Optional: caching, notifications, charts, historical data

---

## Scraping & API

* **Scraping Classes:**

  * `ScheduleScraper` → full schedule
  * `ESPNApiClient` → points table data
  * `DynamicDataService` → live match simulation

* **API Routes:**

  * `/api/matches` → live/upcoming matches
  * `/api/points-table` → points table
  * `/api/schedule` → full schedule

* **Caching:** Redis - Active caching with 1-hour TTL for schedule/points, 1-minute for live matches

* **Error Handling:** Dummy fallback data if scraping fails

---

## Rendering Strategy

| Page / Component  | Rendering Type | Reason                    |
| ----------------- | -------------- | ------------------------- |
| Full Schedule     | SSG            | Data rarely changes       |
| Points Table      | SSR / ISR      | Updates occasionally      |
| Live Match Info   | SSR + CSR      | Needs latest data         |
| Live Score Widget | CSR            | Updates every few seconds |

* Use server components for SSG/SSR
* Use client components for live updates or polling

---

## Architecture & Modular Approach

* **Centralized Scrapers**: Reusable scraping logic for all data types
* **API Layer**: Handles caching, fallback, and data fetching
* **Components**: Small, reusable UI components (`MatchCard`, `PointsTableRow`, `ScheduleRow`)
* **Cache Layer**: Central Redis utility (`lib/cache.ts`)
* **Types**: Use TypeScript interfaces for consistency (`MatchData`, `PointsTableData`, `ScheduleData`)
* **Server/Client Separation**: Heavy scraping → server, live updates → client

---

## Setup & Installation

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm** - Package manager

### Quick Setup

```bash
# Clone the repository
git clone <repository-url>
cd ipl_dashboard

# Run the automated setup script
./setup.sh

# Start development server
npm run dev
```

### Manual Setup

```bash
# Install dependencies
npm install

# Create environment file (optional)
# cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

```env
# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ESPN API configuration
ESPN_BASE_URL=https://www.espncricinfo.com
```

---

## API Endpoints

### Core API Routes

#### `/api/matches`
- **Method**: GET
- **Purpose**: Fetch live and upcoming matches
- **Response**: Array of match objects
- **Caching**: Redis cache with 1-minute TTL

#### `/api/points-table`
- **Method**: GET
- **Purpose**: Get current points table standings
- **Response**: Array of team standings
- **Caching**: Redis cache with 1-hour TTL

#### `/api/schedule`
- **Method**: GET
- **Purpose**: Fetch complete match schedule
- **Response**: Array of scheduled matches
- **Caching**: Redis cache with 1-hour TTL

### API Response Format

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  timestamp: number;
  error?: string;
}
```

---

## Pages & Routes

### Route Structure

```
/ (Home)
├── /points-table
│   └── /[year] (Dynamic year selection)
└── /schedule
    └── /[year] (Dynamic year selection)
```

### Page Components

#### Home Page (`/`)
- **Purpose**: Main dashboard with live/upcoming matches
- **Features**: Match list, quick navigation, live updates
- **Rendering**: SSR with client-side updates

#### Points Table (`/points-table`)
- **Purpose**: Team standings and playoff scenarios
- **Features**: Sortable table, team statistics, qualification indicators
- **Rendering**: SSR with on-request generation

#### Schedule (`/schedule`)
- **Purpose**: Complete match fixtures and results
- **Features**: Date filtering, venue information, match status
- **Rendering**: SSR with on-request generation

---

## Development

### Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Code Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── matches/       # Live match endpoints
│   │   ├── points-table/  # Points table endpoints
│   │   └── schedule/      # Schedule endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── points-table/      # Points table pages
│   └── schedule/          # Schedule pages
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── effects/           # Animation effects
│   ├── layout/            # Layout components
│   ├── live-score/        # Live score components
│   ├── playing-xi/        # Playing XI components
│   ├── points-table/      # Points table components
│   ├── schedule/          # Schedule components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── scrapers/          # Web scraping classes
│   └── cache.ts           # Redis caching utilities
├── services/              # Business logic services
├── types/                 # TypeScript type definitions
└── data/                  # Static data and constants
```

### Development Best Practices

- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Turbopack** - Fast development builds
- **Error Boundaries** - Graceful error handling
- **Custom Hooks** - Reusable state logic

---

## Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Deploy to Vercel
npx vercel

# Configure environment variables in Vercel dashboard
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

- **Production URL** - Update `NEXT_PUBLIC_BASE_URL`
- **API Rate Limiting** - Configure request limits
- **Error Monitoring** - Set up error tracking (Sentry)

---

## 🚀 Getting Started Guide

### For New Developers

**1. Understanding the Codebase Structure**
```bash
# Key directories to explore first:
src/
├── app/                    # Next.js App Router (pages & API routes)
├── components/            # Reusable UI components
├── services/              # Business logic (DynamicDataService, MatchSimulator)
├── lib/                   # Utilities (scrapers, cache, data generation)
└── hooks/                 # Custom React hooks
```

**2. Key Files to Start With**
- `src/app/page.tsx` - Main dashboard entry point
- `src/services/DynamicDataService.ts` - Core match simulation logic
- `src/components/LiveScoreWidget.tsx` - Live score display component
- `src/hooks/useLiveScore.ts` - Live score state management

**3. Development Workflow**
```bash
# Start development server
npm run dev

# Test live features
# Visit http://localhost:3000 and interact with:
# - Live score updates (auto-refresh every 30s)
# - Match controls (Next Ball, Reset, Random Teams)
# - Points table navigation
# - Schedule year selection
```

**4. Understanding Data Flow**
1. **Live Matches**: `DynamicDataService` → `MatchSimulator` → Real-time updates
2. **Points Table**: `ESPNApiClient` → Cache → Fallback to generated data
3. **Schedule**: `ScheduleScraper` → Cache → Fallback to dummy data

---

## Implementation Status ✅

**Completed Features:**
- ✅ Schedule scraping with fallback data
- ✅ ESPN API integration for points table
- ✅ Dynamic match simulation engine
- ✅ API routes with Redis caching
- ✅ Mobile-first responsive UI components
- ✅ Live score updates with client-side polling
- ✅ Points table with team standings
- ✅ Complete match schedule
- ✅ Error handling and dummy data fallbacks
- ✅ TypeScript interfaces and type safety

**Key Features:**
- **Live Matches**: Real-time score updates every 30 seconds
- **Points Table**: Team standings with playoff qualification indicators
- **Schedule**: Complete fixture list with venue and timing
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Caching**: Redis integration - Active with TTL-based caching
- **Fallback Data**: Dummy data when scraping fails
- **Error Handling**: Graceful degradation and user feedback

**Tech Stack Used:**
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Redis for caching
- Axios + Cheerio for web scraping
- Server-side rendering (SSR) and static generation (SSG)
