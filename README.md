# Rasoi Manager

Restaurant procurement and operations platform built for the Indian market.

Connects your **PetPooja POS** to track consumption in real-time and places purchase orders to suppliers via **WhatsApp Business API** — automatically.

---

## What's included

**13 routes, zero build errors:**

| Route | What it does |
|---|---|
| `/` | Full marketing landing page (Indian market copy, pricing in ₹) |
| `/dashboard` | Live stats, consumption chart from PetPooja, low-stock alerts, recent orders |
| `/inventory` | Full stock table with category filters, urgency badges, "Order via WhatsApp" per-item |
| `/orders` | Order builder → select supplier → add items → set quantities → **Send via WhatsApp** |
| `/suppliers` | Supplier cards with WhatsApp chat + order links |
| `/reports` | Bar/pie charts for consumption, inventory value, monthly procurement spend |
| `/settings` | PetPooja + WhatsApp API credential configuration with `.env.local` instructions |
| `/api/petpooja/sync` | `POST` — syncs menu + inventory from PetPooja |
| `/api/petpooja/consumption` | `GET` — consumption report (falls back to mock if no creds) |
| `/api/whatsapp/send-order` | `POST` — sends formatted purchase order via WhatsApp Cloud API |

---

## Tech stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **POS Integration**: PetPooja REST API
- **Messaging**: Meta WhatsApp Business Cloud API

---

## Getting started

```bash
git clone https://github.com/aviexk/rasoi-manager.git
cd rasoi-manager
npm install
cp .env.local.example .env.local
# fill in your credentials (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Without credentials the app runs in demo mode** — orders generate a `wa.me` deep-link that opens WhatsApp pre-filled with the full purchase order message, so you can test the entire flow immediately.

---

## Environment variables

Create `.env.local` from the example file:

```env
# PetPooja POS
# Get from: partner.petpooja.com → API Settings
PETPOOJA_APP_KEY=
PETPOOJA_APP_SECRET=
PETPOOJA_ACCESS_TOKEN=
PETPOOJA_RESTAURANT_ID=

# WhatsApp Business Cloud API (Meta)
# Get from: developers.facebook.com → WhatsApp → Getting Started
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
```

### Getting PetPooja credentials
1. Log in to `partner.petpooja.com`
2. Go to **API Settings** → **Generate API Keys**
3. Copy `app_key`, `app_secret`, `access_token`, and your `restaurant_id`

### Getting WhatsApp Business API credentials
1. Create a Meta Developer account at `developers.facebook.com`
2. Create a new app → Add **WhatsApp** product
3. Under **Getting Started**, copy your **Phone Number ID** and generate a **System User access token**

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── inventory/page.tsx          # Inventory management
│   ├── orders/page.tsx             # Order placement + WhatsApp
│   ├── suppliers/page.tsx          # Supplier management
│   ├── reports/page.tsx            # Analytics & reports
│   ├── settings/page.tsx           # Integration settings
│   └── api/
│       ├── petpooja/sync/          # PetPooja sync endpoint
│       ├── petpooja/consumption/   # Consumption data endpoint
│       └── whatsapp/send-order/    # WhatsApp order endpoint
├── components/
│   ├── layout/                     # Sidebar, TopBar, AppShell
│   ├── landing/                    # Hero, Features, Pricing, etc.
│   └── dashboard/                  # Charts, alerts, stats cards
└── lib/
    ├── petpooja.ts                 # PetPooja API client
    ├── whatsapp.ts                 # WhatsApp Business API client
    ├── mock-data.ts                # Demo data (Indian restaurants)
    └── types.ts                    # TypeScript types
```

---

## Key features

- **PetPooja sync** — pulls item consumption, sales, and stock data automatically
- **Low-stock alerts** — colour-coded urgency levels (critical / low / warning)
- **WhatsApp ordering** — formatted purchase orders sent directly to suppliers
- **INR currency** — all amounts in Indian Rupees with `en-IN` locale formatting
- **GST-ready** — supplier records include GSTIN fields
- **Demo mode** — works without any API credentials out of the box

---

## Deployment

Deploy instantly to Vercel:

```bash
npx vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.
