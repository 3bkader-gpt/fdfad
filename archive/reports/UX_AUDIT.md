# 🎯 FADFAAD — UX/UI Audit Report

_Generated: June 2026 · Full product review across Storefront & Admin_

---

## Executive Summary

FADFAAD has a strong visual identity — the typography, dark mode, animations, and overall aesthetic are well-executed. However, the current experience has **friction in critical conversion paths** (checkout, product selection) and **operational friction in the admin** (product creation, order management). This audit maps every issue to a severity level and proposes actionable fixes.

**Overall Scores (before fixes)**

| Area                | Score  | Grade |
| ------------------- | ------ | ----- |
| Customer Storefront | 68/100 | C+    |
| Admin Dashboard     | 61/100 | C     |
| Accessibility       | 55/100 | D+    |
| Mobile UX           | 72/100 | B-    |

---

## Part I — Customer Storefront Audit

### 🏠 Homepage (`/`)

#### Findings

| #    | Issue                                                                               | Severity  | File       |
| ---- | ----------------------------------------------------------------------------------- | --------- | ---------- |
| S-01 | No navigation bar visible on homepage — users don't know they can browse categories | 🔴 High   | `page.tsx` |
| S-02 | Hero CTA scrolls to `#collection` but there's no scroll-to-top mechanism            | 🟡 Medium | `page.tsx` |
| S-03 | Product grid is 2 columns — on 390px this makes each card very narrow               | 🟡 Medium | `page.tsx` |
| S-04 | No empty-state illustration — "The collection awaits" text is too minimal           | 🟢 Low    | `page.tsx` |
| S-05 | GSAP animation blocks visibility for ~1.2s — content invisible until hero animates  | 🔴 High   | `page.tsx` |
| S-06 | No category filter on homepage — all products shown without organization            | 🟡 Medium | `page.tsx` |

#### Recommendations

```
S-01 → Add GlobalHeader on homepage (currently hidden). Header already handles
        dark/light mode and cart — just needs to appear on the homepage.

S-05 → Initialize titleRef/subtitleRef with opacity: 1 (not 0). Let GSAP animate
        from opacity: 0 but set initial CSS so content is visible if JS is slow.

S-03 → Consider responsive: grid-cols-1 on xs, grid-cols-2 from sm. Or make
        cards slightly wider using max-w-xl instead of max-w-2xl for the container.
```

---

### 🛍️ Product Detail Page (`/products/[slug]`)

#### Findings

| #    | Issue                                                                               | Severity  | File                               |
| ---- | ----------------------------------------------------------------------------------- | --------- | ---------------------------------- |
| P-01 | Size/Color errors only appear inline — no shake animation or visual urgency         | 🟡 Medium | `ProductDetailsClient.tsx`         |
| P-02 | "Add to Bag" sticky button blocks content on mobile while scrolling                 | 🟡 Medium | `ProductDetailsClient.tsx`         |
| P-03 | Image gallery counter `1 / 3` overlaps zoom button on small screens                 | 🟡 Medium | `ProductDetailsClient.tsx`         |
| P-04 | Zoom modal says "Tap image to zoom 2x" in English even in Arabic locale             | 🔴 High   | `ProductDetailsClient.tsx:624`     |
| P-05 | Color swatches don't show color name in Arabic — raw English color names            | 🟡 Medium | `ProductDetailsClient.tsx`         |
| P-06 | "Cash on Delivery" text hardcoded in English inside shipping section                | 🔴 High   | `ProductDetailsClient.tsx:507`     |
| P-07 | Related products section has no heading in Arabic for RTL locales                   | 🟡 Medium | `ProductDetailsClient.tsx:540`     |
| P-08 | Specs section always visible even when only fabric is filled — shows redundant card | 🟢 Low    | `ProductDetailsClient.tsx:400-473` |
| P-09 | No breadcrumb — users lose navigation context (came from category?)                 | 🟡 Medium | `ProductDetailsClient.tsx`         |
| P-10 | AddToCartButton has no quantity selector — can only add 1 item at a time            | 🟡 Medium | `AddToCartButton.tsx`              |

