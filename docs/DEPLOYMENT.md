# Deployment Guide: FADFAAD

## Overview

FADFAAD is a Next.js application deployed on Vercel, utilizing Supabase for database, authentication, and storage.

## Environments

- **Production:** [https://fdfad.vercel.app/](https://fdfad.vercel.app/)
- **Vercel Project:** `fdfad`

## Prerequisites

- Node.js 18+
- pnpm 9+
- Vercel CLI (optional)
- Supabase CLI (optional)

## Environment Variables

The following secrets are required in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for server-side operations).

## Deployment Workflow

1. **Push to GitHub:** Merging into the `main` branch triggers an automatic production build on Vercel.
2. **Build Command:** `pnpm build`
3. **Build Status:** Monitored via Vercel Dashboard.

## Database Migrations

Database changes are handled via Supabase Migrations located in `/supabase/migrations`.
Apply migrations using the Supabase Dashboard or CLI:

```bash
supabase db push
```

## Storage Configuration

Ensure the `product-images` bucket exists in Supabase Storage with public read access and authenticated admin write access.
