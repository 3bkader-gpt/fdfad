import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Safely handle missing environment variables during build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Log warning only in development or build logs, avoid crashing the process
  console.warn('Supabase credentials missing. Initializing with placeholder for build stability.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
