# Architecture Decision Record (ADR): FADFAAD MVP

**Author:** Staff Software Architect
**Date:** May 31, 2026
**Status:** Approved / Locked
**Project:** FADFAAD (Mobile-First Modest Fashion Ecommerce)

---

## 1. Technology Selection & Evaluation

### Frontend Framework
*   **Options:** Next.js, React (CRA/Vite), Nuxt.
*   **Decision:** **Next.js (App Router)**
*   **Justification:** Next.js provides out-of-the-box SEO (Server-Side Rendering), which is non-negotiable for a fashion brand competing for search traffic. Its Image Optimization component is critical for the high-res macro fabric shots identified in our research.
*   **Tradeoff:** Higher learning curve compared to Vite, but justifies the cost with performance and deployment ease on Vercel.

### Backend & Database
*   **Options:** Supabase, Firebase, NestJS + PostgreSQL.
*   **Decision:** **Supabase (PostgreSQL)**
*   **Justification:** Supabase provides a managed PostgreSQL database, Real-time subscriptions (perfect for the Admin "New Order" notification), and built-in Auth. It eliminates the need to manage a separate backend server for an MVP, drastically reducing "WhatsApp style" data loss risks.
*   **Tradeoff:** Vendor lock-in to Supabase features, but the underlying data is standard PostgreSQL, making future migration easy.

### Authentication
*   **Decision:** **Supabase Auth**
*   **Justification:** Seamless integration with PostgreSQL Row Level Security (RLS). We only need to secure the `/admin` route for the owner.

### Hosting & Storage
*   **Decision:** **Vercel (Hosting) + Supabase Storage (Assets)**
*   **Justification:** Vercel is the native environment for Next.js. Supabase Storage handles image uploads for product management with built-in CDN support.

---

## 2. Final Recommended Stack (The "Speed-to-Trust" Stack)

*   **Frontend:** Next.js 14+, Tailwind CSS (Modern UI), Lucide Icons.
*   **Backend:** Supabase (DB, Auth, Storage).
*   **Deployment:** Vercel.
*   **State Management:** TanStack Query (React Query) for reliable server-state.

**Why this stack?**
This stack allows us to build the MVP in days. It solves the **Business Pain** by providing a robust, structured database immediately, while giving the customer a high-end, fast "boutique" feel that builds trust.

---

## 3. Project Structure

We will follow a **Feature-Based Architecture** within the `src` directory to keep the code modular as we scale from 10 to 10,000 orders.

```text
/fdfad
├── /public            # Static assets (logo, icons)
├── /src
│   ├── /app           # Next.js App Router (Routes & Layouts)
│   ├── /components    # Shared UI components (Buttons, Inputs, Badges)
│   ├── /features      # Logic-heavy domains
│   │   ├── /products  # Product Grid, PDP logic
│   │   ├── /orders    # Cart, Checkout, Success logic
│   │   └── /admin     # Dashboard, Status management
│   ├── /lib           # Supabase client, Shared utils
│   ├── /types         # TypeScript definitions
│   └── /styles        # Global CSS / Tailwind config
└── middleware.ts      # Auth protection for /admin
```

---

## 4. Database Design (Production Schema)

### 4.1 Table: `products`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK, default gen_random_uuid() |
| `name_ar` | text | NOT NULL |
| `name_en` | text | NOT NULL |
| `description` | text | |
| `price` | numeric | NOT NULL, CHECK (price > 0) |
| `category` | text | NOT NULL (Enum: abaya, khimar, jilbab, hijab) |
| `opacity` | int | CHECK (opacity BETWEEN 1 AND 5) |
| `weight` | text | (Light, Medium, Heavy) |
| `images` | text[] | Array of URLs |
| `stock_status`| boolean| Default: true |
| `created_at` | timestamptz| Default: now() |

### 4.2 Table: `orders`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `order_no` | text | UNIQUE (Format: FDF-1001) |
| `customer_name`| text | NOT NULL |
| `phone` | text | NOT NULL |
| `governorate` | text | NOT NULL |
| `address` | text | NOT NULL |
| `notes` | text | |
| `total` | numeric | NOT NULL |
| `status` | text | Default: 'new' (new, confirmed, preparing, shipped, delivered, cancelled) |
| `created_at` | timestamptz| Default: now() |

### 4.3 Table: `order_items`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `order_id` | uuid | FK -> orders.id (ON DELETE CASCADE) |
| `product_id` | uuid | FK -> products.id |
| `quantity` | int | NOT NULL |
| `price` | numeric | Price at time of purchase |

---

## 5. API & Interaction Design

For the MVP, we will use **Supabase Client-Side SDK with RLS** for maximum speed, supplemented by **Next.js Server Actions** for sensitive operations.

### Endpoints (Internal)
*   `GET /products`: Fetch active catalog (Public).
*   `POST /orders`: Submit checkout form + line items (Public).
*   `GET /admin/orders`: Real-time order stream (Admin Only).
*   `PATCH /admin/orders/:id`: Update status (Admin Only).

---

## 6. Security Review

1.  **Admin Protection:** The `/admin/*` route is protected via **Next.js Middleware** and **Supabase RLS**. Even if a user finds the URL, the DB will reject the request without a valid admin JWT.
2.  **Rate Limiting:** Vercel + Supabase built-in rate limiting prevents "bot-ordering" spam.
3.  **Input Validation:** **Zod** schema validation on both Frontend and Backend for phone numbers and address fields.
4.  **Order Protection:** Orders are write-only for the public; once submitted, they cannot be edited or deleted by the customer.

---

## 7. Scalability Review

*   **100 orders/day:** Handled easily by the free tier of Supabase/Vercel.
*   **1000 orders/day:** PostgreSQL handles this without sweat. The bottleneck will be human fulfillment (the owner).
*   **10,000 orders/day:** The architecture survives. We would only need to upgrade Supabase to a Pro tier for higher connection limits and IOPS.

---

## 8. Developer Experience (DX)

*   **Package Manager:** `pnpm` (Fast, efficient).
*   **Linting/Formatting:** ESLint + Prettier.
*   **Validation:** Zod (Type-safe schemas).
*   **Testing:** Playwright for "Happy Path" checkout testing.
*   **Deployment:** Git-flow -> Vercel (Auto-deploy on `main` branch).

---

## 9. Implementation Plan

| Phase | Task | Complexity |
| :--- | :--- | :--- |
| **Ph 1** | **Infra:** Set up Supabase Project, Tables, and RLS Policies. | Low |
| **Ph 2** | **Core UI:** Homepage + Category Grid + Mobile Nav. | Medium |
| **Ph 3** | **PDP:** Implementation of Opacity Scales and Image Gallery. | Medium |
| **Ph 4** | **Cart & Checkout:** Drawer cart + COD Single Page Checkout. | High |
| **Ph 5** | **Admin:** Secure Dashboard + Order Status Toggles. | Medium |
| **Ph 6** | **Launch:** Vercel deployment + Domain mapping. | Low |

---

## 10. Acceptance Criteria for Implementation Agent

1.  **Mobile Viewport:** Must be perfectly responsive on iPhone 15 Pro (390x844).
2.  **Data Integrity:** A single order must create 1 row in `orders` and N rows in `order_items` atomically.
3.  **Admin UX:** The owner must be able to change order status without refreshing the page (Real-time).
4.  **Branding:** Off-white backgrounds and Serif headings must be preserved per the Visual System.
