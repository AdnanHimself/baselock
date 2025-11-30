import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase URL or Service Role Key');
}

// Admin Supabase client for server-side operations
// Uses the Service Role Key which bypasses RLS policies
// WARNING: Never expose this client or key to the browser
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
