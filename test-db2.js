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
  const { data, error } = await supabase.rpc('get_foreign_keys_test')
  if (error) {
    // try direct SQL if we have postgres access, but we don't via supabase-js without an RPC.
    console.log("No RPC. Let's try inserting a goal sheet for Arjun to see the exact error.")
    
    const { error: insertErr } = await supabase.from('goal_sheets').insert({
      employee_id: '00000000-0000-0000-0000-000000000001',
      cycle_id: 'c1111111-0000-0000-0000-000000000002',
      status: 'submitted'
    })
    console.log("Insert Error:", insertErr)
  }
}
test()