#### Recommendations

```
P-04, P-06 → Move hardcoded English strings into translation files (ar.json/en.json).

P-01 → Add a CSS animation class (shake) to error messages:
         @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

P-09 → Add a simple breadcrumb: الرئيسية / [Category Name] / [Product Name]
        This reduces navigation confusion after direct URL share or category browsing.

P-10 → Add quantity stepper (− N +) inline in AddToCartButton for faster bulk ordering.
```

---

### 🛒 Checkout Page (`/checkout`)

#### Findings

| #    | Issue                                                                                        | Severity  | File                        |
| ---- | -------------------------------------------------------------------------------------------- | --------- | --------------------------- |
| C-01 | Governorate dropdown defaults to English names — Arabic users expect Arabic                  | 🔴 High   | `checkout/page.tsx:24-52`   |
| C-02 | Validation errors only show after button tap — no real-time feedback                         | 🟡 Medium | `checkout/page.tsx`         |
| C-03 | Phone field placeholder `01xxxxxxxxx` doesn't adapt per locale                               | 🟢 Low    | `checkout/page.tsx:218`     |
| C-04 | "Special delivery instructions" placeholder is English-only                                  | 🔴 High   | `checkout/page.tsx:267`     |
| C-05 | No order review step — user must mentally cross-reference cart with form                     | 🟡 Medium | `checkout/page.tsx`         |
| C-06 | "Add some curated items before checking out" string not translated                           | 🔴 High   | `checkout/page.tsx:131`     |
| C-07 | Form submits with `alert(result.error)` on failure — native browser alert breaks luxury feel | 🔴 High   | `checkout/page.tsx:112`     |
| C-08 | No mobile keyboard optimization — `inputMode` not set for phone/numeric fields               | 🟡 Medium | `checkout/page.tsx`         |
| C-09 | Notes field is optional but positioned last — users skip it; should be inline hint           | 🟢 Low    | `checkout/page.tsx:259-268` |
| C-10 | Cart summary shows product title but no image thumbnail — adds trust & confirmation          | 🟡 Medium | `checkout/page.tsx:158-175` |

#### Recommendations

```
C-01 → Create GOVERNORATES_AR array with Arabic governorate names.
        Use locale detection to switch between Arabic/English arrays.

C-07 → Replace alert() with an inline error toast component:
        <ErrorToast message={submitError} onClose={() => setSubmitError(null)} />

C-08 → Add inputMode="tel" to phone, inputMode="numeric" to all number fields.

C-10 → Fetch and show product cover image in cart summary row.
        Small 40×54px thumbnail boosts confidence before submitting.
```

---

### 📁 Category Pages (`/categories`)

#### Findings

| #      | Issue                                                                     | Severity  | File          |
| ------ | ------------------------------------------------------------------------- | --------- | ------------- |
| CAT-01 | Categories page not visited in audit — check if it exists and is linked   | 🟡 Medium | `categories/` |
| CAT-02 | No "View Category" CTA on homepage — categories exist but aren't surfaced | 🔴 High   | `page.tsx`    |

---

## Part II — Admin Dashboard Audit

### 📊 Dashboard Overview (`/admin`)

#### Findings

| #    | Issue                                                                                            | Severity  | File                     |
| ---- | ------------------------------------------------------------------------------------------------ | --------- | ------------------------ |
| A-01 | Metric cards show English labels (Total, New, Preparing) — not translated                        | 🔴 High   | `admin/page.tsx:52-81`   |
| A-02 | "Your business at a glance" subtitle is hardcoded English                                        | 🔴 High   | `admin/page.tsx:44`      |
| A-03 | Orders table shows only 10 rows — no pagination or load-more                                     | 🟡 Medium | `admin/page.tsx:120`     |
| A-04 | Click on order row navigates to order detail — but entire row isn't clickable, only order number | 🟡 Medium | `admin/page.tsx:121-147` |
| A-05 | No revenue summary KPI (total EGP this week/month)                                               | 🟡 Medium | `admin/page.tsx`         |
| A-06 | No quick-action shortcut to add new product from dashboard                                       | 🟢 Low    | `admin/page.tsx`         |
| A-07 | "Awaiting first curation." text not translated                                                   | 🔴 High   | `admin/page.tsx:152`     |

