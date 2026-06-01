import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// Safely handle missing environment variables during build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Log warning only in development or build logs, avoid crashing the process
  console.warn('Supabase credentials missing. Initializing with placeholder for build stability.');
}

// Use createBrowserClient from @supabase/ssr to ensure session synchronization
// with Next.js auth cookies. This resolves RLS issues during client-side uploads.
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
