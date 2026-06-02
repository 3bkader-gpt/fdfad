# Product Requirements Document (PRD): فضفاض (Fadfaad) MVP

**Status:** Final / Ready for Implementation
**Target Version:** 1.0 (MVP)
**Primary Goal:** Solve WhatsApp ordering chaos through structured data entry.

---

## 1. Product Vision

To provide the modern Egyptian woman with a serene, professional, and trustworthy shopping experience that honors Islamic modesty standards through a frictionless mobile-first platform.

## 2. Problem Statement

The current manual ordering process via WhatsApp is scaling-limited. Orders are lost, customer data is unorganized, and the lack of a structured catalog leads to repetitive inquiries and blocked accounts. This creates a trust gap for new customers and operational burnout for the owner.

## 3. Goals & Success Metrics

### Goals

- **Structured Data:** Every order must arrive in a database with full customer and product details.
- **Zero-Chat Checkout:** Customers should be able to complete a purchase without needing to "ask for price" or "confirm availability" via chat.
- **Professionalism:** Elevate the brand beyond a "social media page" to a legitimate ecommerce entity.

### Success Metrics

- **Metric 1:** 70% reduction in "How much?" or "Is this available?" WhatsApp inquiries.
- **Metric 2:** 0% lost orders due to chat history overlap.
- **Metric 3:** <2 minute average time from landing to order confirmation for the customer.

---

## 4. User Personas

- **The Busy Professional (Aya):** Needs to buy a high-quality, opaque Abaya for work. She doesn't have time for 20 minutes of back-and-forth on WhatsApp. She wants to see photos, check the fabric weight, and order in 3 clicks.
- **The Brand Owner (Mariam):** Manages production and fulfillment. Needs a single dashboard to see what needs to be packed and where it needs to be shipped, without scrolling through 500 unread messages.

---

## 5. Functional Requirements

### 5.1 Customer Frontend (Mobile First: 390x844)

| ID  | Feature                 | Description                                                            | Research Insight Applied                   |
| :-- | :---------------------- | :--------------------------------------------------------------------- | :----------------------------------------- |
| C.1 | **Home Page**           | Brand intro, auto-scrolling hero, and a 2-column product grid.         | Portrait (3:4) imagery only.               |
| C.2 | **Product Page**        | Macro-fabric photography, price, and "Add to Cart."                    | **Fabric Opacity Scale (1-5)** mandatory.  |
| C.3 | **Fabric Guide**        | Small text or icons describing texture (Smooth/Textured) and Weight.   | Solves "Touch Gap" anxiety.                |
| C.4 | **Cart Drawer**         | Slide-out menu showing items, total, and "Checkout" CTA.               | Keeps user in browsing context.            |
| C.5 | **Simplified Checkout** | Single-page form: Name, Phone, Governorate (Dropdown), Address, Notes. | COD by default. Guest checkout only.       |
| C.6 | **Order Success**       | Visual confirmation with Order ID and delivery timeframe.              | Specific local timeframes (e.g. 2-3 days). |

### 5.2 Admin Backend

| ID  | Feature               | Description                                                       |
| :-- | :-------------------- | :---------------------------------------------------------------- |
| A.1 | **Secure Login**      | Simple email/password authentication for the owner.               |
| A.2 | **Orders Dashboard**  | List view of all orders sorted by "Newest."                       |
| A.3 | **Status Management** | Toggle status: New > Confirmed > Preparing > Shipped > Delivered. |
| A.4 | **Product Manager**   | CRUD (Create, Read, Update, Delete) for products.                 |
| A.5 | **Stock Toggle**      | Quick "In Stock / Out of Stock" toggle per product.               |

---

## 6. User Flows

### 6.1 The Happy Path (Customer)

Instagram Ad → Product Page → Select Size/Color → Add to Cart → Slide-out Cart → Checkout Page → Enter Phone/Address → Order Success Page.

### 6.2 The Order Lifecycle (Owner)

Login → View "New" Orders → Call/WhatsApp customer to confirm (optional) → Move to "Preparing" → Print/Write Address → Move to "Shipped" → Order Delivered.

---

## 7. Database Schema (PostgreSQL/Supabase)

### Table: `admins`

- `id`: UUID (Primary Key)
- `email`: String
- `password_hash`: String

### Table: `products`

- `id`: UUID (Primary Key)
- `name`: String (Arabic/English)
- `description`: Text
- `price`: Decimal (EGP)
- `category`: String (Abaya, Khimar, etc.)
- `opacity_rating`: Integer (1-5)
- `fabric_weight`: String (Light, Medium, Heavy)
- `images`: Array of Strings (URLs)
- `is_active`: Boolean
- `created_at`: Timestamp

### Table: `orders`

- `id`: UUID (Primary Key)
- `order_number`: String (Human readable, e.g., FDF-1001)
- `customer_name`: String
- `phone_number`: String
- `governorate`: String
- `address`: Text
- `notes`: Text
- `total_amount`: Decimal
- `status`: Enum (New, Confirmed, Preparing, Shipped, Delivered, Cancelled)
- `created_at`: Timestamp

### Table: `order_items`

- `id`: UUID
- `order_id`: UUID (Foreign Key)
- `product_id`: UUID (Foreign Key)
- `quantity`: Integer
- `price_at_purchase`: Decimal

---

## 8. API Requirements (REST)

| Method | Endpoint                | Description                         | Auth    |
| :----- | :---------------------- | :---------------------------------- | :------ |
| GET    | `/api/products`         | Fetch all active products for Home. | Public  |
| GET    | `/api/products/:id`     | Fetch single product details.       | Public  |
| POST   | `/api/orders`           | Create a new order from Checkout.   | Public  |
| GET    | `/api/admin/orders`     | List all orders for Dashboard.      | Private |
| PATCH  | `/api/admin/orders/:id` | Update order status.                | Private |
| POST   | `/api/admin/products`   | Add new product.                    | Private |

---

## 9. Non-Functional Requirements

- **Mobile-First Performance:** Page Load < 2s on local Egyptian 4G networks.
- **Image Optimization:** All product photos must be served via CDN in WebP format.
- **Reliability:** No "WhatsApp-style" message loss; DB transactions must ensure order integrity.
- **UX Accessibility:** Arabic RTL (Right-to-Left) support is mandatory for the frontend.

---

## 10. Acceptance Criteria (For Implementation)

1.  **Trust:** The phrase "Made in Egypt" and "Cash on Delivery" must be visible on the product page without scrolling.
2.  **Conversion:** The "Add to Cart" button must be sticky on the mobile view.
3.  **Friction:** The checkout process must not require more than 5 input fields.
4.  **Admin:** The owner must be able to change an order status in 2 clicks from the dashboard.

---

## 11. Future Roadmap (Post-MVP)

- Phase 2: Discount codes and seasonal promotions.
- Phase 3: Automated SMS/WhatsApp status notifications.
- Phase 4: Online payment integration (Paymob/Fawry).
- Phase 5: Customer account history and loyalty points.
