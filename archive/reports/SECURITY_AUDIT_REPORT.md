# SECURITY AUDIT REPORT

## Scope
Reviewed repository code and migrations for:
- `products`
- `product_images`
- `product_categories`
- `categories`
- `storage.objects` (bucket `product-images`)
- Supabase auth usage, server actions, middleware auth checks, and upload paths.

## Evidence Reviewed
- `supabase/migrations/20240531230000_init_schema.sql`
- `supabase/migrations/20260601000000_add_category_translations.sql`
- `supabase/migrations/20260601120000_update_category_translations.sql`
- `src/components/ui/ImageUpload.tsx`
- `src/app/[locale]/admin/products/ProductActions.ts`
- `src/app/[locale]/admin/categories/actions.ts`
- `src/app/[locale]/admin/orders/actions.ts`
- `src/app/[locale]/checkout/actions.ts`
- `src/app/[locale]/admin/login/actions.ts`
- `src/lib/supabase/middleware.ts`
- `src/middleware.ts`

## Findings Summary
1. **Critical:** Tracked RLS policy model was too broad for catalog/admin data.
   - Existing baseline policy grants `FOR ALL` on products/images/orders/items to any `authenticated` user.
   - This is not admin-only and violates least privilege.
2. **Critical:** No tracked RLS policies for `categories`, `product_categories`, or `storage.objects` in migrations.
   - Effective security for these objects may have been manually configured in Supabase dashboard and is not reproducible from code.
3. **High:** Client-side image uploads use anon client (`ImageUpload.tsx`) directly to bucket `product-images`.
   - Safe only if storage INSERT/UPDATE/DELETE policies are strict admin-only.
4. **Medium:** Admin authorization in app relies mainly on auth session presence + DB RLS.
   - There is no explicit app-layer admin role gate in server actions; correctness depends on RLS.

## Current Permission State (Before Hardening Migration)
This section reflects **tracked repository migrations**, not guaranteed live dashboard state.

### Public Tables (as tracked)
- `products`: public SELECT active only; authenticated FOR ALL (not admin-scoped).
- `product_images`: public SELECT for active products; authenticated FOR ALL (not admin-scoped).
- `orders`: public INSERT allowed; authenticated FOR ALL.
- `order_items`: public INSERT allowed; authenticated FOR ALL.
- `categories`: not defined in tracked RLS policies.
- `product_categories`: not defined in tracked RLS policies.

### Storage (`storage.objects`)
- No tracked policies in repository for bucket `product-images`.

## Anonymous Capability Verification
Based on tracked code + policies before hardening:
- Create products (anon): **No** (needs authenticated role under tracked policy).
- Modify products (anon): **No**.
- Delete products (anon): **No**.
- Upload images (anon): **Unknown from repo alone** (depends on untracked storage policies).
- Delete images (anon): **Unknown from repo alone** (depends on untracked storage policies).
- Modify categories (anon): **Unknown from repo alone** (categories RLS not tracked here).

## Server/Auth Review
- Admin login/logout uses Supabase auth (`signInWithPassword`, `signOut`).
- Middleware checks user session and redirects admin paths when unauthenticated.
- Server actions perform sensitive writes without separate admin-check guard; they rely on RLS.
- No `/api` route handlers used for admin writes; mutations are via Server Actions.
- Upload path: `product-images/products/<random>.<ext>` from client.

## Remediation Applied
Added hardening migration:
- `supabase/migrations/20260601183000_harden_rls_and_storage.sql`

What it enforces:
1. `public.is_admin()` helper based on `auth.jwt()->>'email'` in `public.admins`.
2. Enables RLS on relevant tables.
3. Drops legacy policies on targeted tables and recreates strict policies.
4. Public users can only read active catalog (`products`, `categories`, mapped `product_images`/`product_categories`).
5. Only admin users can INSERT/UPDATE/DELETE catalog/category/image data.
6. Orders and order_items remain publicly INSERT-able for checkout flow.
7. Adds strict `storage.objects` policies for bucket `product-images`:
   - Public read only.
   - Admin-only insert/update/delete.

## Permissions Matrix (Post-Remediation Target)
| Object | Role | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| products | anon | Active only | No | No | No |
| products | authenticated non-admin | Active only | No | No | No |
| products | admin | All | Yes | Yes | Yes |
| product_images | anon | Active-product images only | No | No | No |
| product_images | authenticated non-admin | Active-product images only | No | No | No |
| product_images | admin | All | Yes | Yes | Yes |
| product_categories | anon | Active mappings only | No | No | No |
| product_categories | authenticated non-admin | Active mappings only | No | No | No |
| product_categories | admin | All | Yes | Yes | Yes |
| categories | anon | Active only | No | No | No |
| categories | authenticated non-admin | Active only | No | No | No |
| categories | admin | All | Yes | Yes | Yes |
| storage.objects (`product-images`) | anon | Yes (bucket read) | No | No | No |
| storage.objects (`product-images`) | authenticated non-admin | Yes (bucket read) | No | No | No |
| storage.objects (`product-images`) | admin | Yes | Yes | Yes | Yes |
| orders | anon | No | Yes | No | No |
| orders | admin | Yes | Yes* | Yes | Yes |
| order_items | anon | No | Yes | No | No |
| order_items | admin | Yes | Yes* | Yes | Yes |

`*` Admin INSERT remains allowed by policy design.

## Risk Assessment
- Before remediation: **High/Critical** (over-broad authenticated write access; untracked category/storage policy posture).
- After remediation migration (when applied to DB): **Medium** pending live verification.
- Residual risks:
  - Live Supabase environment may still contain manual policies differing from migrations.
  - Admin identity tied to `admins.email`; if admin roster is not maintained, authorized users may be blocked.
  - Client upload endpoint still public at app layer; safety depends entirely on storage RLS.

## Required Live Verification Steps
Because Supabase CLI is not installed in this environment, live DB policy introspection was not executed here. Run in deployment environment:
1. List policies for all scoped tables and `storage.objects`.
2. Validate anon/authenticated/admin behavior with real tokens.
3. Confirm bucket `product-images` has expected policies only.
4. Confirm admin users exist in `public.admins` matching auth emails.

## Security Remediation Tasks
1. Apply migration `20260601183000_harden_rls_and_storage.sql` to all environments.
2. Run live policy verification checks and capture results.
3. Add a repeatable security test checklist to CI/release process.
4. Optionally add app-layer admin guard in critical server actions (defense in depth), not replacing RLS.