#### Recommendations

```
A-01, A-02 → Add Admin namespace translations for all hardcoded strings.

A-04 → Wrap entire <tr> in a clickable wrapper or use CSS pointer cursor
        and navigate via router on row click.

A-05 → Add a revenue card: sum(total_amount) WHERE created_at > this week.
        Can be computed client-side from the existing typedOrders array.
```

---

### 📦 Product Management (`/admin/products`)

#### Findings

| #     | Issue                                                                         | Severity  | File                         |
| ----- | ----------------------------------------------------------------------------- | --------- | ---------------------------- |
| PM-01 | Product list shows OPAC 3/5 — admins don't know what opacity scale means      | 🟡 Medium | `admin/products/page.tsx:91` |
| PM-02 | Delete action has no confirm step shown visually before ConfirmModal fires    | 🟢 Low    | `DeleteProductButton`        |
| PM-03 | Product cards show both edit and delete — but no "preview on storefront" link | 🟡 Medium | `admin/products/page.tsx`    |
| PM-04 | "Manage your curated collection" subtitle hardcoded English                   | 🔴 High   | `admin/products/page.tsx:40` |
| PM-05 | No search/filter bar in products list — with 20+ products becomes unusable    | 🔴 High   | `admin/products/page.tsx`    |
| PM-06 | No active/archived filter tab — archived products mix with active ones        | 🔴 High   | `admin/products/page.tsx`    |

#### Recommendations

```
PM-05 → Add a <input type="search"> with client-side filtering on product.title.
        No API call needed for small inventories — just useState + filter().

PM-06 → Add tabs: [الكل | متاح | مخفي] using simple state toggle.
        Filter products array client-side before rendering.

PM-03 → Add external link button: href={`/${locale}/products/${product.slug}`}
        Opens storefront product page in new tab.
```

---

### ✏️ Product Form (`/admin/products/new` & `/admin/products/[id]`)

#### Findings

| #     | Issue                                                                                           | Severity  | File                      |
| ----- | ----------------------------------------------------------------------------------------------- | --------- | ------------------------- |
| PF-01 | Form has 6 sections but no progress indicator — admin doesn't know how long it'll take          | 🟡 Medium | `ProductForm.tsx`         |
| PF-02 | "Display Title" label is hardcoded English — not translated                                     | 🔴 High   | `ProductForm.tsx:285`     |
| PF-03 | "Detailed Description" label hardcoded English                                                  | 🔴 High   | `ProductForm.tsx:361`     |
| PF-04 | "Made in Egypt" field uses True/False — should be a toggle/checkbox                             | 🟡 Medium | `ProductForm.tsx:349-357` |
| PF-05 | Slug field is hidden — admin can't manually override slug if auto-slug is wrong                 | 🟡 Medium | `ProductForm.tsx:711`     |
| PF-06 | Size recommendations require sizes to be added first — error message missing                    | 🔴 High   | `ProductForm.tsx:663-684` |
| PF-07 | Submit button is always at bottom — 740-line form means huge scroll distance                    | 🟡 Medium | `ProductForm.tsx:730-736` |
| PF-08 | Color chip background uses `color.toLowerCase()` — "Grey" renders as grey, "Mocha" renders grey | 🟡 Medium | `ProductForm.tsx:506`     |
| PF-09 | Validation error summary in Arabic but field errors are English (Zod messages)                  | 🔴 High   | `ProductForm.tsx:715-727` |
| PF-10 | Image upload section has no maximum count indicator                                             | 🟢 Low    | `MultiImageUpload.tsx`    |

#### Recommendations

```
PF-04 → Replace Made in Egypt select with a styled toggle switch.
         <label><input type="checkbox" {...register('made_in_egypt')} /> صنع في مصر</label>

PF-05 → Show slug field with a small "edit" icon — collapsed by default, expandable.

PF-06 → If sizeRecommendations.length > 0 and sizes.length === 0, show warning:
         "لازم تضيف مقاسات الأول قبل إضافة التوصيات"

PF-09 → Override Zod messages with Arabic-language error messages in the schema.
         z.string().min(3, 'الاسم مطلوب (3 حروف على الأقل)')
```

