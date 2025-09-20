# IPL T20 Live Dashboard

This project is a mobile-first IPL T20 dashboard that displays live match info, upcoming matches, points table, and full match schedule. Built with Next.js, TypeScript, Tailwind CSS, and Node.js API routes.

---

## Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Requirements](#requirements)
* [Scraping & API](#scraping--api)
* [Rendering Strategy](#rendering-strategy)
* [Architecture & Modular Approach](#architecture--modular-approach)
* [Setup & Run](#setup--run)
* [Time Plan](#time-plan)

---

## Overview

* Show **live matches** if ongoing, otherwise **upcoming matches**
* Display **points table** with team rankings
* Show **full match schedule**
* Mobile-first, responsive design

---

## Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Node.js API Routes
* Puppeteer / Axios / Cheerio (scraping)
* Redis (caching)

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

  * `MatchScraper` → live & upcoming matches
  * `PointsTableScraper` → points table
  * `ScheduleScraper` → full schedule

* **API Routes:**

  * `/api/matches` → live/upcoming matches
  * `/api/points-table` → points table
  * `/api/schedule` → full schedule

* **Caching:** Redis used to reduce scraping load

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

## Setup & Run

1. Clone repo:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create `.env` file:

   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   REDIS_URL=redis://localhost:6379
   ```
4. Run dev server:

   ```bash
   npm run dev
   ```
5. API Endpoints:

   * `/api/matches` → live/upcoming matches
   * `/api/points-table` → points table
   * `/api/schedule` → full schedule

---

## Time Plan (2 Days)

**Day 1:**

* Setup project, Tailwind, TypeScript
* Implement scrapers and API routes with caching
* Test data fetching & dummy fallback

**Day 2:**

* Build pages with modular components
* Implement rendering strategy (SSG/SSR/CSR)
* Mobile-first UI & styling
* Test & deploy

---

This plan ensures the dashboard is **fully functional** within 2 days while keeping code modular, reusable, and maintainable.
