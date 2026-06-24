import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Initialize dotenv configuration
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error('CRITICAL CONFIGURATION ERROR: SUPABASE_URL environment variable is missing.');
}

if (!supabaseAnonKey) {
    throw new Error('CRITICAL CONFIGURATION ERROR: SUPABASE_ANON_KEY environment variable is missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