---

### 📋 Order Detail (`/admin/orders/[id]`)

#### Findings

| #     | Issue                                                                            | Severity  | File                                 |
| ----- | -------------------------------------------------------------------------------- | --------- | ------------------------------------ |
| OD-01 | "Customer Credentials" / "Fulfillment Location" labels are English               | 🔴 High   | `admin/orders/[id]/page.tsx:63,92`   |
| OD-02 | Phone number is a `<a href="tel:">` — great! But no WhatsApp quick-link          | 🟡 Medium | `admin/orders/[id]/page.tsx:77-82`   |
| OD-03 | "Print Waybill" button is non-functional (no action attached)                    | 🟡 Medium | `admin/orders/[id]/page.tsx:173`     |
| OD-04 | Order items show no selected_size or selected_color in admin view                | 🔴 High   | `admin/orders/[id]/page.tsx:138-153` |
| OD-05 | "Owner's Directive" is confusing label — should be "ملاحظات العميل"              | 🟡 Medium | `admin/orders/[id]/page.tsx:119`     |
| OD-06 | No keyboard shortcut to change status quickly                                    | 🟢 Low    | `StatusPill.tsx`                     |
| OD-07 | StatusPill requires a dropdown interaction — consider large tap-target on mobile | 🟡 Medium | `StatusPill.tsx`                     |

#### Recommendations

```
OD-02 → Add WhatsApp button: href={`https://wa.me/2${order.phone_number}`}
         Opens WhatsApp with the customer's number pre-filled.

OD-04 → Show selected_size and selected_color from order_items in the item list:
         <p>{item.selected_size && `المقاس: ${item.selected_size}`}</p>

OD-03 → Implement window.print() with a styled print stylesheet, or generate
         a simple PDF using browser print API.
