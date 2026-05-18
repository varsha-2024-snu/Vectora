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
  console.log("Inserting for Priya Nair...")
  const { data: newSheet, error: sheetErr } = await supabase
    .from('goal_sheets')
    .insert({
      employee_id: '00000000-0000-0000-0000-000000000002',
      cycle_id: 'c1111111-0000-0000-0000-000000000002',
      status: 'submitted'
    })
    .select('id')
    .single()
  console.log("Insert Error:", sheetErr)
  console.log("Inserted Sheet:", newSheet)
}
test()
