import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf-8').split('\n')
let url = '', key = ''
for (const line of env) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1]
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = line.split('=')[1]
}
const supabase = createClient(url, key)

async function test() {
  const { data, error } = await supabase.from('goal_sheets').select('*')
  console.log("Goal sheets currently in DB:", data)

  // Query list of tables in public schema
  const { data: tables, error: tErr } = await supabase.rpc('get_tables_test')
  if (tErr) {
    // If no RPC, let's execute query via a standard supabase select on a view or information_schema if enabled
    console.log("No RPC. Let's try executing a custom select on goal_sheets columns.")
  }
}
test()
