# Post-Launch Improvement Roadmap: FADFAAD

## Background & Motivation
The FADFAAD MVP has successfully launched as a high-trust, mobile-first Egyptian modest fashion e-commerce platform. Moving into the Post-Launch phase, the focus shifts to resolving critical production issues, improving product organization, expanding market reach with Arabic/English multi-language support (i18n), refining the UI system, and hardening the mobile user experience.

## Scope & Impact
This roadmap spans 7 sequential phases:
1. **Critical Bug Fixes:** Resolving Supabase Storage RLS policies preventing image uploads and fixing mobile horizontal scrolling (overflow) issues.
2. **Product Organization:** Introducing a robust `categories` and `product_categories` (many-to-many) database schema.
3. **Category Management:** Building admin tools for category CRUD operations.
4. **Multi-Language (i18n):** Implementing `next-intl` for native Next.js App Router localization (SSR, SEO, RTL/LTR), with Arabic as the default.
5. **UI System Review:** Integrating and adapting components from `REUSABLE_UI_COMPONENTS.md` (Theme/Language toggles, Header) to fit FADFAAD's serene minimalism and modest identity.
6. **Mobile UX Hardening:** Comprehensive audit and refinement of touch targets, typography, spacing, and safe areas.
7. **Final QA:** End-to-end testing, typing, linting, and manual audits.

## Proposed Solution
- **Database:** Future-proof many-to-many category schema. The Admin UI will enforce a single category selection initially to maintain simplicity, writing to the junction table.
- **i18n:** `next-intl` integration to provide robust localized routing (e.g., `/ar/...`), enabling superior SEO and SSR performance for the Egyptian market.
- **UI & Bug Fixes:** Strategic CSS updates (`overflow-x-hidden`, viewport constraints) and Supabase SQL migrations for Storage RLS.

## Alternatives Considered
- **Custom Context i18n:** Considered using the lightweight context-based translation from the reusable components file, but rejected in favor of `next-intl` to ensure robust SEO, SSR, and proper locale URLs.
- **One-to-Many Category Schema:** Considered adding a simple `category_id` to the `products` table, but rejected to prevent complex future data migrations. The chosen many-to-many schema future-proofs the database while the UI remains simple.

## Implementation Plan

### Phase 1: Critical Bug Fixes (P0)
- **Task 1: Storage RLS Fix**
  - **Action:** Apply SQL migration to `storage.objects` for the `product-images` bucket to allow `INSERT`/`UPDATE`/`DELETE` for authenticated admins.
  - **Verification:** Admin successfully uploads, stores, and views product images.
- **Task 2: Mobile Overflow Fix**
  - **Action:** Audit `globals.css` and layout containers. Apply `overflow-x-hidden` to `body`/`html` and ensure max-width constraints on product cards and checkout forms.
  - **Verification:** Zero horizontal scroll drift on 390x844 viewports.

### Phase 2: Product Organization (P0)
- **Task 1: Schema Implementation**
  - **Action:** Create `categories` table and `product_categories` junction table via Supabase migration.
- **Task 2: Product Form Updates**
  - **Action:** Add Category dropdown to the Admin Product Form. Populate from the database. Save the single selected category to the junction table.
  - **Verification:** Create a category, assign it to a product, and retrieve the association.

### Phase 3: Category Management (P0)
- **Task 1: Admin Dashboard Integration**
  - **Action:** Build Category List, Create, Rename, Archive, and Delete interfaces in the Admin Dashboard.
  - **Verification:** All CRUD operations succeed and reflect accurately in the database and storefront.

### Phase 4: Multi-Language (P1)
- **Task 1: Architecture Setup**
  - **Action:** Install and configure `next-intl`. Define Arabic (default) and English routing.
- **Task 2: Content Translation**
  - **Action:** Extract hardcoded strings into dictionaries. Translate Navigation, Buttons, Checkout, Admin, and System messages.
- **Task 3: Layout & Direction**
  - **Action:** Implement dynamic RTL (Arabic) and LTR (English) switching based on locale. Persist selection via cookies.
  - **Verification:** Seamless language switching with correct routing, metadata, and visual alignment.

### Phase 5: UI System Review (P1)
- **Task 1: Component Audit & Adaptation**
  - **Action:** Review `REUSABLE_UI_COMPONENTS.md`. Integrate the Language Switcher and potentially adapt the Dark Mode Toggle and Navigation patterns.
  - **Action:** Re-theme adopted components to utilize FADFAAD's color palette (`#2C3E35`, `#C89B7E`, `#FAFAFA`).
  - **Verification:** New components match the "Serene Minimalism" brand perfectly.

### Phase 6: Mobile UX Hardening (P1)
- **Task 1: Comprehensive Audit**
  - **Action:** Review spacing, typography, touch target minimums (44px/48px), and bottom safe areas for modern iPhones.
  - **Verification:** Smooth navigation, easy thumb reach, and no overlapping elements.

### Phase 7: Final QA (P0)
- **Task 1: End-to-End Validation**
  - **Action:** Run `pnpm lint`, `pnpm build`, and strict type checking.
  - **Action:** Execute manual audits for Mobile, Admin, Checkout, Categories, i18n, and Uploads.
  - **Verification:** All checks pass with zero critical issues.

## Migration & Rollback
- All database changes will be managed via sequential Supabase migrations, allowing for `down` migrations if needed.
- Vercel deployments will utilize preview environments for each phase before promoting to the production URL. Rollbacks can be performed instantly via the Vercel dashboard.

*(Each phase will conclude with a `PHASE_X_COMPLETION_REPORT.md` and a Git commit.)*
