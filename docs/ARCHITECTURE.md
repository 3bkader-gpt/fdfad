# System Architecture: FADFAAD

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Motion:** GSAP + Framer Motion (for some components)
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (Admin-only access)
- **Storage:** Supabase Storage (`product-images` bucket)
- **i18n:** `next-intl` (Segment-based routing)
- **State:** Zustand (Cart persistence)

## High-Level Architecture

FADFAAD follows a decoupled, mobile-first architecture optimized for performance and maintainability.

### 1. Presentation Layer

- **Client Components:** Handle interactivity (Cart, Mobile Menu, Docks, Toggles).
- **Server Components:** Handle data fetching from Supabase for optimal SEO and SSR.
- **RTL/LTR:** Controlled by the `[locale]` layout segment.

### 2. Business Engine (Server Actions)

- All critical mutations (Order creation, Product CRUD, Category management) are handled via Next.js Server Actions.
- Localized assertions bridge library inference gaps in the PostgREST client.

### 3. Data Layer

- **Supabase Client:** Shared instance in `src/lib/supabase.ts` for browser and `src/lib/supabase/server.ts` for server.
- **RLS:** Enforced at the database level to protect orders and admin-only tables.

### 4. Localization

- Dynamic segment-based routing (`/ar` and `/en`).
- Dictionary-based string management in `messages/*.json`.
- Automatic font switching between `Cairo` (Arabic) and `Geist Sans` (English).

## Directory Structure

- `/src/app/[locale]`: Main routing and layouts.
- `/src/components/ui`: Atomic, reusable UI components.
- `/src/lib`: Shared utilities, stores, and API clients.
- `/supabase/migrations`: Version-controlled database schema.
- `/messages`: Localization dictionaries.
