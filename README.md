# Restaurant HACCP Eye

Automated commercial kitchen hygiene inspection, fridge temperature logging, and HACCP compliance audit engine powered by Sensifai Vision Core.

[![Sensifai Marketplace](https://img.shields.io/badge/Sensifai-Marketplace-059669?style=flat-square)](https://sensifai.com/marketplace)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=flat-square)](https://restaurant-haccp-eye.sensifai.com)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=flat-square)](LICENSE)

---

## Overview

**Restaurant HACCP Eye** is an enterprise-grade automated food safety inspection and HACCP compliance intelligence application built for restaurant chains, commercial catering operators, cloud kitchens, and hospitality food safety consultants. In under 60 seconds, it analyzes frontline station photos, fridge thermometer probe displays, and food prep expiration day-dots to auto-populate daily temperature logs, detect critical control point violations, and compile inspector-ready compliance audit packets.

- **Canonical URL**: `https://restaurant-haccp-eye.sensifai.com`
- **Application UUID**: `01a1de6e-d432-748f-a9ae-13b54601a030`
- **Domain Archetype**: Editorial Before/After Proof with Bespoke Emerald (`#059669`) Palette
- **Pricing Model**: Pay-As-You-Go (€0.05 / Audit Request)

---

## Core Capabilities

1. **Station-by-Station Hygiene Inspection**: Verifies sanitation buckets, PPE compliance (gloves, hairnets), and cross-contamination hazards across cooking, prep, and dishwashing lines.
2. **Automated Fridge & Freezer Temperature Logging**: Reads digital probe displays and analog dial gauges from photos and flags danger zone temperatures (>40°F cold holding, <140°F hot holding).
3. **Prep Label Expiration & Allergen Spotting**: Transcribes food container day-dots and prep stickers to spot expired items and cross-contact risks before service.
4. **Corrective Action Task Assignment**: Immediately drafts actionable staff remediation tickets with photographic evidence for non-compliant stations.
5. **Developer REST API**: Secure token issuance (`rh_live_...`) for enterprise kitchen operations software and franchise management dashboards.

---

## Verified Kitchen Presets

- **Walk-In Cooler & Raw Protein Line**: 36.4°F walk-in cooler probe, organized poultry and seafood cambros, 96% hygiene score (PASSED).
- **Salad Prep Line & Deli Slicer Station**: 43.1°F cold rail warning (above 40°F threshold), cold rail temp alert, 78% hygiene score (ACTION_REQUIRED).
- **Raw Seafood Bar & Hot Holding Wells**: 154.2°F soup hot well / 33.5°F raw seafood display on fresh ice, 98% hygiene score (PASSED).
- **High-Temp Dish Machine & Bakery Station**: 182.4°F sanitizing rinse gauge, dry bakery bins, 94% hygiene score (PASSED).

---

## Technical Stack & Architecture

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom Emerald & Clean Culinary design system
- **Authentication**: Zero-mock Logto OIDC PKCE redirect (`https://auth.sensifai.com/oidc`)
- **Billing & Entitlement**: Sensifai Gatekeeper REST API with atomic balance synchronization (`https://gatekeeper.sensifai.com`)
- **AI Core**: Sensifai LiteLLM AI Gateway (`https://llm.sensifai.com`) dynamically resolving latest Gemini Flash models
- **Containerization**: Standalone multi-stage Docker build

---

## Quickstart & Local Development

### 1. Prerequisites
- Node.js 18+ or Docker 24+
- Sensifai Developer Account

### 2. Installation
```bash
git clone https://github.com/Sensifai-BV/restaurant-haccp-eye.git
cd restaurant-haccp-eye
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and populate your credentials:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Automated Verification Suites
```bash
# Platform Quality Gate & Live Balance Deduction Audit (7/7 Passed)
node scripts/test-sensifai.mjs

# End-to-End Playwright Browser Verification (6/6 Passed)
python3 scripts/e2e-verify.py

# Visual Media Asset Verification (8/8 Verified)
node scripts/generate-media.mjs
```

---

## Container Deployment (Coolify / Docker Compose)

Deploy with Docker Compose using the production container definition:

```bash
docker compose up -d --build
```

Health endpoint: `GET /api/health`

---

## Security & Food Safety Disclaimer

All kitchen station photos, thermometer displays, and prep labels are processed ephemerally. Restaurant HACCP Eye enforces strict 401 authentication gates on custom audit submissions and never stores raw customer credentials or PII. Automated AI recommendations provide guidance and do not replace mandatory certified health department inspections or local food safety jurisdiction requirements.