```

---

## Part III — Cross-Cutting Issues

### 🌍 Internationalization (i18n)

| #    | Issue                                                                | Severity  |
| ---- | -------------------------------------------------------------------- | --------- |
| I-01 | ~30+ hardcoded English strings across admin (not using translations) | 🔴 High   |
| I-02 | Governorate names not translated to Arabic                           | 🔴 High   |
| I-03 | Zod validation messages not translated                               | 🔴 High   |
| I-04 | Date formatting not using locale-aware `toLocaleDateString('ar-EG')` | 🟡 Medium |

### ♿ Accessibility

| #      | Issue                                                                 | Severity  |
| ------ | --------------------------------------------------------------------- | --------- |
| ACC-01 | Form inputs in admin have no `id` + matching `for` on labels          | 🔴 High   |
| ACC-02 | Color swatches have no `aria-label` describing the color              | 🔴 High   |
| ACC-03 | Size buttons have no `aria-pressed` state                             | 🟡 Medium |
| ACC-04 | Image zoom modal has no `aria-modal` or focus trap                    | 🟡 Medium |
| ACC-05 | Cart drawer has no `aria-live` region for screen reader announcements | 🟡 Medium |

### 🌙 Dark Mode

| #     | Issue                                                                                                                     | Severity  |
| ----- | ------------------------------------------------------------------------------------------------------------------------- | --------- |
| DM-01 | Form inputs use hardcoded `bg-bg-main text-text-primary` — works, but `ring-border-color` is sometimes too subtle in dark | 🟡 Medium |
| DM-02 | Admin `bg-[#FAFAFA]` and `text-[#2C3E35]` hardcoded in ProductForm header — breaks dark mode                              | 🔴 High   |
| DM-03 | Admin ProductForm section headings `text-[#2C3E35]` hardcoded — invisible in dark mode                                    | 🔴 High   |

#### Fix for DM-02 and DM-03

```tsx
// Replace hardcoded hex colors in ProductForm.tsx:
// text-[#2C3E35] → text-text-primary
// bg-[#FAFAFA] → bg-bg-elevated
```

### 📱 Mobile UX

| #      | Issue                                                                                             | Severity  |
| ------ | ------------------------------------------------------------------------------------------------- | --------- |
| MOB-01 | Admin bottom nav shows only icons — on first visit admin doesn't know which is orders vs products | 🟡 Medium |
| MOB-02 | Checkout form has no auto-scroll to first error on mobile                                         | 🟡 Medium |
| MOB-03 | Product form is essentially unusable on mobile (6 sections, no anchors)                           | 🟡 Medium |
| MOB-04 | Size recommendation table in product detail is tight at 390px                                     | 🟢 Low    |

---

## Part IV — Quick Wins (Ship This Week)

These fixes take < 30 minutes each and have high impact:

| Priority | Fix                                                        | File                         | Time   |
| -------- | ---------------------------------------------------------- | ---------------------------- | ------ |
| 🔴 1     | Replace `alert()` with toast in checkout                   | `checkout/page.tsx`          | 20 min |
| 🔴 2     | Fix `text-[#2C3E35]` in ProductForm for dark mode          | `ProductForm.tsx`            | 10 min |
| 🔴 3     | Add `selected_size` / `selected_color` to admin order view | `admin/orders/[id]/page.tsx` | 20 min |
| 🔴 4     | Add WhatsApp link on order detail                          | `admin/orders/[id]/page.tsx` | 5 min  |
| 🟡 5     | Add `inputMode="tel"` to phone fields                      | `checkout/page.tsx`          | 5 min  |
| 🟡 6     | Add "Preview on storefront" link in product admin card     | `admin/products/page.tsx`    | 10 min |
| 🟡 7     | Make entire order table row clickable                      | `admin/page.tsx`             | 15 min |
| 🟡 8     | Add Arabic governorate names to checkout                   | `checkout/page.tsx`          | 30 min |

---

## Part V — Friction Heatmap

```
STOREFRONT
══════════════════════════════════════════════════════════════════
Homepage        ▓▓░░░░░░░░  Low friction (but discoverability gap)
Product Page    ▓▓▓▓░░░░░░  Medium friction (size/color selection)
Checkout        ▓▓▓▓▓▓░░░░  HIGH friction (language gaps, alert())
Order Success   ░░░░░░░░░░  Low friction (good animation)

ADMIN
══════════════════════════════════════════════════════════════════
Dashboard       ▓▓░░░░░░░░  Low friction (good overview)
Products List   ▓▓▓▓░░░░░░  Medium (no search/filter)
Product Form    ▓▓▓▓▓▓▓░░░  HIGH friction (740 lines, dark mode bugs)
Order Detail    ▓▓▓░░░░░░░  Medium (missing size/color, WhatsApp)
```

---

## Part VI — Recommended Roadmap

### Sprint 1 (This Week) — Critical Fixes

1. Fix all hardcoded English strings in admin (add to translations)
2. Fix ProductForm dark mode (`text-[#2C3E35]` → `text-text-primary`)
3. Add selected size/color to order detail view
4. Replace `alert()` with inline toast in checkout
5. Add Arabic governorate names

### Sprint 2 (Next Week) — UX Polish

1. Add product search/filter in admin products list
2. Add active/archived filter tabs
3. Add WhatsApp quick-link in order detail
4. Add "Preview on storefront" button in product cards
5. Make order table rows fully clickable
6. Fix zoom/shipping hardcoded strings in product page

### Sprint 3 (Next Month) — Feature Improvements

1. Add quantity stepper to AddToCartButton
2. Add breadcrumb navigation on product pages
3. Add revenue KPI to admin dashboard
4. Implement proper print waybill functionality
5. Add product pagination or infinite scroll
6. Add scroll-to-error on checkout form validation

---

## Methodology

This audit was conducted via:

- **Static code review** of all pages, components, and translation files
- **Architecture analysis** of routing, state management, and data flow
- **UX heuristic evaluation** using Nielsen's 10 heuristics
- **Arabic/RTL-specific review** for bilingual consistency
- **Dark mode verification** via CSS variable inspection

_Files reviewed: 12 pages, 15 components, 2 translation files, 1 global stylesheet_
