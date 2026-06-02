# TODO

## P0 - Security (Must Complete Before Feature Work)

### 1. Apply DB hardening migration

- File: `supabase/migrations/20260601183000_harden_rls_and_storage.sql`
- Outcome: Enforces admin-only catalog/category/image mutations + public read-only active catalog + public order creation.
- Difficulty: Medium
- Blocker: Security compliance.

### 2. Verify live RLS/storage policy behavior

- Scope: `products`, `product_images`, `product_categories`, `categories`, `storage.objects`, `orders`, `order_items`.
- Required checks:
  - anon cannot create/update/delete products/categories/images
  - anon can read active catalog only
  - anon can create orders/order_items only
  - admin can perform full CRUD where required
- Difficulty: Medium
- Blocker: Supabase CLI / SQL access to live environment.

### 3. Confirm admin identity mapping

- Scope: `public.admins` records vs Supabase auth user emails.
- Difficulty: Low
- Blocker: Prevent false-deny for legitimate admin users after hardening.

### 4. Add security release checklist

- Scope: document and enforce policy verification in release flow.
- Difficulty: Low
- Blocker: Prevents future policy drift.

## P0 - Build & Quality Gate

### 5. Fix admin product form TypeScript blocker

- Scope: `src/app/[locale]/admin/products/ProductForm.tsx`, `src/components/ui/ImageUpload.tsx`
- Difficulty: Medium
- Blocker: `pnpm build` currently fails.

### 6. Restore lint baseline

- Scope: files reported by `pnpm lint` (format/style).
- Difficulty: Low
- Blocker: CI/release hygiene.

## P1 - Stability

### 7. Migrate Next middleware convention

- Scope: `src/middleware.ts` + auth/session path checks.
- Difficulty: Medium
- Blocker: Framework deprecation risk.

### 8. Harden checkout integrity server-side

- Scope: `src/app/[locale]/checkout/actions.ts`
- Work: Validate product ids/prices/status server-side, avoid trusting client totals.
- Difficulty: Medium
- Blocker: Fraud/inconsistency risk.

### 9. Reduce unsafe type assertions in server actions

- Scope: admin and checkout server actions.
- Difficulty: Medium
- Blocker: Maintainability and runtime type safety.

## P2 - Maintainability

### 10. Sync docs with implementation + security posture

- Scope: `README.md`, `docs/*`, `PROJECT_STATUS.md`, `SECURITY_AUDIT_REPORT.md`.
- Difficulty: Low
- Blocker: Team alignment.

### 11. Add smoke/security regression tests

- Scope: catalog read rules, admin writes, checkout insertion flow.
- Difficulty: Medium
- Blocker: Regression prevention.

## P3 - Roadmap Features

- Payments (Paymob/Fawry)
- Notifications (SMS/WhatsApp)
- Promotions/discounts
- Customer accounts/order history

## Active Blockers

- Live policy verification tooling access required.
- Build failure currently present.
- Lint failure currently present.
