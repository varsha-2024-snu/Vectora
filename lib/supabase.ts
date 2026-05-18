import { createClient } from '@supabase/supabase-js'

// Using service role key to bypass RLS since we are using dummy auth cards
// In a true production environment, we would use Supabase Auth and the anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
