import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables in case they aren't loaded yet
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  console.warn('Warning: SUPABASE_URL environment variable is not defined.');
}

if (!supabaseServiceKey) {
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY environment variable is not defined.');
}

// Create administrative client with bypass-RLS service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
