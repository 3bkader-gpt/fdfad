# Database Backup & Disaster Recovery Package: FADFAAD

This package contains the complete SQL definitions and procedures required to restore the FADFAAD database on Supabase.

## Package Contents

- `schema.sql`: Table definitions, sequences, and indexes.
- `functions.sql`: Stored procedures and helper functions.
- `triggers.sql`: Table triggers for automated column updates.
- `rls-policies.sql`: Row Level Security policies for all tables and storage objects.
- `migrations/`: A complete history of version-controlled changes.

## Disaster Recovery Procedure

### 1. Database Schema Restore
Execute the contents of `schema.sql` in the Supabase SQL Editor. This will recreate all tables, sequences, and indexes.

### 2. Functions & Procedures Restore
Execute the contents of `functions.sql`. This ensures that `is_admin()`, `create_order_rpc`, and other logic are available.

### 3. Triggers Restore
Execute the contents of `triggers.sql`. This activates the automated timestamp management.

### 4. RLS & Security Restore
Execute the contents of `rls-policies.sql`. This is critical to ensure data is protected and that the storefront can function while keeping administrative areas private.

### 5. Data Migration (Manual)
If the database was completely lost, data must be restored from Supabase's automatic daily backups or CSV exports. If only the schema was corrupted, steps 1-4 are sufficient.

## Verification Checklist
- [ ] Check if `admins` table contains authorized emails.
- [ ] Verify `is_admin()` function returns true for authorized admins.
- [ ] Verify storefront can load products (requires `products_public_select_active` policy).
- [ ] Verify checkout can create orders (requires `orders_public_insert` policy).
- [ ] Verify Admin Dashboard can see all orders (requires `orders_admin_all` policy).
