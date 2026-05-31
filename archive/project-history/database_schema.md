# Database Schema Documentation: FADFAAD

This document describes the PostgreSQL schema implemented on Supabase for the FADFAAD MVP.

## Tables

### 1. `admins`
Stores authorized administrative accounts.
- `id` (uuid, PK): Unique identifier.
- `email` (text, unique): Admin login email.
- `created_at` (timestamptz): Creation timestamp.

### 2. `products`
The core catalog of modest fashion items.
- `id` (uuid, PK): Unique identifier.
- `title` (text): Display name.
- `slug` (text, unique): URL-friendly identifier.
- `description` (text): Product details.
- `price` (numeric): Current selling price (EGP).
- `opacity_scale` (int, 1-5): Research-driven modesty indicator.
- `fabric_type` (text): e.g., Linen, Chiffon, Crepe.
- `made_in_egypt` (boolean): Local trust indicator (default: true).
- `is_active` (boolean): Visibility toggle.
- `created_at` (timestamptz): Creation timestamp.
- `updated_at` (timestamptz): Last modification timestamp.

### 3. `product_images`
One-to-many relationship with products for galleries.
- `id` (uuid, PK): Unique identifier.
- `product_id` (uuid, FK): Reference to `products.id`.
- `url` (text): CDN/Storage URL.
- `alt_text` (text): Accessibility description.
- `display_order` (int): Sorting order for the gallery.

### 4. `orders`
Structured customer orders to replace WhatsApp chat logs.
- `id` (uuid, PK): Unique identifier.
- `order_no` (text, unique): Human-readable ID (e.g., FDF-1001).
- `customer_name` (text): Full name.
- `phone_number` (text): Mobile number for delivery.
- `governorate` (text): Delivery region.
- `address` (text): Street-level details.
- `notes` (text): Customer special instructions.
- `total_amount` (numeric): Final price paid.
- `status` (text): Workflow state (NEW, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED).
- `created_at` (timestamptz): Order date.
- `updated_at` (timestamptz): Last status change.

### 5. `order_items`
Snapshot of line items within an order.
- `id` (uuid, PK): Unique identifier.
- `order_id` (uuid, FK): Reference to `orders.id`.
- `product_id` (uuid, FK): Reference to `products.id`.
- `quantity` (int): Number of units.
- `price_at_purchase` (numeric): Historic price (guards against future catalog changes).

## Security (RLS)
- **Anonymous:** Can only SELECT active products/images and INSERT into orders/items.
- **Authenticated (Admin):** Full CRUD access to all tables.
