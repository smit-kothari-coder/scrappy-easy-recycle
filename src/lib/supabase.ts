import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/database.types';

// Supabase client configuration
const supabaseUrl = 'https://akzayvoltyikdixdcuok.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFremF5dm9sdHlpa2RpeGRjdW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODA3NDIsImV4cCI6MjA2MDU1Njc0Mn0._PNjRql6RUd8viDJWlo72ScSPMUT5Uc5vS86ZJdVPqY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
}); 