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
  console.log("Checking users table...")
  const { data: users, error: uErr } = await supabase.from('users').select('id, full_name')
  if (uErr) {
    console.error("Error fetching users:", uErr.message)
  } else {
    console.log("Users:", users)
  }

  console.log("Checking active cycles...")
  const { data: activeCycle, error: cErr } = await supabase.from('cycles').select('id').eq('is_active', true).single()
  if (cErr) {
    console.error("Error fetching cycle:", cErr.message)
  } else {
    console.log("Active cycle:", activeCycle)
  }
}

test()
