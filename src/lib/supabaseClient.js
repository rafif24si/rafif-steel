import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nrhdsormwvapwjrhjfcb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_t1YlxWCGxBoY7YL95yrc1w_pIEZgGaf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
