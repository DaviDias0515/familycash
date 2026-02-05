import { createClient } from '@supabase/supabase-js'

// TODO: Replace with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key missing. Check .env file.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
