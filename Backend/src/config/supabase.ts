import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Initialize dotenv configuration
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error('CRITICAL CONFIGURATION ERROR: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) environment variable is missing.');
}

if (!supabaseAnonKey) {
    throw new Error('CRITICAL CONFIGURATION ERROR: SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) environment variable is missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
