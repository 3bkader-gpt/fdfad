<div align="center">

# 👗 Fadfaad (فضفاض): Modest Fashion E-Commerce Platform

### Mobile-First Modern Modest Fashion Digital Boutique & Ordering Engine

[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase%20(Postgres)-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38.svg)](https://zustand-demo.pmnd.rs/)
[![Playwright](https://img.shields.io/badge/Tests-Playwright%20E2E-45BA4B.svg?logo=playwright&logoColor=white)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Mobile-First UX • Bilingual Arabic (RTL) & English (LTR) • Row-Level Security • Dynamic Cart Engine**

[System Architecture](#-system-architecture) • [Key Capabilities](#-key-capabilities) • [Local Development](#-getting-started) • [E2E Testing](#-e2e-testing-suite)

</div>

---

## 🎯 Overview

**Fadfaad (فضفاض)** is a boutique modest-fashion e-commerce platform architected to modernize and elevate direct-to-consumer apparel shopping.

Designed to replace chaotic manual social-commerce interactions with a structured, high-trust digital storefront, Fadfaad pairs **Next.js 16 (App Router)** and **React 19** with **Supabase (PostgreSQL + RLS)** to deliver sub-second page transitions, bilingual localization, persistent shopping carts, and a streamlined frictionless checkout experience.

---

## 🏗 System Architecture

```mermaid
flowchart TD
    User["📱 Mobile / Desktop Shopper"]
    
    subgraph Frontend Application Layer (Next.js 16 + React 19)
        AppRouter["⚡ Next.js App Router & Server Components"]
        i18n["🌍 Bilingual Localization Engine (next-intl: AR / EN)"]
        UI["🎨 Tailwind CSS v4 & Framer Motion Animations"]
        ClientStore["🛒 Reactive Client Cart (Zustand)"]
    end
    
    subgraph Data & Cloud Services (Supabase)
        Auth["🔐 Supabase Auth & JWT Session Guard"]
        Postgres[("🐘 PostgreSQL (Products, Orders, Categories)")]
        RLS["🛡️ Row Level Security (RLS Engine)"]
        Storage["☁️ Supabase Cloud Media Storage (Product Assets)"]
    end

    User -->|HTTPS Navigation| AppRouter
    AppRouter --> i18n
    i18n --> UI
    UI <--> ClientStore
    
    AppRouter <-->|SSR Data Fetching / Server Actions| Postgres
    Postgres --- RLS
    AppRouter <--> Auth
    UI -->|Serve Optimized Images| Storage
```

---

## 🌟 Key Capabilities

- 📱 **Mobile-First Luxury Aesthetics:** Designed specifically for smartphone ergonomics with fluid drawer menus, sticky action bars, and swipe gestures powered by **Framer Motion**.
- 🌍 **Seamless Bilingual Localization:** Native support for Arabic (RTL) and English (LTR) using `next-intl`, complete with localized currency formatting and regional address inputs.
- 🛒 **Persistent Reactive Cart Engine:** Lightweight state management via **Zustand** ensuring instant cart updates, quantity increments, and local persistence across browsing sessions.
- 🛡️ **PostgreSQL Row Level Security (RLS):** Granular security policies ensuring customers only access their own orders while restricting product modification to authenticated administrators.
- ⚡ **Zero-Layout Shift Image Optimization:** Automatic WebP/AVIF media delivery via Next.js image optimization and Supabase media storage CDN.
- 🧪 **Comprehensive Playwright E2E Suite:** Automated testing coverage spanning checkout flows, product filtering, localization switching, and cart operations.

---

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18+ or v20+)
- `pnpm` (Recommended) or `npm`
- A free [Supabase](https://supabase.com/) project

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/3bkader-gpt/fdfad.git
cd fdfad

# Install dependencies using pnpm
pnpm install
```

### 2. Environment Configuration
Create a local `.env.local` file using the provided template:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your Supabase project credentials:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server
```bash
pnpm dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🧪 E2E Testing Suite

Run the automated Playwright test suite to verify critical shopping flows:

```bash
# Run all Playwright tests
pnpm exec playwright test

# Open interactive UI test runner
pnpm exec playwright test --ui
```

---

## 📄 License

This software is licensed under the [MIT License](LICENSE).
