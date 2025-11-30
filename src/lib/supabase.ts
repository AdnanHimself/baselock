import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public Supabase client for client-side operations
// Uses the anonymous key which has restricted access based on RLS policies
export const supabase = createClient(supabaseUrl, supabaseKey);
